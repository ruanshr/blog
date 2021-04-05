---
prev: /javascript/p6-questions
next: /javascript/performance-monitor
---

# Array

### 数组交集

```js
const arr1 = [1, 2, 3, 4, 5, 7]
const arr2 = [4, 5, 8, 9]

const intersection = arr1.filter((val) => arr2.indexOf(val) > -1)
```

```js
const arr1 = [
  { name: 'name1', id: 1 },
  { name: 'name2', id: 2 },
  { name: 'name3', id: 3 },
  { name: 'name5', id: 5 },
]

const arr2 = [
  { name: 'name1', id: 1 },
  { name: 'name2', id: 2 },
  { name: 'name3', id: 3 },
  { name: 'name4', id: 4 },
  { name: 'name5', id: 5 },
]

const result = arr2.filter(function(v) {
  return arr1.some((n) => JSON.stringify(n) === JSON.stringify(v))
})
```

### 数组并集

```js
const arr1 = [1, 2, 3, 4, 5, 7]
const arr2 = [4, 5, 8, 9]

const intersection = arr1.contract(arr1.filter((val) => !arr2.includes(val))

```

### 数组差集

```js
const arr1 = [1, 2, 3, 4, 5, 8, 9]
const arr2 = [5, 6, 7, 8, 9]
const diff = arr1.filter((item) => arr2.includes(item))
console.log(diff)
```

### 数组补集

```js

const arr1 = [1, 2, 3, 4, 5, 8, 9]
​
const arr2 = [5, 6, 7, 8, 9];
​
const difference = Array.from(arr1.concat(arr2).filter(item => !arr1.includes(item) || !arr2.includes(item)))
​
console.log(difference)


```

### 数组排序

```js
console.log([1, 2, 3, 4].sort((a, b) => a - b)) // [1, 2,3,4] 升序

console.log([1, 2, 3, 4].sort((a, b) => b - a)) // [4,3,2,1] 降序
```

### 最大值

```js
Math.max(...[1, 2, 3, 4]) //4
Math.max
  .apply(this, [1, 2, 3, 4]) //4
  [(1, 2, 3, 4)].reduce((prev, cur, curIndex, arr) => {
    return Math.max(prev, cur)
  }) //4
```

### 数组求和

```js
;[1, 2, 3, 4].reduce(function(prev, cur) {
  return prev + cur
}, 0)
```

### 数组合并

```js
const arr1 = [1, 2, 3, 4].concat([5, 6]) //[1,2,3,4,5,6]
const arr2 = [...[1, 2, 3, 4], ...[4, 5]] //[1,2,3,4,5,6]
const arrA = [1, 2]
const arrB = [3, 4]
const arr3 = Array.prototype.push.apply(arrA, arrB) //arrA值为[1,2,3,4
```

### 数组是否包含值

```js
console.log([1, 2, 3].includes(4)) //false
console.log([1, 2, 3].indexOf(4)) //-1 如果存在换回索引
console.log([1, 2, 3].find((item) => item === 3)) //3 如果数组中无值返回undefined
console.log([1, 2, 3].findIndex((item) => item === 3)) //2 如果数组中无值返回-1
```

### 数组每一项都满足

```js
const arr1 = [1, 2, 3]
const flag = arr1.every((item) => {
  return item > 2
})
```

### 数组有一项满足

```js
const arr1 = [1, 2, 3]
const flag = arr1.some((item) => {
  return item > 2
})
```

### 多维数组去重

```js
const arr1 = [1, [2, 3, [4, 5, [6, 7]]]]

const arr2 = arr1.toString().split(',')

arr2.filter((item, index) => arr2.indexOf(item) === index)
```

### 对象转数组

```js

Object.keys({ name: '张三', age: 14 }) //['name','age']
Object.values({ name: '张三', age: 14 }) //['张三',14]
Object.entries({ name: '张三', age: 14 }) //[[name,'张三'],[age,14]]

```



### 对象深度拷贝

JSON.stringify深度克隆对象;
1.无法对函数 、RegExp等特殊对象的克隆;
2.会抛弃对象的constructor,所有的构造函数会指向Object;
3.对象有循环引用,会报错