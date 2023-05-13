---
prev: /react-analysis/features/context
next: /react-analysis/features/ref
---

# hydrate

`hydrate`是`React`中提供在初次渲染的时候，去复用原本已经存在的`DOM`节点，减少重新生成节点以及删除原本`DOM`节点的开销，来加速初次渲染的功能。主要使用场景是服务端渲染或者像`prerender`等情况。

决定在初次渲染时是否需要执行`hydrate`的标准取决于以下条件

- 是否调用方法时就指定使用`hydrate`
- 初次渲染可以调用两种方法：`ReactDOM.render`和`ReactDOM.hydrate`。后者就是直接告诉`ReactDOM`需要`hydrate`，目前来说如果你调用的是`render`，但是`React`会检测是否可以`hydrate`，如果可以他会提醒你应该使用`hydrate`。

### shouldHydrateDueToLegacyHeuristic

即便你不指定需要`hydrate`，`React`也会调用该方法进行检测

```js
const ROOT_ATTRIBUTE_NAME = 'data-reactroot'

function shouldHydrateDueToLegacyHeuristic(container) {
  const rootElement = getReactRootElementInContainer(container)
  return !!(
    rootElement &&
    rootElement.nodeType === ELEMENT_NODE &&
    rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME)
  )
}

function getReactRootElementInContainer(container: any) {
  if (!container) {
    return null
  }

  if (container.nodeType === DOCUMENT_NODE) {
    return container.documentElement
  } else {
    return container.firstChild
  }
}
```

如果`container`是`document`则`rootElement`是`html`，否则是他的第一个子节点。看到这里就需要注意我们为什么不推荐使用`document`来作为`container`了，因为他会直接把`html`覆盖。

然后判断条件是`rootElement`是普通的`element`并且具有`data-reactroot`属性，这是`React`在服务端渲染的时候加上去的。

符合以上两个条件之一的，就会在初次渲染的时候进行`hydrate`，通过在`FiberRoot`上标记`hydrate`属性。

### 开始 hydrate

在更新到`HostRoot`的时候，就正式开始了`hydrate`的流程，`hydrate`是一个整体的模块设计，会存在着一系列的公共变量

| 变量名                   | 作用                            |
| ------------------------ | ------------------------------- |
| `nextHydratableInstance` | 下一个可以被`hydrate`的节点     |
| `isHydrating`            | 是否正在`hydrate`               |
| `hydrationParentFiber`   | 下一个被`hydrate`的节点的父节点 |

`supportsHydration`来自于`HostConfig.js`，在`ReactDOM`中，他是固定值`true`

### enterHydrationState

在更新`HostRoot`的时候，会调用这个方法标志着开始进入`hydrate`流程，设置`isHydrating`为`true`

`getFirstHydratableChild`用于获取子节点中第一个普通`Element`或者`Text`节点

```js
function enterHydrationState(fiber: Fiber): boolean {
  if (!supportsHydration) {
    return false
  }

  const parentInstance = fiber.stateNode.containerInfo
  nextHydratableInstance = getFirstHydratableChild(parentInstance)
  hydrationParentFiber = fiber
  isHydrating = true
  return true
}

export function getFirstHydratableChild(
  parentInstance: Container | Instance
): null | Instance | TextInstance {
  let next = parentInstance.firstChild
  while (next && next.nodeType !== ELEMENT_NODE && next.nodeType !== TEXT_NODE) {
    next = next.nextSibling
  }
  return (next: any)
}
```

### tryToClaimNextHydratableInstance

在更新流程中，还需要做的就是在更新`HostComponent`和`HostText`节点的时候，调用该方法

