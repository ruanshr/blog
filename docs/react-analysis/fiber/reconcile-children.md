---
prev: /react-analysis/fiber/begin-work
next: /react-analysis/fiber/commit-phase/commit-root
---

# reconcileChildren

该方法最终调用的是 reconcileChildFibers

mountChildFibers 和 reconcileChildFibers 方法是一样的，唯一的区别是生成这个方法的时候的一个参数不同

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)
这个参数叫 shouldTrackSideEffects，他的作用是判断是否要增加一些 effectTag，主要是用来优化初次渲染的：

```js
if (shouldTrackSideEffects && newFiber.alternate === null) {
  newFiber.effectTag = Placement
}
// TODO: Remove this and use reconcileChildrenAtExpirationTime directly.
function reconcileChildren(current, workInProgress, nextChildren) {
  reconcileChildrenAtExpirationTime(
    current,
    workInProgress,
    nextChildren,
    workInProgress.expirationTime
  )
}

function reconcileChildrenAtExpirationTime(
  current,
  workInProgress,
  nextChildren,
  renderExpirationTime
) {
  if (current === null) {
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime
    )
  } else {
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderExpirationTime
    )
  }
}
```

reconcileChildFibers
这是个入口方法，会根据 newChild 的不同类型进行对应的处理，这里会进行拆分对不同类型的处理方法进行单独的讲解。

reconcileChildFibers 最终的返回是当前节点的第一个孩子节点，会在 performUnitWork 中 return 并赋值给 nextUnitOfWork

children 的合法类型：

ReactElement，通过 createElement 和 ReactDOM.createPortal 创建，$$typeof 不同
string 或者 number，<div>abc</div>中 div 的 children 就是"abc"
[// renderAble]数组，每一项都可以是其他合法类型，不能嵌套
Iterator，跟数组类似，只是遍历方式不同
React.ConcurrentMode 这些内置组件，最终会转换成 ReactElement，不同的是 ReactElement.type

reconcileSingleElement & reconcileSinglePortal & reconcileSingleTextNode

reconcileChildrenArray & reconcileChildrenArray

```js
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
  expirationTime: ExpirationTime
): Fiber | null {
  const isUnkeyedTopLevelFragment =
    typeof newChild === 'object' &&
    newChild !== null &&
    newChild.type === REACT_FRAGMENT_TYPE &&
    newChild.key === null
  if (isUnkeyedTopLevelFragment) {
    newChild = newChild.props.children
  }

  // Handle object types
  const isObject = typeof newChild === 'object' && newChild !== null

  if (isObject) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        return placeSingleChild(
          reconcileSingleElement(returnFiber, currentFirstChild, newChild, expirationTime)
        )
      case REACT_PORTAL_TYPE:
        return placeSingleChild(
          reconcileSinglePortal(returnFiber, currentFirstChild, newChild, expirationTime)
        )
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    return placeSingleChild(
      reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, expirationTime)
    )
  }

  if (isArray(newChild)) {
    return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, expirationTime)
  }

  if (getIteratorFn(newChild)) {
    return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, expirationTime)
  }

  if (isObject) {
    throwOnInvalidObjectType(returnFiber, newChild)
  }

  if (typeof newChild === 'undefined' && !isUnkeyedTopLevelFragment) {
    switch (returnFiber.tag) {
      case ClassComponent:
      case FunctionComponent: {
        const Component = returnFiber.type
        invariant(
          false,
          '%s(...): Nothing was returned from render. This usually means a ' +
            'return statement is missing. Or, to render nothing, ' +
            'return null.',
          Component.displayName || Component.name || 'Component'
        )
      }
    }
  }

  return deleteRemainingChildren(returnFiber, currentFirstChild)
}
```

placeSingleChild
判断是否是第一次渲染，如果是的话增加 Placement 副作用，后期需要挂载 DOM

```js
function placeSingleChild(newFiber: Fiber): Fiber {
  if (shouldTrackSideEffects && newFiber.alternate === null) {
    newFiber.effectTag = Placement
  }
  return newFiber
}
```
