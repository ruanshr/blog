# JavaScript 里的奇葩知识

### 1、Function.prototype 竟然是个函数类型，而自定义函数的原型却是对象类型

```js
typeof Function.prototype === 'function' // true

function Person() {}

typeof Person.prototype === 'object' // true
```

### 2、一个变量不等于自身

```js
const x = NaN

x !== x // true
```

这是目前为止 js 语言中唯一的一个不等于自己的数据。为什么？因为 NaN 代表的是一个范围，而不是一个具体的数值。 在早期的 isNaN() 函数中，即使传入字符串，也会返回 true ，这个问题已经在 es6 中修复。

```js
isNaN('abc') // true
Number.isNaN('abc') // false
```

### 3、构造函数如果 return 了新的数据

```js
// 不返回
function People() {}
const people = new People() // People {}

// 返回数字
function People() {
  return 1
}
const people = new People() // People {}

// 返回新对象
function Animal() {
  return {
    hello: 'world'
  }
}
const animal = new Animal() // { hello: 'world' }
```

在实例化构造函数时，返回非对象类型将不生效

### 4、.call.call 到底在为谁打 call？

```js
function fn1() {
  console.log(1)
}

function fn2() {
  console.log(2)
}

fn1.call.call(fn2) // 2
```

所以 fn1.call.call(fn2) 等效于 fn2.call(undefined)。而且无论您加多少个 .call，效果也是一样的。

### 5、实例后的对象也能再次实例吗？

```js
function People() {}

const lili = new People() // People {}
const lucy = new lili.constructor() // People {}
```

因为 lili 的原型链指向了 People 的原型，所以通过向上寻找特性，最终在 Peopel.prototype 上找到了构造器即 People 自身

### 6、setTimeout 嵌套会发生什么奇怪的事情？

```js
console.log(0, Date.now())

setTimeout(() => {
  console.log(1, Date.now())
  setTimeout(() => {
    console.log(2, Date.now())
    setTimeout(() => {
      console.log(3, Date.now())
      setTimeout(() => {
        console.log(4, Date.now())
        setTimeout(() => {
          console.log(5, Date.now())
          setTimeout(() => {
            console.log(6, Date.now())
          })
        })
      })
    })
  })
})
```

在 0-4 层，setTimeout 的间隔是 1ms ，而到第 5 层时，间隔至少是 4ms 。

### 7、es6 函数带默认参数时将生成声明作用域

```js
var x = 10

function fn(
  x = 2,
  y = function() {
    return x + 1
  }
) {
  var x = 5
  return y()
}

fn() // 3
```

### 8、函数表达式（非函数声明）中的函数名不可覆盖

```js
const c = function CC() {
  CC = 123
  return CC
}

c() // Function
```

当然，如果设置 var CC = 123 ，加声明关键词是可以覆盖的。

### 9、严格模式下，函数的 this 是 undefined 而不是 Window

```js
// 非严格
function fn1() {
  return this
}
fn1() // Window

// 严格
function fn2() {
  'use strict'
  return this
}
fn2() // undefined
```

对于模块化的经过 webpack 打包的代码，基本都是严格模式的代码。

### 10、取整操作也可以用按位操作

```js
var x = 1.23 | 0 // 1
```

### 11、indexOf() 不需要再比较数字

```js
const arr = [1, 2, 3];

// 存在，等效于 > -1
if (～arr.indexOf(1)) {

}

// 不存在，等效于 === -1
!~arr.indexOf(1);

```

按位操作效率高点，代码也简洁一些。也可以使用 es6 的 includes() 。但写开源库需要考虑兼容性的道友还是用 indexOf 比较好

### 12、getter/setter 也可以动态设置吗？

```js
class Hello {
  _name = 'lucy'

  getName() {
    return this._name
  }

  // 静态的getter
  get id() {
    return 1
  }
}

const hel = new Hello()

hel.name // undefined
hel.getName() // lucy

// 动态的getter
Hello.prototype.__defineGetter__('name', function() {
  return this._name
})

Hello.prototype.__defineSetter__('name', function(value) {
  this._name = value
})

hel.name // lucy
hel.getName() // lucy

hel.name = 'jimi'
hel.name // jimi
hel.getName() // jimi
```

### 13、0.3 - 0.2 !== 0.1

```js
0.3 - 0.2 !== 0.1 // true
```

浮点操作不精确，老生常谈了，不过可以接受误差

0.3 - 0.2 - 0.1 <= Number.EPSILON // true

### 14、class 语法糖到底是怎么继承的？

