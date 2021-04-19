---
prev: /javascript-extend/js-call-stack
next: /javascript-extend/js-memory
---


# Js代码片段

### deepClone
创建对象的深度克隆
使用递归，使用Object.assign() 和空对象创建原始对象的浅克隆。使用object.keys() 和array.prototype.forEach()确定需要深度克隆哪些键值对
 
```js

function deepClone(obj) {
    let clone = Array.isArray(obj) ? Array.from(obj) : Object.assign({}, obj)
    Object.keys(clone).forEach(key => {
        clone[key] = typeof  obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    })
    
    return clone

}

```


### equal 

对两个值进行深入比较，以确定他们是否等效
```js

const equal = (a, b) => {
  if(a === b) return true
  if(a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
  if(!a ||!b || (typeof a !== 'object' && typeof b !== 'object')) return a === b
  if(a === null || a === undefined || b === null || b === undefined ) return false
  if(a.prototype !== b.prototype) return false
  let keys = Object.keys(a)
  if(keys.length !== Object.keys(b).length) return false
  return keys.every(k => equals(a[k], b[k]))

}

```


### flattenObject

扁平化对象

```js

const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length  ? prefix + '.'
    if(typeof obj[k] === 'object') {
      Object.assign(acc, flattenObject(obj[k], pre + k))
    } else {
      acc[pre + k] = obj[k]
    }
    return acc
  }, {}) 
}

```


### pick

从对象中选取与给定键对应的键值对
使用array.prototype.reduce() 将筛选/选取的键转换回具有响应键值对的对象（如果该键存在于对象中）

```js

const pick = (obj, arr) => {
  return Object.keys(obj).reduce((acc, curr) => {
    if(arr.includes(curr) && curr in obj) {
      acc[curr] = obj[curr]
    }
    return acc
  }, {})
}

```

### shallowClone

创建一个对象的浅拷贝
使用Object.assign() 和一个空对象（{}）来创建原始对象的浅拷贝

```js
const shallowClone = obj => Object.assign({}, obj)

```

### size

获取数组，对象或字符串的大小
获取var（array，object或者string）的类型
对应数组使用length属性。对于对象，使用length或size如果可用的话，或者对象的键的数量。对于字符串，使用根据val创建的Blob对象的size

```js

const size = val => {
  if(Array.isArray(val)){ return val.length  }
  if(val && typeof(val) === 'object'){ return val.size || val.length ||  Object.keys(val).length }
  if(typeof val === 'string'){ return new Blob([val]).size }
  return 0
}

```

### unflattenObject

```js
const unflattenObject = obj =>
  Object.keys(obj).reduce((acc,k) => {
    if(k.indexOf('.') > -1) {
      const keys = k.split('.')
      Object.assign(acc, JSON.parse('{' +
        keys.map((v, i) => i !== keys.length - 1 ? `"${v}":{`:`"${v}":`).join('') + obj[k]
      +'}'.repeat(keys.length)))
    } else {
      acc[k] = obj[k]
    }
    return acc
  }, {})

  ```


### curry

柯里化一个函数

使用递归。如果提供的参数（args）数量足够，调用传递函数fn。否则返回一个柯里化后的函数fn，期望剩下的参数。如果你想柯里化一个可以接受可变参数数量的函数（可变参数数量的函数，例如Math.min()）,你可以选择将参数格式传递给第二个参数arity。

```js

const curry = (fn, arity = fn.length, ...args) => arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args)

// curry(Math.pow)(2)(10)
// curry(Math.min,3)(10)(50)(2)

```

### once
确保函数只被调用一次
使用一个闭包，使用一个成为called的标识，并在第一次调用该函数时将其设置为true，以防止它被再次调用。为了允许函数改变它的this上下文（比如在一个事件监听中），必须使用function关键字，并且提供的函数必须应用上下文。允许使用rest（剩余） / spread（展开）（...） 运算符为函数提供任意数量的参数

```js

const once = fn => {
  let called = false
  return function (...args) {
    if (called) {
      return
    }
    return fn.apply(this, args)
  }
}
```

### sleep

延迟异步函数的执行。延迟执行async函数的一部分，通过把它放到sleep状态，返回Promise

```js

const sleep = ms => new Promse(resolve => setTimeout(resolve, ms))

```