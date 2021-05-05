# 找出字符串中最长重复的子串

```js

function findSubString(str, substr) {
    let strlen = str.length
    let substrlen = substr.length
    for(let i = 0; i < strlen - substr.length + 1; i++){
        if(str.slice(i, i + substrlen) === substr) {
            return true
        }
    }
    return false
    // return str.indexOf(substr) > -1
}

function findRepeatLongestStr(str) {
    let len = str.length
    let maxSubLen = Math.floor(len / 2)
    for(let i = 0; i < maxSubLen; i++) {
        let j = 0
        let subLen = maxSubLen - i
        while(j + subLen <= len) {
            let tempstr = str.slice(j, j + subLen)
            if(findSubString(str.slice(j + subLen), tempstr) {
                return tempstr
            }
            j++
        }
    }
    return ''
}

// 最多重复的则存起来
```
