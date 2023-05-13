# renderRoot

这大概是`React`源码中我看到过最长的方法代码了。。。这里展示的我把一些不是特别重要的比如提醒代码或者开发工具代码删了一部分，还有注释也删了挺多。

首先是一个判断是否需要初始化变量的判断

```js
if (expirationTime !== nextRenderExpirationTime || root !== nextRoot || nextUnitOfWork === null) {
  // Reset the stack and start working from the root.
  resetStack()
  nextRoot = root
  nextRenderExpirationTime = expirationTime
  nextUnitOfWork = createWorkInProgress(nextRoot.current, null, nextRenderExpirationTime)
  root.pendingCommitExpirationTime = NoWork
}
```

那么这个判断是什么意思呢？他判断的情况是是否有新的更新进来了。假设这种情况：上一个任务因为时间片用完了而中断了，这个时候`nextUnitOfWork`是有工作的，这时候如果下一个`requestIdleCallback`进来了，中途没有新的任务进来，那么这些全局变量都没有变过，root 的`nextExpirationTimeToWorkOn`肯定也没有变化，那么代表是继续上一次的任务。而如果有新的更新进来，则势必`nextExpirationTimeToWorkOn`或者`root`会变化，那么肯定需要重置变量

`resetStack`如果是被中断的情况，会推出`context`栈，关于`context`可以看[这里](../features/context.md)

然后就进入整体，调用`workLoop`

```js
function workLoop(isYieldy) {
  if (!isYieldy) {
    // Flush work without yielding
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
  } else {
    // Flush asynchronous work until the deadline runs out of time.
    while (nextUnitOfWork !== null && !shouldYield()) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
  }
}
```

`workLoop`逻辑很简单的，只是判断是否需要继续调用`performUnitOfWork`，那么`performUnitOfWorkoop`我们放到下一节再讲，我们先看如果 catch 到错误会怎么样。

### if catch error

首先判断是否有`nextUnitOfWork`，如果是预期错误那么这个值是存在的，如果不存在代表是 React 无法预期的错误

如果存在，在开发时会调用`replayUnitOfWork`重放一下。然后看一下`nextUnitOfWork.return`是否存在，如果不存在也是无法预期的错误。然后执行`throwException`，这个方法非常重要，我单独写一篇文章进行分析，看这里

在`throwException`之后会直接调用`completeWork`当前的`nextUnitOfWork`，因为他已经报错了，所以没必要再渲染他的子节点了。

收尾
在`workLoop`执行完之后，就进入收尾阶段了。

首先如果`didFatal`为`true`，代表有一个无法处理的错误，直接调用`onFatal`，不`commit`

```js
function onFatal(root) {
  root.finishedWork = null
}
```

如果`nextUnitOfWork !== null`，代表任务没有执行完，是`yield`了，执行`onYield`

```js
function onYield(root) {
  root.finishedWork = null
}
```

如果以上都没有，说明已经`complete`整棵树了，如果`nextRenderDidError`代表有捕获到可处理的错误

这时候先判断是否有优先级更低的任务，有的话把当前的渲染时间设置进`suspendTime`，同时调用`onSuspend`

如果不符合再判断是否帧时间超时，如果没有超时并且没有`root.didError`，并且把`root.expirationTime`设置为`Sync`，然后调用`onSuspend`。

需要注意的是，他们调用`onSuspend`最后一个参数传递的都是-1，看`onSuspend`的逻辑可以发现其实什么都不做。什么都不做代表着，他们不会设置`root.finishedWork`，那么返回到上一层的`performWorkOnRoot`的时候

```js
finishedWork = root.finishedWork
if (finishedWork !== null) {
  if (!shouldYield()) {
    // Still time left. Commit the root.
    completeRoot(root, finishedWork, expirationTime)
  } else {
    root.finishedWork = finishedWork
  }
}
```

并不会执行`completeRoot`也就不会`commit`，会再返回到`performWork`找下一个`root`

