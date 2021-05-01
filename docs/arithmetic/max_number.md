#  正整数A和正整数B 的最小公倍数是指 能被A和B整除的最小的正整数值，设计一个算法，求输入A和B的最小公倍数。

```js

function gys(a,b){
    let result = 1
    for(let i = 1; i< a && i < b; i++) {
        if(a % i === 0 && b % i === 0){
            result = i
        }
    }
    return result
}

function gbs(a, b){
    let n = gys(a,b)
    return a * b / n
}

```