```js
function tryToClaimNextHydratableInstance(fiber: Fiber): void {
  if (!isHydrating) {
    return
  }
  let nextInstance = nextHydratableInstance
  if (!nextInstance) {
    // Nothing to hydrate. Make it an insertion.
    insertNonHydratedInstance((hydrationParentFiber: any), fiber)
    isHydrating = false
    hydrationParentFiber = fiber
    return
  }
  const firstAttemptedInstance = nextInstance
  if (!tryHydrate(fiber, nextInstance)) {
    nextInstance = getNextHydratableSibling(firstAttemptedInstance)
    if (!nextInstance || !tryHydrate(fiber, nextInstance)) {
      // Nothing to hydrate. Make it an insertion.
      insertNonHydratedInstance((hydrationParentFiber: any), fiber)
      isHydrating = false
      hydrationParentFiber = fiber
      return
    }
    deleteHydratableInstance((hydrationParentFiber: any), firstAttemptedInstance)
  }
  hydrationParentFiber = fiber
  nextHydratableInstance = getFirstHydratableChild((nextInstance: any))
}
```

该方法做的事情是检查`nextInstance`是否可以和当前节点进行复用，通过`tryHydrate`进行判断

判断条件其实很简单，主要对比节点类型是否相同。

注意这里如果第一次`tryHydrate`不成功，会找他的兄弟节点再次尝试他的下一个兄弟节点，如果两次都不成功，就直接关闭整个`hydrate`流程，设置`isHydrating`为`false`

```js
function tryHydrate(fiber, nextInstance) {
  switch (fiber.tag) {
    case HostComponent: {
      const type = fiber.type
      const props = fiber.pendingProps
      const instance = canHydrateInstance(nextInstance, type, props)
      if (instance !== null) {
        fiber.stateNode = (instance: Instance)
        return true
      }
      return false
    }
    case HostText: {
      const text = fiber.pendingProps
      const textInstance = canHydrateTextInstance(nextInstance, text)
      if (textInstance !== null) {
        fiber.stateNode = (textInstance: TextInstance)
        return true
      }
      return false
    }
    default:
      return false
  }
}

export function canHydrateInstance(
  instance: Instance | TextInstance,
  type: string,
  props: Props
): null | Instance {
  if (
    instance.nodeType !== ELEMENT_NODE ||
    type.toLowerCase() !== instance.nodeName.toLowerCase()
  ) {
    return null
  }
  // This has now been refined to an element node.
  return ((instance: any): Instance)
}

export function canHydrateTextInstance(
  instance: Instance | TextInstance,
  text: string
): null | TextInstance {
  if (text === '' || instance.nodeType !== TEXT_NODE) {
    // Empty strings are not parsed by HTML so there won't be a correct match here.
    return null
  }
  // This has now been refined to a text node.
  return ((instance: any): TextInstance)
}
```

### 真正的 hydrate

之前是在更新节点的过程中通过判断来确定是否可以`hydrate`的过程，真正的合并要在`completeWork`中进行，因为`DOM`节点是在这里被创建的。

```js
let wasHydrated = popHydrationState(workInProgress);
if (wasHydrated) {
  // TODO: Move this and createInstance step into the beginPhase
  // to consolidate.
  if (
    prepareToHydrateHostInstance(
      workInProgress,
      rootContainerInstance,
      currentHostContext,
    )
  ) {
    // If changes to the hydrated node needs to be applied at the
    // commit-phase we mark this as such.
    markUpdate(workInProgress);
  }
```

### popHydrationState

在`completeUnitOfWork`的时候，对于`HostComponent`和`HostText`会调用该方法。

这里需要注意一个逻辑，就是在`update`节点，我们沿着一侧子树向下遍历到叶子节点，那么`hydrationParentFiber`会等于叶子节点对应的`DOM`节点，而`nextHydratableInstance`会等于他的子节点。而 completeUnitOfWork 是从这个叶子节点开始的，所以呢这边的判断`fiber !== hydrationParentFiber`正常来讲是不成立的。

而在下一个判断中，对于当前`fiber`是文字节点的情况，会清除`nextHydratableInstance`和他的所有兄弟节点，因为文字节点不会有子节点。

`popToNextHostParent`这就是找父链上的第一个`HostComponent`节点了。

最后设置`nextHydratableInstance`为兄弟节点，因为按照`React`遍历`Fiber`树的流程，如果有兄弟节点，接下去会更新兄弟节点。

