# 给定几组有序数组，排序

[1, 2, 4, 7],

[3, 5, 8, 11],

[6, 9, 12, 14],

[10, 13, 15, 16]

```js
var a = [1, 2, 4, 7]
var b = [3, 5, 8, 11]
var c = [6, 9, 12, 14]
var d = [10, 13, 15, 16]

function sum(arr1, arr2) {
  let temp1 = arr1.slice()
  let temp2 = arr2.slice()
  for (let i = 0; i < arr1.length; i++) {
    if (temp1[i] > temp2[0]) {
      temp1.splice(i, 0, temp2.shift())
    }
  }
  return temp1.concat(temp2)
}

sort(sort(a, b), sort(c, d))
```
