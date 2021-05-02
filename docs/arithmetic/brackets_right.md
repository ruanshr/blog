# 判断有“()[]{}”6种括号组成的字符串是否合法


1、所有括号必须闭合
2、左括号必须在正确的位置闭合

```js

function checkBracketsRight(str) {
    const tempArr = ['{','}','[',']','(',')']
    const bracketList = str.split('')
    .filter(s => tempArr.includes(s))
    .map(s => {
       let idx = tempArr.indexOf(s)
       return [1, -1, 2, -2, 3, -3][idx]
    })
    const len = bracketList.length
    if(!len || len % 2 !== 0) {
        return false
    }
    const stack = []
    for(let i = 0; i< len;i++) {
        const bracket = bracketList[i]
        let exist = false
        for(let j = stack.length - 1; j >= 0; j--) {
            const t = stack[j]
            if(bracket + t === 0) {
                exist = true
                stack.splice(j ,1)
                break
            }
        }
        if(!exist) {
            stack.push(bracket)
        }
    }
    return stack.length === 0
}

```