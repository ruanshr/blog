# 找出字符串中最长最多重复的子串

```js
function findRepeatestLongestStr(str) {
  let len = str.length
  let maxSubLen = Math.floor(len / 2)
  let result = []
  for (let i = 0; i < maxSubLen; i++) {
    let subLen = maxSubLen - i
    let j = 0
    while (j + subLen <= len) {
      if (str.slice(j + subLen).indexOf(str.slice(j, j + subLen)) > - 1) {
        result.push(str.slice(j, j + subLen))
      }
      j++
    }
  }
  let strList = []
  for (let m = 0; m < result.length; m++) {
    let temp = result[m]
    let obj = strList.find(obj => obj.str === temp)
    if (!obj) {
      strList.push({ str: temp, len: temp.length, repeat: 1 })
    } else {
      obj.repeat += 1
    }
  }
  return strList.reduce(
    (acc, item, index) => {
      return acc.len + acc.repeat > item.len + item.repeat ? acc : item
    },
    { str: '', repeat: 0, len: 0 }
  ).str
}
```
