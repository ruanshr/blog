# 有n级楼梯，有2种爬法，1次1级，或1次2级，问，n级楼梯有多少种爬法？


```js

function jumpStepFibonacci(n) {
    if(n < 0) {
        return -1
    }
    if(n < 2) {
        return n
    }

    return jumpStepFibonacci(n - 1) + jumpStepFibonacci(n - 2)
}
```


```js

function jumpStepFibonacci(n) {
    if( n < 0) {
        return -1
    }
    if( n <= 2) {
        return n
    }
    let result = [1,2]
    for(let i = 2;i < n;i++) {
        const [a,b] = result
        result = [ b, a + b]
    }
    return result[1]
}

```