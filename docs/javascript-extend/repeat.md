# repeat 实现 使用JS实现一个repeat 方法

function repeat(func, times, wait) {}

repeatLog = repeat(console.log, 3, 1000)

repeatLog('hello')


```js

function repeat(func, times, wait) {
    return (...args) => {
        for(let i = 0;i < times; i++) {
            setTimeout(() => {
                func.apply(null, args)
            }, i*wait)
        }
    }
}


var repeatLog = repeat(console.log, 3, 1000)

repeatLog('hello')

```