```js
function onSuspend(
  root: FiberRoot,
  finishedWork: Fiber,
  suspendedExpirationTime: ExpirationTime,
  rootExpirationTime: ExpirationTime,
  msUntilTimeout: number
): void {
  root.expirationTime = rootExpirationTime
  if (enableSuspense && msUntilTimeout === 0 && !shouldYield()) {
    // Don't wait an additional tick. Commit the tree immediately.
    root.pendingCommitExpirationTime = suspendedExpirationTime
    root.finishedWork = finishedWork
  } else if (msUntilTimeout > 0) {
    // Wait`msUntilTimeout`milliseconds before committing.
    root.timeoutHandle = scheduleTimeout(
      onTimeout.bind(null, root, finishedWork, suspendedExpirationTime),
      msUntilTimeout
    )
  }
}

function onTimeout(root, finishedWork, suspendedExpirationTime) {
  if (enableSuspense) {
    // The root timed out. Commit it.
    root.pendingCommitExpirationTime = suspendedExpirationTime
    root.finishedWork = finishedWork
    // Read the current time before entering the commit phase. We can be
    // certain this won't cause tearing related to batching of event updates
    // because we're at the top of a timer event.
    recomputeCurrentRendererTime()
    currentSchedulerTime = currentRendererTime

    if (enableSchedulerTracing) {
      // Don't update pending interaction counts for suspense timeouts,
      // Because we know we still need to do more work in this case.
      suspenseDidTimeout = true
      flushRoot(root, suspendedExpirationTime)
      suspenseDidTimeout = false
    } else {
      flushRoot(root, suspendedExpirationTime)
    }
  }
}
```

其中`scheduleTimeout`是不同平台的`setTimout`

### 真正的 sequense

最后一个判断就是真正的挂起任务了，也就是`suquense`的情况，其实做的事情跟上面两个差不多，唯一的区别是调用`onSuspend`的时候最后一个参数肯定是大于等于零的。代表着他是立刻就要`commit`还是在一个`timeout`之后再`commit`。因为我们可以看到`onTimeout`最后是`flushRoot`，就是以`Sync`的方式调用`performWork`

### 最后

如果以上逻辑都没有，那么直接调用`onComplete`

