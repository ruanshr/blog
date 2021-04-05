---
prev: /javascript-base/es6-proxy
next: /javascript-base/es2020
---
# ES常用语法总汇

1、声明变量
现在Javascript有三种不同关键字声明变量：var、let、const；在ES6之前使用一直是var,ES6添加了let，const
var 声明的变量作用域为全局作用域
let 声明的变量作用域为块级作用域
const 声明的变量是不允许改变

2、箭头函数

```js
const arr = [1,2,3,4]
const odd = arr.filter(arr => arr%2 === 0)
```

3、字符串拼接

```js

let name = '张三'

let word = `${name}, 你好`

```

4、解构赋值
解构赋值主要用于数组和对象赋值

```js

let obj = {name: 'admin', password: '123456', age: null}

const { name, age = 23, password, sex = 'F' } = obj

console.log(age) // null

```

5、扩展运算符

扩展运算符就是三个点（...）


6、异步编程

Promise

promise有四种状态： fulfiled(成功)、reject（失败）、pending（进行中） 之后现在settled（最终状态）；resolve修改成功状态，reject修改失败状态

Generater

ES6新引入了Generator,generator是一个构造器，函数执行时不会执行函数体的内部而是返回一个构造器对象，通过next方法调用函数主题，遇到yield会暂停执行；常见封装函数库为co

```js

function* genFun() {
   console.log(yield 1)

   console.log(yield 2)

   console.log(yield 3)

}

const gen = genFun()

gen.next()

gen.next()

gen.next()
````


