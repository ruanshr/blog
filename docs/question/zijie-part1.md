# 面试题

### 1、Q: 0.1 + 0.2 === 0.3 吗？为什么？
A: javascript 使用Number类型来表示数字（整数或浮点数），遵循IEEE 754标准，通过64位来表示一个数组（1 + 11 + 52）

- 1 符号位，0 表示正数， 1 表示负数
- 11 指数为（e）
- 52 尾数，小数部分（即有效数字）

最大安全数字: Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1 转换成正数就是16位，所以 0.1 === 0.1 是通过toPrecision(16) 去有效位之后，两者是相等的。

在两数相加时，会先转换成二进制， 0.1 和 0.2转换成二进制的时候尾数会发生无限循环，然后进行对阶运算，JS引擎对二进制进行截断，所以造成精度丢失。

所以**精度丢失可能出现在进制转换和对阶运算中**

### JS数据类型

基本类型： Number, Boolean, String , null, undefined, Symbol(ES6 新增的)，BigInt（ES2020） 
引用类型： Object 对象子类型 Array， Function

### JS 整数是怎么表示的？

通过Number 类型来表示，遵循IEEE754标准，通过64位来表示一个整数，（ 1 + 11 + 52 ） 最大安全数字是 Math.pow(2, 53) - 1, 对于16位十进制（符号位 + 指数位 + 小数部分有效位 ）

### Number() 存储空间是多大？ 如果后台发送了一个超过最大自己的数组怎么办

Number.pow(2, 53), 53 为有效数字，会发生截断等于JS能支持的最大数字

###  实现函数能够深度克隆基本类型

```js

function shallowClone(obj) {
    let cloneObj = {}
    for(let i in obj) {
        cloneObjpi = obj[i]
    }
    return cloneObj
}

// 考虑基本类型
// 引用类型
// RegExp、 Date、函数不是JSON安全的
// 会丢失constructor，所有的构造函数都指向Object
// 破解循环引用
function deepClone(obj) {
    var result
    if(typeof obj === 'object' && obj !== null) {
        result = obj instanceof Array ? [] : {}
        for(let i in obj) {
            result[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
        }
    } else {
        result = obj
    }
    return result

}

```

### 事件流

事件流是网页元素接收事件的顺序，“DON2级事件”规定的事件包括三个阶段：
事件捕获阶段、处于目标阶段、事件冒泡阶段。首先发送的事件捕获，为接货事件提供机会，然后是实际的目标接收事件。最后一个阶段是事件冒泡阶段，可以在这个阶段对事件做出响应。虽然捕获阶段在规范中规定不允许响应事件，但是实际上还是会执行，所以有两次机会获得到目标对象

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>事件捕获</title>
</head>
<body>
    <div>
        <p id="parentEle">
            我是父元素
            <span id="childEle">我是子元素</span>
        </p>
    </div>
    <script>
        const $parentEle = document.querySelector('#parentEle')
        const $childEle = document.querySelector('#childEle')
        $parentEle.addEventListener('click', () => {
            console.log('父级 冒泡')
        }, false)

        $parentEle.addEventListener('click', () => {
            console.log('父级 捕获')
        }, true)

        $childEle.addEventListener('click', () => {
            console.log('子级 冒泡')
        }, false)

        $childEle.addEventListener('click', () => {
            console.log('子级 捕获')
        }, true)
    </script>
</body>
</html>


```