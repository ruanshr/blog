# 从给定的无序、不重复的数组 data 中，取出 n 个数，使其相加和为 sum。并给出算法的时间/空间复杂度

回溯法

```js
function getResult(data, n, sum) {
  function insertSort(array) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i; j > 0; j--) {
        if (arr[j] < arr[j - 1]) {
          ;[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
        } else {
          break
        }
      }
    }
    return array
  }
  function getAllCombine(array, n, sum, temp) {
    if (temp.length === n) {
      if (temp.reduce((a, b) => a + b) === sum) {
        return temp
      } else {
        return false
      }
    }
    for (let i = 0; i < array.length; i++) {
      const current = array.shift()
      temp.push(current)
      const result = getAllCombine(array, n, sum, temp)
      if (result) {
        return result
      }
      array.push(temp.pop())
    }
  }
  const array = insertSort(data)
  return getAllCombine(array, n, sum, [])
}
```
