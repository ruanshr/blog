---
prev: /react-analysis/update/react-dom-render
next: /react-analysis/update/expiration-time
---

# setState

`setState`调用`updater.enqueueSetState`，我们先不管这个对象什么时候设置进来的，先来看一下代码

`setState`和`forceUpdate`的代码我们可以看到，几乎是一模一样的。唯一的区别是`Update.tag`

关于`Update`和`UpdateQueue`的数据结构可以看[这里]()

在当前节点对应的 Fiber 对象上创建了`Update`之后，进就如`scheduleWork`调度阶段。

```js
const classComponentUpdater = {
  // isMounted
  enqueueSetState(inst, payload, callback) {
    const fiber = ReactInstanceMap.get(inst)
    const currentTime = requestCurrentTime()
    const expirationTime = computeExpirationForFiber(currentTime, fiber)

    const update = createUpdate(expirationTime)
    update.payload = payload
    if (callback !== undefined && callback !== null) {
      update.callback = callback
    }

    enqueueUpdate(fiber, update)
    scheduleWork(fiber, expirationTime)
  },
  // replaceState
  enqueueForceUpdate(inst, callback) {
    const fiber = ReactInstanceMap.get(inst)
    const currentTime = requestCurrentTime()
    const expirationTime = computeExpirationForFiber(currentTime, fiber)

    const update = createUpdate(expirationTime)
    update.tag = ForceUpdate

    if (callback !== undefined && callback !== null) {
      update.callback = callback
    }

    enqueueUpdate(fiber, update)
    scheduleWork(fiber, expirationTime)
  }
}
```
