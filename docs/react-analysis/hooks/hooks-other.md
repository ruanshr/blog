---
prev: /react-analysis/hooks/hooks-use-state
next: /react-analysis/hooks/hooks-common
---

# useContext

直接调用`readContext`，这也是为什么我们在更新`FunctionalComponent` 需要调用`prepareToReadContext`

```js
export function useContext<T>(context: ReactContext<T>, observedBits: void | number | boolean): T {
  // Ensure we're in a function component (class components support only the
  // .unstable_read() form)
  resolveCurrentlyRenderingFiber()
  return readContext(context, observedBits)
}
```

### useRef

创建并记录`ref` 对象

```js
export function useRef<T>(initialValue: T): { current: T } {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber()
  workInProgressHook = createWorkInProgressHook()
  let ref

  if (workInProgressHook.memoizedState === null) {
    ref = { current: initialValue }
    workInProgressHook.memoizedState = ref
  } else {
    ref = workInProgressHook.memoizedState
  }
  return ref
}
```

### useImperativeMethods

接受一个`ref` 作为参数，内部其实就是一个`useLayoutEffect` 的调用。主要就是在外部传入的`ref` 上挂载内容，实现类似`ref` 挂载到`ClassComponent`上的效果

```js
export function useImperativeMethods<T>(
  ref: { current: T | null } | ((inst: T | null) => mixed) | null | void,
  create: () => T,
  inputs: Array<mixed> | void | null
): void {
  // TODO: If inputs are provided, should we skip comparing the ref itself?
  const nextInputs = inputs !== null && inputs !== undefined ? inputs.concat([ref]) : [ref, create]

  useLayoutEffect(() => {
    if (typeof ref === 'function') {
      const refCallback = ref
      const inst = create()
      refCallback(inst)
      return () => refCallback(null)
    } else if (ref !== null && ref !== undefined) {
      const refObject = ref
      const inst = create()
      refObject.current = inst
      return () => {
        refObject.current = null
      }
    }
  }, nextInputs)
}
```

### useCallback

创建一个回调方法的缓存，可以让我们传入子节点作为`props` 的时候，可以让其没有变化，避免没必要的渲染。

根据输入的`inputs`，也就是一个数组，内部的内容是否又变回，决定是返回存储的老方法，还是返回新的方法并记录。

```js
export function useCallback<T>(callback: T, inputs: Array<mixed> | void | null): T {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber()
  workInProgressHook = createWorkInProgressHook()

  const nextInputs = inputs !== undefined && inputs !== null ? inputs : [callback]

  const prevState = workInProgressHook.memoizedState
  if (prevState !== null) {
    const prevInputs = prevState[1]
    if (areHookInputsEqual(nextInputs, prevInputs)) {
      return prevState[0]
    }
  }
  workInProgressHook.memoizedState = [callback, nextInputs]
  return callback
}
```

### useMemo

`useMemo(() => fn, inputs)跟useCallback(fn, inputs)`效果一样

```js
export function useMemo<T>(nextCreate: () => T, inputs: Array<mixed> | void | null): T {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber()
  workInProgressHook = createWorkInProgressHook()

  const nextInputs = inputs !== undefined && inputs !== null ? inputs : [nextCreate]

  const prevState = workInProgressHook.memoizedState
  if (prevState !== null) {
    const prevInputs = prevState[1]
    if (areHookInputsEqual(nextInputs, prevInputs)) {
      return prevState[0]
    }
  }

  const nextValue = nextCreate()
  workInProgressHook.memoizedState = [nextValue, nextInputs]
  return nextValue
}
```
