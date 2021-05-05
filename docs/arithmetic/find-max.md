# 找出 sum 大于等于 target 的最短连续数组的长度 要通过所有测试数据

```js
function getMax(arr, sum) {
  var result = []
  function wrap(arr, sum, temp) {
    let tempSum = 0
    for (let j = temp.length - 1; j >= 0; j--) {
      tempSum = tempSum + temp[j]
      if (tempSum >= sum) {
        result.push(temp.slice())
        temp.splice(0, j + 2)
        return
      }
      // arr.unshift(temp.shift())
    }
    for (let i = 0; i < arr.length; i++) {
      temp.push(arr.shift())
      wrap(arr, sum, temp)
    }
  }
  wrap(arr, sum, [])
  return result
}

var arr = [1, 2, 3, 6, 8, 4, 1, 1, 3]
var sum = 7
const result = getMax(arr, sum)
console.log(result)
```
