# 重复的数字

有一个长度为N + 1 的整数数组，其中的元素取值范围是 1...N(包含1和N)，并且元素取值覆盖1...N(包含1和N)编程找到重复的数字


```js

function findRepeatNum(arr) {
    let hash = {}
    for(let num of arr) {
        if(hash[num] !== undefined) {
            return num
        }
        hash[num] = true
    }

}

function findRepeatNum2(arr) {
    for(let i = 0; i < arr.length; i++) {
        const num = arr[i]
        if(arr.indexOf(num) !== i) {
            return num
        }
    }

}

````