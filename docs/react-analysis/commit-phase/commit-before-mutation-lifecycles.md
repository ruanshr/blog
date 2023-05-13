---
prev: /react-analysis/commit-phase/invoke-guarded-callback
next: /react-analysis/commit-phase/commit-all-host-effects
---

# commitBeforeMutationLifecycles

这里在`ReactFiberScheduler.js`里面声明了这个方法，但还从`ReactFiberCommitWork`引入了一个同名方法，嗯~~~

这其实就是调用`getSnapshotBeforeUpdate`，在后面调用`componentDidUpdate`声明周期方法的时候，会传入这里计算出来的值。

```js
function commitBeforeMutationLifecycles() {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag
    if (effectTag & Snapshot) {
      recordEffect()
      const current = nextEffect.alternate
      commitBeforeMutationLifeCycles(current, nextEffect)
    }

    // Don't cleanup effects yet;
    // This will be done by commitAllLifeCycles()
    nextEffect = nextEffect.nextEffect
  }
}

function commitBeforeMutationLifeCycles(current: Fiber | null, finishedWork: Fiber): void {
  switch (finishedWork.tag) {
    case ClassComponent: {
      if (finishedWork.effectTag & Snapshot) {
        if (current !== null) {
          const prevProps = current.memoizedProps
          const prevState = current.memoizedState
          startPhaseTimer(finishedWork, 'getSnapshotBeforeUpdate')
          const instance = finishedWork.stateNode
          instance.props = finishedWork.memoizedProps
          instance.state = finishedWork.memoizedState
          const snapshot = instance.getSnapshotBeforeUpdate(prevProps, prevState)
          instance.__reactInternalSnapshotBeforeUpdate = snapshot
          stopPhaseTimer()
        }
      }
      return
    }
    case HostRoot:
    case HostComponent:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      // Nothing to do for these component types
      return
    default: {
      invariant(
        false,
        'This unit of work tag should not have side-effects. This error is ' +
          'likely caused by a bug in React. Please file an issue.'
      )
    }
  }
}
```
