# updateFunctionalComponent

`functionalComponent`本身就是一个`pure function`，所以处理起来相对很简单，获得对应的`props`和`context`之后，直接调用就能获得`nextChildren`，然后就是常规操作`reconcileChildren`和`memoizeProps`。

注意`workInProgress.effectTag |= PerformedWork`这是`functionalComponent`中唯一会加入的`side effect`，也是必定会加的。

```js
function updateFunctionalComponent(current, workInProgress) {
  const fn = workInProgress.type
  const nextProps = workInProgress.pendingProps

  if (hasLegacyContextChanged()) {
    // Normally we can bail out on props equality but if context has changed
    // we don't do the bailout and we have to reuse existing props instead.
  } else {
    if (workInProgress.memoizedProps === nextProps) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress)
    }
    // TODO: consider bringing fn.shouldComponentUpdate() back.
    // It used to be here.
  }

  const unmaskedContext = getUnmaskedContext(workInProgress)
  const context = getMaskedContext(workInProgress, unmaskedContext)

  let nextChildren

  if (__DEV__) {
    ReactCurrentOwner.current = workInProgress
    ReactDebugCurrentFiber.setCurrentPhase('render')
    nextChildren = fn(nextProps, context)
    ReactDebugCurrentFiber.setCurrentPhase(null)
  } else {
    nextChildren = fn(nextProps, context)
  }
  // React DevTools reads this flag.
  workInProgress.effectTag |= PerformedWork
  reconcileChildren(current, workInProgress, nextChildren)
  memoizeProps(workInProgress, nextProps)
  return workInProgress.child
}
```
