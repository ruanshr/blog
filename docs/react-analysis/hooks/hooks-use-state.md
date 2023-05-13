---
prev: /react-analysis/hooks/hooks-start
next: /react-analysis/hooks/hooks-other
---

# useState

当我们的代码执行到了`useState`的时候，他到底做了什么呢？

```js
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === 'function' ? action(state) : action
}

export function useState<S>(initialState: (() => S) | S): [S, Dispatch<BasicStateAction<S>>] {
  return useReducer(
    basicStateReducer,
    // useReducer has a special case to support lazy useState initializers
    (initialState: any)
  )
}
```

可见`useState`不过就是个语法糖，本质其实就是`useReducer`，那么`useReducer`具体做了什么呢？

### useReducer

最开始的两句代码是每个`Hooks`都会做的统一代码：

```js
currentlyRenderingFiber = resolveCurrentlyRenderingFiber()
workInProgressHook = createWorkInProgressHook()
currentlyRenderingFiber
createWorkInProgressHook
```

这里分两种情况：第一次渲染和更新，如果`workInProgressHook.queue`存在则为更新，否则是第一次渲染

### 第一次渲染

第一次渲染主要就是初始化操作

```js
// There's no existing queue, so this is the initial render.
if (reducer === basicStateReducer) {
  // Special case for`useState`.
  if (typeof initialState === 'function') {
    initialState = initialState()
  }
} else if (initialAction !== undefined && initialAction !== null) {
  initialState = reducer(initialState, initialAction)
}
workInProgressHook.memoizedState = workInProgressHook.baseState = initialState
```

这里初始化`initialState`，并且记录在`workInProgressHook.memoizedState`和`workInProgressHook.baseState`上

然后创建`queue`对象

```js
queue = workInProgressHook.queue = {
  last: null,
  dispatch: null
}
```

这一看到`queue`的结构非常简单，只有一个`last`指针和`dispatch`，`dispatch`是用来记录更新`state`的方法的，接下去我们就要创建`dispatch`方法了

```js
const dispatch: Dispatch<A> = (queue.dispatch = (dispatchAction.bind(
  null,
  currentlyRenderingFiber,
  queue
): any))
```

可以看到这个`dispatch`就是`dispatchAction`绑定了对应的`Fiber`和`queue`。最后`return`：

`return [workInProgressHook.memoizedState, dispatch];`
对应了我们`const [state, updateState] = useState('default')`的用法

更新
分两种情况，是否是`reRender`，所谓`reRender`就是说在当前更新周期中又产生了新的更新，就继续执行这些更新知道当前渲染周期中没有更新为止

他们基本的操作是一致的，就是根据`reducer`和`update.action`来创建新的`state`，并赋值给`Hook.memoizedState`以及`Hook.baseState`。

注意这里，对于非`reRender`得情况，我们会对每个更新判断其优先级，如果不是当前整体更新优先级内得更新会跳过，第一个跳过得`Update`会变成新的`baseUpdate`，他记录了在之后所有得`Update`，即便是优先级比他高得，因为在他被执行得时候，需要保证后续的更新要在他更新之后的基础上再次执行，因为结果可能会不一样。

