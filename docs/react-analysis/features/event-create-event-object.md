---
prev: /react-analysis/features/event-dispatch
next: /react-analysis/features/suspense-component
---

# 事件对象生成

### 创建 event 对象

在触发事件的过程中，我们会调用每个插件的`extractEvents`方法来创建对应的事件，这里我们就看看事件创建的过程。这里我们拿最常用的事件之一`onChange`来举例，主要看的是`ChangeEventPlugin.js`

根据不同的情况设置`getTargetInstFunc`

```js
function shouldUseChangeEvent(elem) {
  const nodeName = elem.nodeName && elem.nodeName.toLowerCase()
  return nodeName === 'select' || (nodeName === 'input' && elem.type === 'file')
}
isTextInputElement判断input标签的type是否合理，如果是textarea则直接返回true

function shouldUseClickEvent(elem) {
  const nodeName = elem.nodeName
  return (
    nodeName &&
    nodeName.toLowerCase() === 'input' &&
    (elem.type === 'checkbox' || elem.type === 'radio')
  )
}

```

对于`checkbox`和`radio`使用`click`监听

这些方法的区别就是判断本次事件的具体类型不同，最终调用的都是`getInstIfValueChanged`

```js
function getInstIfValueChanged(targetInst) {
  const targetNode = getNodeFromInstance(targetInst)
  if (inputValueTracking.updateValueIfChanged(targetNode)) {
    return targetInst
  }
}
```

使用`track`判断`input`的值有没有变化，如果有变化则则返回，没有不返回，也就不需要生成事件

```js
extractEvents = function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  const targetNode = targetInst ? getNodeFromInstance(targetInst) : window

  let getTargetInstFunc, handleEventFunc
  if (shouldUseChangeEvent(targetNode)) {
    getTargetInstFunc = getTargetInstForChangeEvent
  } else if (isTextInputElement(targetNode)) {
    if (isInputEventSupported) {
      getTargetInstFunc = getTargetInstForInputOrChangeEvent
    } else {
      getTargetInstFunc = getTargetInstForInputEventPolyfill
      handleEventFunc = handleEventsForInputEventPolyfill
    }
  } else if (shouldUseClickEvent(targetNode)) {
    getTargetInstFunc = getTargetInstForClickEvent
  }

  if (getTargetInstFunc) {
    const inst = getTargetInstFunc(topLevelType, targetInst)
    if (inst) {
      const event = createAndAccumulateChangeEvent(inst, nativeEvent, nativeEventTarget)
      return event
    }
  }

  if (handleEventFunc) {
    handleEventFunc(topLevelType, targetNode, targetInst)
  }

  // When blurring, set the value attribute for number inputs
  if (topLevelType === TOP_BLUR) {
    handleControlledInputBlur(targetNode)
  }
}

function getTargetInstForChangeEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_CHANGE) {
    return targetInst
  }
}

function getTargetInstForInputOrChangeEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_INPUT || topLevelType === TOP_CHANGE) {
    return getInstIfValueChanged(targetInst)
  }
}

function getTargetInstForClickEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_CLICK) {
    return getInstIfValueChanged(targetInst)
  }
}
```

###`createAndAccumulateChangeEvent`

从这里开始构建事件，首先`React`的事件有一个`pool`，可以复用事件对象，不需要每次都重新创建，然后调用`accumulateTwoPhaseDispatches`开始为事件对象挂载两个阶段的监听者：

- 捕获阶段
- 冒泡阶段

`forEachAccumulated`跟调用事件的时候一样，其实就是为每个事件调用`accumulateTwoPhaseDispatchesSingle`

`traverseTwoPhase`向上遍历树找到所有`HostComponent`，并对每一个节点调用`accumulateDirectionalDispatches`，`listenerAtPhase`代码如下：

```js
function listenerAtPhase(inst, event, propagationPhase: PropagationPhases) {
  const registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase]
  return getListener(inst, registrationName)
}

export function getListener(inst: Fiber, registrationName: string) {
  let listener

  const stateNode = inst.stateNode
  if (!stateNode) {
    return null
  }
  const props = getFiberCurrentPropsFromNode(stateNode)
  if (!props) {
    return null
  }
  listener = props[registrationName]
  if (shouldPreventMouseEvent(registrationName, inst.type, props)) {
    return null
  }
  // warn
  return listener
}
```

通过对`HostComponent`的`Fiber`对象上获取`props`，并判断时候有事件监听的`props`，比如`onChange`，`onChangeCapture`，如果有就返回处理函数。在`accumulateDirectionalDispatches`就会赋值在

在这里并没有区分不同阶段的事件，但是在放到`_dispatchListeners`里面的过程中，会直接安排好顺序，注意`traverseTwoPhase`中的两个遍历的顺序，第一个是反向的，也就是从最顶点的节点开始。通过这样来保证事件触发是按照顺序来的。

```js
function createAndAccumulateChangeEvent(inst, nativeEvent, target) {
  const event = SyntheticEvent.getPooled(eventTypes.change, inst, nativeEvent, target)
  event.type = 'change'

  // controlled input fallback
  enqueueStateRestore(target)
  accumulateTwoPhaseDispatches(event)
  return event
}

export function accumulateTwoPhaseDispatches(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle)
}

function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event)
  }
}

export function traverseTwoPhase(inst, fn, arg) {
  const path = []
  while (inst) {
    path.push(inst)
    inst = getParent(inst)
  }
  let i
  for (i = path.length; i-- > 0; ) {
    fn(path[i], 'captured', arg)
  }
  for (i = 0; i < path.length; i++) {
    fn(path[i], 'bubbled', arg)
  }
}

function accumulateDirectionalDispatches(inst, phase, event) {
  const listener = listenerAtPhase(inst, event, phase)
  if (listener) {
    event._dispatchListeners = accumulateInto(event._dispatchListeners, listener)
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst)
  }
}
```
