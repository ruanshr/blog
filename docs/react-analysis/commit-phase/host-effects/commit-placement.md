# CommitPlacement

挂载节点

### getHostParentFiber

```js
function getHostParentFiber(fiber: Fiber): Fiber {
  let parent = fiber.return
  while (parent !== null) {
    if (parent) {
      return parent
    }
    parent = parent.return
  }
}

function isHostParent(fiber: Fiber): boolean {
  return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal
}
```

如上，就是从父链上找到第一个具有`container` 的节点或者是`HostComponent`

根据找到的`parent`设置变量

如果`parent`需要重新设置`text`调用`resetTextContent`

### getHostSibling

```js
function getHostSibling(fiber: Fiber): ?Instance {
  let node: Fiber = fiber
  siblings: while (true) {
    // If we didn't find anything, let's try the next sibling.
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null
      }
      node = node.return
    }
    node.sibling.return = node.return
    node = node.sibling
    while (node.tag !== HostComponent && node.tag !== HostText) {
      if (node.effectTag & Placement) {
        // If we don't have a child, try the siblings instead.
        continue siblings
      }
      if (node.child === null || node.tag === HostPortal) {
        continue siblings
      } else {
        node.child.return = node
        node = node.child
      }
    }
    if (!(node.effectTag & Placement)) {
      // Found it!
      return node.stateNode
    }
  }
}
```

这个方法用来找到当前要执行插入的节点的现有的第一个右侧节点，如果这个方法返回`null`，则会直接调用`parent.appendChild`

这里主要考虑的问题是`parent.appendChild`是插入到最后的，而对于`React` 的节点操作，很可能插入的节点是在中间。对于第一次渲染，因为所有`HostComponent`都是需要插入的，所以按照顺序`appendChild` 没有问题，所以`React` 把这一步放在`completeWork`就做了。但是对于后续更新这个是不确定的，所以要找到整棵树中所有`HostComponent`的树结构中的右侧节点。

这个节点可能存在于：

- 父链中任一节点的右侧节点的子树中的第一个`HostComponent`
- 他的右侧兄弟节点或者子树中的第一个`HostComponent`
- 这个算法就是用来实现这个搜索过程

接下去就是对不同的情况执行不同的插入操作

对于`HostPortal`不需要操作，因为这其实是他的子节点插入到`HostPortal.containerInfo`的过程。

同时这是个循环，这个跟在`completeWork`里`appendAllChindren`一样，要把当前组件的第一层子节点执行插入，比如当前组件如果是一个返回数组的`ClassComponent`

```js
function commitPlacement(finishedWork: Fiber): void {
  if (!supportsMutation) {
    return
  }

  // Recursively insert all host nodes into the parent.
  const parentFiber = getHostParentFiber(finishedWork)

  // Note: these two variables *must* always be updated together.
  let parent
  let isContainer

  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentFiber.stateNode
      isContainer = false
      break
    case HostRoot:
      parent = parentFiber.stateNode.containerInfo
      isContainer = true
      break
    case HostPortal:
      parent = parentFiber.stateNode.containerInfo
      isContainer = true
      break
    default:
      invariant(
        false,
        'Invalid host parent fiber. This error is likely caused by a bug ' +
          'in React. Please file an issue.'
      )
  }
  if (parentFiber.effectTag & ContentReset) {
    // Reset the text content of the parent before doing any insertions
    resetTextContent(parent)
    // Clear ContentReset from the effect tag
    parentFiber.effectTag &= ~ContentReset
  }

  const before = getHostSibling(finishedWork)
  // We only have the top Fiber that was inserted but we need recurse down its
  // children to find all the terminal nodes.
  let node: Fiber = finishedWork
  while (true) {
    if (node.tag === HostComponent || node.tag === HostText) {
      if (before) {
        if (isContainer) {
          insertInContainerBefore(parent, node.stateNode, before)
        } else {
          insertBefore(parent, node.stateNode, before)
        }
      } else {
        if (isContainer) {
          appendChildToContainer(parent, node.stateNode)
        } else {
          appendChild(parent, node.stateNode)
        }
      }
    } else if (node.tag === HostPortal) {
      // If the insertion itself is a portal, then we don't want to traverse
      // down its children. Instead, we'll get insertions from each child in
      // the portal directly.
    } else if (node.child !== null) {
      node.child.return = node
      node = node.child
      continue
    }
    if (node === finishedWork) {
      return
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === finishedWork) {
        return
      }
      node = node.return
    }
    node.sibling.return = node.return
    node = node.sibling
  }
}
```