```js
export function useReducer<S, A>(
  reducer: (S, A) => S,
  initialState: S,
  initialAction: A | void | null
): [S, Dispatch<A>] {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber()
  workInProgressHook = createWorkInProgressHook()
  let queue: UpdateQueue<A> | null = (workInProgressHook.queue: any)
  if (queue !== null) {
    // Already have a queue, so this is an update.
    if (isReRender) {
      // This is a re-render. Apply the new render phase updates to the previous
      // work-in-progress hook.
      const dispatch: Dispatch<A> = (queue.dispatch: any)
      if (renderPhaseUpdates !== null) {
        // Render phase updates are stored in a map of queue -> linked list
        const firstRenderPhaseUpdate = renderPhaseUpdates.get(queue)
        if (firstRenderPhaseUpdate !== undefined) {
          renderPhaseUpdates.delete(queue)
          let newState = workInProgressHook.memoizedState
          let update = firstRenderPhaseUpdate
          do {
            // Process this render phase update. We don't have to check the
            // priority because it will always be the same as the current
            // render's.
            const action = update.action
            newState = reducer(newState, action)
            update = update.next
          } while (update !== null)

          workInProgressHook.memoizedState = newState

          // Don't persist the state accumlated from the render phase updates to
          // the base state unless the queue is empty.
          // TODO: Not sure if this is the desired semantics, but it's what we
          // do for gDSFP. I can't remember why.
          if (workInProgressHook.baseUpdate === queue.last) {
            workInProgressHook.baseState = newState
          }

          return [newState, dispatch]
        }
      }
      return [workInProgressHook.memoizedState, dispatch]
    }

    // The last update in the entire queue
    const last = queue.last
    // The last update that is part of the base state.
    const baseUpdate = workInProgressHook.baseUpdate

    // Find the first unprocessed update.
    let first
    if (baseUpdate !== null) {
      if (last !== null) {
        // For the first update, the queue is a circular linked list where
        //`queue.last.next = queue.first`. Once the first update commits, and
        // the`baseUpdate`is no longer empty, we can unravel the list.
        last.next = null
      }
      first = baseUpdate.next
    } else {
      first = last !== null ? last.next : null
    }
    if (first !== null) {
      let newState = workInProgressHook.baseState
      let newBaseState = null
      let newBaseUpdate = null
      let prevUpdate = baseUpdate
      let update = first
      let didSkip = false
      do {
        const updateExpirationTime = update.expirationTime
        if (updateExpirationTime < renderExpirationTime) {
          // Priority is insufficient. Skip this update. If this is the first
          // skipped update, the previous update/state is the new base
          // update/state.
          if (!didSkip) {
            didSkip = true
            newBaseUpdate = prevUpdate
            newBaseState = newState
          }
          // Update the remaining priority in the queue.
          if (updateExpirationTime > remainingExpirationTime) {
            remainingExpirationTime = updateExpirationTime
          }
        } else {
          // Process this update.
          const action = update.action
          newState = reducer(newState, action)
        }
        prevUpdate = update
        update = update.next
      } while (update !== null && update !== first)

      if (!didSkip) {
        newBaseUpdate = prevUpdate
        newBaseState = newState
      }

      workInProgressHook.memoizedState = newState
      workInProgressHook.baseUpdate = newBaseUpdate
      workInProgressHook.baseState = newBaseState
    }

    const dispatch: Dispatch<A> = (queue.dispatch: any)
    return [workInProgressHook.memoizedState, dispatch]
  }

  // There's no existing queue, so this is the initial render.
  if (reducer === basicStateReducer) {
    // Special case for`useState`.
    if (typeof initialState === 'function') {
      initialState = initialState()
    }
  } else if (initialAction !== undefined && initialAction !== null) {
    initialState = reducer(initialState, initialAction)
  }
  workInProgressHook.memoizedState = workInProgressHook.baseState = initialState
  queue = workInProgressHook.queue = {
    last: null,
    dispatch: null
  }
  const dispatch: Dispatch<A> = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber,
    queue
  ): any))
  return [workInProgressHook.memoizedState, dispatch]
}
```

### dispatchAction

首先看这个判断：

```js
if (
fiber === currentlyRenderingFiber ||
(alternate !== null && alternate === currentlyRenderingFiber)
)
```

这其实就是判断这个更新是否是在渲染过程中产生的，`currentlyRenderingFiber`只有在`FunctionalComponent`更新的过程中才会被设置，在离开更新的时候设置为`null`，所以只要存在并更产生更新的`Fiber`相等，说明这个更新是在当前渲染中产生的，则这是一次`reRender`。

所有更新过程中产生的更新记录在`renderPhaseUpdates`这个`Map`上，以每个`Hook`的`queue`为`key`。

对于不是更新过程中产生的更新，则直接在`queue`上执行操作就行了，注意在最后会发起一次`scheduleWork`的调度。

```js
function dispatchAction<A>(fiber: Fiber, queue: UpdateQueue<A>, action: A) {
  invariant(
    numberOfReRenders < RE_RENDER_LIMIT,
    'Too many re-renders. React limits the number of renders to prevent ' + 'an infinite loop.'
  )

  const alternate = fiber.alternate
  if (
    fiber === currentlyRenderingFiber ||
    (alternate !== null && alternate === currentlyRenderingFiber)
  ) {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdate = true
    const update: Update<A> = {
      expirationTime: renderExpirationTime,
      action,
      next: null
    }
    if (renderPhaseUpdates === null) {
      renderPhaseUpdates = new Map()
    }
    const firstRenderPhaseUpdate = renderPhaseUpdates.get(queue)
    if (firstRenderPhaseUpdate === undefined) {
      renderPhaseUpdates.set(queue, update)
    } else {
      // Append the update to the end of the list.
      let lastRenderPhaseUpdate = firstRenderPhaseUpdate
      while (lastRenderPhaseUpdate.next !== null) {
        lastRenderPhaseUpdate = lastRenderPhaseUpdate.next
      }
      lastRenderPhaseUpdate.next = update
    }
  } else {
    const currentTime = requestCurrentTime()
    const expirationTime = computeExpirationForFiber(currentTime, fiber)
    const update: Update<A> = {
      expirationTime,
      action,
      next: null
    }
    flushPassiveEffects()
    // Append the update to the end of the list.
    const last = queue.last
    if (last === null) {
      // This is the first update. Create a circular list.
      update.next = update
    } else {
      const first = last.next
      if (first !== null) {
        // Still circular.
        update.next = first
      }
      last.next = update
    }
    queue.last = update
    scheduleWork(fiber, expirationTime)
  }
}
```
