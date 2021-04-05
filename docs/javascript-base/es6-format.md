---
prev: /javascript/dom-api
next: /javascript/es6-proxy
---
# ES6 代码规范

**不再使用 var，而使用 let 和 const 。优先使用 const**

```js
//bad
var a = 1,
  b = 2,
  c = 3
// good
const [a, b, c] = [1, 2, 3]
```

**静态字符串一律使用单引号或反引号，不建议使用双引号。**

**动态字符使用反引号。**

```js
//bad
const a = 'foobar'
const b = 'foo' + a + 'bb'

// good
const a = 'foobar'
const b = `foo${a}bar`
```

**使用字面值创建对象。**

```js
// bad
const item = new Object()

// good
const item = {}

// best

const item = Object.create(null)
```

**使用字面值创建数组。**

```js
// bad
const items = new Array()

// good
const items = []
```

**优先使用解构赋值**

```js
const arr = [1, 2, 3, 4]

// bad
const first = arr[0]
const second = arr[1]

// good
const [first, second] = arr
```

**函数的参数如果是对象的成员，优先使用解构赋值。**

```js
// bad
function getFullName(user) {
  const firstName = user.firstName
  const lastName = user.lastName
}

// good
function getFullName(obj) {
  const { firstName, lastName } = obj
}

// best
function getFullName({ firstName, lastName }) {}
```

**程序化生成字符串时，使用模板字符串代替字符串连接。**

```js
// bad
function sayHi(name) {
  return 'How are you, ' + name + '?'
}

// bad
function sayHi(name) {
  return ['How are you, ', name, '?'].join()
}

// good
function sayHi(name) {
  return `How are you, ${name}?`
}
```

**当你必须使用函数表达式（或传递一个匿名函数）时，使用箭头函数符号。**

```js
// bad
;[1, 2, 3].map(function(x) {
  const y = x + 1
  return x * y
})

// good
;[1, 2, 3].map(x => {
  const y = x + 1
  return x * y
})
```

**如果一个函数适合用一行写出并且只有一个参数，那就把花括号、圆括号和 return 都省略掉。如果不是，那就不要省略。**

```js
// good
;[1, 2, 3].map(x => x * x)

// good
;[1, 2, 3].reduce((total, n) => {
  return total + n
}, 0)
```

**总是使用 class。避免直接操作 prototype 。因为 class 语法更为简洁更易读**

```js
// bad
function Queue(contents = []) {
  this._queue = [...contents]
}
Queue.prototype.pop = function() {
  const value = this._queue[0]
  this._queue.splice(0, 1)
  return value
}

// good
class Queue {
  constructor(contents = []) {
    this._queue = [...contents]
  }
  pop() {
    const value = this._queue[0]
    this._queue.splice(0, 1)
    return value
  }
}
```

**使用 extends 继承。**

```js
// bad
const inherits = require('inherits')
function PeekableQueue(contents) {
  Queue.apply(this, contents)
}
inherits(PeekableQueue, Queue)
PeekableQueue.prototype.peek = function() {
  return this._queue[0]
}

// good
class PeekableQueue extends Queue {
  peek() {
    return this._queue[0]
  }
}
```

**对象的属性和方法尽量采用简洁表达法，这样易于描述和书写**

```js
// bad
var ref = 'some value'
const atom = {
  ref: ref,
  value: 1,
  addValue: function(value) {
    return atom.value + value
  }
}

// good
const atom = {
  ref,
  value: 1,
  addValue(value) {
    return atom.value + value
  }
}
```

**优先使用 . 来访问对象的属性。**

```js
const luke = {
  jedi: true,
  age: 28
}

// bad
const isJedi = luke['jedi']

// good
const isJedi = luke.jedi
```

**使用 const 声明每一个变量。**

**为什么？增加新变量将变的更加容易，而且你永远不用再担心调换错 ; 跟 ,。**

```js
// bad
const items = getItems(),
  goSportsTeam = true,
  dragonball = 'z'

// bad
// (compare to above, and try to spot the mistake)
const items = getItems(),
  goSportsTeam = true
dragonball = 'z'

// good
const items = getItems()
const goSportsTeam = true
const dragonball = 'z'
```

** 将所有的 const 和 let 分组**

**为什么？当你需要把已赋值变量赋值给未赋值变量时非常有用。**

```js
// bad
let i,
  len,
  dragonball,
  items = getItems(),
  goSportsTeam = true

// bad
let i
const items = getItems()
let dragonball
const goSportsTeam = true
let len

// good
const goSportsTeam = true
const items = getItems()
let dragonball
let i
let length
```

**优先使用 === 和 !== 而不是 == 和 !=.**

**在对象声明的开头将您的简写属性分组 (写到一起)**

```js
const aa = 'aa'
const bb = 'bb'
// bad
const obj = {
  a: 1,
  b: 2,
  bb,
  c: 3,
  aa
}
// good
const obj = {
  aa,
  bb,
  a: 1,
  b: 2,
  c: 3
}
```