```js
function popToNextHostParent(fiber: Fiber): void {
  let parent = fiber.return
  while (parent !== null && parent.tag !== HostComponent && parent.tag !== HostRoot) {
    parent = parent.return
  }
  hydrationParentFiber = parent
}
function popHydrationState(fiber: Fiber): boolean {
  if (!supportsHydration) {
    return false
  }
  if (fiber !== hydrationParentFiber) {
    return false
  }
  if (!isHydrating) {
    popToNextHostParent(fiber)
    isHydrating = true
    return false
  }

  const type = fiber.type

  if (
    fiber.tag !== HostComponent ||
    (type !== 'head' && type !== 'body' && !shouldSetTextContent(type, fiber.memoizedProps))
  ) {
    let nextInstance = nextHydratableInstance
    while (nextInstance) {
      deleteHydratableInstance(fiber, nextInstance)
      nextInstance = getNextHydratableSibling(nextInstance)
    }
  }

  popToNextHostParent(fiber)
  nextHydratableInstance = hydrationParentFiber ? getNextHydratableSibling(fiber.stateNode) : null
  return true
}
```

### prepareToHydrateHostInstance

这个方法很像`completeWork`中对于`HostComponent`的`updateHostComponent`，调用`hydrateInstance`并返回`payload`，这个方法类似于`finalizeInitialChildren`和`diffProperties`的结合，执行了事件的初始化绑定，并对比属性变化并返回`updatePayload`。具体内容就不深究了，有兴趣的同学可以自己去看。

```js
function prepareToHydrateHostInstance(
  fiber: Fiber,
  rootContainerInstance: Container,
  hostContext: HostContext
): boolean {
  const instance: Instance = fiber.stateNode
  const updatePayload = hydrateInstance(
    instance,
    fiber.type,
    fiber.memoizedProps,
    rootContainerInstance,
    hostContext,
    fiber
  )
  fiber.updateQueue = (updatePayload: any)
  if (updatePayload !== null) {
    return true
  }
  return false
}

export function hydrateInstance(
  instance: Instance,
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object
): null | Array<mixed> {
  precacheFiberNode(internalInstanceHandle, instance)
  updateFiberProps(instance, props)
  let parentNamespace: string
  parentNamespace = ((hostContext: any): HostContextProd)
  return diffHydratedProperties(instance, type, props, parentNamespace, rootContainerInstance)
}
```

### prepareToHydrateHostTextInstance`

对于文字节点判断是否需要更新

```js
function prepareToHydrateHostTextInstance(fiber: Fiber): boolean {
  const textInstance: TextInstance = fiber.stateNode
  const textContent: string = fiber.memoizedProps
  const shouldUpdate = hydrateTextInstance(textInstance, textContent, fiber)
  return shouldUpdate
}

export function hydrateTextInstance(
  textInstance: TextInstance,
  text: string,
  internalInstanceHandle: Object
): boolean {
  precacheFiberNode(internalInstanceHandle, textInstance)
  return diffHydratedText(textInstance, text)
}

export function diffHydratedText(textNode: Text, text: string): boolean {
  const isDifferent = textNode.nodeValue !== text
  return isDifferent
}
```

### 删除多余的 DOM 节点 deleteHydratableInstance

最终的删除要放到`commit`阶段去做，所以这里专门为了记录删除行为创建了`Fiber`对象，用于记录`side effect`，并加入到了`effect`链上。

```js
function deleteHydratableInstance(returnFiber: Fiber, instance: HydratableInstance) {
  const childToDelete = createFiberFromHostInstanceForDeletion()
  childToDelete.stateNode = instance
  childToDelete.return = returnFiber
  childToDelete.effectTag = Deletion

  if (returnFiber.lastEffect !== null) {
    returnFiber.lastEffect.nextEffect = childToDelete
    returnFiber.lastEffect = childToDelete
  } else {
    returnFiber.firstEffect = returnFiber.lastEffect = childToDelete
  }
}

export function createFiberFromHostInstanceForDeletion(): Fiber {
  const fiber = createFiber(HostComponent, null, null, NoContext)
  // TODO: These should not need a type.
  fiber.elementType = 'DELETED'
  fiber.type = 'DELETED'
  return fiber
}
```
