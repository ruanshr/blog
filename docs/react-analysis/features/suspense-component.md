---
prev: /react-analysis/features/event-create-event-object
next: /react-analysis/features/suspense-lazy
---

# Suspense 组件

首先我们来看一下组件的`state`会具有哪些属性

```js
export type SuspenseState = {
  alreadyCaptured: boolean,
  didTimeout: boolean,
  timedOutAt: ExpirationTime
}
```

这三个属性分别的用处是：

-`alreadyCaptured`标志是否子树中已经挂起了
-`didTimeout`标志现在是渲染的主要子节点，还是`fallback`节点。这个主要是在非`ConcurrentMode`中用到
-`timedOutAt`在每次该组件被`commit`的时候被设置为当时的时间
  首先，第一次渲染该组件的时候，`state`肯定等于`null`，所以`nextDidTimeout`是`false`，而且`current`是`null`，走的就是这个流程：

```js
// Mount the primary children without an intermediate fragment fiber.
const nextPrimaryChildren = nextProps.children
child = next = mountChildFibers(workInProgress, null, nextPrimaryChildren, renderExpirationTime)
```

走正常渲染。而如果这时候子树`throw promise`，那么就会到`throwException`的流程，在`throwException`中做了什么呢？

对于同步的情况
给这个节点增加`Callback`副作用，没有`ShouldCapture`

所以该组件在后续`unwindWork`的时候什么都不做，这一次渲染就这么结束了，那么同学们肯定要问了，这没有渲染出`fallback`啊。是的，这个步骤要等到下一次`commit`

因为增加`Callback`所以这个组件在`commitLifecycle`的时候会被提交，具体代码如下

```js
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
```

可以看到他的`state`被第一次设置了，并且在该节点上发起了一次同步的更新，而下一次更新的时候，他的`state`就是这里的`newState`。这次更新的时候，`didTimeout`被设置为`true`，那么`nextDidTimeout`也是`true`，同时经过上一次提交，`current`已经存在。

### 对于异步的情况

增加`ShouldCapture`并且设置`expirationTime`为`renderExpirationTime`，目的是为了后面`retry`的时候，可以让该组件被更新。并且计算了`nextLatestAbsoluteTimeoutMs`来查看何时需要`commit`这个被挂起的提交。

因为有了`ShouldCapture`，所以在`unwindWork`中会更新`state`

```js
if (effectTag & ShouldCapture) {
  workInProgress.effectTag = (effectTag & ~ShouldCapture) | DidCapture
  const current = workInProgress.alternate
  const currentState: SuspenseState | null = current !== null ? current.memoizedState : null
  let nextState: SuspenseState | null = workInProgress.memoizedState
  if (nextState === null) {
    // No existing state. Create a new object.
    nextState = {
      alreadyCaptured: true,
      didTimeout: false,
      timedOutAt: NoWork
    }
  } else if (currentState === nextState) {
    // There is an existing state but it's the same as the current tree's.
    // Clone the object.
    nextState = {
      alreadyCaptured: true,
      didTimeout: nextState.didTimeout,
      timedOutAt: nextState.timedOutAt
    }
  } else {
    // Already have a clone, so it's safe to mutate.
    nextState.alreadyCaptured = true
  }
  workInProgress.memoizedState = nextState
  // Re-render the boundary.
  return workInProgress
}
```

设置了`alreadyCaptured`为`true`，来渲染`fallback`，同时继续沿用之前的`didTimeout`，如果上一次渲染已经被挂起，那么这次继续挂起，这在`updateSuspenseComponent`使用`prevDidTimeout`和`nextDidTimeout`来进行区分。主要区别在于是否要重新构建`FragmentFiber`

### completeWork

对于前后两次`didTimeout`不一样的情况，会为该节点设置`Update`副作用，在`commitLifecycles`的时候会进行设置

```js
case SuspenseComponent: {
  const nextState = workInProgress.memoizedState;
  const prevState = current !== null ? current.memoizedState : null;
  const nextDidTimeout = nextState !== null && nextState.didTimeout;
  const prevDidTimeout = prevState !== null && prevState.didTimeout;
  if (nextDidTimeout !== prevDidTimeout) {
    // If this render commits, and it switches between the normal state
    // and the timed-out state, schedule an effect.
    workInProgress.effectTag |= Update;
  }
  break;
}

```

只有在前后`didTimeout`不同的时候才会增加`Update`

```js
newDidTimeout = newState.didTimeout
if (newDidTimeout) {
  primaryChildParent = finishedWork.child
  newState.alreadyCaptured = false
  if (newState.timedOutAt === NoWork) {
    newState.timedOutAt = requestCurrentTime()
  }
}
```

经过这样之后，在下一次更新`SuspenseComponent`的时候，`nextState`就等于`null`

