# 打印二叉树左视图，右视图

```js

function leftSideView(root) {
    if(!root) {
        return []
    }
    const result = []
    dfs(root, 0, result)
    return result
}

function dfs(node, depth, res) {
    if(node) {
        // 数组长度等于当前 深度 时, 把当前的值加入数组
        if(depth === res.length) {
            res.push(node.val)
        }
        // 先从左边开始, 当左边没了, 再轮到右边
        dfs(node.left, depth + 1, res)
        dfs(node.right, depth + 1, res)
    }
}

```


```js


function rightSideView(root) {
    if(!root) {
        return []
    }
    const result = []
    dfs(root, 0 result)
    return result
}


function dfs(node, depth, res) {
    if(node) {
        // 数组长度等于当前 深度 时, 把当前的值加入数组
        if(depth === res.length) {
            res.push(node.val)
        }
        // 先从右边开始, 当右边没了, 再轮到左边
        dfs(node.right, depth + 1, res)
        dfs(node.left, depth + 1, res)
    }
}
```