# updateClassComponent

开始是对`context`的操作，因为`ClassComponent`可以成为`context provider`。

`current === null`只会出现在第一次渲染的时候，因为会先创建 workInProcess，在渲染结束之后才会把 workInProcess 拷贝成 current，代表着第一次渲染结束。而后面也会出现根据`current === null`来判断是否需要调用 componentDidMount 的代码

在这里如果`current === null`就行要进行实例的构建工作，如果不是，直接`updateClassInstance`

如果是还要判断实例是否已经创建`workInProgress.stateNode === null`，如果是的话要创建这个实例，通过`constructClassInstance`，并且挂载实例`mountClassInstance`

如果已经有`current`则调用`updateClassInstance`

最后调用`finishClassComponent`

```js
function updateClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps,
  renderExpirationTime: ExpirationTime
) {
  // Push context providers early to prevent context stack mismatches.
  // During mounting we don't know the child context yet as the instance doesn't exist.
  // We will invalidate the child context in finishClassComponent() right after rendering.
  let hasContext
  if (isLegacyContextProvider(Component)) {
    hasContext = true
    pushLegacyContextProvider(workInProgress)
  } else {
    hasContext = false
  }
  prepareToReadContext(workInProgress, renderExpirationTime)

  const instance = workInProgress.stateNode
  let shouldUpdate
  if (instance === null) {
    if (current !== null) {
      // An class component without an instance only mounts if it suspended
      // inside a non- concurrent tree, in an inconsistent state. We want to
      // tree it like a new mount, even though an empty version of it already
      // committed. Disconnect the alternate pointers.
      current.alternate = null
      workInProgress.alternate = null
      // Since this is conceptually a new fiber, schedule a Placement effect
      workInProgress.effectTag |= Placement
    }
    // In the initial pass we might need to construct the instance.
    constructClassInstance(workInProgress, Component, nextProps, renderExpirationTime)
    mountClassInstance(workInProgress, Component, nextProps, renderExpirationTime)
    shouldUpdate = true
  } else if (current === null) {
    // In a resume, we'll already have an instance we can reuse.
    shouldUpdate = resumeMountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime
    )
  } else {
    shouldUpdate = updateClassInstance(
      current,
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime
    )
  }
  return finishClassComponent(
    current,
    workInProgress,
    Component,
    shouldUpdate,
    hasContext,
    renderExpirationTime
  )
}
```

### constructClassInstance

首先根据`workInProcess.type`获取`class`，然后构建`instance`

```js
function adoptClassInstance(workInProgress, instance) {
  instance.updater = classComponentUpdater
  workInProgress.stateNode = instance
  // The instance needs access to the fiber so that it can schedule updates
  set(instance, workInProgress)
  {
    instance._reactInternalInstance = fakeInternalInstance
  }
}
```

这个方法给`ClassComponent`的实例挂载一个`updater`对象

```js
{
  enqueueForceUpdate: func,
  enqueueReplaceState: func,
  enqueueSetState: func,
  isMounted: func
}

```

很熟悉对不对，这几个方法就对应我们平时调用的`forceUpdate`,`replaceState`,`setState`

```js
function set(key, value) {
  key._reactInternalFiber = value
}
```

这里给`instance`的`_reactInternalFiber`挂载上`workInProgress`，所以我们可以通过`this._reactInternalFiber`获取该实例对应的`Fiber`对象

关于 Context 看[这里](../../features/context.md)

```js
function constructClassInstance(
  workInProgress: Fiber,
  ctor: any,
  props: any,
  renderExpirationTime: ExpirationTime
): any {
  const unmaskedContext = getUnmaskedContext(workInProgress, ctor, true)
  const contextTypes = ctor.contextTypes
  const isContextConsumer = contextTypes !== null && contextTypes !== undefined
  const context = isContextConsumer
    ? getMaskedContext(workInProgress, unmaskedContext)
    : emptyContextObject

  const instance = new ctor(props, context)
  const state = (workInProgress.memoizedState =
    instance.state !== null && instance.state !== undefined ? instance.state : null)
  adoptClassInstance(workInProgress, instance)

  // 删了一堆关于开发时提醒不安全的生命周期方法的逻辑

  if (isContextConsumer) {
    cacheContext(workInProgress, unmaskedContext, context)
  }

  return instance
}

function adoptClassInstance(workInProgress: Fiber, instance: any): void {
  instance.updater = classComponentUpdater
  workInProgress.stateNode = instance
  // The instance needs access to the fiber so that it can schedule updates
  ReactInstanceMap.set(instance, workInProgress)
}
```

### mountClassInstance

初始化`props`、`state`等实例属性，如果有`updateQueue`就更新之，一般来说第一次渲染是没有的。

`processUpdateQueue`用来计算新的`state`，详见这里

```js
var getDerivedStateFromProps = workInProgress.type.getDerivedStateFromProps
if (typeof getDerivedStateFromProps === 'function') {
  applyDerivedStateFromProps(workInProgress, getDerivedStateFromProps, props)
  instance.state = workInProgress.memoizedState
}
```

