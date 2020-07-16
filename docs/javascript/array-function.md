# javascript 数组Array详解

## Array.prototype.push
push() 方法 参数数列尾部添加到数组,返回当前数组长度
```js
const a = [1,2];
const b = a.join(3,5,6); 
console.log(b)  // 5
console.log(a)  // [1,2,3,5,6]
```

## Array.prototype.pop
pop() 方法 将最后元素移除数组,返回移除元素
```js
const a = [1,2,3,4];
const b = a.pop(); 
console.log(b)  // 4
console.log(a)  // [1,2,3]
```

## Array.prototype.unshift
unshift() 方法 参数数列头部添加到数组,返回当前数组长度
```js
const a = [1,2];
const b = a.unshift(3,5,6); 
console.log(b)  // 5
console.log(a)  // [3,5,6,1,2]
```

## Array.prototype.shift
shift() 方法 将第一个元素移除数组,返回移除元素
```js
const a = [1,2,3,4];
const b = a.shift(); 
console.log(b)  // 1
console.log(a)  // [2,3,4]
```

## Array.prototype.slice
slice(start,end) 方法 复制数组项，返回新的数组
默认复制整个数组，start为undefined时从0开始，end为空值时以最后为结束
但是元素的引用还是一样
如果start为负数，则从右边开始复制数组项，end值必须比start大，当start的绝对值大于数组长度时，则从左边0位开始
```js
const a = [1,2,3,4];
const b = a.slice(); 
const c = a.slice(1)
const d = a.slice(1,3)
const e = a.slice(-3,3)

console.log(b)  // [1,2,3,4]
console.log(c)  // [2,3,4]
console.log(d)  // [2,3]
console.log(a)  // [1,2,3,4]
console.log(e)  // [2,3]

const students = [{name:'Jack'},{name:'Marry'}];
const mystudents = students.slice();
students[0].name = 'Tom';
console.log(mystudents[0].name) // Tom
```

## Array.prototype.splice
splice(fromIndex,removeNum,...addItems)  从fromIndex开始，移除removeNum个元素，并在原数组fromIndex+1追加addItem 数列
并返回移除元素数组
```js
let arr = [1,2,3]
const result1 = arr.splice(1,2,3)
console.log(arr)  // [1,3]
coonsole.log(result1) // [2,3]
```

## Array.prototype.join 
join(separator) 数组元素转换成字符串，再以separator间隔合并成字符串 ，默认为“,”
其中元素为null 或者 undefined 则转换成空字符串，其他类型则调用toString方法
```js
const a = [1,2,3,4];
const b = a.join(); // 1,2,3,4
const c = a.join('|') // 1|2|3|4
const students = [{name:'Jack'},{name:'Marry'}]
const myclass = students.join() // [object Object],[object Object]
```
## Array.prototype.find
find(findFunction,start) 查找元素,查找成功则退出循环，返回第一个查找结果
start表示从第几个开始，默认为0
```js
const arr = [1,8,3,5,3]

const item = arr.find((value)=>{
    return value > 2
})

console.log(item) // 8

const result = arr.find((value)=>{
    return value > 2 && value < 5
})
console.log(result) // 3
```

## Array.prototype.findIndex  
findIndex(findIndexFunction,start) 查找元素,查找成功则退出循环，返回第一个查找结果所在下标
start表示从第几个开始，默认为0
```js
const arr = [1,8,3,5,3]

const itemIndex = arr.findIndex((value)=>{
    return value > 2
})

console.log(itemIndex) // 1

const result = arr.findIndex((value)=>{
    return value > 2 && value < 5
})
console.log(result) // 2
```

## Array.prototype.forEach
forEach(iterator) 遍历数组 iterator 返回为 false 不会退出遍历
```js
const arr = [1,2,3]

arr.forEach((value,index)=>{
    console.log(value,index) // 1 0 、2 1 、 3 2
})

```

## Array.prototype.indexOf
indexOf(searchElement,?fromIndex) 查找数组元素 判断值为 === 返回查找结果下标，不存在则返回 -1
```js
const arr = [1,2,3]
const a = arr.indexOf(1);
const b = arr.indexOf(4);
const c = arr.indexOf(1,1)

console.log(a) // 0
console.log(b) // -1
console.log(c) // -1
```

## Array.prototype.contact
contact 创建新的合并数组，参数数列元素可以为数组或者元素，返回新的数组
```js
const arr = [1,2,3]
const arr1 = arr.concat([4,5])
const arr2 = arr.concat(4,5)
const arr3 = arr.concat(4,[5,6],7,[8],9)

console.log(arr1) // [1,2,3,4,5]
console.log(arr2) // [1,2,3,4,5]
console.log(arr3) // [1,2,3,4,5,6,7,8,9]

```

## Array.prototype.includes
includes() 方法 判断元素是否存在于当前数组，结果为布尔值，其比较的是 === ， 其等价于  indexOf
```js
const a = [1,2,3,7];
const b = a.includes(1);     // false
const c = a.includes(4);     // false
const d = a.includes('1');   // false

const students =  [{name:'Jack'},{name:'Marry'}];

const exist = students.includes({name:'Jack'})  // false
```

