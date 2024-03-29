---
prev: /react-analysis/features/event-injection
next: /react-analysis/features/event-create-event-object
---

# 事件触发

之前我们已经讲了事件是绑定在`container`上的，那么具体事件触发的时候是如何派发到具体的监听者上的呢？这里我们就往下看，假设我们绑定的是`dispatchInteractiveEvent`方法，那么我们来看看他的实现过程：

```js
function dispatchInteractiveEvent(topLevelType, nativeEvent) {
  interactiveUpdates(dispatchEvent, topLevelType, nativeEvent)
}

// 来自'events/ReactGenericBatching'
export function interactiveUpdates(fn, a, b) {
  return _interactiveUpdatesImpl(fn, a, b)
}
let _interactiveUpdatesImpl = function (fn, a, b) {
  return fn(a, b)
}
```

这里简单来说就是调用了`dispatchEvent(topLevelType, nativeEvent)`，`topLevelType`就是`onClick`这类得`React`中得`props`名字，`nativeEvent`就是`DOM`事件对象。那么我们来看`dispatchEvent`

```js
export function dispatchEvent(topLevelType: DOMTopLevelEventType, nativeEvent: AnyNativeEvent) {
  const nativeEventTarget = getEventTarget(nativeEvent)
  // 找到点击事件触发的原始节点最近的Fiber对象
  // 根据设置在DOM节点上的`internalInstanceKey`来寻找
  let targetInst = getClosestInstanceFromNode(nativeEventTarget)
  if (targetInst !== null && typeof targetInst.tag === 'number' && !isFiberMounted(targetInst)) {
    targetInst = null
  }

  // pool
  const bookKeeping = getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst)

  try {
    batchedUpdates(handleTopLevel, bookKeeping)
  } finally {
    releaseTopLevelCallbackBookKeeping(bookKeeping)
  }
}

function getEventTarget(nativeEvent) {
  let target = nativeEvent.target || nativeEvent.srcElement || window

  if (target.correspondingUseElement) {
    target = target.correspondingUseElement
  }
  return target.nodeType === TEXT_NODE ? target.parentNode : target
}
```

这里主要创建了`bookKeeping`对象，包含了事件名称，原始事件对象，以及最近的`Fiber`对象，然后调用`batchedUpdates`，我们来看看这个方法：

```js
// 来自'events/ReactGenericBatching'
export function batchedUpdates(fn, bookkeeping) {
  if (isBatching) {
    return fn(bookkeeping)
  }
  isBatching = true
  try {
    return _batchedUpdatesImpl(fn, bookkeeping)
  } finally {
    isBatching = false
    const controlledComponentsHavePendingUpdates = needsStateRestore()
    if (controlledComponentsHavePendingUpdates) {
      _flushInteractiveUpdatesImpl()
      restoreStateIfNeeded()
    }
  }
}

let _batchedUpdatesImpl = function (fn, bookkeeping) {
  return fn(bookkeeping)
}
```

其实就是设置了一下`isBatching`这个公共变量，然后调用`handleTopLevel`，接着看

```js
function handleTopLevel(bookKeeping) {
  let targetInst = bookKeeping.targetInst

  let ancestor = targetInst
  do {
    if (!ancestor) {
      bookKeeping.ancestors.push(ancestor)
      break
    }
    const root = findRootContainerNode(ancestor)
    if (!root) {
      break
    }
    bookKeeping.ancestors.push(ancestor)
    ancestor = getClosestInstanceFromNode(root)
  } while (ancestor)

  for (let i = 0; i < bookKeeping.ancestors.length; i++) {
    targetInst = bookKeeping.ancestors[i]
    runExtractedEventsInBatch(
      bookKeeping.topLevelType,
      targetInst,
      bookKeeping.nativeEvent,
      getEventTarget(bookKeeping.nativeEvent)
    )
  }
}

function findRootContainerNode(inst) {
  while (inst.return) {
    inst = inst.return
  }
  if (inst.tag !== HostRoot) {
    return null
  }
  return inst.stateNode.containerInfo
}
```

这里简单来说如果目标节点在`portal`内，那么需要包括`portal`外部的节点，对于每个`ancestor`，调用`runExtractedEventsInBatch`

