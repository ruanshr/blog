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

当容器元素及嵌套元素，即在捕获阶段又在冒泡阶段，调用事件处理程序时; 事件按DOM事件流的顺序执行时间处理程序

- 父级捕获

- 子级捕获

- 子级冒泡

- 父级冒泡

且当事件处于目标阶段时，事件调用顺序决定于绑定事件的书写顺序，按上面的例子为，先调用冒泡阶段的事件处理程序，再调用捕获阶段的事件处理程序。依次alert出“子级捕获”，“子级冒泡”

IE 兼容

attchEvent('on' + type, handler)

detachEvent('on' + type, handler)

### 事件是如何实现的。

基于发布订阅模式，就是在浏览器加载的时候会读取事件相关的代码，但是只有实现等到具体的事件触发的时候才会执行。

比如点击按钮，这是个事件（Event）,而复杂处理事件的代码段通常被称为事件处理程序（Event handler）也就是起到对话框的显示这个动作


在Web端，我们常见的就是DOM事件

- DOM级事件，直接在html元素上绑定on-event,比如onclick，，取消的话，dom.onclick = null ,同一个事件只能有一个处理程序，后面的会覆盖前面的

- DOM2级事件，通过addEventListener注册事件，通过removeEventListener来删除事件，一个事件可以有多个事件处理程序，按顺序执行，捕获事件和冒泡事件

- DOM3级事件，增加了事件类型，比如UI事件，焦点事件，鼠标事件


### new -个函数发生了什么

构造调用

- 创建一个全新的对象

- 这个对象会被执行[[prototype]] 连接，将这个新对象的[[Prototype]]连接到这个构造函数prototype所指向的对象

- 这个新对象会绑定到函数调用的this

- 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象

###  new 一个构造函数，如果函数返回return {}、return null、return 1、 return true会发生什么情况

如果函数返回一个对象，那么new这个函数调用返回这个函数的返回对象，否则返回new 创建的新对象


### Symbol 有什么用处

可以用来表示一个独一无二的变量防止命名冲突

还可以利用symbol不被常规的方法（除了Object.getOwnPropertySymbols外）遍历到，所以可以用来模拟私有变量

symbol有内置的常量

可以用来提供遍历接口，实现了symbol.iterator的对象才可以使用for...of循环，可以统一处理数据结构。调用之后返回一个遍历器对象，包含一个next方法
,使用next方法后有两个返回值value和done分别表示函数当前执行的位置的值和是否遍历完毕

Symbol.for() 可以在全局访问symbol


### 闭包是什么

闭包是指由权访问另外一个函数作用域中的变量的函数

Javascript代码的整个执行过程，分为两个阶段，代码编译阶段与代码执行阶。编译阶段有编译器完成，将代码翻译成可执行代码，这个阶段作用域规则会确定。执行阶段由引擎完成，主要任务是执行科执行代码，执行上下文在这个阶段创建。

> 什么是作用域？

ES5中只存在两种作用域：全局作用域和函数作用域。在Javascript中，我们将作用域定义为一套规则，这套规则用来管理引擎如何在当前作用域已经嵌套子作用域中根据标识符名称进行变量（变量名或者函数名）查找

> 什么是作用域链

首先要了解作用域链，当访问一个变量时，编译器会在执行这段代码时，会首先从当前的作用域中查找是否有这个标识符，如果没有找到，就会去父作用域查找，如果父作用域还没有找到继续向上查找，直到全局作用域为止，而作用域链，就是有当前作用域与上层作用域的一系列变量对象组成，它保证了当前执行的作用域对符合访问权限的变量和函数的有序访问

> 闭包产生的本质

当前环境中存在指向父级作用域的引用

> 什么是闭包

闭包是一种特殊的对象，它由两部分组成：执行上下文（A），以及在该执行上下文中创建的函数（B），当B执行时，如果访问了A中的变量对象的值，那么闭包就会产生，且在Chrome中使用这个执行上下文A的函数名代指闭包

> 一般如何产生闭包

- 返回函数

- 函数当做参数传递

> 闭包的应用场景

柯里化

模块


### NaN是什么，用typeof会输出什么

not a number，表示为数字，typeof NaN === 'number'

### Js隐式转换，显示转换

一般非基础类型进行转换时会先调用valueOf，如果valueOf无法返回基础类型，就会调用toString

> 字符串和数字

“+”操作符，如果有一个为字符串，那么都转化到字符串然后执行字符串拼接
“-”操作符，转化为数字，相减（-a, a*1, a/1）都能进行隐式强制转换

