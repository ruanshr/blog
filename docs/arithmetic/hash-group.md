# 字母异位词分组

给定一个字符串数组，将字母异位词组合在一起，字母异位词指定字母相同，但排列不同的字符串。

示例

输入 ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']

输出

[
    ['ate', 'eat', 'tea'],
    ['nat', 'tan'],
    ['bat']
]

```js

function groupAnagrams(strs) {
    let hash = {}
    for(let str of strs) {
        let key = [ ...str ].sort().join()
        if(hash[key] === undefined) {
            hash[key] = []
        }
        hash[key].push(str)
    }
    return Object.keys(hash).map(key => hash[key])
}

```