# 拉伯数字转罗马数字

```js
function convert(num) {
  const aArray = [1000, 500, 100, 50, 10, 5, 1]
  const rArray = ['M', 'D', 'C', 'L','X', 'V', 'I']
  let str = ''
  for (let i = 0; i < aArray.length; i++) {
    while (num >= aArray[i]) {
      str += rArray[i]
      num -= aArray[i]
    }
  }
  return str
}
```