```js
function onComplete(root: FiberRoot, finishedWork: Fiber, expirationTime: ExpirationTime) {
  root.pendingCommitExpirationTime = expirationTime
  root.finishedWork = finishedWork
}
function renderRoot(root, isYieldy, isExpired) {
  !!isWorking
    ? invariant(
        false,
        'renderRoot was called recursively. This error is likely caused by a bug in React. Please file an issue.'
      )
    : void 0
  isWorking = true
  ReactCurrentOwner$2.currentDispatcher = Dispatcher

  // console.log(isYieldy, isExpired)
  logRootTimes('start', root)

  var expirationTime = root.nextExpirationTimeToWorkOn
  console.log(expirationTime, nextRenderExpirationTime)

  var prevInteractions = null
  if (enableSchedulerTracing) {
    prevInteractions = tracing.__interactionsRef.current
    tracing.__interactionsRef.current = root.memoizedInteractions
  }

  // Check if we're starting from a fresh stack, or if we're resuming from
  // previously yielded work.
  if (expirationTime !== nextRenderExpirationTime || root !== nextRoot || nextUnitOfWork === null) {
    // Reset the stack and start working from the root.
    resetStack()
    nextRoot = root
    nextRenderExpirationTime = expirationTime
    nextUnitOfWork = createWorkInProgress(nextRoot.current, null, nextRenderExpirationTime)
    root.pendingCommitExpirationTime = NoWork
  }

  var didFatal = false

  startWorkLoopTimer(nextUnitOfWork)

  do {
    try {
      workLoop(isYieldy)
    } catch (thrownValue) {
      if (nextUnitOfWork === null) {
        // This is a fatal error.
        didFatal = true
        onUncaughtError(thrownValue)
      } else {
        {
          // Reset global debug state
          // We assume this is defined in DEV
          resetCurrentlyProcessingQueue()
        }

        var failedUnitOfWork = nextUnitOfWork
        if (true && replayFailedUnitOfWorkWithInvokeGuardedCallback) {
          replayUnitOfWork(failedUnitOfWork, thrownValue, isYieldy)
        }
        !(nextUnitOfWork !== null)
          ? invariant(
              false,
              'Failed to replay rendering after an error. This is likely caused by a bug in React. Please file an issue with a reproducing case to help us find it.'
            )
          : void 0

        var sourceFiber = nextUnitOfWork
        var returnFiber = sourceFiber.return
        if (returnFiber === null) {
          didFatal = true
          onUncaughtError(thrownValue)
        } else {
          throwException(root, returnFiber, sourceFiber, thrownValue, nextRenderExpirationTime)
          nextUnitOfWork = completeUnitOfWork(sourceFiber)
          continue
        }
      }
    }
    break
  } while (true)

  logRootTimes(1, root)

  if (enableSchedulerTracing) {
    // Traced work is done for now; restore the previous interactions.
    tracing.__interactionsRef.current = prevInteractions
  }

  // We're done performing work. Time to clean up.
  isWorking = false
  ReactCurrentOwner$2.currentDispatcher = null
  resetContextDependences()

  // Yield back to main thread.
  if (didFatal) {
    var _didCompleteRoot = false
    stopWorkLoopTimer(interruptedBy, _didCompleteRoot)
    interruptedBy = null
    // There was a fatal error.
    {
      resetStackAfterFatalErrorInDev()
    }
    nextRoot = null
    onFatal(root)
    return
  }

  if (nextUnitOfWork !== null) {
    var _didCompleteRoot2 = false
    stopWorkLoopTimer(interruptedBy, _didCompleteRoot2)
    interruptedBy = null
    onYield(root)
    return
  }

  // We completed the whole tree.
  var didCompleteRoot = true
  stopWorkLoopTimer(interruptedBy, didCompleteRoot)
  var rootWorkInProgress = root.current.alternate
  !(rootWorkInProgress !== null)
    ? invariant(
        false,
        'Finished root should have a work-in-progress. This error is likely caused by a bug in React. Please file an issue.'
      )
    : void 0

  nextRoot = null
  interruptedBy = null

  if (nextRenderDidError) {
    if (hasLowerPriorityWork(root, expirationTime)) {
      markSuspendedPriorityLevel(root, expirationTime)
      var suspendedExpirationTime = expirationTime
      var rootExpirationTime = root.expirationTime
      onSuspend(
        root,
        rootWorkInProgress,
        suspendedExpirationTime,
        rootExpirationTime,
        -1 // Indicates no timeout
      )
      return
    } else if (!root.didError && !isExpired) {
      root.didError = true
      var _suspendedExpirationTime = (root.nextExpirationTimeToWorkOn = expirationTime)
      var _rootExpirationTime = (root.expirationTime = Sync)
      onSuspend(
        root,
        rootWorkInProgress,
        _suspendedExpirationTime,
        _rootExpirationTime,
        -1 // Indicates no timeout
      )
      return
    }
  }

  if (!isExpired && nextLatestAbsoluteTimeoutMs !== -1) {
    // The tree was suspended.
    var _suspendedExpirationTime2 = expirationTime
    markSuspendedPriorityLevel(root, _suspendedExpirationTime2)

    var earliestExpirationTime = findEarliestOutstandingPriorityLevel(root, expirationTime)
    var earliestExpirationTimeMs = expirationTimeToMs(earliestExpirationTime)
    if (earliestExpirationTimeMs < nextLatestAbsoluteTimeoutMs) {
      nextLatestAbsoluteTimeoutMs = earliestExpirationTimeMs
    }

    var currentTimeMs = expirationTimeToMs(requestCurrentTime())
    var msUntilTimeout = nextLatestAbsoluteTimeoutMs - currentTimeMs
    msUntilTimeout = msUntilTimeout < 0 ? 0 : msUntilTimeout

    // TODO: Account for the Just Noticeable Difference

    var _rootExpirationTime2 = root.expirationTime
    onSuspend(
      root,
      rootWorkInProgress,
      _suspendedExpirationTime2,
      _rootExpirationTime2,
      msUntilTimeout
    )
    logRootTimes(2, root)
    return
  }

  logRootTimes(3, root)

  // Ready to commit.
  onComplete(root, rootWorkInProgress, expirationTime)
}
```
