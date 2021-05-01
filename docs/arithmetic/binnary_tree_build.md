# 构建二叉搜索树

[11,5,15,5,3,9,8,10,13,12]

```js


function BinnarySearchTree() {
    var Node = function(value) {
        this.value = value
        this.left = null
        this.right = null
    }
    this.root = null

    var insertNode = function(node, newNode) {
        if(node.value > newNode.value) {
            if(node.left === null) {
                node.left = newNode
            } else {
                insertNode(node.left, newNode)
            }
        } else {
            if(node.right === null) {
                node.right = newNode
            } else {
                insertNode(node.right, newNode)
            }
        }
    }

    this.insert = function(value) {
        var node = new Node(value)
        if(this.root === null) {
            this.root = node
        } else {
            insertNode(this.root, node)
        }
    }

}

var tree = new BinnarySearchTree()

var treeNodes = [11,5,15,5,3,9,8,10,13,12]
treeNodes.forEach(v => {
    tree.insert(v)
})


```
