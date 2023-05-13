# updateProfiler

```js
function updateProfiler(current, workInProgress) {
  const nextProps = workInProgress.pendingProps
  if (enableProfilerTimer) {
    workInProgress.effectTag |= Update
  }
  if (workInProgress.memoizedProps === nextProps) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress)
  }
  const nextChildren = nextProps.children
  reconcileChildren(current, workInProgress, nextChildren)
  memoizeProps(workInProgress, nextProps)
  return workInProgress.child
}
```
