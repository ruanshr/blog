# 找出有序数组中和为 sum 的两个数

```js
function findSumArray(arr, sum) {
  let i = 0
  let j = arr.length - 1
  while (i < j) {
    let pre = arr[i]
    let last = arr[j]
    let res = pre + last
    if (res === sum) {
      return [pre, last]
    }
    if (res < sum) {
      i++
    }
    if (res < sum) {
      j--
    }
  }
  return []
}
```
