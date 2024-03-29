# updateForwardRef

`ForwardRef`是通过`React.forwardRef`创建的，详细的请看[`forwardRef`](../../features/ref.md)

```js
function updateForwardRef(
  current: Fiber | null,
  workInProgress: Fiber,
  type: any,
  nextProps: any,
  renderExpirationTime: ExpirationTime
) {
  const render = type.render
  const ref = workInProgress.ref
  if (hasLegacyContextChanged()) {
    // Normally we can bail out on props equality but if context has changed
    // we don't do the bailout and we have to reuse existing props instead.
  } else if (workInProgress.memoizedProps === nextProps) {
    const currentRef = current !== null ? current.ref : null
    if (ref === currentRef) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderExpirationTime)
    }
  }

  let nextChildren
  if (__DEV__) {
    ReactCurrentOwner.current = workInProgress
    ReactCurrentFiber.setCurrentPhase('render')
    nextChildren = render(nextProps, ref)
    ReactCurrentFiber.setCurrentPhase(null)
  } else {
    nextChildren = render(nextProps, ref)
  }

  reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime)
  memoizeProps(workInProgress, nextProps)
  return workInProgress.child
}
```
