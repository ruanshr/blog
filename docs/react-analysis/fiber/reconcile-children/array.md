---
prev: /react-analysis/commit-phase/commit-root
next: /react-analysis/commit-phase/commit-root
---

# 调和列表

### reconcileChildrenArray

在 `beginWork` 阶段，`updateHostComponent` 的时候会执行 `reconcileChildFibers` 或者 `mountChildFibers`(初始化的时候)，这两个方法其实是一样的，唯一不同是又一个全局变量不一样：`shouldTrackSideEffects`。

- `reconcileChildFibers` 的时候是 `true`
- `mountChildFibers` 的时候是 `false`

然后如果发现 `newChild` 是数组，那么就是执行 `reconcileChildrenArray`，那么这时候 `key` 就可以发挥作用。接下去我们就来解析一下这个函数

首先进行不正确的 `key` 的警告，然后声明了一堆变量，看名字就大致能知道意思，然后进入一个循环，在循环里面调用了 `updateSlot`，下一个区块会详细讲解这个函数，这里我们只需要知道这个函数对比新旧 `children` 相同 `index` 的对象的 `key` 是否相等，如果是，返回该对象，如果不是，返回 `null`。也就是逐个对比两个数组，如果相等则继续，如果有任何一个不等，那么跳出循环。

也就是说这个循环找到了第一个不想等的位子，这个时候 `oldFiber` 就是那个不等的

```js
if (newIdx === newChildren.length) {
  deleteRemainingChildren(returnFiber, oldFiber)
  return resultingFirstChild
}
```

如果循环之后，循环长度和新的`children`的长度相等，说明新的数组可能小于等于老数组，那么有可能老数组后面有剩余的，所以要删除。

```js
if (oldFiber === null) {
  for (; newIdx < newChildren.length; newIdx++) {
    const newFiber = createChild(returnFiber, newChildren[newIdx], expirationTime)
    if (!newFiber) {
      continue
    }
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  }
  return resultingFirstChild
}
```

如果循环之后没有 `oldFiber` 也就是所有老的数组都可以复用，而剩余的新数组的项就可以作为新的项直接插入进去了。

最后如果上面两种情况都不符合，则代表有可能顺序换了或者有新增或删减，所以就创建一个 `existingChildren` 代表所有剩余没有匹配掉的节点，然后新的数组根据 `key` 从这个 `map` 里面查找，如果有则复用，没有则新建。

最后老的没有匹配到的都要删除。

可以看到 `key` 的作用主要就是复用之前的节点的，没有 `key` 的话，数组就要每次全部删除然后重新创建，开销就非常大

```js
function reconcileChildrenArray(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChildren: Array<*>,
  expirationTime: ExpirationTime
): Fiber | null {
  if (__DEV__) {
    // First, validate keys.
    let knownKeys = null
    for (let i = 0; i < newChildren.length; i++) {
      const child = newChildren[i]
      knownKeys = warnOnInvalidKey(child, knownKeys)
    }
  }

  let resultingFirstChild: Fiber | null = null
  let previousNewFiber: Fiber | null = null

  let oldFiber = currentFirstChild
  let lastPlacedIndex = 0
  let newIdx = 0
  let nextOldFiber = null
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber
      oldFiber = null
    } else {
      nextOldFiber = oldFiber.sibling
    }
    const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], expirationTime)
    if (newFiber === null) {
      if (oldFiber === null) {
        oldFiber = nextOldFiber
      }
      break
    }
    if (shouldTrackSideEffects) {
      if (oldFiber && newFiber.alternate === null) {
        deleteChild(returnFiber, oldFiber)
      }
    }
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
    oldFiber = nextOldFiber
  }

  if (newIdx === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber)
    return resultingFirstChild
  }

  if (oldFiber === null) {
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx], expirationTime)
      if (!newFiber) {
        continue
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber
      } else {
        previousNewFiber.sibling = newFiber
      }
      previousNewFiber = newFiber
    }
    return resultingFirstChild
  }

  // Add all children to a key map for quick lookups.
  const existingChildren = mapRemainingChildren(returnFiber, oldFiber)

  // Keep scanning and use the map to restore deleted items as moves.
  for (; newIdx < newChildren.length; newIdx++) {
    const newFiber = updateFromMap(
      existingChildren,
      returnFiber,
      newIdx,
      newChildren[newIdx],
      expirationTime
    )
    if (newFiber) {
      if (shouldTrackSideEffects) {
        if (newFiber.alternate !== null) {
          existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key)
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber
      } else {
        previousNewFiber.sibling = newFiber
      }
      previousNewFiber = newFiber
    }
  }

  if (shouldTrackSideEffects) {
    existingChildren.forEach((child) => deleteChild(returnFiber, child))
  }

  return resultingFirstChild
}
```

### updateSlot

如果是文字节点就没啥好说的，毕竟文字节点不存在 `key`

如果是对象，就是根据不同的类型执行不同的 `update`

如果是数组，则作为 `fragment` 来处理

```js
function updateSlot(
  returnFiber: Fiber,
  oldFiber: Fiber | null,
  newChild: any,
  expirationTime: ExpirationTime
): Fiber | null {
  // Update the fiber if the keys match, otherwise return null.

  const key = oldFiber !== null ? oldFiber.key : null

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // Text nodes don't have keys. If the previous node is implicitly keyed
    // we can continue to replace it without aborting even if it is not a text
    // node.
    if (key !== null) {
      return null
    }
    return updateTextNode(returnFiber, oldFiber, '' + newChild, expirationTime)
  }

  if (typeof newChild === 'object' && newChild !== null) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE: {
        if (newChild.key === key) {
          if (newChild.type === REACT_FRAGMENT_TYPE) {
            return updateFragment(
              returnFiber,
              oldFiber,
              newChild.props.children,
              expirationTime,
              key
            )
          }
          return updateElement(returnFiber, oldFiber, newChild, expirationTime)
        } else {
          return null
        }
      }
      case REACT_PORTAL_TYPE: {
        if (newChild.key === key) {
          return updatePortal(returnFiber, oldFiber, newChild, expirationTime)
        } else {
          return null
        }
      }
    }

    if (isArray(newChild) || getIteratorFn(newChild)) {
      if (key !== null) {
        return null
      }

      return updateFragment(returnFiber, oldFiber, newChild, expirationTime, null)
    }

    throwOnInvalidObjectType(returnFiber, newChild)
  }

  return null
}
```
