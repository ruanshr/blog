# K 个一组翻转列表

```js
function convertArray(array, k) {
  let len = array.length
  for (let i = 0; i < Math.floor(len / k); i++) {
    let left = i * k
    let right = i * k + k - 1
    while (left < right) {
      [array[right], array[left]] = [array[left], array[right]]
      left++
      right--
    }
  }
  return array
}
```