```js
[] + {}  // [object Object]
{} + []  // 0 因为花括号右边和特殊符号连接会隐式加“;” ({}) + [] 为 [object Object]  
[] - {}  // NaN
{} - []  // -0 因为花括号右边和特殊符号连接会隐式加“;”
```

> 布尔值到数字

1 + true = 2
1 + false = 1

> 转换为布尔值

- for中第二个

- while

- if

- 三元表达式

- ||（逻辑或） && （逻辑与） 左边的操作数

> 宽松相等和严格相等

宽松相等允许进行强制类型转换，而严格相等不允许

> 字符串与数字

转换为数字然后比较

> 其他类型与布尔类型

先把布尔类型转换为数字，然后继续进行比较

> 其他类型与布尔类型

先把布尔类型转换为数字，然后继续进行比较

> 对象与非对象

执行对象的toPrimitive对象，然后继续进行比较

> 假值列表

undefined， null， false， +0 ， -0， NaN， ""

### 了解this吗？bind,call,apply具体指什么

他们都是函数的方法 隐式绑定，显式绑定

> 手写bind, apply, call方法

```js

Function.prototye.call = function call(context, ...args) {
    context = context || window
    const  fnSymbol = Symbol('fnCall')
    context[fnSymbol] = this
    context[fnSymbol](...args)
    delete context[fnSymbol]
}

Function.prototype.apply = function apply(context, args) {
    context = context || window
    const fnSymbol = Symbol('fnApply')
    context[fnSymbol] = this
    context[fnSymbol](...args)
    delete context[fnSymbol]
}

Function.prototype.bind = function bind(context, ...args) {
    context = context || window
    const fnSymbol = Symbol('fnBind')
    context[fnSymbol] = this
    return function (...tempArgs) {
        args =args.concat(tempArgs)
        context[fnSymbol](...args)
        delete context[fnSymbol]
    }
}

```

### setTimeout(fn,0) 多久才执行，Event Loop

setTimeout按照顺序放到队列里面，然后等待函数调用栈情况之后才开始执行，而这些操作进入队列的顺序，则由设定的延迟时间来决定


### Promise 原理

```js

class MyPromise{
    constructor(fn) {
        this.state = 'PENDING'
        this.value = ''
        this.resolvedCallbacks = []
        this.rejectedCallbacks = []
        fn(this.resolve.bind(this), this.reject.bind(this))
    }

    resolve(value) {
      if(this.state === 'PENDING') {
          this.state = 'RESOLVED'
          this.value = value
          this.resolvedCallbacks.map(cb => cb(value))
      }

    }

    reject(value) {
        if(this.state === 'PENDING') {
            this.state = 'REJECTED'
            this.value = value
            this.rejectedCallbacks.map(cb => cb(value))
        }
    }

    then(onFulfilled, onReject) {
        if(this.state === 'PENDING') {
            this.resolvedCallbacks.push(onFulfilled)
            this.rejectedCallbacks.push(onReject)
        }
        if(this.state === 'RESOLVED') {
            if(typeof onFulfilled === 'function'){
                onFulfilled(this.value)
            }
        }

        if(this.state === 'REJECTED') {
            if(typeof onReject === 'function'){
                onReject(this.value)
            }
        }
        return this
    }
}
```


### js脚本加载问题， async、defer问题

- 如何依赖其他脚本和DOM结果，使用defer
- 如果与DOM和其他脚本依赖不强时，使用async

### 如何判断一个对象是不是空对象

Object.keys(obj).length === 0

### &lt;script src='xxx' xxx /&gt;外部js文件先加载还是onload先执行，为什么

onload是所有加载完成之后执行的

### 如何加事件监听

onclick, addEventListener

### 说一下原型链与原型链的继承


### 说一下对JS的了解吧

是基于原型的动态语言，主要独特特性有this，原型和原型链

JS严格意义上来说分为： 语言标准不符（ECMAScript） + 宿主环境部分

> 语言标准部分

2015年发布ES6，引入诸多新特性使得能够编写大小项目变成可能，标准自2015年以年号代码，每年一更

> 宿主环境部分

在浏览器宿主环境包括DOM + BOM等

在node,宿主环境包括以下文件、数据库、网络、与操作系统的交互


### 数组能够调用的函数有哪些

push、pop、shift、unshift、slice、splice、sort、find、findIndex、every、some、map、filter、reduce
原型链上的方法 toString， valueOf

### 如何判断数组类型

Array.isArray

### 函数中arguments是数组吗？类数组转数组的方法？

