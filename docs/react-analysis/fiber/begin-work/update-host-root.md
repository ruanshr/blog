# updateHostRoot

在`scheduleRootUpdate`的时候会为`root`创建`update`，包括的最主要信息是`payload`中的`element`

```js
function scheduleRootUpdate(current, element, expirationTime, callback) {
  {
    if (
      ReactDebugCurrentFiber.phase === 'render' &&
      ReactDebugCurrentFiber.current !== null &&
      !didWarnAboutNestedUpdates
    ) {
      didWarnAboutNestedUpdates = true
      warning(
        false,
        'Render methods should be a pure function of props and state; ' +
          'triggering nested component updates from render is not allowed. ' +
          'If necessary, trigger nested updates in componentDidUpdate.\n\n' +
          'Check the render method of %s.',
        getComponentName(ReactDebugCurrentFiber.current) || 'Unknown'
      )
    }
  }

  var update = createUpdate(expirationTime)
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = { element: element }

  callback = callback === undefined ? null : callback
  if (callback !== null) {
    !(typeof callback === 'function')
      ? warning(
          false,
          'render(...): Expected the last optional`callback`argument to be a ' +
            'function. Instead received: %s.',
          callback
        )
      : void 0
    update.callback = callback
  }
  enqueueUpdate(current, update, expirationTime)

  scheduleWork$1(current, expirationTime)
  return expirationTime
}
```

`ensureWorkInProgressQueueIsAClone`是确保一下`workInProgress`是`current`的一个拷贝，确保不在`current`上直接操作

```js
function resetHydrationState() {
  if (!supportsHydration) {
    return
  }

  hydrationParentFiber = null
  nextHydratableInstance = null
  isHydrating = false
}
```

初始化一些全局变量，应该是后面进行`hydrate`要用到

最后`return`的是`child`，如果没有`child`就完成工作了，如果有说明还没完成

```js
function updateHostRoot(current, workInProgress, renderExpirationTime) {
  pushHostRootContext(workInProgress)
  let updateQueue = workInProgress.updateQueue
  if (updateQueue !== null) {
    const nextProps = workInProgress.pendingProps
    const prevState = workInProgress.memoizedState
    const prevChildren = prevState !== null ? prevState.element : null
    processUpdateQueue(workInProgress, updateQueue, nextProps, null, renderExpirationTime)
    const nextState = workInProgress.memoizedState
    // Caution: React DevTools currently depends on this property
    // being called "element".
    const nextChildren = nextState.element

    if (nextChildren === prevChildren) {
      // If the state is the same as before, that's a bailout because we had
      // no work that expires at this time.
      resetHydrationState()
      return bailoutOnAlreadyFinishedWork(current, workInProgress)
    }
    const root: FiberRoot = workInProgress.stateNode
    if (
      (current === null || current.child === null) &&
      root.hydrate &&
      enterHydrationState(workInProgress)
    ) {
      workInProgress.effectTag |= Placement

      workInProgress.child = mountChildFibers(
        workInProgress,
        null,
        nextChildren,
        renderExpirationTime
      )
    } else {
      // Otherwise reset hydration state in case we aborted and resumed another
      // root.
      resetHydrationState()
      reconcileChildren(current, workInProgress, nextChildren)
    }
    return workInProgress.child
  }
  resetHydrationState()
  // If there is no update queue, that's a bailout because the root has no props.
  return bailoutOnAlreadyFinishedWork(current, workInProgress)
}
```

`pushHostRootContext`目前意义不明，先放着后面看看有没有用到的地方

