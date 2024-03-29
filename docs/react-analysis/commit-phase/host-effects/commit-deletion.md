# CommitDeletion

`unmountHostComponents`是一个大的遍历

注意这里只会对非`HostComponent`的节点查找子树：

```js
} else if (node.tag === HostPortal) {
  currentParent = node.stateNode.containerInfo;
  currentParentIsContainer = true;
  // Visit children because portals might contain host components.
  if (node.child !== null) {
    node.child.return = node;
    node = node.child;
    continue;
  }
} else {
  commitUnmount(node);
  // Visit children because we may find more host components below.
  if (node.child !== null) {
    node.child.return = node;
    node = node.child;
    continue;
  }
}
```

对于`HostComponent`只会找兄弟节点，而他的遍历放在了`commitNestedUnmounts`。注意这是一个递归的过程，在`commitNestedUnmounts`会对每个子节点调用`commitUnmount`，内部会对`HostPortal`类型递归调用`unmountHostComponents`。同样的在这里也会调用`commitUnmount`，所以也会递归。

这里真正需要从`DOM`中删除的只有`HostComponent`，所以这个方法的主逻辑是找到`HostComponent`并根据父节点的类型执行不同的删除操作。

```js
function commitDeletion(current: Fiber): void {
  if (supportsMutation) {
    unmountHostComponents(current)
  } else {
    commitNestedUnmounts(current)
  }
  detachFiber(current)
}

function unmountHostComponents(current): void {
  let node: Fiber = current

  let currentParentIsValid = false

  // Note: these two variables *must* always be updated together.
  let currentParent
  let currentParentIsContainer

  while (true) {
    if (!currentParentIsValid) {
      let parent = node.return
      findParent: while (true) {
        invariant(
          parent !== null,
          'Expected to find a host parent. This error is likely caused by ' +
            'a bug in React. Please file an issue.'
        )
        switch (parent.tag) {
          case HostComponent:
            currentParent = parent.stateNode
            currentParentIsContainer = false
            break findParent
          case HostRoot:
            currentParent = parent.stateNode.containerInfo
            currentParentIsContainer = true
            break findParent
          case HostPortal:
            currentParent = parent.stateNode.containerInfo
            currentParentIsContainer = true
            break findParent
        }
        parent = parent.return
      }
      currentParentIsValid = true
    }

    if (node.tag === HostComponent || node.tag === HostText) {
      commitNestedUnmounts(node)
      if (currentParentIsContainer) {
        removeChildFromContainer((currentParent: any), node.stateNode)
      } else {
        removeChild((currentParent: any), node.stateNode)
      }
      // Don't visit children because we already visited them.
    } else if (node.tag === HostPortal) {
      currentParent = node.stateNode.containerInfo
      currentParentIsContainer = true
      // Visit children because portals might contain host components.
      if (node.child !== null) {
        node.child.return = node
        node = node.child
        continue
      }
    } else {
      commitUnmount(node)
      // Visit children because we may find more host components below.
      if (node.child !== null) {
        node.child.return = node
        node = node.child
        continue
      }
    }
    if (node === current) {
      return
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === current) {
        return
      }
      node = node.return
      if (node.tag === HostPortal) {
        currentParentIsValid = false
      }
    }
    node.sibling.return = node.return
    node = node.sibling
  }
}
```

### commitNestedUnmounts

这个方法是在发现需要删除的节点是`HostComponent`的时候调用的

遍历子树，对每个节点调用`commitUnmount`，遍历过程跟`workLoop`差不多，遵循深度优先遍历规则

在这个遍历过程中，因为对于每个节点都会调用`commitUnmount`，所以如果发现有`portal`节点，则会递归调用`unmountHostComponents`

```js
function commitNestedUnmounts(root: Fiber): void {
  let node: Fiber = root
  while (true) {
    commitUnmount(node)
    if (node.child !== null && (!supportsMutation || node.tag !== HostPortal)) {
      node.child.return = node
      node = node.child
      continue
    }
    if (node === root) {
      return
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === root) {
        return
      }
      node = node.return
    }
    node.sibling.return = node.return
    node = node.sibling
  }
}
```

### commitUnmount

这个方法是真正的对每个节点执行删除前的操作的，对于

### HostComponent

如果有 ref 则要卸载

### ClassComponent

如果有`ref`则要卸载

如果有`componentWillUnmount`生命周期方法，则调用之

### HostPortal

继续调用`unmountHostComponents`

```js
function commitUnmount(current: Fiber): void {
  onCommitUnmount(current)

  switch (current.tag) {
    case ClassComponent: {
      safelyDetachRef(current)
      const instance = current.stateNode
      if (typeof instance.componentWillUnmount === 'function') {
        safelyCallComponentWillUnmount(current, instance)
      }
      return
    }
    case HostComponent: {
      safelyDetachRef(current)
      return
    }
    case HostPortal: {
      if (supportsMutation) {
        unmountHostComponents(current)
      } else if (supportsPersistence) {
        emptyPortalContainer(current)
      }
      return
    }
  }
}
```
