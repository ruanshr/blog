# 无重复字符的最长子串

给定一个字符串，请你找出其中不含有重复字符的最长子串的长度


```js

function lengthOfLongestSubstring(str) {
    let max = 0
    let left = 0
    let hash = {}
    let sub = ''
    for(let i = 0;i < str.length; i++) {
        let v = str[i]
        if(hash[v] >= left) {
            if(!sub) {
                sub = str.substr(left, i + 1)
            }
            left = hash[v] + 1
        }
        hash[v] =  i
        let len = i - left + 1
        if( max < len) {
            max = len
            sub = str.substr(left, i)
        }

    }
    return { max, sub }
}

```