```js
pushHostRootContext(workInProgress)

function pushHostRootContext(workInProgress) {
  var root = workInProgress.stateNode
  if (root.pendingContext) {
    pushTopLevelContextObject(
      workInProgress,
      root.pendingContext,
      root.pendingContext !== root.context
    )
  } else if (root.context) {
    // Should always be set
    pushTopLevelContextObject(workInProgress, root.context, false)
  }
  pushHostContainer(workInProgress, root.containerInfo)
}

function pushTopLevelContextObject(fiber, context, didChange) {
  !(contextStackCursor.current === emptyObject)
    ? invariant(
        false,
        'Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.'
      )
    : void 0

  push(contextStackCursor, context, fiber)
  push(didPerformWorkStackCursor, didChange, fiber)
}

function push(cursor, value, fiber) {
  index++

  valueStack[index] = cursor.current

  {
    fiberStack[index] = fiber
  }

  cursor.current = value
}

function pushHostContainer(fiber, nextRootInstance) {
  // Push current root instance onto the stack;
  // This allows us to reset root when portals are popped.
  push(rootInstanceStackCursor, nextRootInstance, fiber)
  // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.
  push(contextFiberStackCursor, fiber, fiber)

  // Finally, we need to push the host context to the stack.
  // However, we can't just call getRootHostContext() and push it because
  // we'd have a different number of entries on the stack depending on
  // whether getRootHostContext() throws somewhere in renderer code or not.
  // So we push an empty value first. This lets us safely unwind on errors.
  push(contextStackCursor$1, NO_CONTEXT, fiber)
  var nextRootContext = getRootHostContext(nextRootInstance)
  // Now that we know this function doesn't throw, replace it.
  pop(contextStackCursor$1, fiber)
  push(contextStackCursor$1, nextRootContext, fiber)
}
```

### processUpdateQueue

`getStateFromUpdate`从`update`对象上获取最新的`state`

如果有`callback`则设置`workInProgress.effectTag |= Callback`，`Callback`是个常数，等于`32`，跟目前的`effectTag`进行或运算得到新的结果。然后设置`queue`的`effect`链

猜想：如果没有`callback`代表没有`effect`

之后循环`capturedUpdate`

这个方法的主要作用是处理`updateQueue`里面的`update`，执行并获得最新的`state`，最后获取`effect`放置到`Fiber`对象上

```js
var _callback = update.callback
if (_callback !== null) {
  workInProgress.effectTag |= Callback
  // Set this to null, in case it was mutated during an aborted render.
  update.nextEffect = null
  if (queue.lastEffect === null) {
    queue.firstEffect = queue.lastEffect = update
  } else {
    queue.lastEffect.nextEffect = update
    queue.lastEffect = update
  }
}

// Separately, iterate though the list of captured updates.
var newFirstCapturedUpdate = null
update = queue.firstCapturedUpdate
while (update !== null) {
  var _updateExpirationTime = update.expirationTime
  if (_updateExpirationTime > renderExpirationTime) {
    // This update does not have sufficient priority. Skip it.
    if (newFirstCapturedUpdate === null) {
      // This is the first skipped captured update. It will be the first
      // update in the new list.
      newFirstCapturedUpdate = update
      // If this is the first update that was skipped, the current result is
      // the new base state.
      if (newFirstUpdate === null) {
        newBaseState = resultState
      }
    }
    // Since this update will remain in the list, update the remaining
    // expiration time.
    if (newExpirationTime === NoWork || newExpirationTime > _updateExpirationTime) {
      newExpirationTime = _updateExpirationTime
    }
  } else {
    // This update does have sufficient priority. Process it and compute
    // a new result.
    resultState = getStateFromUpdate(workInProgress, queue, update, resultState, props, instance)
    var _callback2 = update.callback
    if (_callback2 !== null) {
      workInProgress.effectTag |= Callback
      // Set this to null, in case it was mutated during an aborted render.
      update.nextEffect = null
      if (queue.lastCapturedEffect === null) {
        queue.firstCapturedEffect = queue.lastCapturedEffect = update
      } else {
        queue.lastCapturedEffect.nextEffect = update
        queue.lastCapturedEffect = update
      }
    }
  }
  update = update.next
}
```
