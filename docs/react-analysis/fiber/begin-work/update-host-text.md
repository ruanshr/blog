# updateHostText

这个就简单了

`tryToClaimNextHydratableInstance`是进行`hydrate`的操作，也就是复用原本存在的`root`的内部的`DOM`节点，详细可以看这里

因为是文字节点，也就不需要`reconcileChildren`了

```js
function updateHostText(current, workInProgress) {
  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress)
  }
  const nextProps = workInProgress.pendingProps
  memoizeProps(workInProgress, nextProps)
  // Nothing to do here. This is terminal. We'll do the completion step
  // immediately after.
  return null
}
```
