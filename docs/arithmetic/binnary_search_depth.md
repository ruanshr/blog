# 二叉树的层序遍历

```js
function bfs(root) {
  const result = []
  if (!root) {
    return result
  }
  function walk(node, level, res) {
    if (res.length === level) {
      res.push([])
    }
    res[level].push(node.val)
    if (node.left) {
      walk(node.left, level + 1, res)
    }
    if (node.right) {
      walk(node.right, level + 1, res)
    }
  }
  walk(root, 0, result)
  return result
}
```
