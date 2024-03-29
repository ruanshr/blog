---
prev: /react-analysis/fiber/perform-work
next: /react-analysis/fiber/render-root
---

# performUnitOfWork

这个方法还是比较好理解的

首先执行`beginWork`进行节点操作，以及创建子节点，子节点会返回成为 next，如果有`next`就返回。返回到`workLoop`之后，`workLoop`会判断是否过期之类的，如果都 OK 就会再次调用该方法。

如果`next`不存在，说明当前节点向下遍历子节点已经到底了，说明这个子树侧枝已经遍历完，可以完成这部分工作了。就执行`completeUnitOfWork`，`completeUnitOfWork`就是处理一些`effact tag`，他会一直往上返回直到 root 节点或者在某一个节点发现有`sibling`兄弟节点为止。如果到了`root`那么他的返回也是`null`，代表整棵树的遍历已经结束了，可以 commit 了，如果遇到兄弟节点就返回该节点，因为这个节点可能也会存在子节点，需要通过`beginWork`进行操作。

workLoop

beginWork
completeUnitOfWork

```js
function performUnitOfWork(workInProgress: Fiber): Fiber | null {
  // The current, flushed, state of this fiber is the alternate.
  // Ideally nothing should rely on this, but relying on it here
  // means that we don't need an additional field on the work in
  // progress.
  const current = workInProgress.alternate

  // See if beginning this work spawns more work.
  startWorkTimer(workInProgress)
  if (__DEV__) {
    ReactCurrentFiber.setCurrentFiber(workInProgress)
  }

  if (__DEV__ && replayFailedUnitOfWorkWithInvokeGuardedCallback) {
    stashedWorkInProgressProperties = assignFiberPropertiesInDEV(
      stashedWorkInProgressProperties,
      workInProgress
    )
  }

  let next
  if (enableProfilerTimer) {
    if (workInProgress.mode & ProfileMode) {
      startProfilerTimer(workInProgress)
    }

    next = beginWork(current, workInProgress, nextRenderExpirationTime)

    if (workInProgress.mode & ProfileMode) {
      // Record the render duration assuming we didn't bailout (or error).
      stopProfilerTimerIfRunningAndRecordDelta(workInProgress, true)
    }
  } else {
    next = beginWork(current, workInProgress, nextRenderExpirationTime)
  }

  if (__DEV__) {
    ReactCurrentFiber.resetCurrentFiber()
    if (isReplayingFailedUnitOfWork) {
      // Currently replaying a failed unit of work. This should be unreachable,
      // because the render phase is meant to be idempotent, and it should
      // have thrown again. Since it didn't, rethrow the original error, so
      // React's internal stack is not misaligned.
      rethrowOriginalError()
    }
  }
  if (__DEV__ && ReactFiberInstrumentation.debugTool) {
    ReactFiberInstrumentation.debugTool.onBeginWork(workInProgress)
  }

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(workInProgress)
  }

  ReactCurrentOwner.current = null

  return next
}
```

### beginWork

首先有一个判断，这个判断是提升性能非常重要的一点，如果符合这个条件那么说明这个节点以及他的子节点很可能在这次更新中都不需要再被计算，我们先来看一下内容

```js
const updateExpirationTime = workInProgress.expirationTime
if (
  !hasLegacyContextChanged() &&
  (updateExpirationTime === NoWork ||
    updateExpirationTime > renderExpirationTime)
)
```

`hasLegacyContextChanged`这个判断是用来判断`context`的，这个判断代表着如果当前节点和他的父节点都没有老的`context api`，也就是 childContextType 那套的话，他就为 true，不然不管他的父级的`context`内容是否有变化，他都为`false`。所以老的`context api`对性能的影响还是非常大的，详细可以看[context](../features/context.md)

第二个判断是超时时间的判断，如果当前节点的`expirationTime`是`NoWork`那么说明他没有更新，也就不需要改动了，如果`expirationTime`大于当前渲染的超时时间，说明他的更新内容不是这次更新造成的，也可以忽略。

如果符合条件，所有组件都会执行`bailoutOnAlreadyFinishedWork`，但是对于一些可以提供`context`的组件，我们仍然要做一些`context`相关的操作

