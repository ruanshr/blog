# updatePortalComponent

`portal`是一个特殊的`React Type`，他会包含一个`container`。

`portal` 本身没有什么功能，所以不需要怎么处理，直接`reconcileChildren`

```js
function updatePortalComponent(current, workInProgress, renderExpirationTime) {
  pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo)
  const nextChildren = workInProgress.pendingProps
  if (hasLegacyContextChanged()) {
    // Normally we can bail out on props equality but if context has changed
    // we don't do the bailout and we have to reuse existing props instead.
  } else if (workInProgress.memoizedProps === nextChildren) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress)
  }

  if (current === null) {
    // Portals are special because we don't append the children during mount
    // but at commit. Therefore we need to track insertions which the normal
    // flow doesn't do during mount. This doesn't happen at the root because
    // the root always starts with a "current" with a null child.
    // TODO: Consider unifying this with how the root works.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime
    )
    memoizeProps(workInProgress, nextChildren)
  } else {
    reconcileChildren(current, workInProgress, nextChildren)
    memoizeProps(workInProgress, nextChildren)
  }
  return workInProgress.child
}
```
