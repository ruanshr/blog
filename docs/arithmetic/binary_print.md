# 打印二叉树（先序，中序，后序）

### 先序打印

```js
function printPreTree(root) {
  function swrap(node, list) {
    if (!node) {
      return
    }
    list.push(node.val)
    swrap(node.left, list)
    swrap(node.right, list)
  }
  let result = []
  swrap(root, result)
  return result
}
```

前序遍历的递归定义：先根节点，后左子树，再右子树。
　　首先，我们遍历左子树，边遍历边打印，并把根节点存入栈中，以后需借助这些节点进入右子树开启新一轮的循环。还得重复一句：所有的节点都可看做是根节点。根据思维走向，写出代码段(i):

```js
function printPreTree(root) {
  function swrap(node) {
    let result = []
    let stack = []
    while (stack.length || node) {
      while (node) {
        result.push(node.val)
        stack.push(node)
        node = node.right
      }
      if (stack.length) {
        let current = stack.pop()
        node = current.right
      }
    }
    return result
  }

  return swrap(root)
}
```

### 中序打印

```js
function printMidTree(root) {
  function swrap(node, list) {
    if (!node) {
      return
    }
    swrap(node.left, list)
    list.push(node.val)
    swrap(node.right, list)
  }
  let result = []
  swrap(root, result)
  return result
}
```

```js
function printMidTree(root) {
  function swrap(node) {
    let result = []
    let stack = []
    while (stack.length || node) {
      while (node) {
        stack.push(node)
        node = node.left
      }
      if (stack.length) {
        let current = stack.pop()
        result.push(current.val)
        node = current.right
      }
    }
    return result
  }

  return swrap(root)
}
```

### 后序打印

```js
function printLastTree(root) {
  function swrap(node, list) {
    if (!node) {
      return
    }
    swrap(node.left, list)
    swrap(node.right, list)
    list.push(node.val)
  }
  let result = []
  swrap(root, result)
  return result
}
```

后序遍历递归定义：先左子树，后右子树，再根节点。
　　后序遍历的难点在于：需要判断上次访问的节点是位于左子树，还是右子树。若是位于左子树，则需跳过根节点，先进入右子树，再回头访问根节点；若是位于右子树，则直接访问根节点。直接看代码，代码中有详细的注释。

```js
function printLastTree(root) {}
```