`bailoutOnAlreadyFinishedWork`具体做了什么呢？

```js
function bailoutOnAlreadyFinishedWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime
): Fiber | null {
  cancelWorkTimer(workInProgress)

  if (current !== null) {
    workInProgress.firstContextDependency = current.firstContextDependency
  }

  if (enableProfilerTimer) {
    stopProfilerTimerIfRunning(workInProgress)
  }

  const childExpirationTime = workInProgress.childExpirationTime
  if (childExpirationTime === NoWork || childExpirationTime > renderExpirationTime) {
    return null
  } else {
    cloneChildFibers(current, workInProgress)
    return workInProgress.child
  }
}
```

最主要的是看最后面的判断，如果`childExpirationTime === NoWork || childExpirationTime > renderExpirationTime`成立，也就是他的子树上没有更新，他返回的是`null`，回想一下`performUnitOfWork`的逻辑，这里`return null`代表着`next`是`null`，就直接`completeUnitOfWork`了，就不解析`child`了。

如果不满足就是复用当前 `Fiber` 对象，然后返回他的子节点，因为他的子节点还是有工作要做的。

然后就是根据`element`的不同类型执行不同的`update。`

这里说一下，如果出现`switch(workInProgress.tag) case ClassComponentLazy`的情况，说明这个异步组件已经加载完成了，在加载完成前应该都是`IndeterminateComponent`，会直接`throw`，造成跟`Placeholder`组件使用时一样的情况