## Array.prototype.map
map() (映射)方法最后生成一个新数组，不改变原始数组的值。其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。
```js
array.map(callback,[ thisObject]);
```
callback(回调函数)
```js
[].map(function(currentValue, index, array) {
    // ...
});
```
传递给 map 的回调函数（callback）接受三个参数，分别是 currentValue——正在遍历的元素、index（可选）——元素索引、array（可选）——原数组本身，除了 callback 之外还可以接受 this 值（可选），用于执行 callback 函数时使用的this 值。


```js
// kaola
const arr1 = [1, 2, 3, 4];
const arr2 = arr1.map(item => item * 2);

console.log( arr2 );
// [2, 4, 6, 8]
console.log( arr1 );
// [1, 2, 3, 4]
```
 
### map高阶函数对应的一道经典面试题
```js
//输出结果
["1", "2", "3"].map(parseInt);
```
看了这道题不知道会不会有大多数开发者认为输出结果是[1,2,3],错误

正确的输出结果为：
```js
[1,NaN,NaN]
```
分析与讲解
因为map的callback函数有三个参数，正在遍历的元素, 元素索引(index), 原数组本身(array)。parseInt有两个参数，string和radix(进制)。只传入parseInt的话，map callback会自动忽略第三个参数array。而index参数不会被忽略。而不被忽略的index(0,1,2)就会被parseInt当做第二个参数。

将其拆开看：
```js
parseInt("1",0);//上面说过第二个参数为进制，所以"1"，0会被忽略，按照，parseInt默认的型的1。
parseInt("2",1);//此时将2转为1进制数，由于超过进制数1，所以返回NaN。
parseInt("3",2);//此时将3转为1进制数，由于超过进制数2，所以返回NaN。
```
所以最终的结果为[1,NaN,NaN]。

那么如果要得到[1,2,3]该怎么写。["1","2","3"].map((x)=>{ return parseInt(x); }); 也可以简写为：["1","2","3"].map(x=>parseInt(x));

这样写为什么就能返回想要的值呢？因为，传一个完整函数进去，有形参，有返回值。这样就不会造成因为参数传入错误而造成结果错误了，最后返回一个经纯函数处理过的新数组。

## Array.prototype.reduce
reduce() 方法对数组中的每个元素执行一个提供的 reducer 函数(升序执行)，将其结果汇总为单个返回值。传递给 reduce 的回调函数（callback）接受四个参数，分别是累加器 accumulator、currentValue——正在操作的元素、currentIndex（可选）——元素索引，但是它的开始会有特殊说明、array（可选）——原始数组本身，除了 callback 之外还可以接受初始值 initialValue 值（可选）。

如果没有提供 initialValue，那么第一次调用 callback 函数时，accumulator 使用原数组中的第一个元素，currentValue 即是数组中的第二个元素。在没有初始值的空数组上调用 reduce 将报错。

如果提供了 initialValue，那么将作为第一次调用 callback 函数时的第一个参数的值，即 accumulator，currentValue 使用原数组中的第一个元素。

无 initialValue 值
```js
const arr = [0, 1, 2, 3, 4];
let sum = arr.reduce((accumulator, currentValue, currentIndex, array) => {
  return accumulator + currentValue;
});

console.log( sum );
// 10
console.log( arr );
// [0, 1, 2, 3, 4]
```
没有 initialValue 的情况，callback 总共调用四次。

 
有 initialValue 值
```js
//koala
const arr = [0, 1, 2, 3, 4];
let sum = arr.reduce((accumulator, currentValue, currentIndex, array) => {
  return accumulator + currentValue;
}, 10);

console.log( sum );
// 20
console.log( arr );
// [0, 1, 2, 3, 4]
```
有 initialValue 值 callback 总共调用五次。

## Array.prototype.reduceRight
reduceRight 与 reduce相同，数组遍历是从结尾开始

## reduce实现map方法
```js

Array.prototype.myMap = function myMap(handler){
    return this.reduce((accumulator, currentValue, currentIndex) =>{
        const item = handler(currentValue,currentIndex,this);
        accumulator.push(currentValue);
        return accumulator;
    },[])
}

```

## reduce实现filter方法

```js
Array.prototype.myFilter = function myFilter(handler){
    return this.reduce((accumulator, currentValue, currentIndex) =>{
        if(handler(currentValue,currentIndex,this)){
            accumulator.push(currentValue);
        }
        return accumulator;
    },[])
}

```
## Array.prototype.toString
toString 方法返回数组元素值，用“,”号分割
```js
const arr = [1,2,3]

console.log(arr.toString())  // 1,2,3

const arr2 = [1,[2,3],[4,[5,6]]] 

console.log(arr2.toString()) // 1,2,3,4,5,6

// 利用toString将多维数组去重

const arr3 = [1,[2,3],[4,[1,3]]] 
// 1
const result1 = [...new Set(arr3.toString().split(','))]

const result3 = arr3.toString().split(',').filter((item,index,arr) => arr.indexof(item) === index)
```


