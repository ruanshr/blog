---
prev: /javascript/study
next: /javascript/tcp-introduction
---

# ES6 新特性之 Symbol

## 数据类型 Symbol

ES6 引入 Symbol 作为一种新的基础数据类型，表示独一无二的值，每个从Symbol()返回的symbol值都是唯一的，一个symbol值能作为对象属性的标识符，这是该数据类型仅有的目的。

ES6 之后，JavaScript 一共有 6 种基础数据类型：Symbol、undefined、null、Boolean、String、Number。

Symbol 函数不能用 new，会报错。由于 Symbol 是一个原始类型，不是对象，所以不能添加属性，它是类似于字符串的数据类型。
Symbol 都是不相等的，即使参数相同。

```js
const a1 = Symbol()
const b1 = Symbol()
console.log(a1 === b1) // false

const a2 = Symbol('abc')
const b2 = Symbol('abc')
console.log(a2 === b2) // false
```

- Symbol 不能与其他类型的值计算，会报错

```js
let a3 = Symbol('hello')
a3 += ' word' // TypeError
let a4 = `${a3} world` // TypeError
```

- Symbol 可以显式转换为字符串

```js
let a4 = Symbol('hello')
String(a4) // Symbol(hello)
a4.toString() // Symbol(hello)
```

- Symbol 可以转换为布尔值，但不能转为数值

```js
let a5 = Symbol()
!a5 // false
a5 + 1 // TypeError
~a5 + // TypeError
a5 - // TypeError
  a5 // TypeError
```

## Symbol 作为属性名

- 防止同名属性，还有防止键被改写或覆盖
- Symbol 作为对象属性名时，不能用点运算符，并且必须放在方括号内

## 属性名遍历

- Symbol 作为属性名遍历，不出现在 for...in、for...of 循环，也不被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回
- Object.getOwnPropertySymbols 方法返回一个数组，包含当前对象所有用做属性名的 Symbol 值
- 另外可以使用 Reflect.ownKeys 方法可以返回所有类型的键名，包括常规键名和 Symbol 键名
- 由于 Symbol 值作为名称的属性不被常规方法遍历获取，因此常用于定义对象的一些非私有，且内部使用的方法

## Symbol.for()、Symbol.keyFor()

- Symbol.for() 用于重复使用一个 Symbol 值，接收一个字符串作为参数，若存在用此参数作为名称的 Symbol 值，返回这个 Symbol，否则新建并返回以这个参数为名称的 Symbol 值。

Symbol.keyFor() 用于返回一个已使用的 Symbol 类型的 key

## 内置的 Symbol 值

ES6 提供 11 个内置的 Symbol 值，指向语言内部使用的方法

- 1、Symbol.hasInstance
  当其他对象使用 instanceof 运算符，判断是否为该对象的实例时，会调用这个方法。比如，foo instanceof Foo 在语言内部，实际调用的是 Foo[Symbol.hasInstance](foo)。

```js
class P {
  [Symbol.hasInstance](obj) {
    return obj instanceof Array
  }
}
;[1, 2, 3] instanceof Array
```

P 是一个类，new P()会返回一个实例，该实例的 Symbol.hasInstance 方法，会在进行 instanceof 运算时自动调用，判断左侧的运算子是否为 Array 的实例。

- 2、Symbol.isConcatSpreadable
  值为布尔值，表示该对象用于 Array.prototype.concat()时，是否可以展开

```js
let a = ['aa', 'bb'][('cc', 'dd')].concat(a, 'ee') // ['aa','bb','cc','dd','ee']
a[Symbol.isConcatSpreadable] // undefined

let b = ['aa', 'bb']
b[Symbol.isConcatSpreadable] = false[('cc', 'dd')].concat(b, 'ee') // ['aa','bb',['cc','dd'],'ee']
```

- 3、Symbol.species
  指向一个构造函数，在创建衍生对象时会使用，使用时需要用 get 取值器。

```js
class P extends Array {
  static get [Symbol.species]() {
    return this
  }
}
```

