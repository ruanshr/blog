---
prev: /javascript-base/array-function
next: /javascript-base/bigInt
---
# Array.prototype.reduce

reduce的核心在于降维，降数字reduce为一个值，比如求和，而且遍历数组：

```js

const arr = [52,71,27,28]
const sum = (x, y) => x + y
const count = arr.reduce(sum, 0)

```

### array.map

map方法可以通过reduce方法实现

```js

Array.prototype.custMap = function(fn) {
   return this.reduce((acc, v, i) => {
       return acc.concat(fn(v, i, this))
   },[])
}

```

### array.some， array.every

```js

Array.prototype.custSome = function(fn) {
    return this.reduce((acc, v, i) => acc || !!fn(v, i, this), false)
}

Array.prototype.custEvery = function(fn) {
    return this.reduce((acc, v, i) => acc && !!fn(v, i, this), true)
}


```

### array.find , array.findIndex

```js

Array.prototype.custFind = function(fn) {
    if(!this.length) {
        return 
    }
    return this.reduce((acc, v, i) => {
        return acc === undefined && fn(v, i, this) ? val: acc
    })
}

Array.prototype.custFindIndex = function(fn) {
    return this.reduce((acc, v, i) => {
        return acc === -1 && fn(v, i, this) > -1 ? i: acc
    }, -1)
}

Array.prototype.custIncludes = function( value) {
    return this.custFind(v => v === value)
}

Array.prototype.custIndexOf = function(value) {
    return this.custFindIndex(v => v === value)
}
```

### array.filter

```js

Array.prototype.custFilter = function(fn) {
    return this.reduce((acc, v, i) => {
        return fn(v, i, this) ? acc.concat(v) : acc
    }, [])
}

```

### array.flat ，array.flatMap 拍平数组

```js

const flat1 = arr => [].concat(...arr)

const flat2 = arr => arr.reduce(arr, v => arr.concat(v), [])

const flatAllX = arr => arr.reduce((acc, v) => Array.isArray(v) ? acc.concat(flatAllX(v)) : acc.concat(v))


Array.prototype.custFlatAll = function custFlatAll() {
    return this.reduce((acc, v) => Array.isArray(v) ? acc.concat(v.custFlatAll()) : acc.concat(v), [])
}

Array.prototype.custFlatX = function(n = 1) {
     return this.reduce((acc, v) => { 
         if(n <= 1) {
             return acc.concat(v)
         }
         return Array.isArray(v) ? acc.concat(v.custFlatX(n - 1)) : acc.concat(v)
     }, [])
}

```