## Array.prototype.filter
filter(过滤，筛选) 方法创建一个新数组,原始数组不发生改变。
```js
array.filter(callback,[ thisObject]);
```
其包含通过提供函数实现的测试的所有元素。接收的参数和 map 是一样的，filter的callback函数需要返回布尔值true或false. 如果为true则表示通过啦！如果为false则失败，其返回值是一个新数组，由通过测试为true的所有元素组成，如果没有任何数组元素通过测试，则返回空数组。

```js
// 去重
const arr1 = [1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4];
const arr2 = arr1.filter( (element, index, self) => {
    return self.indexOf( element ) === index;
});

console.log( arr2 );
// [1, 2, 3, 5, 4]
console.log( arr1 );
// [1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4]
```
filter注意点说明
callback在过滤测试的时候，一定要是Boolean值吗？例子：
```js
var arr = [0, 1, 2, 3];
var arrayFilter = arr.filter(function(item) {
    return item;
});
console.log(arrayFilter); // [1, 2, 3]
```
通过例子可以看出:过滤测试的返回值只要是弱等于== true/false就可以了，而非非得返回 === true/false.

## Array.prototype.sort
sort()方法用原地算法对数组的元素进行排序，并返回数组，该排序方法会在原数组上直接进行排序，并不会生成一个排好序的新数组。排序算法现在是稳定的。默认排序顺序是根据字符串Unicode码点。
```js
// 语法
arr.sort([compareFunction])
```
compareFunction参数是可选的，用来指定按某种顺序进行排列的函数。注意该函数有两个参数：

参数1:firstEl

第一个用于比较的元素。

参数2:secondEl

第二个用于比较的元素。看下面的例子与说明：
```js
// 未指明compareFunction函数

['Google', 'Apple', 'Microsoft'].sort(); // ['Apple', 'Google', 'Microsoft'];

// apple排在了最后:
['Google', 'apple', 'Microsoft'].sort(); // ['Google', 'Microsoft", 'apple']

// 无法理解的结果:
[10, 20, 1, 2].sort(); // [1, 10, 2, 20]
//正确的结果
[6, 8, 1, 2].sort(); // [1, 2，6, 8]

// 指明compareFunction函数
'use strict';
var arr = [10, 20, 1, 2];
    arr.sort(function (x, y) {
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    });
console.log(arr); // [1, 2, 10, 20]
```

如果没有指明 compareFunction ，那么元素会按照转换为的字符串的诸个字符的Unicode位点进行排序。例如 "Banana" 会被排列到 "cherry" 之前。当数字按由小到大排序时，10 出现在 2 之前，但因为（没有指明 compareFunction），比较的数字会先被转换为字符串，所以在Unicode顺序上 "10" 要比 "2" 要靠前。

如果指明了 compareFunction ，那么数组会按照调用该函数的返回值排序。即 a 和 b 是两个将要被比较的元素：

如果 compareFunction(a, b) 小于 0 ，那么 a 会被排列到 b 之前；

如果 compareFunction(a, b) 等于 0 ， a 和 b 的相对位置不变。备注：ECMAScript 标准并不保证这一行为，而且也不是所有浏览器都会遵守（例如 Mozilla 在 2003 年之前的版本）；

如果 compareFunction(a, b) 大于 0 ， b 会被排列到 a 之前。compareFunction(a, b) 必须总是对相同的输入返回相同的比较结果，否则排序的结果将是不确定的。

sort排序算法的底层实现
看了上面sort的排序介绍，我想小伙伴们肯定会对sort排序算法的内部实现感兴趣，我在sf上面搜了一下，发现有些争议。于是去查看了V8引擎的源码，发现在源码中的710行

源码地址：[https://github.com/v8/v8/blob/ad82a40509c5b5b4680d4299c8f08d6c6d31af3c/src/js/array.js](https://github.com/v8/v8/blob/ad82a40509c5b5b4680d4299c8f08d6c6d31af3c/src/js/array.js)

// In-place QuickSort algorithm.
// For short (length <= 22) arrays, insertion sort is used for efficiency.
V8 引擎 sort 函数只给出了两种排序 InsertionSort和 QuickSort，数量小于等于22的数组使用 InsertionSort，比22大的数组则使用 QuickSort，有兴趣的可以看看具体算法实现。

注意：不同的浏览器引擎可能算法实现并不同，我这里只是查看了V8引擎的算法实现，有兴趣的小伙伴可以查看下其他开源浏览器具体sort的算法实现。

如何改进排序算法实现数字正确排序呢？
对于要比较数字而非字符串，比较函数可以简单的以 a 减 b，如下的函数将会将数组升序排列，降序排序则使用b-a。
```js
let compareNumbers= function (a, b) {
    return a - b;
}
let koala=[10, 20, 1, 2].sort(compareNumbers)

console.log(koala);
// [1 , 2 , 10 , 20]
```