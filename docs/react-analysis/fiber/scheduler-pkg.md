# scheduler

`React16.5` 之后把`scheduler`单独发一个包了，就叫`scheduler`

## scheduleCallbackWithExpirationTime

异步进行`root`任务调度就是通过这个方法来做的，这里最主要的就是调用了`scheduler的scheduleDeferredCallback`方法（在`scheduler`包中是`scheduleWork`）

传入的的是回调函数`performAsyncWork`，以及一个包含`timeout`超时事件的对象

```js
function scheduleCallbackWithExpirationTime(root: FiberRoot, expirationTime: ExpirationTime) {
  if (callbackExpirationTime !== NoWork) {
    // A callback is already scheduled. Check its expiration time (timeout).
    if (expirationTime > callbackExpirationTime) {
      // Existing callback has sufficient timeout. Exit.
      return
    } else {
      if (callbackID !== null) {
        // Existing callback has insufficient timeout. Cancel and schedule a
        // new one.
        cancelDeferredCallback(callbackID)
      }
    }
    // The request callback timer is already running. Don't start a new one.
  } else {
    startRequestCallbackTimer()
  }

  callbackExpirationTime = expirationTime
  const currentMs = now() - originalStartTimeMs
  const expirationTimeMs = expirationTimeToMs(expirationTime)
  const timeout = expirationTimeMs - currentMs
  callbackID = scheduleDeferredCallback(performAsyncWork, { timeout })
}
```

### scheduler.scheduleWork

创建一个调度节点`newNode`，并按照`timoutAt`的顺序加入到`CallbackNode`链表，调用`ensureHostCallbackIsScheduled`

这里面的`expirationTime`是调用时传入的`timeoutAt`加上当前时间形成的过期时间。

```js
function unstable_scheduleCallback(callback, deprecated_options) {
  var startTime = currentEventStartTime !== -1 ? currentEventStartTime : getCurrentTime()

  var expirationTime
  if (
    typeof deprecated_options === 'object' &&
    deprecated_options !== null &&
    typeof deprecated_options.timeout === 'number'
  ) {
    // FIXME: Remove this branch once we lift expiration times out of React.
    expirationTime = startTime + deprecated_options.timeout
  } else {
    // 这里是以后把`expirationTime`从React中抽离出来之后的逻辑
  }

  var newNode = {
    callback,
    priorityLevel: currentPriorityLevel,
    expirationTime,
    next: null,
    previous: null
  }

  // Insert the new callback into the list, ordered first by expiration, then
  // by insertion. So the new callback is inserted any other callback with
  // equal expiration.
  if (firstCallbackNode === null) {
    // This is the first callback in the list.
    firstCallbackNode = newNode.next = newNode.previous = newNode
    ensureHostCallbackIsScheduled()
  } else {
    var next = null
    var node = firstCallbackNode
    do {
      if (node.expirationTime > expirationTime) {
        // The new callback expires before this one.
        next = node
        break
      }
      node = node.next
    } while (node !== firstCallbackNode)

    if (next === null) {
      // No callback with a later expiration was found, which means the new
      // callback has the latest expiration in the list.
      next = firstCallbackNode
    } else if (next === firstCallbackNode) {
      // The new callback has the earliest expiration in the entire list.
      firstCallbackNode = newNode
      ensureHostCallbackIsScheduled()
    }

    var previous = next.previous
    previous.next = next.previous = newNode
    newNode.next = next
    newNode.previous = previous
  }

  return newNode
}
```

### ensureHostCallbackIsScheduled

如果已经在调用回调了，就 `return`，因为本来就会继续调用下去，`isExecutingCallback`在`flushWork`的时候会被修改为 `true`

如果`isHostCallbackScheduled`为`false`，也就是还没开始调度，那么设为`true`，如果已经开始了，就直接取消，因为顺序可能变了。

调用`requestHostCallback`开始调度