是类数组，属于鸭子类型的范畴，长得像数组

- ...运算符

- Array.from

- Array.prototype.slice.call(arguments)

### 用过typescript吗？它的作用是什么

为JS添加类型支持，以及提供最新版的ES语法的支持，是利于团队协作和排错，开发大型项目



### ES6之前使用过prototype实现继承


### 如果一个构造函数，bind了一个对象，用这个构造函数创建出的实例会继承这个对象的属性吗？为什么

不会继承，因为根据this绑定四大规则，new绑定的优先级高于bind显示绑定，通过new进行构造函数调用时，会创建一个新对象，这个对象会代替bind的对象绑定，作为此函数的this，并且在此函数没有返回对象的情况下，返回这个新建的对象

### 箭头函数和普通函数有什么区别？箭头函数能当构造函数吗？

普通函数通过function关键字定义，this无法结婚吃饭作用域使用，在运行时绑定，只取决于函数的调用方式，在哪里被调用，调用位置（取决于调用者，和是否独立运行）

箭头函数使用被称为“胖箭头”的操作=>定义，箭头函数不应用普通函数this绑定的四种规则，而是根据外层（函数或全局）的作用域来决定this，且箭头函数的绑定无法被修改（new 也不行）

一个函数内部有两个方法[[Call]] 和 [[Construct]]，在通过new进行函数调用时，会执行[[Construct]] 方法，创建一个实例对象，然后再执行这个函数体，将函数的this绑定在这个实例对象上

当自己调用时，执行[[Call]] 方法，直接执行函数体

箭头函数没有[[Construct]] 方法，不能被用作钩子函数调用，当使用new进行函数调用时会报错

箭头函数常用于回调函数中，包括时间处理器或定时器

箭头函数和var self = this，都是他取代传统的this运行机制，将this的绑定拉回到词法作用域

没有原型，没有this，没有super，没有arguments，没有new.target

不能通过new 关键字调用

### ES6的class？ static 关键字有了解？

为这个类的函数对象直接添加方法，而不是加在这个函数的原型对象上


### 事件循环机制 Event loop

事件循环机制从整体上告诉了我们Javascript代码的执行顺序Event Loop即事件循环，是指浏览器或Node的一种捷径Javascript单线程运行时不会阻塞的一种机制，也就是我们经常使用异步的原理

先执行宏任务队列，然后执行微任务队列，然后开始下一个事件循环，继续先执行宏任务队列，再执行微任务队列

- 宏任务队列

script、setTimeout、setInterval、setImmediate、I/O、UI Render

- 微任务

process.nextTick、Promise

上述的setTimeout和setInterval等都是任务源，真正进入任务队列的是他们分发的任务

> 优先级

setTimeout =  setInterval 一个队列

setTimeout > setImmediate 

process.nextTick > Promise

### 数组扁平化

```js

function flatten(arr) {
    let result = []
    arr.forEach(val => {
        if(Array.isArray(val)) {
            result = result.concat(flatten(val))
        }else {
            result = result.concat(val)
        }
    })
    return result
}


```


### 实现柯里化

为函数预设参数

柯里化是什么？是指这样的一个函数，它接收函数A，并且能够返回一个新的函数，这个新的函数能够处理函数A的剩余参数


```js

function createCurry（func, args) {
    var argity = func.length
    var args = Array.isArray(args) ? args: args ? [args] :[]
    return function (...subArgs) {
        args.push(subArgs)
        if(args.length >= argity) {
            return func.apply(this, args)
        }
        return createCurry.call(this, func, args)
    }
}

```

### 数组去重

```js

Array.from(new Set([1,2,3,1,3]))
```

### let闭包

let会产生临时性死区，在当前的执行上下文中，会进行变量提升，但是未被初始化，所以在执行上下文执行阶段，执行代码如果还没有执行到变量赋值，就引用此变量就会报错，此变量未初始化

### 变量提升

函数在运行的时候，会首先创建执行上下文，然后将执行上下文入栈，然后当执行上下文处于栈顶时，开始运行执行上下文

在创建执行上下文的过程中会做三件事：创建变量对象，创建作用域链，确定this指向，其中创建变量对象的过程中，首先会为arguments创建一个属性，值为arguments，然后会扫码function函数声明，创建一个同名属性，值为函数的引用，接着会扫码var变量声明，创建一个同名属性，值为undefined，这就是变量提升

### instanceof 如何使用

左边可以是任意值，右边只能是函数

从原型链上找构造函数

```js

'hello' instanceof String // false
```