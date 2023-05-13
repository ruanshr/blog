# performWork

`performWork` 通过两种方式调用

performAsyncWork 异步方式
异步情况给 `performWork` 设置的 `minExpirationTime` 是 `NoWork`，并且会判断 `dl.didTimeout`，这个值是指任务的 `expirationTime` 是否已经超时，如果超时了，则直接设置 `newExpirationTimeToWorkOn` 为当前时间，表示这个任务直接执行就行了，不需要判断是否超过了帧时间

performSyncWork 同步方式
同步方式久比较简单了，设置 minExpirationTime 为 Sync 也就是 1

具体 `performWork`
首先要通过 `findHighestPriorityRoot` 找到下一个需要操作的` root`，会设置两个全局变量

这里判断是否有 deadline 来分成两种渲染方式，但最大的差距其实是 while 循环的判断条件，有 `deadline` 的多了一个条件`(!deadlineDidExpire || currentRendererTime >= nextFlushedExpirationTime)`

我们先来看相同的部分

```js
nextFlushedRoot !== null &&
  nextFlushedExpirationTime !== NoWork &&
  (minExpirationTime === NoWork || minExpirationTime >= nextFlushedExpirationTime)
```

下一个输出节点不是 `null`，并且过期时间不是 `NoWork`，同时超时时间是 `NoWork`，或者超时时间大于下个节点的超时时间，一般来说 `minExpirationTime` 应该就等于 `nextFlushedExpirationTime` 因为他们来自同一个 `root`，`nextFlushedExpirationTime` 是在 `findHighestPriorityRoot` 阶段读取出来的 `root.expirationTime`

在非异步的情况下，接下去就是循环执行 performWorkOnRoot 然后再找下一个优先级的 root 执行

而在异步的情况下多了一个判断`(!deadlineDidExpire || currentRendererTime >= nextFlushedExpirationTime)`，什么意思呢？`deadlineDidExpire` 是用来判断时间片是否到期的，也就是 `deadline` 中设置的，而第二个条件是当前渲染时间是否大于 `nextFlushedExpirationTime`，也就是判断任务是否已经超时了了，如果超时了，根据下面调用 `performWorkOnRoot` 的参数中有一个 `currentRendererTime >= nextFlushedExpirationTime`，也就是这种情况下为 `true`，代表的意思是同步执行任务不再判断是否时间片到期。

收尾
最后如果跳出循环，有两种可能，一是任务已经完成，一是时间片用完了并且任务没过期。对于第二种情况会重新发起一次异步调度，等 `requestIdleCallback `有空了再回来继续执行。

```js
function performAsyncWork(dl) {
  if (dl.didTimeout) {
    if (firstScheduledRoot !== null) {
      recomputeCurrentRendererTime()
      let root: FiberRoot = firstScheduledRoot
      do {
        didExpireAtExpirationTime(root, currentRendererTime)
        // The root schedule is circular, so this is never null.
        root = (root.nextScheduledRoot: any)
      } while (root !== firstScheduledRoot)
    }
  }
  performWork(NoWork, dl)
}

function performSyncWork() {
  performWork(Sync, null)
}

function performWork(minExpirationTime: ExpirationTime, dl: Deadline | null) {
  deadline = dl

  // Keep working on roots until there's no more work, or until we reach
  // the deadline.
  findHighestPriorityRoot()

  if (deadline !== null) {
    recomputeCurrentRendererTime()
    currentSchedulerTime = currentRendererTime

    if (enableUserTimingAPI) {
      const didExpire = nextFlushedExpirationTime < currentRendererTime
      const timeout = expirationTimeToMs(nextFlushedExpirationTime)
      stopRequestCallbackTimer(didExpire, timeout)
    }

    while (
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      (minExpirationTime === NoWork || minExpirationTime >= nextFlushedExpirationTime) &&
      (!deadlineDidExpire || currentRendererTime >= nextFlushedExpirationTime)
    ) {
      performWorkOnRoot(
        nextFlushedRoot,
        nextFlushedExpirationTime,
        currentRendererTime >= nextFlushedExpirationTime
      )
      findHighestPriorityRoot()
      recomputeCurrentRendererTime()
      currentSchedulerTime = currentRendererTime
    }
  } else {
    while (
      nextFlushedRoot !== null &&
      nextFlushedExpirationTime !== NoWork &&
      (minExpirationTime === NoWork || minExpirationTime >= nextFlushedExpirationTime)
    ) {
      performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, true)
      findHighestPriorityRoot()
    }
  }

  // We're done flushing work. Either we ran out of time in this callback,
  // or there's no more work left with sufficient priority.

  // If we're inside a callback, set this to false since we just completed it.
  if (deadline !== null) {
    callbackExpirationTime = NoWork
    callbackID = null
  }
  // If there's work left over, schedule a new callback.
  if (nextFlushedExpirationTime !== NoWork) {
    scheduleCallbackWithExpirationTime(
      ((nextFlushedRoot: any): FiberRoot),
      nextFlushedExpirationTime
    )
  }

  // Clean-up.
  deadline = null
  deadlineDidExpire = false

  finishRendering()
}
```

### performWorkOnRoot

这里也分为同步和异步两种情况，但是这两种情况的区别其实非常小。

