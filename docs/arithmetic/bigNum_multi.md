# 以字符串的形式读入两个数字，编写一个函数计算它们的乘积，以字符串形式返回。

```js
function bigNumMulti(m, n) {
  if (m.length < n.length) {
    ;[n, m] = [m, n]
  }
  let a = m.length
  let b = n.length
  let container = []
  for (let i = 0; i < a; i++) {
    let t1 = m[i]
    for (let j = 0; j < b; j++) {
      let t2 = n[j]
      let pre = container[i + j]
      let num = t1 * t2
      container[i + j] = pre ? pre + num : num
    }
  }
  let result = []
  let overNum = 0
  for (let k = container.length - 1; k >= 0; k--) {
    let temp = container[k]
    temp = temp + overNum
    overNum = parseInt(temp / 10)
    result.unshift(temp % 10)
  }
  if (overNum) {
    result.unshift(overNum)
  }
  return result.join('')
}
```

```js
// function bigNumMulti(m, n) {
//   if (m.length < n.length) {
//     ;[n, m] = [m, n]
//   }
//   const a = m.length
//   const b = n.length
//   const container = Array(a).fill(0)
//   for (let i = 0; i < a; i++) {
//     let count = 0
//     let j = 0
//     while (i - j >= 0) {
//       if (i - j <= b) {
//         count += m[j] * n[i - j]
//       }
//       j++
//     }
//     container[i] = count
//   }
//   container.push(m[a - 1] * n[b - 1])
//   let result = []
//   let overNum = 0
//   for (let k = container.length - 1; k >= 0; k--) {
//     let temp = container[k]
//     temp = temp + overNum
//     overNum = parseInt(temp / 10)
//     result.unshift(temp % 10)
//   }
//   if (overNum) {
//     result.unshift(overNum)
//   }
//   return result.join('')
// }
```
