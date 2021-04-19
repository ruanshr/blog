---
prev: /javascript-extend/event-loop
next: /javascript-extend/history
---


# 实现ES6用for...of遍历对象，编写iterator接口


我们都知道for...of是ES6新增的遍历数组和字符串的方法，唯有对象不能遍历，由于对象里面的数据比较复杂，不能使用索引取到响应的值，for...of 实现的原理是调用iterator接口，现在我们就用自己编写一个遍历对象的接口

```js

let obj = {
    name: '张三',
    age: 23,
    [Symbol.iterator]() {
        let self = this
        let index = 0
        let arr = Object.keys(self)
        let len = arr.length
        return {
            next() {
                let key = arr[index++]
                let value = self[key]
                return {
                    value: [key, value],
                    done: index <= len        // true 的时候终止迭代
                }
            }
        }
    }
}

```