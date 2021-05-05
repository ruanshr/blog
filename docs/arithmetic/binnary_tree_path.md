# 二叉树路径和

```js
function binnaryTreePathSum(root) {
  let paths = []
  function getPath(node, pathList) {
    if (!node) {
      return
    }
    pathList.push(node.value)
    if (!node.left && !node.right) {
      paths.push(pathList.join(''))
      pathList.pop()
      return
    }
    if (node.left) {
      getPath(node.left, pathList)
    }
    if (node.right) {
      getPath(node.right, pathList)
    }
    pathList.pop()
  }
  getPath(root, [])
  return paths.map(p => Number(p)).reduce((a, b) => a + b, 0)
}
```
