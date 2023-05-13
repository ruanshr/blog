---
prev: /react-analysis/features/suspense
next: /react-analysis/hooks/hooks-start
---

# lazy 组件

通过`React.lazy`我们非常方便地实现异步加载模块的功能，通过这个`API`创建的对象如下：

```js

{
  $$typeof: REACT_LAZY_TYPE,
  _ctor: ctor,
  // React uses these fields to store the result.
  _status: -1,
  _result: null,
}

```

其中`_status`和`_result`两个值是非常重要的，用来标记加载完成的模块的内容，而`_ctor`则记载了我们传入的生产`thenable`对象的方法。

在更新过程中，我们遇到`lazy`组件会怎么样呢？

```js
function mountLazyComponent(
  _current,
  workInProgress,
  elementType,
  updateExpirationTime,
  renderExpirationTime
) {
  if (_current !== null) {
    _current.alternate = null
    workInProgress.alternate = null
    workInProgress.effectTag |= Placement
  }

  const props = workInProgress.pendingProps
  cancelWorkTimer(workInProgress)
  let Component = readLazyComponentType(elementType)
  workInProgress.type = Component
  const resolvedTag = (workInProgress.tag = resolveLazyComponentTag(Component))
  startWorkTimer(workInProgress)
  const resolvedProps = resolveDefaultProps(Component, props)
  let child
  switch (resolvedTag) {
    // 根据返回的组件类型执行更新
    default: {
      // warning
    }
  }
  return child
}
```

首先我们看到如果`_current`存在值会强行删除`current`的引用，为什么要这么做呢？因为`lazy`组件只有在第一次渲染的时候才会调用该方法，等到组件已经加载完成了，就会走直接更新组件的流程，具体证据就是下面这句代码：

```js
const resolvedTag = (workInProgress.tag = resolveLazyComponentTag(Component))
```

`resolveLazyComponentTag`是`ReactFiber`提供的根据特性判断组件类型的方法，可以判断是`ClassComponent`还是`FunctionalComponent`还是一些内置类型。在组件加载完成之后，就直接设置`tag`为新的类型了，并且设置了`type`为返回的`Component`，就变成了异步加载过来的组件了。

那么如果还没加载完成呢？我们来看`readLazyComponentType`

```js
export const Pending = 0
export const Resolved = 1
export const Rejected = 2

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

这里就用到了`_status`和`_result`，一开始`_status`是-1，所以不符合前三个 case，然后就进入 default，这里面调用了`_ctor`创建了`thenable`对象，调用`then`方法，`resolve`和`reject`之后会分别设置`_status`和`_result`，默认`_status`变成`pendding`，所以下一次进来会`throw thenable`，这就进入了`Suspense`的阶段了。
