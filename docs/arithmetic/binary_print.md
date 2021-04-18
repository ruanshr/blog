# 打印二叉树（先序，中序，后序）


### 先序打印

```js


function printPreTree(root) {
    function swrap(node, list) {
        if(!node) {
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

### 中序打印

```js

function printMidTree(root) {
   function swrap(node, list) {
        if(!node) {
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


### 后序打印

```js

function printLastTree(root) {
   function swrap(node, list) {
        if(!node) {
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


````