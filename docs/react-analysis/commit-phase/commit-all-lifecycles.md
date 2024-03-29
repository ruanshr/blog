---
prev: /react-analysis/commit-phase/commit-all-host-effects
next: /react-analysis/features/context
---

# commitAllLifeCycles

### commitUpdateQueue

对于`ClassComponent`，需要调用生命周期方法。同时对于创建了更新的`ClassComponent`，需要判断调用的`setState` 是否有回调函数，如果有的话需要在这里一起调用。注意这里把`capturedUpdates` 挂到了`updates` 上，`React` 会尝试把捕获产生的更新放到下一次渲染上（如果有的话），但是如果本身已经没有更新了，则会直接删除。

```js
export function commitUpdateQueue<State>(
  finishedWork: Fiber,
  finishedQueue: UpdateQueue<State>,
  instance: any,
  renderExpirationTime: ExpirationTime
): void {
  // 如果有低优先级的任务，则让本次渲染捕获的更新放到低优先级的任务上渲染
  // 这里的假设是当前节点上低优先级的任务可能可以处理捕获的任务
  // 如果没有低优先级的任务，则清除本次捕获的更新
  if (finishedQueue.firstCapturedUpdate !== null) {
    // Join the captured update list to the end of the normal list.
    if (finishedQueue.lastUpdate !== null) {
      finishedQueue.lastUpdate.next = finishedQueue.firstCapturedUpdate
      finishedQueue.lastUpdate = finishedQueue.lastCapturedUpdate
    }
    // Clear the list of captured updates.
    finishedQueue.firstCapturedUpdate = finishedQueue.lastCapturedUpdate = null
  }

  // Commit the effects
  commitUpdateEffects(finishedQueue.firstEffect, instance)
  finishedQueue.firstEffect = finishedQueue.lastEffect = null

  commitUpdateEffects(finishedQueue.firstCapturedEffect, instance)
  finishedQueue.firstCapturedEffect = finishedQueue.lastCapturedEffect = null
}

function commitUpdateEffects<State>(effect: Update<State> | null, instance: any): void {
  while (effect !== null) {
    const callback = effect.callback
    if (callback !== null) {
      effect.callback = null
      callCallback(callback, instance)
    }
    effect = effect.nextEffect
  }
}
```

```js
function commitAllLifeCycles(finishedRoot: FiberRoot, committedExpirationTime: ExpirationTime) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag

    if (effectTag & (Update | Callback)) {
      recordEffect()
      const current = nextEffect.alternate
      commitLifeCycles(finishedRoot, current, nextEffect, committedExpirationTime)
    }

    if (effectTag & Ref) {
      recordEffect()
      commitAttachRef(nextEffect)
    }

    const next = nextEffect.nextEffect
    nextEffect.nextEffect = null
    nextEffect = next
  }
}

function commitLifeCycles(
  finishedRoot: FiberRoot,
  current: Fiber | null,
  finishedWork: Fiber,
  committedExpirationTime: ExpirationTime
): void {
  switch (finishedWork.tag) {
    case ClassComponent: {
      const instance = finishedWork.stateNode
      if (finishedWork.effectTag & Update) {
        if (current === null) {
          startPhaseTimer(finishedWork, 'componentDidMount')
          instance.props = finishedWork.memoizedProps
          instance.state = finishedWork.memoizedState
          instance.componentDidMount()
          stopPhaseTimer()
        } else {
          const prevProps = current.memoizedProps
          const prevState = current.memoizedState
          startPhaseTimer(finishedWork, 'componentDidUpdate')
          instance.props = finishedWork.memoizedProps
          instance.state = finishedWork.memoizedState
          instance.componentDidUpdate(
            prevProps,
            prevState,
            instance.__reactInternalSnapshotBeforeUpdate
          )
          stopPhaseTimer()
        }
      }
      const updateQueue = finishedWork.updateQueue
      if (updateQueue !== null) {
        instance.props = finishedWork.memoizedProps
        instance.state = finishedWork.memoizedState
        commitUpdateQueue(finishedWork, updateQueue, instance, committedExpirationTime)
      }
      return
    }
    case HostRoot: {
      const updateQueue = finishedWork.updateQueue
      if (updateQueue !== null) {
        let instance = null
        if (finishedWork.child !== null) {
          switch (finishedWork.child.tag) {
            case HostComponent:
              instance = getPublicInstance(finishedWork.child.stateNode)
              break
            case ClassComponent:
              instance = finishedWork.child.stateNode
              break
          }
        }
        commitUpdateQueue(finishedWork, updateQueue, instance, committedExpirationTime)
      }
      return
    }
    case HostComponent: {
      const instance: Instance = finishedWork.stateNode
      if (current === null && finishedWork.effectTag & Update) {
        const type = finishedWork.type
        const props = finishedWork.memoizedProps
        commitMount(instance, type, props, finishedWork)
      }

      return
    }
    case HostText: {
      // We have no life-cycles associated with text.
      return
    }
    case HostPortal: {
      // We have no life-cycles associated with portals.
      return
    }
    case Profiler: {
      if (enableProfilerTimer) {
        const onRender = finishedWork.memoizedProps.onRender

        if (enableSchedulerTracing) {
          onRender(
            finishedWork.memoizedProps.id,
            current === null ? 'mount' : 'update',
            finishedWork.actualDuration,
            finishedWork.treeBaseDuration,
            finishedWork.actualStartTime,
            getCommitTime(),
            finishedRoot.memoizedInteractions
          )
        } else {
          onRender(
            finishedWork.memoizedProps.id,
            current === null ? 'mount' : 'update',
            finishedWork.actualDuration,
            finishedWork.treeBaseDuration,
            finishedWork.actualStartTime,
            getCommitTime()
          )
        }
      }
      return
    }
    case SuspenseComponent: {
      if (finishedWork.effectTag & Callback) {
        const newState: SuspenseState = {
          alreadyCaptured: true,
          didTimeout: false,
          timedOutAt: NoWork
        }
        finishedWork.memoizedState = newState
        scheduleWork(finishedWork, Sync)
        return
      }
      let oldState: SuspenseState | null = current !== null ? current.memoizedState : null
      let newState: SuspenseState | null = finishedWork.memoizedState
      let oldDidTimeout = oldState !== null ? oldState.didTimeout : false

      let newDidTimeout
      let primaryChildParent = finishedWork
      if (newState === null) {
        newDidTimeout = false
      } else {
        newDidTimeout = newState.didTimeout
        if (newDidTimeout) {
          primaryChildParent = finishedWork.child
          newState.alreadyCaptured = false
          if (newState.timedOutAt === NoWork) {
            newState.timedOutAt = requestCurrentTime()
          }
        }
      }

      if (newDidTimeout !== oldDidTimeout && primaryChildParent !== null) {
        hideOrUnhideAllChildren(primaryChildParent, newDidTimeout)
      }
      return
    }
    case IncompleteClassComponent:
      break
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
