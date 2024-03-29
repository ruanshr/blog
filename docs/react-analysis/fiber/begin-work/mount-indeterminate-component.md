# mountIndeterminateComponent

判断`_current`是否存在然后做的操作主要是因为：`IndeterminateComponent`只有在组件被第一次渲染的情况下才会出现，在经过第一次渲染之后，我们就会更新组件的类型，也就是 `Fiber.tag`。如果出现了`_current`存在的情况，那么可能是因为渲染时有`Suspend`的情况。

对于 `ClassComponent`和 `FunctionalComponent`的判断条件仅仅如下：

```js
if (
  typeof value === 'object' &&
  value !== null &&
  typeof value.render === 'function' &&
  value.$$typeof === undefined
)

```

说明 `FunctionalComponent`我们这么些，会被当做 `ClassComponent`处理

```js
import React from 'react'

export default function TestIndeterminateComponent() {
  return {
    componentDidMount() {
      console.log('invoker')
    },
    render() {
      return <span>aaa</span>
    }
  }
}
```

### 什么时候组件会是 `IndeterminateComponent`？

`FunctionalComponent`在第一次创建 `Fiber`的时候就是，详细看 `createFiberFormTypeAndProps`方法。

- [`updateClassComponent`](./update-class-component.md)
- [`updateFunctionalComponent`](./update-functional-component.md)

```js
// 关键代码
function mountIndeterminateComponent(_current, workInProgress, Component, renderExpirationTime) {
  if (_current !== null) {
    // An indeterminate component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to tree it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null
    workInProgress.alternate = null
    // Since this is conceptually a new fiber, schedule a Placement effect
    workInProgress.effectTag |= Placement
  }

  const props = workInProgress.pendingProps
  const unmaskedContext = getUnmaskedContext(workInProgress, Component, false)
  const context = getMaskedContext(workInProgress, unmaskedContext)

  prepareToReadContext(workInProgress, renderExpirationTime)

  let value

  value = Component(props, context)
  // React DevTools reads this flag.
  workInProgress.effectTag |= PerformedWork

  if (
    typeof value === 'object' &&
    value !== null &&
    typeof value.render === 'function' &&
    value.$$typeof === undefined
  ) {
    // Proceed under the assumption that this is a class instance
    workInProgress.tag = ClassComponent

    let hasContext = false
    if (isLegacyContextProvider(Component)) {
      hasContext = true
      pushLegacyContextProvider(workInProgress)
    } else {
      hasContext = false
    }

    workInProgress.memoizedState =
      value.state !== null && value.state !== undefined ? value.state : null

    const getDerivedStateFromProps = Component.getDerivedStateFromProps
    if (typeof getDerivedStateFromProps === 'function') {
      applyDerivedStateFromProps(workInProgress, Component, getDerivedStateFromProps, props)
    }

    adoptClassInstance(workInProgress, value)
    mountClassInstance(workInProgress, Component, props, renderExpirationTime)
    return finishClassComponent(
      null,
      workInProgress,
      Component,
      true,
      hasContext,
      renderExpirationTime
    )
  } else {
    // Proceed under the assumption that this is a function component
    workInProgress.tag = FunctionComponent
    reconcileChildren(null, workInProgress, value, renderExpirationTime)
    return workInProgress.child
  }
}
```
