---
prev: /react-analysis/features/event-injection
next: /react-analysis/features/event-dispatch
---

# 事件绑定

事件绑定主要是在初始化`DOM`的事件，当然在`DOM`更新过程中也会出现，不过较少，所以我们就从初始化`DOM`的时候入手来讲。在初始化的时候我们会调用一个方法叫做`setInitialProperties`，这里一开始就对一些类型的节点执行了一些事件绑定：

```js
switch (tag) {
  case 'iframe':
  case 'object':
    trapBubbledEvent(TOP_LOAD, domElement);
    props = rawProps;
    break;
  case 'video':
  case 'audio':
    // Create listener for each media event
    for (let i = 0; i < mediaEventTypes.length; i++) {
      trapBubbledEvent(mediaEventTypes[i], domElement);
    }
    props = rawProps;
    break;
// ... others
```

这里调用的方法是`trapBubbledEvent`

而后面调用了方法`setInitialDOMProperties`来真正得初始化`DOM`属性

```js
} else if (registrationNameModules.hasOwnProperty(propKey)) {
  if (nextProp != null) {
    if (__DEV__ && typeof nextProp !== 'function') {
      warnForInvalidEventListener(propKey, nextProp);
    }
    ensureListeningTo(rootContainerElement, propKey);
  }
}
```

这里判断了某个`propKey`是否在`registrationNameModules`中，而`registrationNameModules`是我们在初始化事件系统中注册的事件名对应的模块的对象，这就联系起来了。

这里调用了 ensureListeningTo，我们来看一下代码：

```js
function ensureListeningTo(rootContainerElement, registrationName) {
  const isDocumentOrFragment =
    rootContainerElement.nodeType === DOCUMENT_NODE ||
    rootContainerElement.nodeType === DOCUMENT_FRAGMENT_NODE
  const doc = isDocumentOrFragment ? rootContainerElement : rootContainerElement.ownerDocument
  listenTo(registrationName, doc)
}
```

`rootContainerElement`是`React`应用的挂载点，或者是`HostPortal`的`container`，所以这些事件其实都是通过事件代理来实现的。我们继续看`listenTo`的代码，他来自`ReactBrowserEventEmitter.js`

```js
export function listenTo(registrationName: string, mountAt: Document | Element) {
  const isListening = getListeningForDocument(mountAt)
  const dependencies = registrationNameDependencies[registrationName]

  for (let i = 0; i < dependencies.length; i++) {
    const dependency = dependencies[i]
    if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
      switch (dependency) {
        case TOP_SCROLL:
          trapCapturedEvent(TOP_SCROLL, mountAt)
          break
        case TOP_FOCUS:
        case TOP_BLUR:
          trapCapturedEvent(TOP_FOCUS, mountAt)
          trapCapturedEvent(TOP_BLUR, mountAt)
          // We set the flag for a single dependency later in this function,
          // but this ensures we mark both as attached rather than just one.
          isListening[TOP_BLUR] = true
          isListening[TOP_FOCUS] = true
          break
        case TOP_CANCEL:
        case TOP_CLOSE:
          if (isEventSupported(getRawEventName(dependency))) {
            trapCapturedEvent(dependency, mountAt)
          }
          break
        case TOP_INVALID:
        case TOP_SUBMIT:
        case TOP_RESET:
          // We listen to them on the target DOM elements.
          // Some of them bubble so we don't want them to fire twice.
          break
        default:
          // By default, listen on the top level to all non-media events.
          // Media events don't bubble so adding the listener wouldn't do anything.
          const isMediaEvent = mediaEventTypes.indexOf(dependency) !== -1
          if (!isMediaEvent) {
            trapBubbledEvent(dependency, mountAt)
          }
          break
      }
      isListening[dependency] = true
    }
  }
}
```

可以看到除了一些特定的事件调用`trapCapturedEvent`之外，其他都绑定`trapBubbledEvent`，需要注意的是，绑定的时候我们需要获取某个事件的`dependencies`，来自`registrationNameDependencies`。其实看这两个方法的名字就可以知道，他们分别监听的是捕获和冒泡阶段。接下去我们就来看看这两个方法做了什么。

```js
export function trapBubbledEvent(topLevelType: DOMTopLevelEventType, element: Document | Element) {
  if (!element) {
    return null
  }
  const dispatch = isInteractiveTopLevelEventType(topLevelType)
    ? dispatchInteractiveEvent
    : dispatchEvent

  addEventBubbleListener(
    element,
    getRawEventName(topLevelType),
    // Check if interactive and wrap in interactiveUpdates
    dispatch.bind(null, topLevelType)
  )
}

export function trapCapturedEvent(topLevelType: DOMTopLevelEventType, element: Document | Element) {
  if (!element) {
    return null
  }
  const dispatch = isInteractiveTopLevelEventType(topLevelType)
    ? dispatchInteractiveEvent
    : dispatchEvent

  addEventCaptureListener(
    element,
    getRawEventName(topLevelType),
    // Check if interactive and wrap in interactiveUpdates
    dispatch.bind(null, topLevelType)
  )
}
```

`dispatchInteractiveEvent`和`dispatchEvent`分别对应不同优先级的事件，前者优先级较高，如果处于`ConcurrentMode`产生的`expirationTime`会较小。这两个方法我们到讲解事件触发过程中去讲解。

而`addEventBubbleListener`和`addEventCaptureListener`这两个方法就很简单了。

```js
export function addEventBubbleListener(
  element: Document | Element,
  eventType: string,
  listener: Function
): void {
  element.addEventListener(eventType, listener, false)
}

export function addEventCaptureListener(
  element: Document | Element,
  eventType: string,
  listener: Function
): void {
  element.addEventListener(eventType, listener, true)
}
```

到这里我们就把事件通过事件代理的方式绑定到了`container`对象上。当然对于特殊的节点的不会冒泡的事件，在`setInitialProperties`中已经事先直接绑定到节点上了。
