---
prev: /javascript-base/bigInt
next: /javascript-base/data-function
---

# Javascript 中函数的代码实现

### 函数是一等公民

函数是一等公民可以作为函数参数，可以作为函数返回值，也可以赋值给变量。

### 纯纯函数

一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做纯函数

### 函数的调用

执行函数有 4 种方法
1、new 执行
2、call，apply 执行
3、作为一个对象的方法执行
4、直接执行

![javascript](../images/javascript/javascript-func.png)

在业务开发中经常会用的 Javascript 内置对象提供的，可以很方便的实现想要的需求，对于这些功能我们也能手动实现，这样可以更深入了解其工作原理。

### new 函数

```js
function Person(name, age) {
  this.name = name
  this.age = age
  return name
}

let p = new Person('张三', 23)
// p 的结果 { name: '张三', age: 23 }

function Animal() {}

let a = new Animal()
// a 的结果 {}
```

### call 函数

call 属于 Function 原型上的方法，执行函数，改变函数 this 的指向
其中：第二个及之后的参数为数列

```js
Function.prototype.call = function call(context = window, ...args) {
  const func = Symbol('funCall')
  context[func] = this
  const result = context[func](...args)
  delete context[func]
  return result
}
```

### apply 函数

apply 函数与 call 函数的功能类型，只是传递的第二个参数为数组

```js
Function.prototype.apply = function apply(context = window, ...args) {
  const func = Symbol('funApply')
  context[func] = this
  const result = context[func](args)
  delete context[func]
  return result
}
```

### bind 函数

bind 也是 Function 原型上的方法，用于绑定函数，一遍后续调用，功能跟 call 和 apply 相似，但是该方法并不执行函数
其中：返回值是一个函数，bind 第二个及以后的参数将成为返回函数的首先参数
由于闭包，返回的函数再 bind 新的 context 并不影响执行原函数的 context
但是会追加参数数列

```js
Function.prototype.bind = function bind(context = window, ...bindArgs) {
  const self = this
  return function handler(...args) {
    return self.apply(context, bindArgs.concat(args))
  }
}

Function.prototype.bind = function bind(context = window, ...bindArgs) {
  const self = this
  return function handler(...args) {
    if (this instanceof handler) {
      const result = self.apply(this, bindArgs.concat(args))
      if (result && (typeof result === 'object' || typeof result === 'function')) {
        return result
      }
      return this
    } else {
      return self.apply(context, bindArgs.concat(args))
    }
  }
}
// function test(...args) {
//   console.log(this.type,args);
// }
// const test1 = test.bind({ type: "Foo" }, 1);
// const test2 = test1.bind({ type: "Bar"},2,3);
// test2()  // Foo [1,2,3]
```

### assign 函数

assign 属于 Object 上的方法，用于合并对象，可以实现浅拷贝

```js
Object.assign = function assign(target, ...args) {
  args.forEach(obj => {
    Object.keys(obj).forEach((key, value) => {
      target[key] = value
    })
  })
}

// 用展开对象方法同样实现
// target = { ...target,...source1,...source2 }
```

### create 函数

create 属于 Object 的方法，用于创建对象
其中：参数为 null 则创建没有原型 Object.prototype 的对象

```js
Object.create = function create(proto) {
  function F() {}
  F.prototype = proto
  return new F()
}

// const obj1 = Object.create(null)
// obj1 instanceOf Object // false
```
