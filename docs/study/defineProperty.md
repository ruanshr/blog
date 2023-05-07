# 属性描述符 defineProperty

属性描述符的配置参考 [MDN.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

**Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象**

### 1、属性描述符：它表达了一个属性的相关信息（元数据），它本质上时一个对象。

1、数据属性

2、存储器属性
当给它赋值，会自动运行一个函数
当获取它的值时，会自动运行一个函数

**存储器属性特性为以下四种：**

- 读取（get）
- 写入（set）
- 可枚举性（enumerable）
- 可配置性（configurable）

```js
const obj = { name: '张三', _age: 23 }
Object.defineProperty(obj, 'age', {
  get: () => {
    console.log('obj.age', obj._age)
    return obj._age
  },
  set: (val) => {
    if (val < 100 && val >= 0) {
      console.log('preValue', obj._age, 'nextValue', val)
      obj._age = val
    }
  }
})
```

### 1.2说明:

- **defineProperty**不能修改继承属性

- **defineProperty**不必包含所有四个属性，对于已有的属性来说，未指定的特性不做修改，只对指定特性进行修改。

- 对于新创建的属性来说默认是 false 或者 undefined。

- 当**configurable**设置为 false，就不能再设置为 true 了，因为不可配置也不能配置自己

- 当**configurable**设置为 true，writable 设置为 false 时，是可以通过配置特性更改 value 值的

- 当**configurable**设置为 false 时，writable 可以从 true 设置为 false，当时不能从 false 设置为 true

### 1.3、同时修改多个属性的特性

```js
Object.defineProperties()
```

### 1.4 获取对象属性的描述

**Object.getOwnPropertyDescriptor() 方法返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）**

```js
Object.getOwnPropertyDescriptor()
```

### 2.1、将对象设置为不可扩展

Object.preventExtensions()

说明：

对象一旦设置不为不可扩展就不能转换为可扩展了

Object.preventExtensions 只会影响对象本身的可扩展性，所以依然还是可以给对象原型添加属性。

```js
var aa = {}
Object.preventExtensions(aa)
aa.x = 1
console.log(aa.x)
```

### 2.2、检测对象是否是可扩展的

Object.isExtensible()

```js
//  在《javascript权威指南》第六版中6.8.3节介绍可扩展性的时候，将isExtensible写为esExtensible了。

var aa = {}
var bb = {}
Object.preventExtensions(aa)
console.log(Object.isExtensible(aa))
console.log(Object.isExtensible(bb))
```

### 2.3、将对象封闭（sealed）

Object.seal()
说明：

Object.seal 不仅可以设置对象的可扩展性，还可以设置对象的所有自有属性的可配置性
将对象设置为不可扩展并且不可配置，也就是说不能给这个对象添加新属性，而且已有的属性不能删除或者配置。
不过这些属性可写特性依然是可以配置的

```js
var aa = {
  y: 2
}
Object.seal(aa)
aa.x = 1
console.log(aa.x)
console.log(Object.getOwnPropertyDescriptor(aa, 'y'))
Object.defineProperty(aa, 'y', {
  writable: false
})
console.log(Object.getOwnPropertyDescriptor(aa, 'y'))
```

### 2.4、检测对象是否被封闭

```js
Object.isSealed()
var aa = {}
var bb = {}
Object.seal(aa)
console.log(Object.isSealed(aa))
console.log(Object.isSealed(bb))
```

### 2.5、将对象冻结（freeze）
Object.freeze()

说明：

freeze 不仅仅可以将对象设置为不可扩展和所有属性为不可配置，并且会将所有对象属性设置为只读。
如果存取器属性具有 setter 方法，则不会受到影响，仍然可以通过此方法给属性赋值。

```js
var aa = {
  x: 1
}
Object.freeze(aa)
console.log(Object.getOwnPropertyDescriptor(aa, 'x'))
```

### 2.6、检测对象是否配冻结
Object.isFreeze()

```js
var aa = {}
var bb = {}
Object.freeze(aa)
console.log(Object.isFrozen(aa))
console.log(Object.isFrozen(bb))
```