```js
function ensureHostCallbackIsScheduled() {
  if (isExecutingCallback) {
    // Don't schedule work yet; wait until the next time we yield.
    return
  }
  // Schedule the host callback using the earliest expiration in the list.
  var expirationTime = firstCallbackNode.expirationTime
  if (!isHostCallbackScheduled) {
    isHostCallbackScheduled = true
  } else {
    // Cancel the existing host callback.
    cancelHostCallback()
  }
  requestHostCallback(flushWork, expirationTime)
}

cancelHostCallback = function () {
  scheduledHostCallback = null
  isMessageEventScheduled = false
  timeoutTime = -1
}
```

### requestHostCallback

开始进入调度，设置调度的内容，用`scheduledHostCallback`和`timeoutTime`这两个全局变量记录回调函数和对应的过期时间

调用`requestAnimationFrameWithTimeout`，其实就是调用`requestAnimationFrame`在加上设置了一个 `100ms` 的定时器，防止`requestAnimationFrame`太久不触发。

调用回调`animtionTick`并设置`isAnimationFrameScheduled`全局变量为`true`

```js
requestHostCallback = function (callback, absoluteTimeout) {
  scheduledHostCallback = callback
  timeoutTime = absoluteTimeout
  if (isFlushingHostCallback || absoluteTimeout < 0) {
    // Don't wait for the next frame. Continue working ASAP, in a new event.
    window.postMessage(messageKey, '*')
  } else if (!isAnimationFrameScheduled) {
    isAnimationFrameScheduled = true
    requestAnimationFrameWithTimeout(animationTick)
  }
}
```

### 模拟 requestIdleCallback

因为`requestIdleCallback`这个 `API` 目前还处于草案阶段，所以浏览器实现率还不高，所以在这里 React 直接使用了 `polyfill` 的方案。

这个方案简单来说是通过`requestAnimationFrame`在浏览器渲染一帧之前做一些处理，然后通过 `postMessage` 在 `macro task`（类似 `setTimeout`）中加入一个回调，在因为接下去会进入浏览器渲染阶段，所以主线程是被 `block` 住的，等到渲染完了然后回来清空`macro task`。

总体上跟 `requestIdleCallback` 差不多，等到主线程有空的时候回来调用

### animationTick

只要`scheduledHostCallback`还在就继续调要`requestAnimationFrameWithTimeout`因为这一帧渲染完了可能队列还没情况，本身也是要进入再次调用的，这边就省去了 `requestHostCallback` 在次调用的必要性

接下去一段代码是用来计算相隔的 `requestAnimationFrame` 的时差的，这个时差如果连续两次都小鱼当前的 `activeFrameTime`，说明平台的帧率是很高的，这种情况下会动态得缩小帧时间。

最后更新 `frameDeadline`，然后如果没有触发 `idleTick` 则发送消息

```js
var animationTick = function (rafTime) {
  if (scheduledHostCallback !== null) {
    requestAnimationFrameWithTimeout(animationTick)
  } else {
    isAnimationFrameScheduled = false
    return
  }

  var nextFrameTime = rafTime - frameDeadline + activeFrameTime
  if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
    if (nextFrameTime < 8) {
      nextFrameTime = 8
    }
    activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime
  } else {
    previousFrameTime = nextFrameTime
  }
  frameDeadline = rafTime + activeFrameTime
  if (!isMessageEventScheduled) {
    isMessageEventScheduled = true
    window.postMessage(messageKey, '*')
  }
}
```

### idleTick

首先判断`postMessage`是不是自己的，不是直接返回

清空`scheduledHostCallback`和`timeoutTime`

获取当前时间，对比`frameDeadline`，查看是否已经超时了，如果超时了，判断一下任务 `callback` 的过期时间有没有到，如果没有到，则重新对这个 `callback` 进行一次调度，然后返回。如果到了，则设置 `didTimeout` 为 `true`

