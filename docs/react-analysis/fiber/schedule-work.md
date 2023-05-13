---
prev: /react-analysis/fiber/schedule-global
next: /react-analysis/fiber/scheduler-pkg
---

# scheduleWork

这里先 `scheduleWorkToRoot`，这一步非常重要，他主要做了一下几个任务

- 找到当前 `Fiber` 的 `root`
- 给更新节点的父节点链上的每个节点的 expirationTime 设置为这个 `update` 的 `expirationTime`，除非他本身时间要小于 `expirationTime`
- 给更新节点的父节点链上的每个节点的 childExpirationTime 设置为这个 `update` 的 `expirationTime`，除非他本身时间要小于 `expirationTime`

最终返回 `root` 节点的 `Fiber` 对象

然后进入一个判断：

```js
if (
!isWorking &&
nextRenderExpirationTime !== NoWork &&
expirationTime < nextRenderExpirationTime
)
```

我们来解释一下这几个变量的意思

`isWorking` 代表是否正在工作，在开始 `renderRoot` 和 `commitRoot` 的时候会设置为 `true`，也就是在 `render` 和 `commit` 两个阶段都会为 `true`
`nextRenderExpirationTime` 在是新的 `renderRoot` 的时候会被设置为当前任务的 `expirationTime`，而且一旦他被，只有当下次任务是 `NoWork` 的时候他才会被再次设置为 `NoWork`，当然最开始也是 `NoWork`
那么这个条件就很明显了：目前没有任何任务在执行，并且之前有执行过任务，同时当前的任务比之前执行的任务过期时间要早（也就是优先级要高）

那么这种情况会出现在什么时候呢？答案就是：上一个任务是异步任务（优先级很低，超时时间是 `502ms`），并且在上一个时间片（初始是 `33ms`）任务没有执行完，而且等待下一次 `requestIdleCallback` 的时候新的任务进来了，并且超时时间很短（`52ms` 或者 `22ms` 甚至是 `Sync`），那么优先级就变成了先执行当前任务，也就意味着上一个任务被打断了（`interrupted`）

被打断的任务会从当前节点开始往上推出 `context`，因为在 `React` 只有一个 `stack`，而下一个任务会从头开始的，所以在开始之前需要清空之前任务的的 `stack`。

`context` 请看[这里](../features/context.md)

`unwindWork` 请看[这里]()

然后重置所有的公共变量：

```js
nextRoot = null
nextRenderExpirationTime = NoWork
nextLatestAbsoluteTimeoutMs = -1
nextRenderDidError = false
nextUnitOfWork = null
```

### markPendingPriorityLevel

这个方法会记录当前的 `expirationTime` 到 `pendingTime`，让 `expirationTime` 处于 `earliestPendingTime` 和 `latestPendingTime` 之间

并且会设置`root.nextExpirationTimeToWorkOn` 和 `root.expirationTime = expirationTime` 分别是：

最早的 `pendingTime` 或者 `pingedTime`，如果都没有则是 lastestSuspendTime
`suspendedTime` 和 `nextExpirationTimeToWorkOn` 中较早的一个
调用 requestWork

```js
if (
!isWorking ||
isCommitting ||
nextRoot !== root
)
```

这个判断条件就比较简单了，`!isWorking || isCommitting `简单来说就是要么处于没有 `work` 的状态，要么只能在 `render` 阶段，不能处于 `commit` 阶段（比较好奇什么时候会在 `commit` 阶段有新的任务进来，`commit` 都是同步的无法打断）。还有一个选项 `nextRoot !== root`，这个的意思就是你的 `APP` 如果有两个不同的 `root`，这时候也符合条件。

在符合条件之后就 `requestWork` 了

