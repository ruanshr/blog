---
prev: /react-analysis/base/react-element
next: /react-analysis/base/react-structure
---

# React Children

先来看一下流程图

![React Children](../../images/react-analysis/react-children-map.png)

当然这么看肯定云里雾里，接下去会对各个函数进行讲解，然后再回过头来配合图片观看更好理解。

```js
function mapChildren(children, func, context) {
  if (children == null) {
    return children
  }
  const result = []
  mapIntoWithKeyPrefixInternal(children, result, null, func, context)
  return result
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  let escapedPrefix = ''
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/'
  }
  const traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context)
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext)
  releaseTraverseContext(traverseContext)
}
```

`map`和`forEach`的最大区别就是有没有`return result`。

`getPooledTraverseContext`就是从`pool`里面找一个对象，`releaseTraverseContext`会把当前的`context`对象清空然后放回到`pool`中。

```js
const POOL_SIZE = 10
const traverseContextPool = []
function getPooledTraverseContext() {
  // args
  if (traverseContextPool.length) {
    const traverseContext = traverseContextPool.pop()
    // set attrs
    return traverseContext
  } else {
    return {
      /* attrs */
    }
  }
}

function releaseTraverseContext(traverseContext) {
  // clear attrs
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext)
  }
}
```

那么按照这个流程来看，是不是`pool`永远都只有一个值呢，毕竟推出之后操作完了就推入了，这么循环着。答案肯定是否的，这就要讲到`React.Children.map`的一个特性了，那就是对每个节点的`map`返回的如果是数组，那么还会继续展开，这是一个递归的过程。接下去我们就来看看。

```js
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext)
}

function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  const type = typeof children

  if (type === 'undefined' || type === 'boolean') {
    children = null
  }

  let invokeCallback = false

  if (children === null) {
    invokeCallback = true
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true
        break
      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true
        }
    }
  }

  if (invokeCallback) {
    callback(
      traverseContext,
      children,
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
    )
    return 1
  }

  let child
  let nextName
  let subtreeCount = 0 // Count of children found in the current subtree.
  const nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR

  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      child = children[i]
      nextName = nextNamePrefix + getComponentKey(child, i)
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext)
    }
  } else {
    const iteratorFn = getIteratorFn(children)
    if (typeof iteratorFn === 'function') {
      // iterator，和array差不多
    } else if (type === 'object') {
      // 提醒不正确的children类型
    }
  }

  return subtreeCount
}
```

这里就是一层递归了，对于可循环的`children`，都会重复调用`traverseAllChildrenImpl`，直到是一个节点的情况，然后调用`callback`，也就是`mapSingleChildIntoContext`

```js
function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  const { result, keyPrefix, func, context } = bookKeeping

  let mappedChild = func.call(context, child, bookKeeping.count++)
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, (c) => c)
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        keyPrefix +
          (mappedChild.key && (!child || child.key !== mappedChild.key)
            ? escapeUserProvidedKey(mappedChild.key) + '/'
            : '') +
          childKey
      )
    }
    result.push(mappedChild)
  }
}
```

`mapSingleChildIntoContext`这个方法其实就是调用`React.Children.map(children, callback)`这里的`callback`，就是我们传入的第二个参数，并得到 map 之后的结果。注意重点来了，如果 map 之后的节点还是一个数组，那么再次进入`mapIntoWithKeyPrefixInternal`，那么这个时候我们就会再次从`pool`里面去`context`了，而`pool`的意义大概也就是在这里了，如果循环嵌套多了，可以减少很多对象创建和`gc`的损耗。

而如果不是数组并且是一个合规的`ReactElement`，就触达顶点了，替换一下`key`就推入`result`了。

`React`这么实现主要是两个目的：

- 拆分`map`出来的数组
- 因为对 Children 的处理一般在`render`里面，所以会比较频繁，所以设置一个`pool`减少声明和`gc`的开销

这就是`Children.map`的实现，虽然不算什么特别神奇的代码，但是阅读一下还是挺有意思的。
