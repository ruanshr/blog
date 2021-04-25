# 从给定的无序、不重复的数组data中，取出n个数，使其相加和为sum。并给出算法的时间/空间复杂度

```js


function getResult(data, n, sum) {

    function getAllCombine(array, n, sum, temp) {
        if(temp.length === n) {
            debugger
            if(temp.reduce((a, b) => a + b) === sum) {
                return temp
            } else {
                return false
            }
        }
        for(let i = 0; i < array.length ;i++) {
            const current = array.shift()
            temp.push(current)
            const result = getAllCombine(array, n, sum, temp)
            if(result) {
                return result
            }
            array.push(temp.pop())
        }
    }

    return getAllCombine(data, n, sum, [])
}