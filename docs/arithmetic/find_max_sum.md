# 数组里找出最大的连续子数组和 （最大子序列）

[1, 2, -4, 3, -1, 5, 6, -10]

```js
function findMaxSubArray(arr) {
  let currentSum = 0
  let maxSum = -Number.MAX_VALUE
  let subArr = []
  for (let i = 0; i < arr.length; i++) {
    currentSum = 0
    for (let j = i; j < arr.length; j++) {
      currentSum = currentSum + arr[j]
      if (maxSum < currentSum) {
        maxSum = currentSum
        subArr = arr.slice(i, j)
      }
    }
  }
  return {
    maxSum,
    subArr
  }
}

var arr = [1, 2, -4, 3, -1, 5, 6, -10]
findMaxSubArray(arr)
```

```js
function findMaxSumArray(arr) {
  let max = -Number.MAX_VALUE
  let sum = 0
  let idx = 0
  let subArr = []
  for (let i = 0; i < arr.length; i++) {
    if (sum < 0) {
      sum = arr[i]
      idx = i
    } else {
      sum += arr[i]
    }
    if (max < sum) {
      max = sum
      subArr = arr.slice(idx, i + 1)
    }
  }

  return {
    max,
    subArr
  }
}
```