- mountIndeterminateComponent
- updateFunctionalComponent
- updateClassComponent
- updateHostRoot
- updateHostComponent
- updateHostText
- updateTimeoutComponent
- updatePortalComponent
- updateForwardRef
- updateFragment
- updateMode
- updateProfiler
- updateContextProvider
- updateContextConsumer

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime
): Fiber | null {
  const updateExpirationTime = workInProgress.expirationTime
  if (
    !hasLegacyContextChanged() &&
    (updateExpirationTime === NoWork || updateExpirationTime > renderExpirationTime)
  ) {
    // This fiber does not have any pending work. Bailout without entering
    // the begin phase. There's still some bookkeeping we that needs to be done
    // in this optimized path, mostly pushing stuff onto the stack.
    switch (workInProgress.tag) {
      case HostRoot:
        pushHostRootContext(workInProgress)
        resetHydrationState()
        break
      case HostComponent:
        pushHostContext(workInProgress)
        break
      case ClassComponent: {
        const Component = workInProgress.type
        if (isLegacyContextProvider(Component)) {
          pushLegacyContextProvider(workInProgress)
        }
        break
      }
      case ClassComponentLazy: {
        const thenable = workInProgress.type
        const Component = getResultFromResolvedThenable(thenable)
        if (isLegacyContextProvider(Component)) {
          pushLegacyContextProvider(workInProgress)
        }
        break
      }
      case HostPortal:
        pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo)
        break
      case ContextProvider: {
        const newValue = workInProgress.memoizedProps.value
        pushProvider(workInProgress, newValue)
        break
      }
      case Profiler:
        if (enableProfilerTimer) {
          workInProgress.effectTag |= Update
        }
        break
    }
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderExpirationTime)
  }

  // Before entering the begin phase, clear the expiration time.
  workInProgress.expirationTime = NoWork

  switch (workInProgress.tag) {
    case IndeterminateComponent: {
      const Component = workInProgress.type
      return mountIndeterminateComponent(current, workInProgress, Component, renderExpirationTime)
    }
    case FunctionalComponent: {
      const Component = workInProgress.type
      const unresolvedProps = workInProgress.pendingProps
      return updateFunctionalComponent(
        current,
        workInProgress,
        Component,
        unresolvedProps,
        renderExpirationTime
      )
    }
    case FunctionalComponentLazy: {
      const thenable = workInProgress.type
      const Component = getResultFromResolvedThenable(thenable)
      const unresolvedProps = workInProgress.pendingProps
      const child = updateFunctionalComponent(
        current,
        workInProgress,
        Component,
        resolveDefaultProps(Component, unresolvedProps),
        renderExpirationTime
      )
      workInProgress.memoizedProps = unresolvedProps
      return child
    }
    case ClassComponent: {
      const Component = workInProgress.type
      const unresolvedProps = workInProgress.pendingProps
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        unresolvedProps,
        renderExpirationTime
      )
    }
    case ClassComponentLazy: {
      const thenable = workInProgress.type
      const Component = getResultFromResolvedThenable(thenable)
      const unresolvedProps = workInProgress.pendingProps
      const child = updateClassComponent(
        current,
        workInProgress,
        Component,
        resolveDefaultProps(Component, unresolvedProps),
        renderExpirationTime
      )
      workInProgress.memoizedProps = unresolvedProps
      return child
    }
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime)
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime)
    case HostText:
      return updateHostText(current, workInProgress)
    case PlaceholderComponent:
      return updatePlaceholderComponent(current, workInProgress, renderExpirationTime)
    case HostPortal:
      return updatePortalComponent(current, workInProgress, renderExpirationTime)
    case ForwardRef: {
      const type = workInProgress.type
      return updateForwardRef(
        current,
        workInProgress,
        type,
        workInProgress.pendingProps,
        renderExpirationTime
      )
    }
    case ForwardRefLazy:
      const thenable = workInProgress.type
      const Component = getResultFromResolvedThenable(thenable)
      const unresolvedProps = workInProgress.pendingProps
      const child = updateForwardRef(
        current,
        workInProgress,
        Component,
        resolveDefaultProps(Component, unresolvedProps),
        renderExpirationTime
      )
      workInProgress.memoizedProps = unresolvedProps
      return child
    case Fragment:
      return updateFragment(current, workInProgress, renderExpirationTime)
    case Mode:
      return updateMode(current, workInProgress, renderExpirationTime)
    case Profiler:
      return updateProfiler(current, workInProgress, renderExpirationTime)
    case ContextProvider:
      return updateContextProvider(current, workInProgress, renderExpirationTime)
    case ContextConsumer:
      return updateContextConsumer(current, workInProgress, renderExpirationTime)
    default:
      invariant(
        false,
        'Unknown unit of work tag. This error is likely caused by a bug in ' +
          'React. Please file an issue.'
      )
  }
}
```

### completeUnitOfWork

可以看到这里就是一个非常大的循环，声明了两个变量`returnFiber`是父亲节点，`siblingFiber`是兄弟节点

循环内部首先是一个`if`判断，这个判断是看这个任务是否是`Incomplete`，也就是收否有错误发生并被捕获。

如果没有错误
就执行`nextUnitOfWork = completeWork`

### completeWork

然后执行`resetChildExpirationTime`

```js
function resetChildExpirationTime(workInProgress: Fiber, renderTime: ExpirationTime) {
  if (renderTime !== Never && workInProgress.childExpirationTime === Never) {
    return
  }

  let newChildExpirationTime = NoWork

  // if ProfileMode

  {
    let child = workInProgress.child
    while (child !== null) {
      const childUpdateExpirationTime = child.expirationTime
      const childChildExpirationTime = child.childExpirationTime
      if (
        newChildExpirationTime === NoWork ||
        (childUpdateExpirationTime !== NoWork && childUpdateExpirationTime < newChildExpirationTime)
      ) {
        newChildExpirationTime = childUpdateExpirationTime
      }
      if (
        newChildExpirationTime === NoWork ||
        (childChildExpirationTime !== NoWork && childChildExpirationTime < newChildExpirationTime)
      ) {
        newChildExpirationTime = childChildExpirationTime
      }
      child = child.sibling
    }
  }

  workInProgress.childExpirationTime = newChildExpirationTime
}
```

这个方法就是找到当前节点的所有子节点，并且读取他的更新时间和他的子节点更新时间，找到其中非`NoWork`的最早过期时间，然后赋值给当前节点的`childExpirationTime`

然后如果没有`next`就直接返回，如果有，就要向上创建`effect`链

最后如果有兄弟节点，则返回兄弟节点，对兄弟节点进行`beginWork`，如果没有则继续操作上级`fiber`

如果有错误
则执行`unwindWork`，后续的操作跟没有错误的情况差不多

但是多了一步，就是会向他的父节点增加`Incomplete`的`side effect tag`

```js
function completeUnitOfWork(workInProgress: Fiber): Fiber | null {
  while (true) {
    const current = workInProgress.alternate
    if (__DEV__) {
      ReactCurrentFiber.setCurrentFiber(workInProgress)
    }

    const returnFiber = workInProgress.return
    const siblingFiber = workInProgress.sibling

    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      // This fiber completed.
      if (enableProfilerTimer) {
        if (workInProgress.mode & ProfileMode) {
          startProfilerTimer(workInProgress)
        }

        nextUnitOfWork = completeWork(current, workInProgress, nextRenderExpirationTime)

        if (workInProgress.mode & ProfileMode) {
          // Update render duration assuming we didn't error.
          stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false)
        }
      } else {
        nextUnitOfWork = completeWork(current, workInProgress, nextRenderExpirationTime)
      }
      let next = nextUnitOfWork
      stopWorkTimer(workInProgress)
      resetChildExpirationTime(workInProgress, nextRenderExpirationTime)
      if (__DEV__) {
        ReactCurrentFiber.resetCurrentFiber()
      }

      if (next !== null) {
        stopWorkTimer(workInProgress)
        if (__DEV__ && ReactFiberInstrumentation.debugTool) {
          ReactFiberInstrumentation.debugTool.onCompleteWork(workInProgress)
        }
        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        return next
      }

      if (
        returnFiber !== null &&
        // Do not append effects to parents if a sibling failed to complete
        (returnFiber.effectTag & Incomplete) === NoEffect
      ) {
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect
        }
        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect
          }
          returnFiber.lastEffect = workInProgress.lastEffect
        }

        const effectTag = workInProgress.effectTag
        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress
          } else {
            returnFiber.firstEffect = workInProgress
          }
          returnFiber.lastEffect = workInProgress
        }
      }

      if (__DEV__ && ReactFiberInstrumentation.debugTool) {
        ReactFiberInstrumentation.debugTool.onCompleteWork(workInProgress)
      }

      if (siblingFiber !== null) {
        // If there is more work to do in this returnFiber, do that next.
        return siblingFiber
      } else if (returnFiber !== null) {
        // If there's no more work in this returnFiber. Complete the returnFiber.
        workInProgress = returnFiber
        continue
      } else {
        // We've reached the root.
        return null
      }
    } else {
      if (workInProgress.mode & ProfileMode) {
        // Record the render duration for the fiber that errored.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false)
      }

      const next = unwindWork(workInProgress, nextRenderExpirationTime)
      // Because this fiber did not complete, don't reset its expiration time.
      if (workInProgress.effectTag & DidCapture) {
        // Restarting an error boundary
        stopFailedWorkTimer(workInProgress)
      } else {
        stopWorkTimer(workInProgress)
      }

      if (__DEV__) {
        ReactCurrentFiber.resetCurrentFiber()
      }

      if (next !== null) {
        stopWorkTimer(workInProgress)
        if (__DEV__ && ReactFiberInstrumentation.debugTool) {
          ReactFiberInstrumentation.debugTool.onCompleteWork(workInProgress)
        }

        if (enableProfilerTimer) {
          // Include the time spent working on failed children before continuing.
          if (next.mode & ProfileMode) {
            let actualDuration = next.actualDuration
            let child = next.child
            while (child !== null) {
              actualDuration += child.actualDuration
              child = child.sibling
            }
            next.actualDuration = actualDuration
          }
        }

        next.effectTag &= HostEffectMask
        return next
      }

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its effect list.
        returnFiber.firstEffect = returnFiber.lastEffect = null
        returnFiber.effectTag |= Incomplete
      }

      if (__DEV__ && ReactFiberInstrumentation.debugTool) {
        ReactFiberInstrumentation.debugTool.onCompleteWork(workInProgress)
      }

      if (siblingFiber !== null) {
        // If there is more work to do in this returnFiber, do that next.
        return siblingFiber
      } else if (returnFiber !== null) {
        // If there's no more work in this returnFiber. Complete the returnFiber.
        workInProgress = returnFiber
        continue
      } else {
        return null
      }
    }
  }

  return null
}
```
