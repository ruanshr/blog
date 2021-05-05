# 根据一棵树的前序遍历和中序遍历构造二叉树

前序遍历 [3, 9, 20, 15, 7] // root left right
中序遍历 [9, 3, 15, 20, 7] // left root right

```js
function TreeNode(val) {
  this.val = val
  this.left = this.right = null
}

function buildTree(preOrder, midOrder) {
  if (!preOrder.length || !midOrder.length) {
    return
  }

  let root = preOrder[0]
  let node = new TreeNode(root)
  let rootMidIndex = midOrder.findIndex(item => item === root)

  node.left = buildTree(preOrder.slice(1, rootMidIndex + 1), midOrder.slice(0, rootMidIndex))

  node.right = buildTree(preOrder.slice(rootMidIndex + 1), midOrder.slice(rootMidIndex + 1))
  return node
}

//
let preOrder = [3, 9, 20, 15, 7]
let midOrder = [9, 3, 15, 20, 7]

buildTree(preOrder, midOrder)
```