接下去就是调用 `callback` 了，这里设置 `isFlushingHostCallback` 全局变量为 `true` 代表正在执行。并且调用 `callback` 也就是 `flushWork` 并传入 `didTimeout`

```js
var idleTick = function (event) {
  if (event.source !== window || event.data !== messageKey) {
    return
  }

  isMessageEventScheduled = false

  var prevScheduledCallback = scheduledHostCallback
  var prevTimeoutTime = timeoutTime
  scheduledHostCallback = null
  timeoutTime = -1

  var currentTime = getCurrentTime()

  var didTimeout = false
  if (frameDeadline - currentTime <= 0) {
    if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
      didTimeout = true
    } else {
      if (!isAnimationFrameScheduled) {
        isAnimationFrameScheduled = true
        requestAnimationFrameWithTimeout(animationTick)
      }
      scheduledHostCallback = prevScheduledCallback
      timeoutTime = prevTimeoutTime
      return
    }
  }

  if (prevScheduledCallback !== null) {
    isFlushingHostCallback = true
    try {
      prevScheduledCallback(didTimeout)
    } finally {
      isFlushingHostCallback = false
    }
  }
}
```

### flushWork

先设置`isExecutingCallback`为`true`，代表正在调用`callback`

设置`deadlineObject.didTimeout`，在 `React` 业务中可以用来判断任务是否超时

如果`didTimeout`，会一次从`firstCallbackNode`向后一直执行，知道第一个没过期的任务

如果没有超时，则依此执行第一个`callback`，知道帧时间结束为止

最后清理变量，如果任务没有执行完，则再次调用`ensureHostCallbackIsScheduled`进入调度

顺便把 `Immedia`优先级的任务都调用一遍。

```js
function flushWork(didTimeout) {
  isExecutingCallback = true
  deadlineObject.didTimeout = didTimeout
  try {
    if (didTimeout) {
      while (firstCallbackNode !== null) {
        var currentTime = getCurrentTime()
        if (firstCallbackNode.expirationTime <= currentTime) {
          do {
            flushFirstCallback()
          } while (firstCallbackNode !== null && firstCallbackNode.expirationTime <= currentTime)
          continue
        }
        break
      }
    } else {
      if (firstCallbackNode !== null) {
        do {
          flushFirstCallback()
        } while (firstCallbackNode !== null && getFrameDeadline() - getCurrentTime() > 0)
      }
    }
  } finally {
    isExecutingCallback = false
    if (firstCallbackNode !== null) {
      ensureHostCallbackIsScheduled()
    } else {
      isHostCallbackScheduled = false
    }
    flushImmediateWork()
  }
}
```

### flushFirstCallback

代码太长不放了，他做的事情很简单

- 如果当前队列中只有一个回调，清空队列
- 调用回调并传入`deadline`对象，里面有`timeRemaining`方法通过`frameDeadline - now()`来判断是否帧时间已经到了
- 如果回调有返回内容，把这个返回加入到回调队列

### 全局变量参考

**isHostCallbackScheduled**

是否已经开始调度了，在`ensureHostCallbackIsScheduled`设置为`true`，在结束执行`callback`之后设置为`false`

**scheduledHostCallback**

在 `requestHostCallback` 设置，值一般为`flushWork`，代表下一个调度要做的事情

**isMessageEventScheduled**

是否已经发送调用 `idleTick` 的消息，在`animationTick`中设置为`true`

**timeoutTime**

表示过期任务的时间，在`idleTick`中发现第一个任务的时间已经过期的时候设置

**isAnimationFrameScheduled**

是否已经开始调用`requestAnimationFrame`

**activeFrameTime**

给一帧渲染用的时间，默认是 `33`，也就是 `1 秒 30 帧`

**frameDeadline**

记录当前帧的到期时间，他等于 `currentTime + activeFraeTime`，也就是 `requestAnimationFrame` 回调传入的时间，加上一帧的时间。

**isFlushingHostCallback**

是否正在执行 `callback`
