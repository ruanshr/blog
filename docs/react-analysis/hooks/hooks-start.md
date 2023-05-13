---
prev: /react-analysis/features/suspense-lazy
next: /react-analysis/hooks/hooks-use-state
---

# hooks

### 开始

在`React.js`中可以看到`Hooks`导入的代码：

```js
import {
  useCallback,
  useContext,
  useEffect,
  useImperativeMethods,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from './ReactHooks'
```

那么我们就来看看具体的代码是怎样的：

```js
function resolveDispatcher() {
  const dispatcher = ReactCurrentOwner.currentDispatcher
  return dispatcher
}

export function useState<S>(initialState: (() => S) | S) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useState(initialState)
}

export function useEffect(create: () => mixed, inputs: Array<mixed> | void | null) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useEffect(create, inputs)
}

export function useContext<T>(Context: ReactContext<T>, observedBits: number | boolean | void) {
  const dispatcher = resolveDispatcher()
  // dev code
  return dispatcher.useContext(Context, observedBits)
}
```

以上就是三个最常用的`Hooks`在`React`中的源码，可见他们也跟其他`React`的`API`一样，只管定义，不管实现。他们都调用了`ReactCurrentOwner.currentDispatcher.xxx`对应的方法。那么这个`ReactCurrentOwner.currentDispatcher`是啥呢？

在我们执行 renderRoot 开始渲染的时候，我们会设置这个值：

```js
import { Dispatcher } from './ReactFiberDispatcher'

if (enableHooks) {
  ReactCurrentOwner.currentDispatcher = Dispatcher
}
```

并且在离开`renderRoot`的时候设置为`null`。那么这个`Dispatcher`又是啥呢？

```js
// ReactFiberDispatcher.js
import { readContext } from './ReactFiberNewContext'
import {
  useCallback,
  useContext,
  useEffect,
  useImperativeMethods,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from './ReactFiberHooks'

export const Dispatcher = {
  readContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeMethods,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState
}
```

OK，`Hooks`方法的源头代码找到了。需要注意的是`Hooks`只有`FunctionalComponent`被更新的时候才会被调用，所以我们肯定需要关心一下`FunctionalComponent`的更新过程。

```js
function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps: any,
  renderExpirationTime
) {
  const unmaskedContext = getUnmaskedContext(workInProgress, Component, true)
  const context = getMaskedContext(workInProgress, unmaskedContext)

  let nextChildren
  prepareToReadContext(workInProgress, renderExpirationTime)
  prepareToUseHooks(current, workInProgress, renderExpirationTime)
  nextChildren = Component(nextProps, context)
  nextChildren = finishHooks(Component, nextProps, nextChildren, context)

  // React DevTools reads this flag.
  workInProgress.effectTag |= PerformedWork
  reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime)
  return workInProgress.child
}
```

可以看到这里增加了三个方法调用：`prepareToReadContext`，`prepareToUseHooks`，`finishHooks`。后两个都明显跟`Hooks`有关，而第一个是读取新的`Context API`的，因为在`Hooks`中有读取`Context`的操作，所以增加这个就无可厚非了。我们看一下`prepareToUseHooks`和`finishHooks`分别做了什么。

### prepareToUseHooks

这个方法来自`ReactFiberHooks.js`，明显只是初始化一些模块内的全局变量。

```js
export function prepareToUseHooks(
  current: Fiber | null,
  workInProgress: Fiber,
  nextRenderExpirationTime: ExpirationTime
): void {
  renderExpirationTime = nextRenderExpirationTime
  currentlyRenderingFiber = workInProgress
  firstCurrentHook = current !== null ? current.memoizedState : null
}
```

### finishHooks

相比之下`finishHooks`则复杂很多，一进来就有一个`while`循环，这个循环是因为`Hooks`提供了我们一个功能：如果在一次更新中（也就是调用`FunctionalComponent`的过程中）如果直接调用了类似`setState`的`Hooks API`产生了新的更新，则会在当前的渲染周期中直接执行更新。这个大家可以先了解一下，后面我们具体讲`Hooks`的实现会再具体讲到。

后面设置了`renderedWork.updateQueue`，就非常类似于`HostComponent`和`ClassComponent`了，本来`FunctionalComponent`在`commit`阶段是完全没有更新的，但是现在`Hooks`给了他产生`side effect`的能力，所以这就是记录这些`side effect`的`queue`。

后面就是初始化全局变量了，就先不多讲了。

```js
export function finishHooks(Component: any, props: any, children: any, refOrContext: any): any {
  while (didScheduleRenderPhaseUpdate) {
    didScheduleRenderPhaseUpdate = false
    numberOfReRenders += 1

    // Start over from the beginning of the list
    currentHook = null
    workInProgressHook = null
    componentUpdateQueue = null

    children = Component(props, refOrContext)
  }
  renderPhaseUpdates = null
  numberOfReRenders = 0

  const renderedWork: Fiber = (currentlyRenderingFiber: any)

  renderedWork.memoizedState = firstWorkInProgressHook
  renderedWork.expirationTime = remainingExpirationTime
  renderedWork.updateQueue = (componentUpdateQueue: any)

  const didRenderTooFewHooks = currentHook !== null && currentHook.next !== null

  renderExpirationTime = NoWork
  currentlyRenderingFiber = null

  firstCurrentHook = null
  currentHook = null
  firstWorkInProgressHook = null
  workInProgressHook = null

  remainingExpirationTime = NoWork
  componentUpdateQueue = null

  return children
}
```
