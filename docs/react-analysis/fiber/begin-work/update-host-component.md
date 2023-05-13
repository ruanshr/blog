# updateHostComponent

hostComponent 即指原生的 HTML 标签。

context 相关的看[这里](../../features/context.md)

`tryToClaimNextHydratableInstance`是进行 hydrate 的操作，也就是复用原本存在的`root`的内部的`DOM`节点，详细可以看[这里](../scheduler-pkg.md)

```js
export function shouldDeprioritizeSubtree(type: string, props: Props): boolean {
  return !!props.hidden
}
```

`shouldDeprioritizeSubtree`判断了是否有`hidden`这个`prop`，如果这个节点是`AsyncMode`的并且有`hidden`，就设置`expirationTime`为`Never`。

设置为`Never` 是什么意思？意味着他的优先级是最低的，知道没有任何其他任务的时候这个才会被执行，详见这里

然后就是常规的处理`children` 的逻辑，就不详细讲了

```js
function updateHostComponent(current, workInProgress, renderExpirationTime) {
  pushHostContext(workInProgress)

  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress)
  }

  const type = workInProgress.type
  const nextProps = workInProgress.pendingProps
  const prevProps = current !== null ? current.memoizedProps : null

  let nextChildren = nextProps.children
  const isDirectTextChild = shouldSetTextContent(type, nextProps)

  if (isDirectTextChild) {
    // We special case a direct text child of a host node. This is a common
    // case. We won't handle it as a reified child. We will instead handle
    // this in the host environment that also have access to this prop. That
    // avoids allocating another HostText fiber and traversing it.
    nextChildren = null
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.effectTag |= ContentReset
  }

  markRef(current, workInProgress)

  // Check the host config to see if the children are offscreen/hidden.
  if (
    renderExpirationTime !== Never &&
    workInProgress.mode & AsyncMode &&
    shouldDeprioritizeSubtree(type, nextProps)
  ) {
    // Schedule this fiber to re-render at offscreen priority. Then bailout.
    workInProgress.expirationTime = Never
    workInProgress.memoizedProps = nextProps
    return null
  }

  reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime)
  memoizeProps(workInProgress, nextProps)
  return workInProgress.child
}
```