**在 BOOL 运算时使用简写。**

```js
// bad
if (name !== '') {
  // ...stuff...
}

// good
if (name) {
  // ...stuff...
}

// bad
if (collection.length > 0) {
  // ...stuff...
}

// good
if (collection.length) {
  // ...stuff...
}
```

**只有引用非法的变易命名时才用引号将属性名包起来，其它情况一率不采用这种方式。**
**它改进了语法高亮显示，并且更容易被许多 js 引擎优化。**

```js
const bad = {
  foo: 3,
  bar: 4,
  'data-blah': 5
}
const good = {
  foo: 3,
  bar: 4,
  'data-blah': 5
}
```

**使用解构符来对 Object 进行拷贝**

```js
// very bad
const original = { a: 1, b: 2 }
const copy = Object.assign(original, { c: 3 })
delete copy.a //

// bad
const original = { a: 1, b: 2 }
const copy = Object.assign({}, original, { c: 3 })

// good !!!!!
const original = { a: 1, b: 2 }
const copy = { ...original, c: 3 } // copy => { a:1,b:2,c:3 }
const { a, ...noA } = copy // noA => { b:2 ,c:3 }
```

**善于使用解构（…）**

**使用解构进行数组拷贝**

```js
// bad
const len = items.length
const itemsCopy = []
let i
for (i = 0; i < len; i++) {
  itemsCopy = items[i]
}
// good
const itemsCopy = [...items]
```

**使用解构进行参数解构**

```js
// good
function getFullName(user) {
  const { firstName, lastName } = user
  return `${firstName} ${lastName}`
}
// best
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`
}
```

**使用解构进行方法的多参数返回**

```js
// best
const [first, second] = arr
// good
function processInput(input) {
  return { left, right, top, bottom }
}
```

**函数参数列表解构**

```js
// bad
function concateAll() {
  const args = Array.prototype.slice.call(arguments)
  return args.join('')
}
// good
function concateAll(...args) {
  return args.join('')
}
```

**使用 /** ... \*/ 作为多行注释。包含描述、指定所有参数和返回值的类型和值。\*\*

```js
// bad
// make() returns a new element
// based on the passed in tag name
//
// @param {String} tag
// @return {Element} element
function make(tag) {
  // ...stuff...

  return element
}

// good
/**
 * make() returns a new element
 * based on the passed in tag name
 *
 * @param {String} tag
 * @return {Element} element
 */
function make(tag) {
  // ...stuff...

  return element
}
```

**给注释增加 FIXME 或 TODO 的前缀可以帮助其他开发者快速了解这是一个需要复查的问题，或是给需要实现的功能提供一个解决方式。**

这将有别于常见的注释，因为它们是可操作的。使用 FIXME -- need to figure this out 或者 TODO -- need to implement。\

使用 // FIXME: 标注问题。

```js
class Calculator {
  constructor() {
    // FIXME: shouldn't use a global here
    total = 0
  }
}
```

**使用 // TODO: 标注问题的解决方式。**

```js
class Calculator {
  constructor() {
    // TODO: total should be configurable by an options param
    this.total = 0
  }
}
```

**使用 2 个空格作为缩进。**

```js
// bad
function() {
∙∙∙∙const name;
}

// bad
function() {
∙const name;
}

// good
function() {
∙∙const name;
}
```

命名规则
**避免单字母命名。命名应具备描述性。**

```js
// bad
function q() {
  // ...stuff...
}

// good
function query() {
  // ..stuff..
}
```

**使用驼峰式命名对象、函数和实例。**

```js
// bad
const OBJEcttsssss = {}
const this_is_my_object = {}
function c() {}

// good
const thisIsMyObject = {}
function thisIsMyFunction() {}
```

**使用帕斯卡式命名构造函数或类。**

```js
// bad
function user(options) {
  this.name = options.name
}

const bad = new user({
  name: 'nope'
})

// good
class User {
  constructor(options) {
    this.name = options.name
  }
}

const good = new User({
  name: 'yup'
})
```

**不要使用下划线 \_ 结尾或开头来命名属性和方法。**

```js
// bad
this.__firstName__ = 'Panda'
this.firstName_ = 'Panda'
this._firstName = 'Panda'

// good
this.firstName = 'Panda'
```

**别保存 this 的引用。使用箭头函数或 Function#bind。**

```js
// bad
function foo() {
  const self = this
  return function() {
    console.log(self)
  }
}

// bad
function foo() {
  const that = this
  return function() {
    console.log(that)
  }
}

// good
function foo() {
  return () => {
    console.log(this)
  }
}
```

**如果你需要存取函数时使用 getVal() 和 setVal('hello')。**

```js
// bad
dragon.age()

// good
dragon.getAge()

// bad
dragon.age(25)

// good
dragon.setAge(25)
```

**如果属性是布尔值，使用 isVal() 或 hasVal()。**

```js
// bad
if (!dragon.age()) {
  return false
}

// good
if (!dragon.hasAge()) {
  return false
}
```
