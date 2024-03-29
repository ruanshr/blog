# mountLazyCompont

为什么要叫`mount`而不是`update`呢？因为`lazy`组件只有在加载的组件还没完成之前才会被执行，等到加载完成了，那么就变成加载之后的组件了，永远不会执行到自己的更新。

这也是一开始判断`current`是否存在的原因，如果存在则不符合组件的期望，需要重新按照`current`不存在的方式进行更新。

核心方法是`readLazyComponentType`

```js
export function readLazyComponentType<T>(lazyComponent: LazyComponent<T>): T {
  const status = lazyComponent._status
  const result = lazyComponent._result
  switch (status) {
    case Resolved: {
      const Component: T = result
      return Component
    }
    case Rejected: {
      const error: mixed = result
      throw error
    }
    case Pending: {
      const thenable: Thenable<T, mixed> = result
      throw thenable
    }
    default: {
      lazyComponent._status = Pending
      const ctor = lazyComponent._ctor
      const thenable = ctor()
      thenable.then(
        (moduleObject) => {
          if (lazyComponent._status === Pending) {
            const defaultExport = moduleObject.default
            if (__DEV__) {
              if (defaultExport === undefined) {
                warning(
                  false,
                  'lazy: Expected the result of a dynamic import() call. ' +
                    'Instead received: %s\n\nYour code should look like: \n  ' +
                    "const MyComponent = lazy(() => import('./MyComponent'))",
                  moduleObject
                )
              }
            }
            lazyComponent._status = Resolved
            lazyComponent._result = defaultExport
          }
        },
        (error) => {
          if (lazyComponent._status === Pending) {
            lazyComponent._status = Rejected
            lazyComponent._result = error
          }
        }
      )
      lazyComponent._result = thenable
      throw thenable
    }
  }
}
```

默认`status`是`-1`，执行传入的方法得到`thenable`方法，根据`thenable`的结果更新组件的状态，并且把`resolve`的组件进行返回

返回组件之后执行了以下几句代码，非常重要：

```js
workInProgress.type = Component
const resolvedTag = (workInProgress.tag = resolveLazyComponentTag(Component))
```

他把`lazy`组件的`Fiber`对象的`tag`和`type`都改变了，下次执行到这个`Fiber`的更新，则会直接更新返回的`type`

```js
// 关键代码
function mountLazyComponent(
  _current,
  workInProgress,
  elementType,
  updateExpirationTime,
  renderExpirationTime
) {
  if (_current !== null) {
    // An lazy component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to tree it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null
    workInProgress.alternate = null
    // Since this is conceptually a new fiber, schedule a Placement effect
    workInProgress.effectTag |= Placement
  }

  const props = workInProgress.pendingProps
  // We can't start a User Timing measurement with correct label yet.
  // Cancel and resume right after we know the tag.
  cancelWorkTimer(workInProgress)
  let Component = readLazyComponentType(elementType)
  // Store the unwrapped component in the type.
  workInProgress.type = Component
  const resolvedTag = (workInProgress.tag = resolveLazyComponentTag(Component))
  startWorkTimer(workInProgress)
  const resolvedProps = resolveDefaultProps(Component, props)
  let child
  switch (resolvedTag) {
    case FunctionComponent: {
      child = updateFunctionComponent(
        null,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      )
      break
    }
    case ClassComponent: {
      child = updateClassComponent(
        null,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      )
      break
    }
    case ForwardRef: {
      child = updateForwardRef(null, workInProgress, Component, resolvedProps, renderExpirationTime)
      break
    }
    case MemoComponent: {
      child = updateMemoComponent(
        null,
        workInProgress,
        Component,
        resolveDefaultProps(Component.type, resolvedProps), // The inner type can have defaults too
        updateExpirationTime,
        renderExpirationTime
      )
      break
    }
    default: {
    }
  }
  return child
}
```
