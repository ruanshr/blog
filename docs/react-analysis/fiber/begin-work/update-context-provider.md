# updateContextProvider

`context` 详细的看[这里](../../features/context.md)

```js
function updateContextProvider(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime
) {
  const providerType: ReactProviderType<any> = workInProgress.type
  const context: ReactContext<any> = providerType._context

  const newProps = workInProgress.pendingProps
  const oldProps = workInProgress.memoizedProps

  const newValue = newProps.value
  workInProgress.memoizedProps = newProps

  pushProvider(workInProgress, newValue)

  if (oldProps !== null) {
    const oldValue = oldProps.value
    const changedBits = calculateChangedBits(context, newValue, oldValue)
    if (changedBits === 0) {
      // No change. Bailout early if children are the same.
      if (oldProps.children === newProps.children && !hasLegacyContextChanged()) {
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderExpirationTime)
      }
    } else {
      // The context value changed. Search for matching consumers and schedule
      // them to update.
      propagateContextChange(workInProgress, context, changedBits, renderExpirationTime)
    }
  }

  const newChildren = newProps.children
  reconcileChildren(current, workInProgress, newChildren, renderExpirationTime)
  return workInProgress.child
}
```
