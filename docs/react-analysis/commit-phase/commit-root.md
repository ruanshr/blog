---
prev: /react-analysis/fiber/reconcile-children
next: /react-analysis/commit-phase/invoke-guarded-callback
---

# commitRoot

首先要标记优先级，因为有一部分优先级的任务已经被提交了，所以需要清楚一些相关的优先级。被提交的任务应该是：

- 子树中优先级最高的任务
- 或者外部指定的优先级（`flushSync`或者`retry`）

如果`RootFiber`本身也有副作用（一般只有第一次），那么他本身也要加到`effect`链上，放在最后。

接下去是三个提交操作，分别是：

- [提交 Snapshot](../commit-phase/commit-before-mutation-lifecycles.md)
- [提交 HostComponent 的 side effect](../commit-phase/commit-all-host-effects.md)
- [提交所有组件的生命周期](../commit-phase/commit-all-lifecycles.md)

注意这里用到了一个方法`invokeGuardedCallback`，只有在开发环境才会使用，那么他是干嘛的呢？看[这里]()

```js
function commitRoot(root: FiberRoot, finishedWork: Fiber): void {
  isWorking = true
  isCommitting = true
  startCommitTimer()

  invariant(
    root.current !== finishedWork,
    'Cannot commit the same tree as before. This is probably a bug ' +
      'related to the return field. This error is likely caused by a bug ' +
      'in React. Please file an issue.'
  )
  const committedExpirationTime = root.pendingCommitExpirationTime
  invariant(
    committedExpirationTime !== NoWork,
    'Cannot commit an incomplete root. This error is likely caused by a ' +
      'bug in React. Please file an issue.'
  )
  root.pendingCommitExpirationTime = NoWork

  const updateExpirationTimeBeforeCommit = finishedWork.expirationTime
  const childExpirationTimeBeforeCommit = finishedWork.childExpirationTime
  const earliestRemainingTimeBeforeCommit =
    updateExpirationTimeBeforeCommit === NoWork ||
    (childExpirationTimeBeforeCommit !== NoWork &&
      childExpirationTimeBeforeCommit < updateExpirationTimeBeforeCommit)
      ? childExpirationTimeBeforeCommit
      : updateExpirationTimeBeforeCommit
  markCommittedPriorityLevels(root, earliestRemainingTimeBeforeCommit)

  let prevInteractions: Set<Interaction> = (null: any)

  // Reset this to null before calling lifecycles
  ReactCurrentOwner.current = null

  let firstEffect
  if (finishedWork.effectTag > PerformedWork) {
    // A fiber's effect list consists only of its children, not itself. So if
    // the root has an effect, we need to add it to the end of the list. The
    // resulting list is the set that would belong to the root's parent, if
    // it had one; that is, all the effects in the tree including the root.
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork
      firstEffect = finishedWork.firstEffect
    } else {
      firstEffect = finishedWork
    }
  } else {
    // There is no effect on the root.
    firstEffect = finishedWork.firstEffect
  }

  prepareForCommit(root.containerInfo)

  // Invoke instances of getSnapshotBeforeUpdate before mutation.
  nextEffect = firstEffect
  startCommitSnapshotEffectsTimer()
  while (nextEffect !== null) {
    let didError = false
    let error
    if (__DEV__) {
      invokeGuardedCallback(null, commitBeforeMutationLifecycles, null)
      if (hasCaughtError()) {
        didError = true
        error = clearCaughtError()
      }
    } else {
      try {
        commitBeforeMutationLifecycles()
      } catch (e) {
        didError = true
        error = e
      }
    }
    if (didError) {
      invariant(
        nextEffect !== null,
        'Should have next effect. This error is likely caused by a bug ' +
          'in React. Please file an issue.'
      )
      captureCommitPhaseError(nextEffect, error)
      // Clean-up
      if (nextEffect !== null) {
        nextEffect = nextEffect.nextEffect
      }
    }
  }
  stopCommitSnapshotEffectsTimer()

  nextEffect = firstEffect
  startCommitHostEffectsTimer()
  while (nextEffect !== null) {
    let didError = false
    let error
    if (__DEV__) {
      invokeGuardedCallback(null, commitAllHostEffects, null)
      if (hasCaughtError()) {
        didError = true
        error = clearCaughtError()
      }
    } else {
      try {
        commitAllHostEffects()
      } catch (e) {
        didError = true
        error = e
      }
    }
    if (didError) {
      invariant(
        nextEffect !== null,
        'Should have next effect. This error is likely caused by a bug ' +
          'in React. Please file an issue.'
      )
      captureCommitPhaseError(nextEffect, error)
      // Clean-up
      if (nextEffect !== null) {
        nextEffect = nextEffect.nextEffect
      }
    }
  }
  stopCommitHostEffectsTimer()

  resetAfterCommit(root.containerInfo)

  root.current = finishedWork

  nextEffect = firstEffect
  startCommitLifeCyclesTimer()
  while (nextEffect !== null) {
    let didError = false
    let error
    if (__DEV__) {
      invokeGuardedCallback(null, commitAllLifeCycles, null, root, committedExpirationTime)
      if (hasCaughtError()) {
        didError = true
        error = clearCaughtError()
      }
    } else {
      try {
        commitAllLifeCycles(root, committedExpirationTime)
      } catch (e) {
        didError = true
        error = e
      }
    }
    if (didError) {
      invariant(
        nextEffect !== null,
        'Should have next effect. This error is likely caused by a bug ' +
          'in React. Please file an issue.'
      )
      captureCommitPhaseError(nextEffect, error)
      if (nextEffect !== null) {
        nextEffect = nextEffect.nextEffect
      }
    }
  }

  isCommitting = false
  isWorking = false
  stopCommitLifeCyclesTimer()
  stopCommitTimer()
  onCommitRoot(finishedWork.stateNode)

  const updateExpirationTimeAfterCommit = finishedWork.expirationTime
  const childExpirationTimeAfterCommit = finishedWork.childExpirationTime
  const earliestRemainingTimeAfterCommit =
    updateExpirationTimeAfterCommit === NoWork ||
    (childExpirationTimeAfterCommit !== NoWork &&
      childExpirationTimeAfterCommit < updateExpirationTimeAfterCommit)
      ? childExpirationTimeAfterCommit
      : updateExpirationTimeAfterCommit
  if (earliestRemainingTimeAfterCommit === NoWork) {
    // If there's no remaining work, we can clear the set of already failed
    // error boundaries.
    legacyErrorBoundariesThatAlreadyFailed = null
  }
  onCommit(root, earliestRemainingTimeAfterCommit)

  // profiler 相关
}
```