首先是一个参数的区别，`isYieldy` 在同步的情况下是 `false`，而在异步情况下是 `true`。这个参数顾名思义就是是否可以中断，那么这个区别也就很好理解了。

第二个区别就是在 `renderRoot` 之后判断一下 `shouldYeild`，如果时间片已经用完，则不直接 `completeRoot`，而是等到一下次 `requestIdleCallback` 之后再执行。

`renderRoot` 和 `completeRoot` 分别对应两个阶段：

- 渲染阶段
- 提交阶段

渲染阶段可以被打断，而提交阶段不能

```js
function performWorkOnRoot(root: FiberRoot, expirationTime: ExpirationTime, isExpired: boolean) {
  isRendering = true

  if (deadline === null || isExpired) {
    let finishedWork = root.finishedWork
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      completeRoot(root, finishedWork, expirationTime)
    } else {
      root.finishedWork = null
      const timeoutHandle = root.timeoutHandle
      if (enableSuspense && timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout
        cancelTimeout(timeoutHandle)
      }
      const isYieldy = false
      renderRoot(root, isYieldy, isExpired)
      finishedWork = root.finishedWork
      if (finishedWork !== null) {
        // We've completed the root. Commit it.
        completeRoot(root, finishedWork, expirationTime)
      }
    }
  } else {
    // Flush async work.
    let finishedWork = root.finishedWork
    if (finishedWork !== null) {
      // This root is already complete. We can commit it.
      completeRoot(root, finishedWork, expirationTime)
    } else {
      root.finishedWork = null
      // If this root previously suspended, clear its existing timeout, since
      // we're about to try rendering again.
      const timeoutHandle = root.timeoutHandle
      if (enableSuspense && timeoutHandle !== noTimeout) {
        root.timeoutHandle = noTimeout
        // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
        cancelTimeout(timeoutHandle)
      }
      const isYieldy = true
      renderRoot(root, isYieldy, isExpired)
      finishedWork = root.finishedWork
      if (finishedWork !== null) {
        if (!shouldYield()) {
          // Still time left. Commit the root.
          completeRoot(root, finishedWork, expirationTime)
        } else {
          root.finishedWork = finishedWork
        }
      }
    }
  }

  isRendering = false
}
```

### findHighestPriorityRoot

一般情况下我们的 `React` 应用只会有一个 `root`，所以这里的大部分逻辑其实都不是常见情况

循环`firstScheduledRoot => lastScheduledRoot`，`remainingExpirationTime`是`root.expirationTime`，也就是最早的过期时间。

如果他是 NoWork 说明他已经没有任务了，从链表中删除。

从剩下的中找到 `expirationTime` 最小的也就是优先级最高的 `root` 然后把他赋值给 `nextFlushedRoot` 并把他的 `expirationTime` 赋值给 `nextFlushedExpirationTime` 这两个公共变量。

一般来说会直接执行下面这个逻辑

```js
if (root === root.nextScheduledRoot) {
  // This is the only root in the list.
  root.nextScheduledRoot = null;
  firstScheduledRoot = lastScheduledRoot = null;
  break;
}
function findHighestPriorityRoot() {
  let highestPriorityWork = NoWork
  let highestPriorityRoot = null
  if (lastScheduledRoot !== null) {
    let previousScheduledRoot = lastScheduledRoot
    let root = firstScheduledRoot
    while (root !== null) {
      const remainingExpirationTime = root.expirationTime
      if (remainingExpirationTime === NoWork) {
        // This root no longer has work. Remove it from the scheduler.

        // TODO: This check is redudant, but Flow is confused by the branch
        // below where we set lastScheduledRoot to null, even though we break
        // from the loop right after.
        invariant(
          previousScheduledRoot !== null && lastScheduledRoot !== null,
          'Should have a previous and last root. This error is likely ' +
            'caused by a bug in React. Please file an issue.',
        )
        if (root === root.nextScheduledRoot) {
          // This is the only root in the list.
          root.nextScheduledRoot = null
          firstScheduledRoot = lastScheduledRoot = null
          break
        } else if (root === firstScheduledRoot) {
          // This is the first root in the list.
          const next = root.nextScheduledRoot
          firstScheduledRoot = next
          lastScheduledRoot.nextScheduledRoot = next
          root.nextScheduledRoot = null
        } else if (root === lastScheduledRoot) {
          // This is the last root in the list.
          lastScheduledRoot = previousScheduledRoot
          lastScheduledRoot.nextScheduledRoot = firstScheduledRoot
          root.nextScheduledRoot = null
          break
        } else {
          previousScheduledRoot.nextScheduledRoot = root.nextScheduledRoot
          root.nextScheduledRoot = null
        }
        root = previousScheduledRoot.nextScheduledRoot
      } else {
        if (
          highestPriorityWork === NoWork ||
          remainingExpirationTime < highestPriorityWork
        ) {
          // Update the priority, if it's higher
          highestPriorityWork = remainingExpirationTime
          highestPriorityRoot = root
        }
        if (root === lastScheduledRoot) {
          break
        }
        if (highestPriorityWork === Sync) {
          // Sync is highest priority by definition so
          // we can stop searching.
          break
        }
        previousScheduledRoot = root
        root = root.nextScheduledRoot
      }
    }
  }

  nextFlushedRoot = highestPriorityRoot
  nextFlushedExpirationTime = highestPriorityWork
}

```
