# reconcileSingleElement

第一个 while 循环的目的明显就是找到老的`children`和新的`children`中第一个 key 和节点类型相同的节点，直接复用这个节点，然后删除老的`children`中其他的（我们无法保证新的`children`是单个节点的时候老的`children`也是单个的，所以要用遍历。）

注意`key`为`null`我们也认为是相等，因为单个节点没有`key`也是正常的

如果找了一圈没发现，那么就把老的`children`都删了，重新为新的`children`创建节点。

coerceRef 的作用是把规范化`ref`，因为`ref`有三种形式，`string ref`要转换成方法。

```js
function coerceRef(returnFiber: Fiber, current: Fiber | null, element: ReactElement) {
  let mixedRef = element.ref
  if (mixedRef !== null && typeof mixedRef !== 'function' && typeof mixedRef !== 'object') {
    if (element._owner) {
      const owner: ?Fiber = (element._owner: any)
      let inst
      if (owner) {
        const ownerFiber = ((owner: any): Fiber)
        invariant(ownerFiber.tag === ClassComponent, 'Function components cannot have refs.')
        inst = ownerFiber.stateNode
      }
      invariant(
        inst,
        'Missing owner for string ref %s. This error is likely caused by a ' +
          'bug in React. Please file an issue.',
        mixedRef
      )
      const stringRef = '' + mixedRef
      // Check if previous string ref matches new string ref
      if (
        current !== null &&
        current.ref !== null &&
        typeof current.ref === 'function' &&
        current.ref._stringRef === stringRef
      ) {
        return current.ref
      }
      const ref = function (value) {
        let refs = inst.refs
        if (refs === emptyRefsObject) {
          // This is a lazy pooled frozen object, so we need to initialize.
          refs = inst.refs = {}
        }
        if (value === null) {
          delete refs[stringRef]
        } else {
          refs[stringRef] = value
        }
      }
      ref._stringRef = stringRef
      return ref
    } else {
      // error handlers
    }
  }
  return mixedRef
}
```

这个方法可以看出来会把`string ref`转换成一个方法，最终会把对象设置到`inst.refs`上。

```js
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement,
  expirationTime: ExpirationTime
): Fiber {
  const key = element.key
  let child = currentFirstChild
  while (child !== null) {
    // TODO: If key === null and child.key === null, then this only applies to
    // the first item in the list.
    if (child.key === key) {
      if (
        child.tag === Fragment
          ? element.type === REACT_FRAGMENT_TYPE
          : child.elementType === element.type
      ) {
        deleteRemainingChildren(returnFiber, child.sibling)
        const existing = useFiber(
          child,
          element.type === REACT_FRAGMENT_TYPE ? element.props.children : element.props,
          expirationTime
        )
        existing.ref = coerceRef(returnFiber, child, element)
        existing.return = returnFiber
        if (__DEV__) {
          existing._debugSource = element._source
          existing._debugOwner = element._owner
        }
        return existing
      } else {
        deleteRemainingChildren(returnFiber, child)
        break
      }
    } else {
      deleteChild(returnFiber, child)
    }
    child = child.sibling
  }

  if (element.type === REACT_FRAGMENT_TYPE) {
    const created = createFiberFromFragment(
      element.props.children,
      returnFiber.mode,
      expirationTime,
      element.key
    )
    created.return = returnFiber
    return created
  } else {
    const created = createFiberFromElement(element, returnFiber.mode, expirationTime)
    created.ref = coerceRef(returnFiber, currentFirstChild, element)
    created.return = returnFiber
    return created
  }
}
```

### reconcileSinglePortal

`portal`其实就是特殊的`ReactElement`，他的`$$typeof`不是`REACT_ELEMENT_TYPE`。但是他们的处理方式其实差不多，也都是循环老的`children`找能复用的，找不到就创建新的，只是创建`Fiber`的方法不一样。

```js
function reconcileSinglePortal(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  portal: ReactPortal,
  expirationTime: ExpirationTime
): Fiber {
  const key = portal.key
  let child = currentFirstChild
  while (child !== null) {
    if (child.key === key) {
      if (
        child.tag === HostPortal &&
        child.stateNode.containerInfo === portal.containerInfo &&
        child.stateNode.implementation === portal.implementation
      ) {
        deleteRemainingChildren(returnFiber, child.sibling)
        const existing = useFiber(child, portal.children || [], expirationTime)
        existing.return = returnFiber
        return existing
      } else {
        deleteRemainingChildren(returnFiber, child)
        break
      }
    } else {
      deleteChild(returnFiber, child)
    }
    child = child.sibling
  }

  const created = createFiberFromPortal(portal, returnFiber.mode, expirationTime)
  created.return = returnFiber
  return created
}
```

### reconcileSingleTextNode

文字节点的对比比较简单粗暴，直接找老的`children`中的第一个节点，如果是文字节点就复用，如果不是就删除全部老的节点，创建新的文字节点。

```js
function reconcileSingleTextNode(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  textContent: string,
  expirationTime: ExpirationTime
): Fiber {
  // There's no need to check for keys on text nodes since we don't have a
  // way to define them.
  if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
    // We already have an existing node so let's just update it and delete
    // the rest.
    deleteRemainingChildren(returnFiber, currentFirstChild.sibling)
    const existing = useFiber(currentFirstChild, textContent, expirationTime)
    existing.return = returnFiber
    return existing
  }
  // The existing first child is not a text node so we need to create one
  // and delete the existing ones.
  deleteRemainingChildren(returnFiber, currentFirstChild)
  const created = createFiberFromText(textContent, returnFiber.mode, expirationTime)
  created.return = returnFiber
  return created
}
```
