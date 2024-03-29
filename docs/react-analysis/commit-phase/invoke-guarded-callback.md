---
prev: /react-analysis/commit-phase/commit-root
next: /react-analysis/commit-phase/commit-before-mutation-lifecycles
---

# invokeGuardedCallback

在开发阶段`React`提供了一个方法来帮助收集错误，一开始我一直没看到到底是用来做什么的，后来根据注释查了以下资料之后了解了这个方法的作用，我们来看一下。

首先是用法：

```js
if (__DEV__) {
  invokeGuardedCallback(null, commitBeforeMutationLifecycles, null)
  if (hasCaughtError()) {
    didError = true
    error = clearCaughtError()
  }
} else {
  try {
    commitBeforeMutationLifecycles()
  } catch (e) {
    didError = true
    error = e
  }
}
```

只有`dev`环境会有使用这个方法进行调用，对比以下，在正式环境使用的是`try catch`。（请无视`commitBeforeMutationLifecycles`这个方法）

先来看一下这个方法的关键代码：

```js
const invokeGuardedCallbackDev = function <A, B, C, D, E, F, Context>(
  name: string | null,
  func: (a: A, b: B, c: C, d: D, e: E, f: F) => mixed,
  context: Context
  // 需要传递给回调的参数
) {
  // 如果`document`不存在的提醒
  const evt = document.createEvent('Event')

  // 记录传入的需要调用的函数是否有错误
  let didError = true

  let windowEvent = window.event

  // 持续跟踪`window.event`的`descriptor`
  // https://github.com/facebook/react/issues/13688
  const windowEventDescriptor = Object.getOwnPropertyDescriptor(window, 'event')

  // 获取需要传递给回调的参数
  const funcArgs = Array.prototype.slice.call(arguments, 3)
  function callCallback() {
    fakeNode.removeEventListener(evtType, callCallback, false)
    if (typeof window.event !== 'undefined' && window.hasOwnProperty('event')) {
      window.event = windowEvent
    }

    func.apply(context, funcArgs)
    didError = false
  }

  let error
  // Use this to track whether the error event is ever called.
  let didSetError = false
  let isCrossOriginError = false

  function handleWindowError(event) {
    error = event.error
    didSetError = true
    if (error === null && event.colno === 0 && event.lineno === 0) {
      isCrossOriginError = true
    }
    if (event.defaultPrevented) {
      // 有其他地方监听了`error`事件并`preventDefault`
      // 记录并让后续代码决定是否要报告
      if (error != null && typeof error === 'object') {
        try {
          error._suppressLogging = true
        } catch (inner) {
          // Ignore.
        }
      }
    }
  }

  // Create a fake event type.
  const evtType =`react-${name ? name : 'invokeguardedcallback'}`

  // Attach our event handlers
  window.addEventListener('error', handleWindowError)
  fakeNode.addEventListener(evtType, callCallback, false)

  // Synchronously dispatch our fake event. If the user-provided function
  // errors, it will trigger our global error handler.
  evt.initEvent(evtType, false, false)
  fakeNode.dispatchEvent(evt)

  if (windowEventDescriptor) {
    Object.defineProperty(window, 'event', windowEventDescriptor)
  }

  if (didError) {
    if (!didSetError) {
      // 函数调用确实出错了，但是`window.error`没有被触发
      // 进行提醒，代码太长不展示
    } else if (isCrossOriginError) {
      error = new Error(
        "A cross-origin error was thrown. React doesn't have access to " +
          'the actual error object in development. ' +
          'See https://fb.me/react-crossorigin-error for more information.'
      )
    }
    this.onError(error)
  }

  // Remove our event listeners
  window.removeEventListener('error', handleWindowError)
}
```

代码会有点长，不要在意这些细节

首先说一下为什么要用这种方式来收集错误，主要原因是为了防止浏览器`DevTool`的`pause on any exception`功能导致`React`渲染因为出现错误被中断，而导致渲染不出内容，因为`React`现在是可以捕获错误并且在错误的时候渲染对应的`UI`的，但是浏览器的这个功能甚至可以让被`try catch`捕获的错误也停在错误出现的地方，对`React`开发的体验不是很好。

OK，其实我已经解释完了。

好吧，其实还有一些可以说的，注意`isCrossOriginError`这个变量，他会在什么时候被设置为`true`呢？

```js
error = event.error
didSetError = true
if (error === null && event.colno === 0 && event.lineno === 0) {
  isCrossOriginError = true
}
```

这里面的逻辑是什么呢？浏览器对于错误收集是有安全策略的，对于错误信息，如果监听的脚本来自非同源的地方，那么就会阻止他收集错误信息（并没有验证，大家可以自己试试，有空我也会写个`demo`）。也就是说下面几个情况会让 React 出现`cross-origin`的错误提醒：

- `React`来自`CDN`
- 构建工具要使用`source-map`，使用`eval`来执行代码
- 异步模块加载

对于第一种情况，可以使用`<script crossorigin src="..."></script>`增加`crossorigin`属性来告知浏览器安全性，同时要保证`CDN`返回的头信息有`Access-Control-Allow-Origin: *`

对于第二种情况，如果你使用`webpack`，不要`devtool`上使用有`eval`的属性，推荐使用`cheap-module-source-map`

对于第三种情况，如果使用`webpack`，可以配置`crossOriginLoading`

[官方文档](https://legacy.reactjs.org/docs/cross-origin-errors.html)

剩下的就不再详细讲解了，大家有兴趣自己研究以下代码吧，主要就是如何主动触发事件相关的，以及像设置`didError`和`didSetError`双重验证来确定是否`error`事件监听被调用之类的代码。
