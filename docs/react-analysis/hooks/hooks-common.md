---
prev: /react-analysis/hooks/hooks-other
next: false
---

# 通用API

### resolveCurrentlyRenderingFiber

返回当前正在渲染的组件对应的`Fiber`，也就是当前`FunctionalComponent` 对应的`Fiber`，在`prepareToUseHooks` 时设置

### createWorkInProgressHook

`workInProgressHook` 在每次`finishHooks` 的时候会被重置为`null`，所以对于每个`FunctionalComponent` 中的第一个`Hooks` 调用，他调用`createWorkInProgressHook` 的时候，肯定符合`workInProgressHook === null`，而第二个`Hooks` 调用开始，肯定不符合该条件。

`firstWorkInProgressHook` 时用来记录当前`FunctionalComponent` 中第一个`Hook` 调用对应的`Hook`对象。

该方法主要就是用来生产`workInProgressHook` 对象的，这个跟`Fiber` 的`workInProgress` 非常类似，对于整个`React` 应用，我们把每个节点按照`Fiber` 对象的形式来进行拆分然后进行更新，以及信息记录，比如两个最重要的数据记录：

- `Fiber.memoizedState`
- `Fiber.memoizedProps`

分别记录上次渲染时的`state` 和`props`。

在`Hooks` 体系中，我们对一个`FunctionalComponent` 中每个`Hook` 调用进行单元拆分，分别为他们创建`Hook` 对象，用来记录他们的`state`，这就是我们能够通过`useState` 记录状态原理。

那么同理，我们有`createHook` 和`cloneHook` 分别对应创建和复用。`Hook` 对象的数据结构如下：

```js
function createHook(): Hook {
  return {
    memoizedState: null,

    baseState: null,
    queue: null,
    baseUpdate: null,

    next: null
  }
}
```

相比`Fiber` 还是简单很多了的。

这里需要注意`isReRender` 这个变量，他是用来记录是否时重复渲染的，注意他被设置为`true` 的条件：

`workInProgressHook` 不存在并且`firstWorkInProgressHook` 存在
`workInProgressHook.next` 存在
这两种情况都说明了当前组件在这个渲染周期中已经被执行过一次了。

```js
function resolveCurrentlyRenderingFiber(): Fiber {
  invariant(
    currentlyRenderingFiber !== null,
    'Hooks can only be called inside the body of a function component.'
  )
  return currentlyRenderingFiber
}

function createWorkInProgressHook(): Hook {
  if (workInProgressHook === null) {
    // This is the first hook in the list
    if (firstWorkInProgressHook === null) {
      isReRender = false
      currentHook = firstCurrentHook
      if (currentHook === null) {
        // This is a newly mounted hook
        workInProgressHook = createHook()
      } else {
        // Clone the current hook.
        workInProgressHook = cloneHook(currentHook)
      }
      firstWorkInProgressHook = workInProgressHook
    } else {
      // There's already a work-in-progress. Reuse it.
      isReRender = true
      currentHook = firstCurrentHook
      workInProgressHook = firstWorkInProgressHook
    }
  } else {
    if (workInProgressHook.next === null) {
      isReRender = false
      let hook
      if (currentHook === null) {
        // This is a newly mounted hook
        hook = createHook()
      } else {
        currentHook = currentHook.next
        if (currentHook === null) {
          // This is a newly mounted hook
          hook = createHook()
        } else {
          // Clone the current hook.
          hook = cloneHook(currentHook)
        }
      }
      // Append to the end of the list
      workInProgressHook = workInProgressHook.next = hook
    } else {
      // There's already a work-in-progress. Reuse it.
      isReRender = true
      workInProgressHook = workInProgressHook.next
      currentHook = currentHook !== null ? currentHook.next : null
    }
  }
  return workInProgressHook
}
```