```js
class P1 = extends Array()
let a1 = new P1(1,2,3)
let b1 = a1.map(x => x)

b1 instanceof Array   // true
b1 instanceof P1       // true

class P2 extends Array{
    static get [Symbol.species](){ return Array}
}
let a2 = new P2(1,2,3)
let b2 = a2.map(x => x)

b2 instanceof Array   // true
b2 instanceof P2      // false
```

- 4、Symbol.match
  当执行 str.match(myObject)，传入的属性存在时会调用，并返回该方法的返回值。

```js
class M {
  constructor() {
    this.matchTemplate = 'hello word'
  }
  [Symbol.match](str) {
    return this.matchTemplate.indexOf(str) > -1
  }
}
'h'.match(new M())
```

- 5、Symbol.replace 当该对象被 String.prototype.replace 方法调用时，会返回该方法的返回值。

```js
let a = {}
a[Symbol.replace] = (...s) => {
  console.log(s)
  return s
}
'Hello'.replace(a, 'Word') //  ["Hello", "Word"]
```

- 6、Symbol.hasInstance
  当该对象被 String.prototype.search 方法调用时，会返回该方法的返回值。

```js
class S {
  constructor(val) {
    this.val = val
  }
  [Symbol.search](s) {
    return s.indexOf(this.val)
  }
}
'Tommery'.search(new S('mm')) // 2
```

- 7、Symbol.split
  当该对象被 String.prototype.split 方法调用时，会返回该方法的返回值。

```js
class SP {
  constructor(val) {
    this.val = val
  }
  [Symbol.split](s) {
    let i = s.indexOf(this.val)
    if (i === -1) {
      return s
    }
    return [s.substr(0, i), s.substr(i + this.val.length)]
  }
}
'helloword'.split(new SP('llo')) // ['he','word']
```

- 8、Symbol.iterator
  对象进行 for...of 循环时，会调用 Symbol.iterator 方法，返回该对象的默认遍历器。

```js
class It {
  *[Symbol.iterator]() {
    let i = 0
    while (this[i] !== undefined) {
      yield this[i]
      i++
    }
  }
}
```

- 9.Symbol.toPrimitive
  该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。调用时，需要接收一个字符串参数，表示当前运算模式，运算模式有：
  Number : 此时需要转换成数值
  String : 此时需要转换成字符串
  Default : 此时可以转换成数值或字符串

```js
let obj = {
  num: 3,
  str: 'three',
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return this.num
      case 'string':
        return this.str
      case 'default':
        return this.num
      default:
        throw new Error()
    }
  },
}

2 + obj // 5                  hint 为 default
5 - obj // 2                  hint 为 number
~obj // 2                  hint 为 number

'2' + obj // 23                hint 为 default
obj + '2' // 23                hint 为 default
obj == 3 // true               hint 为 default
Number(obj) // 2               hint 为 number
String(obj) // three           hint 为 string
```

- 10、Symbol.toStringTag
  在该对象上面调用 Object.prototype.toString 方法时，如果这个属性存在，它的返回值会出现在 toString 方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制[object Object]或[object Array]中 object 后面的那个字符串。

```js
;({ [Symbol.toStringTag]: 'Foo' }.toString())
// [Object Foo]

class Collection {
  get [Symbol.toStringTag]() {
    return 'xxx'
  }
}

let x = new Collection()
Object.prototype.toString.call(x) // [Object xxx]
```

- 11、Symbol.unscopables
  该对象指定了使用 with 关键字时，哪些属性会被 with 环境排除。

```js
const foo = function foo(){
    return 1
}
class MyClass{
    foo(){ return 2 }
}

with(MyClass.prototype){
    foo() // 2
}

class MyClass1{
    foo(){ return 3 },
    get [Symbol.unscopeables](){
        return { foo: true}
    }
}

with(MyClass1.prototype){
    foo() // 1
}

```

上面代码通过指定 Symbol.unscopables 属性，使得 with 语法块不会在当前作用域寻找 foo 属性，即 foo 将指向外层作用域的变量
