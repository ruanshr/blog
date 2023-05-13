# beginWork

这个版本`React`优化了是否需要更新的验证，直接放在`beginWork`的顶部

```js
if (
  oldProps === newProps &&
  !hasLegacyContextChanged() &&
  (updateExpirationTime === NoWork ||
    updateExpirationTime > renderExpirationTime)
)
```

这里判断了：

- 前后`props`是否相等
- `hasLegacyContextChanged`判断了是否有老版本`context`使用并且发生变化
- 当前节点是否需要更新以及他的更新优先级是否在当前更新优先级之前

只要满足这三个条件都不存在，那么`React`判断当前节点是不需要更新的，执行一些必要操作之后就可以跳过了。

必要操作无非就是：

- 如果提高老版本`context`，要入栈
- 如果是`host container`也要如栈
- 特殊组件如`Suspense`的特殊处理

关于`stack`和`context`看[这里](../features/context.md)

```js
bailoutOnAlreadyFinishedWork
function bailoutOnAlreadyFinishedWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime
): Fiber | null {
  const childExpirationTime = workInProgress.childExpirationTime
  if (childExpirationTime === NoWork || childExpirationTime > renderExpirationTime) {
    return null
  } else {
    cloneChildFibers(current, workInProgress)
    return workInProgress.child
  }
}
```

这里根据之前设置的 `childExpirationTime` 来判断子树是否需要更新，如果子树也不需要更新则就直接` return null `了，代表可以直接 `complete` 了。如果有更新还是需要调和子节点。

如果不能跳过，那么就根据节点类型进行更新了：

- [`mountIndeterminateComponent`](./begin-work/update-context-consumer.md)
- [`mountLazyComponent`](./begin-work/update-context-consumer.md)
- [`updateFunctionComponent`](./begin-work/update-context-consumer.md)
- [`updateClassComponent`](./begin-work/update-context-consumer.md)
- [`updateHostRoot`](./begin-work/update-context-consumer.md)
- [`updateHostComponent`](./begin-work/update-context-consumer.md)
- [`updateHostText`](./begin-work/update-context-consumer.md)
- [`updateSuspenseComponent`](./begin-work/update-context-consumer.md)
- [`updatePortalComponent`](./begin-work/update-context-consumer.md)
- [`updateForwardRef`](./begin-work/update-context-consumer.md)
- [`updateFragment`](./begin-work/update-context-consumer.md)
- [`updateMode`](./begin-work/update-context-consumer.md)
- [`updateProfiler`](./begin-work/update-context-consumer.md)
- [`updateContextProvider`](./begin-work/update-context-consumer.md)
- [`updateContextConsumer`](./begin-work/update-context-consumer.md)

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime
): Fiber | null {
  const updateExpirationTime = workInProgress.expirationTime

  if (current !== null) {
    const oldProps = current.memoizedProps
    const newProps = workInProgress.pendingProps
    if (
      oldProps === newProps &&
      !hasLegacyContextChanged() &&
      (updateExpirationTime === NoWork || updateExpirationTime > renderExpirationTime)
    ) {
      // This fiber does not have any pending work. Bailout without entering
      // the begin phase. There's still some bookkeeping we that needs to be done
      // in this optimized path, mostly pushing stuff onto the stack.
      switch (workInProgress.tag) {
        case HostRoot:
          pushHostRootContext(workInProgress)
          resetHydrationState()
          break
        case HostComponent:
          pushHostContext(workInProgress)
          break
        case ClassComponent: {
          const Component = workInProgress.type
          if (isLegacyContextProvider(Component)) {
            pushLegacyContextProvider(workInProgress)
          }
          break
        }
        case HostPortal:
          pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo)
          break
        case ContextProvider: {
          const newValue = workInProgress.memoizedProps.value
          pushProvider(workInProgress, newValue)
          break
        }
        case Profiler:
          if (enableProfilerTimer) {
            workInProgress.effectTag |= Update
          }
          break
        case SuspenseComponent: {
          const state: SuspenseState | null = workInProgress.memoizedState
          const didTimeout = state !== null && state.didTimeout
          if (didTimeout) {
            const primaryChildFragment: Fiber = (workInProgress.child: any)
            const primaryChildExpirationTime = primaryChildFragment.childExpirationTime
            if (
              primaryChildExpirationTime !== NoWork &&
              primaryChildExpirationTime <= renderExpirationTime
            ) {
              return updateSuspenseComponent(current, workInProgress, renderExpirationTime)
            } else {
              const child = bailoutOnAlreadyFinishedWork(
                current,
                workInProgress,
                renderExpirationTime
              )
              if (child !== null) {
                return child.sibling
              } else {
                return null
              }
            }
          }
          break
        }
      }
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderExpirationTime)
    }
  }

  // Before entering the begin phase, clear the expiration time.
  workInProgress.expirationTime = NoWork

  switch (workInProgress.tag) {
    case IndeterminateComponent: {
      const elementType = workInProgress.elementType
      return mountIndeterminateComponent(current, workInProgress, elementType, renderExpirationTime)
    }
    case LazyComponent: {
      const elementType = workInProgress.elementType
      return mountLazyComponent(
        current,
        workInProgress,
        elementType,
        updateExpirationTime,
        renderExpirationTime
      )
    }
    case FunctionComponent: {
      const Component = workInProgress.type
      const unresolvedProps = workInProgress.pendingProps
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps)
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      )
    }
    case ClassComponent: {
      const Component = workInProgress.type
      const unresolvedProps = workInProgress.pendingProps
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps)
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      )
    }
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime)
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime)
    case HostText:
      return updateHostText(current, workInProgress)
    case SuspenseComponent:
      return updateSuspenseComponent(current, workInProgress, renderExpirationTime)
    case HostPortal:
      return updatePortalComponent(current, workInProgress, renderExpirationTime)
    case ForwardRef: {
      const type = workInProgress.type
      const unresolvedProps = workInProgress.pendingProps
      const resolvedProps =
        workInProgress.elementType === type
          ? unresolvedProps
          : resolveDefaultProps(type, unresolvedProps)
      return updateForwardRef(current, workInProgress, type, resolvedProps, renderExpirationTime)
    }
    case Fragment:
      return updateFragment(current, workInProgress, renderExpirationTime)
    case Mode:
      return updateMode(current, workInProgress, renderExpirationTime)
    case Profiler:
      return updateProfiler(current, workInProgress, renderExpirationTime)
    case ContextProvider:
      return updateContextProvider(current, workInProgress, renderExpirationTime)
    case ContextConsumer:
      return updateContextConsumer(current, workInProgress, renderExpirationTime)
    case MemoComponent: {
      const type = workInProgress.type
      const unresolvedProps = workInProgress.pendingProps
      const resolvedProps = resolveDefaultProps(type.type, unresolvedProps)
      return updateMemoComponent(
        current,
        workInProgress,
        type,
        resolvedProps,
        updateExpirationTime,
        renderExpirationTime
      )
    }
    case SimpleMemoComponent: {
      return updateSimpleMemoComponent(
        current,
        workInProgress,
        workInProgress.type,
        workInProgress.pendingProps,
        updateExpirationTime,
        renderExpirationTime
      )
    }
    case IncompleteClassComponent: {
      const Component = workInProgress.type
      const unresolvedProps = workInProgress.pendingProps
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps)
      return mountIncompleteClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      )
    }
    default:
      invariant(
        false,
        'Unknown unit of work tag. This error is likely caused by a bug in ' +
          'React. Please file an issue.'
      )
  }
}
```
