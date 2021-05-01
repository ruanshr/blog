# 0,1,2,...,n 这 n+1 个数中选择 n 个数，找出这 n 个数中缺失的那个数

```js
function findMissNumber(a) {
  if (!a.length) {
    return 0
  }
  let len = a.length
  let left = 0
  let right = len
  while (left < right) {
    let mid = left + Math.floor((right - left) / 2)
    if (a[mid] === mid) {
      left = mid + 1
    } else {
      right = mid
    }
  }
  return left
}
```