```js
function updateSuspenseComponent(current, workInProgress, renderExpirationTime) {
  const mode = workInProgress.mode
  const nextProps = workInProgress.pendingProps

  // We should attempt to render the primary children unless this boundary
  // already suspended during this render (`alreadyCaptured`is true).
  let nextState: SuspenseState | null = workInProgress.memoizedState
  if (nextState === null) {
    // An empty suspense state means this boundary has not yet timed out.
  } else {
    if (!nextState.alreadyCaptured) {
      // Since we haven't already suspended during this commit, clear the
      // existing suspense state. We'll try rendering again.
      nextState = null
    } else {
      // Something in this boundary's subtree already suspended. Switch to
      // rendering the fallback children. Set`alreadyCaptured`to true.
      if (current !== null && nextState === current.memoizedState) {
        // Create a new suspense state to avoid mutating the current tree's.
        nextState = {
          alreadyCaptured: true,
          didTimeout: true,
          timedOutAt: nextState.timedOutAt
        }
      } else {
        // Already have a clone, so it's safe to mutate.
        nextState.alreadyCaptured = true
        nextState.didTimeout = true
      }
    }
  }
  const nextDidTimeout = nextState !== null && nextState.didTimeout

  let child
  let next
  if (current === null) {
    if (nextDidTimeout) {
      // Mount separate fragments for primary and fallback children.
      const nextFallbackChildren = nextProps.fallback
      const primaryChildFragment = createFiberFromFragment(null, mode, NoWork, null)
      const fallbackChildFragment = createFiberFromFragment(
        nextFallbackChildren,
        mode,
        renderExpirationTime,
        null
      )
      primaryChildFragment.sibling = fallbackChildFragment
      child = primaryChildFragment
      // Skip the primary children, and continue working on the
      // fallback children.
      next = fallbackChildFragment
      child.return = next.return = workInProgress
    } else {
      // Mount the primary children without an intermediate fragment fiber.
      const nextPrimaryChildren = nextProps.children
      child = next = mountChildFibers(
        workInProgress,
        null,
        nextPrimaryChildren,
        renderExpirationTime
      )
    }
  } else {
    // This is an update. This branch is more complicated because we need to
    // ensure the state of the primary children is IncompleteClassComponent.
    const prevState = current.memoizedState
    const prevDidTimeout = prevState !== null && prevState.didTimeout
    if (prevDidTimeout) {
      // The current tree already timed out. That means each child set is
      // wrapped in a fragment fiber.
      const currentPrimaryChildFragment: Fiber = (current.child: any)
      const currentFallbackChildFragment: Fiber = (currentPrimaryChildFragment.sibling: any)
      if (nextDidTimeout) {
        // Still timed out. Reuse the current primary children by cloning
        // its fragment. We're going to skip over these entirely.
        const nextFallbackChildren = nextProps.fallback
        const primaryChildFragment = createWorkInProgress(
          currentPrimaryChildFragment,
          currentPrimaryChildFragment.pendingProps,
          NoWork
        )
        primaryChildFragment.effectTag |= Placement
        // Clone the fallback child fragment, too. These we'll continue
        // working on.
        const fallbackChildFragment = (primaryChildFragment.sibling = createWorkInProgress(
          currentFallbackChildFragment,
          nextFallbackChildren,
          currentFallbackChildFragment.expirationTime
        ))
        fallbackChildFragment.effectTag |= Placement
        child = primaryChildFragment
        primaryChildFragment.childExpirationTime = NoWork
        // Skip the primary children, and continue working on the
        // fallback children.
        next = fallbackChildFragment
        child.return = next.return = workInProgress
      } else {
        // No longer suspended. Switch back to showing the primary children,
        // and remove the intermediate fragment fiber.
        const nextPrimaryChildren = nextProps.children
        const currentPrimaryChild = currentPrimaryChildFragment.child
        const currentFallbackChild = currentFallbackChildFragment.child
        const primaryChild = reconcileChildFibers(
          workInProgress,
          currentPrimaryChild,
          nextPrimaryChildren,
          renderExpirationTime
        )
        // Delete the fallback children.
        reconcileChildFibers(workInProgress, currentFallbackChild, null, renderExpirationTime)
        // Continue rendering the children, like we normally do.
        child = next = primaryChild
      }
    } else {
      // The current tree has not already timed out. That means the primary
      // children are not wrapped in a fragment fiber.
      const currentPrimaryChild: Fiber = (current.child: any)
      if (nextDidTimeout) {
        // Timed out. Wrap the children in a fragment fiber to keep them
        // separate from the fallback children.
        const nextFallbackChildren = nextProps.fallback
        const primaryChildFragment = createFiberFromFragment(
          // It shouldn't matter what the pending props are because we aren't
          // going to render this fragment.
          null,
          mode,
          NoWork,
          null
        )
        primaryChildFragment.effectTag |= Placement
        primaryChildFragment.child = currentPrimaryChild
        currentPrimaryChild.return = primaryChildFragment
        // Create a fragment from the fallback children, too.
        const fallbackChildFragment = (primaryChildFragment.sibling = createFiberFromFragment(
          nextFallbackChildren,
          mode,
          renderExpirationTime,
          null
        ))
        fallbackChildFragment.effectTag |= Placement
        child = primaryChildFragment
        primaryChildFragment.childExpirationTime = NoWork
        // Skip the primary children, and continue working on the
        // fallback children.
        next = fallbackChildFragment
        child.return = next.return = workInProgress
      } else {
        // Still haven't timed out.  Continue rendering the children, like we
        // normally do.
        const nextPrimaryChildren = nextProps.children
        next = child = reconcileChildFibers(
          workInProgress,
          currentPrimaryChild,
          nextPrimaryChildren,
          renderExpirationTime
        )
      }
    }
  }

  workInProgress.memoizedState = nextState
  workInProgress.child = child
  return next
}
```