```js
function Super() {
  this.a = 1
}

function Child() {
  // 属性继承
  Super.call(this)
  this.b = 2
}
// 原型继承
Child.prototype = new Super()

const child = new Child()
child.a // 1
```

正式代码的原型继承，不会直接实例父类，而是实例一个空函数，避免重复声明动态属性

```js
const extends = (Child, Super) => {
  const fn = function() {}

  fn.prototype = Super.prototype
  Child.prototype = new fn()
  Child.prototype.constructor = Child
}
```

### 15、es6 居然可以重复解构对象

```js
const obj = {
  a: {
    b: 1
  },
  c: 2
}

const {
  a: { b },
  a
} = obj
```

一行代码同时获取 a 和 a.b 。 在 a 和 b 都要多次用到的情况下，普通人的逻辑就是先解构出 a，再在下一行解构出 b

### 16、判断代码是否压缩

```js
function CustomFn() {}

const isCrashed = typeof CustomFn.name === 'string' && CustomFn.name === 'CustomFn'
```

### 17、对象 === 比较的是内存地址，而 &gt;&eq; 将比较转换后的值

```js

{} === {} // false

// 隐式转换 toString()
{} >= {}  // true

```

### 18、intanceof 的判断方式是原型是否在当前对象的原型链上面

```js
function People() {}
function Man() {}
Man.prototype = new People()
Man.prototype.constructor = Man

const man = new Man()
man instanceof People // true

// 替换People的原型
People.prototype = {}
man instanceof People // false
```

如果您用 es6 的 class 的话，prototype 原型是不允许被重新定义的，所以不会出现上述情况

### 19、Object.prototype.**proto**

```js
Object.prototype.__proto__ === null // true
```

这是原型链向上查找的最顶层，一个 null

### 20、parseInt 太小的数字会产生 bug

```js
parseInt(0.0000009) // 9
parseInt(0.00000000454) // 4
parseInt(10.23) // 10
```

### 21、null 与 undefined

```js
1 + null // 1
1 + undefined // NaN

Number(null) // 0
Number(undefined) // NaN
```

### 22、arguments 和形参是别名关系

```js
function test(a, b) {
  console.log(a, b) // 2, 3

  arguments[0] = 100
  arguments[1] = 200

  console.log(a, b) // 100, 200
}
test(2, 3)
```

但是您可以用 use strict 严格模式来避免这一行为，这样 arguments 就只是个副本了

### 23、void 是个固执的老头

```js
void 0 === undefined // true
void 1 === undefined // true
void {} === undefined // true
void 'hello' === undefined // true
void void 0 === undefined // true
```

### 24、try/catch/finally 也有特定的执行顺序

```js
function fn1() {
  console.log('fn1')
  return 1
}

function fn2() {
  console.log('fn2')
  return 2
}

function getData() {
  try {
    throw new Error('')
  } catch (e) {
    return fn1()
  } finally {
    return fn2()
  }
}

console.log(getData())

// 打印顺序: 'fn1', 'fn2', 2
```

在 try/catch 代码块中，如果碰到 return xxyyzz; 关键词，那么 xxyyzz 会先执行并把值放在临时变量里，接着去执行 finally 代码块的内容后再返回该临时变量。 如果 finally 中也有 return aabbcc ，那么会立即返回新的数据 aabbcc 。

### 25、是否存在这样的变量 x ，使得它等于多个数字？

```js
const x = {
  value: 0,
  toString() {
    return ++this.value
  }
}

x == 1 && x == 2 && x == 3 // true
```

通过隐式转换，这样不是什么难的事情

### 26、clearTimeout 和 clearInterval 可以互换~~~~使用吗

```js
var timeout = setTimeout(() => console.log(1), 1000)
var interval = setInterval(() => console.log(2), 800)

clearInterval(timeout)
clearTimeout(interval)
```

是的。大部分浏览器都支持互相清理定时器，但是建议使用对应的清理函数

### 27、下面的打印顺序是？

```js
setTimeout(() => {
  console.log(1)
}, 0)

new Promise(resolve => {
  console.log(2)
  resolve()
}).then(() => console.log(3))

function callMe() {
  console.log(4)
}

;(async () => {
  await callMe()
  console.log(5)
})()

```

答案是：2, 4, 3, 5, 1

主线任务：2，4

微任务：3，5

宏任务：1

### 28、null 是 object 类型，但又不是继承于 Object ，它更像一个历史遗留的 bug 。鉴于太多人在用这个特性，修复它反而会导致成千上万的程序出错。

```js
typeof null === 'object' // true
Object.prototype.toString.call(null) // [object Null]
null instanceof Object // false
```