```js
function scheduleWork(fiber: Fiber, expirationTime: ExpirationTime) {
  const root = scheduleWorkToRoot(fiber, expirationTime)

  if (enableSchedulerTracing) {
    storeInteractionsForExpirationTime(root, expirationTime, true)
  }

  if (
    !isWorking &&
    nextRenderExpirationTime !== NoWork &&
    expirationTime < nextRenderExpirationTime
  ) {
    // This is an interruption. (Used for performance tracking.)
    interruptedBy = fiber
    resetStack()
  }
  markPendingPriorityLevel(root, expirationTime)
  if (
    // If we're in the render phase, we don't need to schedule this root
    // for an update, because we'll do it before we exit...
    !isWorking ||
    isCommitting ||
    // ...unless this is a different root than the one we're rendering.
    nextRoot !== root
  ) {
    const rootExpirationTime = root.expirationTime
    requestWork(root, rootExpirationTime)
  }
}

function scheduleWorkToRoot(fiber: Fiber, expirationTime): FiberRoot | null {
  // Update the source fiber's expiration time
  if (fiber.expirationTime === NoWork || fiber.expirationTime > expirationTime) {
    fiber.expirationTime = expirationTime
  }
  let alternate = fiber.alternate
  if (
    alternate !== null &&
    (alternate.expirationTime === NoWork || alternate.expirationTime > expirationTime)
  ) {
    alternate.expirationTime = expirationTime
  }
  // Walk the parent path to the root and update the child expiration time.
  let node = fiber.return
  if (node === null && fiber.tag === HostRoot) {
    return fiber.stateNode
  }
  while (node !== null) {
    alternate = node.alternate
    if (node.childExpirationTime === NoWork || node.childExpirationTime > expirationTime) {
      node.childExpirationTime = expirationTime
      if (
        alternate !== null &&
        (alternate.childExpirationTime === NoWork || alternate.childExpirationTime > expirationTime)
      ) {
        alternate.childExpirationTime = expirationTime
      }
    } else if (
      alternate !== null &&
      (alternate.childExpirationTime === NoWork || alternate.childExpirationTime > expirationTime)
    ) {
      alternate.childExpirationTime = expirationTime
    }
    if (node.return === null && node.tag === HostRoot) {
      return node.stateNode
    }
    node = node.return
  }
  return null
}

function resetStack() {
  if (nextUnitOfWork !== null) {
    let interruptedWork = nextUnitOfWork.return
    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork)
      interruptedWork = interruptedWork.return
    }
  }

  nextRoot = null
  nextRenderExpirationTime = NoWork
  nextLatestAbsoluteTimeoutMs = -1
  nextRenderDidError = false
  nextUnitOfWork = null
}
```

### requestWork

`addRootToSchedule` 把 `root` 加入到调度队列，但是要注意一点，不会存在两个相同的 `root` 前后出现在队列中

可以看出来，如果第一次调用`addRootToSchedule`的时候，`nextScheduledRoot`是`null`，这时候公共变量`firstScheduledRoot`和`lastScheduledRoot`也是`null`，所以会把他们都赋值成`root`，同时`root.nextScheduledRoot = root`。然后第二次进来的时候，如果前后`root`是同一个，那么之前的`firstScheduledRoot`和`lastScheduledRoot`都是 `root`，所以`lastScheduledRoot.nextScheduledRoot = root`就等于 `root.nextScheduledRoot = root`

这么做是因为同一个`root`不需要存在两个，因为前一次调度如果中途被打断，下一次调度进入还是从同一个 root 开始，就会把新的任务一起执行了。

之后根据`expirationTime`调用`performSyncWork`还是`scheduleCallbackWithExpirationTime`

`scheduleCallbackWithExpirationTime` 是根据时间片来执行任务的，会涉及到 `requestIdleCallback`，详细解析看[这里](./scheduler-pkg.md)

`isBatchingUpdates` 和 `isUnbatchingUpdates` 涉及到事件系统，看 [`React` 事件系统](../features/event-injection.md)

他们最终都要调用 `performWork`

```js
function requestWork(root: FiberRoot, expirationTime: ExpirationTime) {
  addRootToSchedule(root, expirationTime)
  if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
    return
  }

  if (isBatchingUpdates) {
    // Flush work at the end of the batch.
    if (isUnbatchingUpdates) {
      nextFlushedRoot = root
      nextFlushedExpirationTime = Sync
      performWorkOnRoot(root, Sync, true)
    }
    return
  }

  if (expirationTime === Sync) {
    performSyncWork()
  } else {
    scheduleCallbackWithExpirationTime(root, expirationTime)
  }
}

function addRootToSchedule(root: FiberRoot, expirationTime: ExpirationTime) {
  // Add the root to the schedule.
  // Check if this root is already part of the schedule.
  if (root.nextScheduledRoot === null) {
    // This root is not already scheduled. Add it.
    root.expirationTime = expirationTime
    if (lastScheduledRoot === null) {
      firstScheduledRoot = lastScheduledRoot = root
      root.nextScheduledRoot = root
    } else {
      lastScheduledRoot.nextScheduledRoot = root
      lastScheduledRoot = root
      lastScheduledRoot.nextScheduledRoot = firstScheduledRoot
    }
  } else {
    // This root is already scheduled, but its priority may have increased.
    const remainingExpirationTime = root.expirationTime
    if (remainingExpirationTime === NoWork || expirationTime < remainingExpirationTime) {
      // Update the priority.
      root.expirationTime = expirationTime
    }
  }
}
```

关于 `scheduleCallbackWithExpirationTime` 的看[这里](../fiber/scheduler-pkg.md)

接下去就进入了[`performWork` 阶段](../fiber/perform-work.md)
