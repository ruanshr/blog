---
prev: /javascript/performance-monitor
next: /javascript/question-es6
---

# javascript——原型与原型链
### 原型

1、在JavaScript中，每个函数都有一个prototype属性，这个属性指向函数的原型对象。

2、每个对象(除null外)都会有的属性，叫做__proto__，这个属性会指向该对象的原型。绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 Person.prototype 中，实际上，它是来自于 Object.prototype ，与其说是一个属性，不如说是一个 getter/setter，当使用 obj.__proto__ 时，可以理解成返回了 Object.getPrototypeOf(obj)

3、每个原型都有一个constructor属性，指向该关联的构造函数。


### 原型链

每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。那么假如我们让原型对象等于另一个类型的实例，结果会怎样？显然，此时的原型对象将包含一个指向另一个原型的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立。如此层层递进，就构成了实例与原型的链条。这就是所谓的原型链的基本概念。——摘自《javascript高级程序设计》

### 扩展

```js

const a = Object.create(null) 
a instanceOf Object // false
const b = Object.create({})
b instanceOf Object // true

Object.getPrototypeOf({}) === Object.prototype 
// true

Object.getPrototypeOf([]) === Object.prototype
// false

Object.getPrototypeOf([]) === Function.prototype
// true

```