如果`class`有声明`getDerivedStateFromProps`，就调用他，调用该方法之后会根据结果更新`workInProgress.memoizedState`，所以要重新赋值给`instance.state`

接下去判断一下是否没有新的生命周期方法，如果没有并且有`componentWillMount`生命周期方法，则调用他。

最后判断是否有`componentDidMount`，如果有就修改`workInProgress.effectTag |= Update`，因为`componentDidMount`要在真正渲染进 DOM 之后才调用，也就是`commit`之后

```js
function mountClassInstance(
  workInProgress: Fiber,
  ctor: any,
  newProps: any,
  renderExpirationTime: ExpirationTime
): void {
  if (__DEV__) {
    checkClassInstance(workInProgress, ctor, newProps)
  }

  const instance = workInProgress.stateNode
  const unmaskedContext = getUnmaskedContext(workInProgress, ctor, true)

  instance.props = newProps
  instance.state = workInProgress.memoizedState
  instance.refs = emptyRefsObject
  instance.context = getMaskedContext(workInProgress, unmaskedContext)

  let updateQueue = workInProgress.updateQueue
  if (updateQueue !== null) {
    processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime)
    instance.state = workInProgress.memoizedState
  }

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps
  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps)
    instance.state = workInProgress.memoizedState
  }

  if (
    typeof ctor.getDerivedStateFromProps !== 'function' &&
    typeof instance.getSnapshotBeforeUpdate !== 'function' &&
    (typeof instance.UNSAFE_componentWillMount === 'function' ||
      typeof instance.componentWillMount === 'function')
  ) {
    callComponentWillMount(workInProgress, instance)
    // If we had additional state updates during this life-cycle, let's
    // process them now.
    updateQueue = workInProgress.updateQueue
    if (updateQueue !== null) {
      processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime)
      instance.state = workInProgress.memoizedState
    }
  }

  if (typeof instance.componentDidMount === 'function') {
    workInProgress.effectTag |= Update
  }
}
```

### applyDerivedStateFromProps

调用`getDerivedStateFromProps`获得最新的`state`并放到`fiber.memoizedState`上

```js
export function applyDerivedStateFromProps(
  workInProgress: Fiber,
  getDerivedStateFromProps: (props: any, state: any) => any,
  nextProps: any
) {
  const prevState = workInProgress.memoizedState

  const partialState = getDerivedStateFromProps(nextProps, prevState)

  // Merge the partial state and the previous state.
  const memoizedState =
    partialState === null || partialState === undefined
      ? prevState
      : Object.assign({}, prevState, partialState)
  workInProgress.memoizedState = memoizedState

  // Once the update queue is empty, persist the derived state onto the
  // base state.
  const updateQueue = workInProgress.updateQueue
  if (updateQueue !== null && updateQueue.expirationTime === NoWork) {
    updateQueue.baseState = memoizedState
  }
}
```

### finishClassComponent

首先`markRef`

```js
function markRef(current: Fiber | null, workInProgress: Fiber) {
  const ref = workInProgress.ref
  if ((current === null && ref !== null) || (current !== null && current.ref !== ref)) {
    // Schedule a Ref effect
    workInProgress.effectTag |= Ref
  }
}
```

也就是给`effectTag`加上`Ref`属性

然后如果即`shouldUpdate`不为`true`，又没有捕获到错误，那么说明这个组件已经更新完成了，直接返回`bailoutOnAlreadyFinishedWork`

之后进入`render`阶段，这个阶段主要是获取`instance.render`的结果，作为当前`Fiber`的`children`，到这里就结束了 render 阶段。

再给`effectTag`加上`PerformedWork`，接下去就进入了日常的`reconcileChildrenAtExpirationTime`阶段了

```js
function finishClassComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  shouldUpdate: boolean,
  hasContext: boolean,
  renderExpirationTime: ExpirationTime
) {
  // Refs should update even if shouldComponentUpdate returns false
  markRef(current, workInProgress)

  const didCaptureError = (workInProgress.effectTag & DidCapture) !== NoEffect

  if (!shouldUpdate && !didCaptureError) {
    // Context providers should defer to sCU for rendering
    if (hasContext) {
      invalidateContextProvider(workInProgress, false)
    }

    return bailoutOnAlreadyFinishedWork(current, workInProgress)
  }

  const ctor = workInProgress.type
  const instance = workInProgress.stateNode

  // Rerender
  ReactCurrentOwner.current = workInProgress
  let nextChildren
  if (
    didCaptureError &&
    (!enableGetDerivedStateFromCatch || typeof ctor.getDerivedStateFromCatch !== 'function')
  ) {
    nextChildren = null

    if (enableProfilerTimer) {
      stopBaseRenderTimerIfRunning()
    }
  } else {
    nextChildren = instance.render()
  }

  // React DevTools reads this flag.
  workInProgress.effectTag |= PerformedWork
  if (didCaptureError) {
    reconcileChildrenAtExpirationTime(current, workInProgress, null, renderExpirationTime)
    workInProgress.child = null
  }
  reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, renderExpirationTime)
  // Memoize props and state using the values we just used to render.
  // TODO: Restructure so we never read values from the instance.
  memoizeState(workInProgress, instance.state)
  memoizeProps(workInProgress, instance.props)

  // The context might have changed so we need to recalculate it.
  if (hasContext) {
    invalidateContextProvider(workInProgress, true)
  }

  return workInProgress.child
}
```