```js
export function runExtractedEventsInBatch(
  topLevelType: TopLevelType,
  targetInst: null | Fiber,
  nativeEvent: AnyNativeEvent,
  nativeEventTarget: EventTarget
) {
  const events = extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget)
  runEventsInBatch(events, false)
}

function extractEvents(
  topLevelType: TopLevelType,
  targetInst: null | Fiber,
  nativeEvent: AnyNativeEvent,
  nativeEventTarget: EventTarget
): Array<ReactSyntheticEvent> | ReactSyntheticEvent | null {
  let events = null
  for (let i = 0; i < plugins.length; i++) {
    // Not every plugin in the ordering may be loaded at runtime.
    const possiblePlugin: PluginModule<AnyNativeEvent> = plugins[i]
    if (possiblePlugin) {
      const extractedEvents = possiblePlugin.extractEvents(
        topLevelType,
        targetInst,
        nativeEvent,
        nativeEventTarget
      )
      if (extractedEvents) {
        events = accumulateInto(events, extractedEvents)
      }
    }
  }
  return events
}
```

这里开始生成事件，调用每个`plugin`的`extractEvents`方法来生产事件，并调用`accumulateInto`来合并事件

```js
function accumulateInto<T>(current: ?(Array<T> | T), next: T | Array<T>): T | Array<T> {
  if (current == null) {
    return next
  }

  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next)
      return current
    }
    current.push(next)
    return current
  }

  if (Array.isArray(next)) {
    return [current].concat(next)
  }

  return [current, next]
}
```

这个方法主要是判断当前的`events`和`next`对应的刚产生的`event`，因为他们都可能是单个事件或者是数组，最终目的是要达成数组合并，最终返回一个数组，事件生产好之后，调用`runEventsInBatch`，接下去看

```js
export function runEventsInBatch(
  events: Array<ReactSyntheticEvent> | ReactSyntheticEvent | null,
  simulated: boolean,
) {
  if (events !== null) {
    eventQueue = accumulateInto(eventQueue, events)
  }

  const processingEventQueue = eventQueue
  eventQueue = null

  if (!processingEventQueue) {
    return
  }

  if (simulated) {
    forEachAccumulated(
      processingEventQueue,
      executeDispatchesAndReleaseSimulated,
    )
  } else {
    forEachAccumulated(
      processingEventQueue,
      executeDispatchesAndReleaseTopLevel,
    )
  }
  rethrowCaughtError()
}
simulated传入的是false，所以调用的是executeDispatchesAndReleaseTopLevel

function forEachAccumulated<T>(
  arr: ?(Array<T> | T),
  cb: (elem: T) => void,
  scope: ?any,
) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope)
  } else if (arr) {
    cb.call(scope, arr)
  }
}

const executeDispatchesAndReleaseTopLevel = function(e) {
  return executeDispatchesAndRelease(e, false)
}

const executeDispatchesAndRelease = function(
  event: ReactSyntheticEvent,
  simulated: boolean,
) {
  if (event) {
    executeDispatchesInOrder(event, simulated)

    if (!event.isPersistent()) {
      event.constructor.release(event)
    }
  }
}

export function executeDispatchesInOrder(event, simulated) {
  const dispatchListeners = event._dispatchListeners
  const dispatchInstances = event._dispatchInstances
  if (Array.isArray(dispatchListeners)) {
    for (let i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break
      }
      // Listeners and Instances are two parallel arrays that are always in sync.
      executeDispatch(
        event,
        simulated,
        dispatchListeners[i],
        dispatchInstances[i],
      )
    }
  } else if (dispatchListeners) {
    executeDispatch(event, simulated, dispatchListeners, dispatchInstances)
  }
  event._dispatchListeners = null
  event._dispatchInstances = null
}

function executeDispatch(event, simulated, listener, inst) {
  const type = event.type || 'unknown-event'
  event.currentTarget = getNodeFromInstance(inst)
  invokeGuardedCallbackAndCatchFirstError(type, listener, undefined, event)
  event.currentTarget = null
}

```

`_dispatchListeners`和`_dispatchInstances`是在生成事件对象的时候赋值的，在`executeDispatchesInOrder`中我们就按照顺序执行了所有监听的事件了。
