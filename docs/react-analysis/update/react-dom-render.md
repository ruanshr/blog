---
prev: /react-analysis/base/react-structure
next: /react-analysis/update/set-state
---

# ReactDOM.render

### 开始

创建`ReactRoot`，并且根据情况调用`root.legacy_renderSubtreeIntoContainer`或者`root.render`，前者是遗留的 API 将来应该会删除，根据`ReactDOM.render`的调用情况也可以发现`parentComponent`是写死的`null`

`DOMRenderer.unbatchedUpdates`制定不使用`batchedUpdates`，因为这是初次渲染，需要尽快完成。

```js
ReactDOM = {
  render(element: React$Element<any>, container: DOMContainer, callback: ?Function) {
    return legacyRenderSubtreeIntoContainer(null, element, container, false, callback)
  }
}

function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: DOMContainer,
  forceHydrate: boolean,
  callback: ?Function
) {
  let root: Root = (container._reactRootContainer: any)
  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate)
    if (typeof callback === 'function') {
      const originalCallback = callback
      callback = function () {
        const instance = DOMRenderer.getPublicRootInstance(root._internalRoot)
        originalCallback.call(instance)
      }
    }
    // Initial mount should not be batched.
    DOMRenderer.unbatchedUpdates(() => {
      if (parentComponent != null) {
        // 一般不会出现
      } else {
        root.render(children, callback)
      }
    })
  } else {
    // 有root的情况
  }
  return DOMRenderer.getPublicRootInstance(root._internalRoot)
}
```

首先会创建`ReactRoot`对象，然后调用他的 render 方法

创建`ReactRoot`的时候会调用`DOMRenderer.createContainer`创建`FiberRoot`，在后期调度更新的过程中这个节点非常重要

这两个数据结构看[这里](../base/react-structure.md)

```js
function legacyCreateRootFromDOMContainer(container: DOMContainer, forceHydrate: boolean): Root {
  const shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container)
  // First clear any existing content.
  if (!shouldHydrate) {
    let warned = false
    let rootSibling
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling)
    }
  }
  // Legacy roots are not async by default.
  const isConcurrent = false
  return new ReactRoot(container, isConcurrent, shouldHydrate)
}

function ReactRoot(container: Container, isConcurrent: boolean, hydrate: boolean) {
  const root = DOMRenderer.createContainer(container, isConcurrent, hydrate)
  this._internalRoot = root
}

ReactRoot.prototype.render = function (children: ReactNodeList, callback: ?() => mixed): Work {
  const root = this._internalRoot
  const work = new ReactWork()
  callback = callback === undefined ? null : callback
  if (__DEV__) {
    warnOnInvalidCallback(callback, 'render')
  }
  if (callback !== null) {
    work.then(callback)
  }
  DOMRenderer.updateContainer(children, root, null, work._onCommit)
  return work
}
```

其中`DOMRenderer`是`react-reconciler/src/ReactFiberReconciler`，他的`updateContainer`如下在这里计算了一个时间，这个时间叫做`expirationTime`，顾名思义就是这次更新的 超时时间。

关于时间是如何计算的看[这里](./expiration-time.md)

然后调用了`updateContainerAtExpirationTime`，在这个方法里调用了`scheduleRootUpdate`就非常重要了

```js
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function
): ExpirationTime {
  const current = container.current
  const currentTime = requestCurrentTime()
  const expirationTime = computeExpirationForFiber(currentTime, current)
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback
  )
}

export function updateContainerAtExpirationTime(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  expirationTime: ExpirationTime,
  callback: ?Function
) {
  // TODO: If this is a nested container, this won't be the root.
  const current = container.current
  const context = getContextForSubtree(parentComponent)
  if (container.context === null) {
    container.context = context
  } else {
    container.pendingContext = context
  }

  return scheduleRootUpdate(current, element, expirationTime, callback)
}
```

### 开始调度

首先要生成一个`update`，不管你是`setState`还是`ReactDOM.render`造成的`React`更新，都会生成一个叫`update`的对象，并且会赋值给`Fiber.updateQueue`

关于 `update`请看[这里](../base/react-structure.md)

然后就是调用`scheduleWork`。注意到这里之前`setState`和`ReactDOM.render`是不一样，但进入`schedulerWork`之后，就是任务调度的事情了，跟之前你是怎么调用的没有任何关系

```js
function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime,
  callback: ?Function
) {
  const update = createUpdate(expirationTime)

  update.payload = { element }

  callback = callback === undefined ? null : callback
  if (callback !== null) {
    warningWithoutStack(
      typeof callback === 'function',
      'render(...): Expected the last optional `callback`argument to be a ' +
        'function. Instead received: %s.',
      callback
    )
    update.callback = callback
  }
  enqueueUpdate(current, update)

  scheduleWork(current, expirationTime)
  return expirationTime
}
```
