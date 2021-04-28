# 翻转二叉树

```js

function investBinaryTree(node) {

    function swrap(node) {
        if(!node) {
            return 
        }
        // 快速交换方法
        // let m = 7; 
        // let n = 8;
        // [n, m] = [m, n]
        // console.log(m, n)
        [node.right, node.left ] = [node.left, node.right]
        swrap(node.left)
        swrap(node.right)
    }
    swrap(node)
} 

```