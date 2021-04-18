# 根据一棵树的中序遍历和后序遍历构造二叉树

前序遍历 [3, 9, 4, 20, 15, 7]  // root left right
后序遍历 [4, 9, 15, 7, 20, 3]  // left right root



```js


function TreeNode(val) {
    this.val = val
    this.left = this.right = null
}


function buildTree(midOrder, lastOrder) {
    if(!midOrder.length || !lastOrder.length) {
        return 
    }
    let root = lastOrder[lastOrder.length - 1]
    let node = new TreeNode(root)
    let rootMidIndex = midOrder.findIndex(item => item === root )

    node.left = buildTree(midOrder.slice(0, rootMidIndex), lastOrder.slice(0, rootMidIndex))

    node.right = buildTree(midOrder.slice(rootMidIndex + 1),  lastOrder.slice(rootMidIndex, lastOrder.length - 1))
    return node
}



//
let midOrder = [9, 4, 3, 15, 20, 7]
let lastOrder = [4, 9, 15, 7, 20, 3]

buildTree(midOrder, lastOrder)

```