### updateClassInstance

这个代码就是按照流程来办事来，比较简单就不详细讲了。主要就是调用来更新相关的几个生命周期方法

`checkShouldComponentUpdate`里面会调用`shouldComponentUpdate`生命周期方法

这里看出来是否需要`update`只取决于你`shouldComponentUpdate`的返回以及是否是`PureComponent`并且`props`和`state`没有变化

```js
function checkShouldComponentUpdate(
  workInProgress,
  ctor,
  oldProps,
  newProps,
  oldState,
  newState,
  nextLegacyContext
) {
  const instance = workInProgress.stateNode
  if (typeof instance.shouldComponentUpdate === 'function') {
    startPhaseTimer(workInProgress, 'shouldComponentUpdate')
    const shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextLegacyContext)
    stopPhaseTimer()

    if (__DEV__) {
      warningWithoutStack(
        shouldUpdate !== undefined,
        '%s.shouldComponentUpdate(): Returned undefined instead of a ' +
          'boolean value. Make sure to return true or false.',
        getComponentName(ctor) || 'Component'
      )
    }

    return shouldUpdate
  }

  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
  }

  return true
}
function updateClassInstance(
  current: Fiber,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime
): boolean {
  const ctor = workInProgress.type
  const instance = workInProgress.stateNode

  const oldProps = workInProgress.memoizedProps
  const newProps = workInProgress.pendingProps
  instance.props = oldProps

  const oldContext = instance.context
  const newUnmaskedContext = getUnmaskedContext(workInProgress)
  const newContext = getMaskedContext(workInProgress, newUnmaskedContext)

  const getDerivedStateFromProps = ctor.getDerivedStateFromProps
  const hasNewLifecycles =
    typeof getDerivedStateFromProps === 'function' ||
    typeof instance.getSnapshotBeforeUpdate === 'function'

  if (
    !hasNewLifecycles &&
    (typeof instance.UNSAFE_componentWillReceiveProps === 'function' ||
      typeof instance.componentWillReceiveProps === 'function')
  ) {
    if (oldProps !== newProps || oldContext !== newContext) {
      callComponentWillReceiveProps(workInProgress, instance, newProps, newContext)
    }
  }

  resetHasForceUpdateBeforeProcessing()

  const oldState = workInProgress.memoizedState
  let newState = (instance.state = oldState)
  let updateQueue = workInProgress.updateQueue
  if (updateQueue !== null) {
    processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime)
    newState = workInProgress.memoizedState
  }

  if (
    oldProps === newProps &&
    oldState === newState &&
    !hasContextChanged() &&
    !checkHasForceUpdateAfterProcessing()
  ) {
    if (typeof instance.componentDidUpdate === 'function') {
      if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.effectTag |= Update
      }
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.effectTag |= Snapshot
      }
    }
    return false
  }

  if (typeof getDerivedStateFromProps === 'function') {
    applyDerivedStateFromProps(workInProgress, getDerivedStateFromProps, newProps)
    newState = workInProgress.memoizedState
  }

  const shouldUpdate =
    checkHasForceUpdateAfterProcessing() ||
    checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState, newContext)

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (
      !hasNewLifecycles &&
      (typeof instance.UNSAFE_componentWillUpdate === 'function' ||
        typeof instance.componentWillUpdate === 'function')
    ) {
      startPhaseTimer(workInProgress, 'componentWillUpdate')
      if (typeof instance.componentWillUpdate === 'function') {
        instance.componentWillUpdate(newProps, newState, newContext)
      }
      if (typeof instance.UNSAFE_componentWillUpdate === 'function') {
        instance.UNSAFE_componentWillUpdate(newProps, newState, newContext)
      }
      stopPhaseTimer()
    }
    if (typeof instance.componentDidUpdate === 'function') {
      workInProgress.effectTag |= Update
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      workInProgress.effectTag |= Snapshot
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === 'function') {
      if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.effectTag |= Update
      }
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
      if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
        workInProgress.effectTag |= Snapshot
      }
    }

    // If shouldComponentUpdate returned false, we should still update the
    // memoized props/state to indicate that this work can be reused.
    workInProgress.memoizedProps = newProps
    workInProgress.memoizedState = newState
  }

  // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.
  instance.props = newProps
  instance.state = newState
  instance.context = newContext

  return shouldUpdate
}
```
