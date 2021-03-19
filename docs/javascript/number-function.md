---
prev: /javascript/jslint
next: /javascript/orientation
---
# javascript 数字Number详解

JavaScript 的 Number 对象是经过封装的能让你处理数字值的对象。Number 对象由 Number() 构造器创建。
JavaScript的Number类型为双精度IEEE 754 64位浮点类型。
最近出了stage3BigInt 任意精度数字类型，已经进入stage3规范


通过new 创建出来的对象与Number函数返回的值类型是不同的
```js
// new Number(value); 
var a = new Number('123'); // a === 123 is false
var b = Number('123'); // b === 123 is true
a instanceof Number; // true
b instanceof Number; // false
typeof  a // object
typeof b  // number
a == b // true

var c = Number('12a')  // NaN

```

Number 对象主要用于：
如果参数无法被转换为数字，则返回 NaN。
在非构造器上下文中 (如：没有 new 操作符)，Number 能被用来执行类型转换。

### Number 的属性

- Number.EPSILON
两个可表示(representable)数之间的最小间隔。
EPSILON 属性的值接近于 2.2204460492503130808472633361816E-16，或者 2^52。

```js

function getRealNum(num) {
   if(num - num.toFixed(16) < Number.EPSILON) {
      return Number(num.toFixed(16))
   }
   return NaN
}

```

- Number.MAX_SAFE_INTEGER
JavaScript 中最大的安全整数 (2的53次幂 - 1)。

- Number.MAX_VALUE
能表示的最大正数。最小的负数是 -MAX_VALUE。
MAX_VALUE 属性值接近于 1.79E+308。大于 MAX_VALUE 的值代表 "Infinity"。
因为 MAX_VALUE 是 Number 对象的一个静态属性，所以你应该直接使用Number.MAX_VALUE ，而不是作为一个创建的 Number 实例的属性

```js
console.log(BigInt(Number.MAX_VALUE))
//179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368n

console.log(Number.MAX_VALUE)              // 1.7976931348623157e+308

console.log(Number.MAX_VALUE.toString(2))  // 返回字符串长度为1024   // Math.pow(2,1023)

console.log(Number.MAX_VALUE + 1)          // 精度丢失

```

- Number.MIN_SAFE_INTEGER
JavaScript 中最小的安全整数 (-(2的53次幂 - 1)).

- Number.MIN_VALUE
能表示的最小正数即最接近 0 的正数 (实际上不会变成 0)。最大的负数是 -MIN_VALUE。
```js
console.log(Number.MIN_VALUE)              // 5e-324
```
- Number.NaN
特殊的“非数字”值。
- Number.NEGATIVE_INFINITY
特殊的负无穷大值，在溢出时返回该值。
- Number.POSITIVE_INFINITY
特殊的正无穷大值，在溢出时返回该值。
- Number.prototype
Number 对象上允许的额外属性。

### Number 的原型链上的方法
- Number.prototype.toString
返回数字的字符串，可接受参数 redix，表示进制 取值范围 2 ~ 36 之间的整数
```js
let n = 7..toString(2) // 原始类型是没有属性的，但是 ..运算符可以将使用原始类型的引用对象，仅限于 number,boolean
let m = Number(7).toString(2)
let a = 7
let b = a.toString(2)
let c = (new Number(7)).toString(2)

```

- Number.prototype.valueOf
返回原始类型
```js

console.log(typeof Number('24').valueOf())  // number

```

- Number.isNaN()
确定传递的值是否是 NaN。

```js
Number.isNaN(NaN)  // true
Number.isNaN('a')  // false

isNaN('a')  // true

function myIsNaN(value) {
  return typeof(value) === 'number' && isNaN(value)
}

```

### Number 的方法
- Number.isFinite()
确定传递的值类型及本身是否是有限数。
```js
Number.isFinite(Infinity);  // false
Number.isFinite(NaN);       // false
Number.isFinite(-Infinity); // false
Number.isFinite(0);         // true
Number.isFinite(2e64);      // true
Number.isFinite('0');       // false, 全局函数 isFinite('0') 会返回 true
```

- Number.isInteger()
确定传递的值类型是“number”，且是整数。
```js
Number.isInteger(99)    // true
Number.isInteger(99.99) // false
Number.isInteger(null)  // false
Number.isInteger()      // false
```

- Number.isSafeInteger()
确定传递的值是否为安全整数 ( -(2的53次幂 - 1) 至 2的53次幂 - 1之间)。
MAX_SAFE_INTEGER 是一个值为 9007199254740991的常量。因为Javascript的数字存储使用了IEEE 754中规定的双精度浮点数数据类型，而这一数据类型能够安全存储 -(253 - 1) 到 253 - 1 之间的数值（包含边界值）。
这里安全存储的意思是指能够准确区分两个不相同的值，例如 Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2 将得到 true的结果，而这在数学上是错误的。需要用到BigInt
由于 MAX_SAFE_INTEGER 是Number的一个静态属性，所以你不用自己动手为Number对象创建Number.MAX_SAFE_INTEGER这一属性，就可以直接使用它。

- Number.toInteger() 
计算传递的值并将其转换为整数 (或无穷大)。

- Number.parseFloat()
和全局对象 parseFloat() 一样。
参数string：要解析的值。 如果此参数不是字符串，则使用toString抽象操作将其转换为字符串。忽略此参数中的前导空格。
返回值： 取 string 参数从左开始不是空字符串开始，如果是数字则开始转换，直到不是数字的字符串和小数点，小数点只能取第一个，第二个小数点则截取

```js
let a1 = Number.parseFloat(' 6d') // 6
let a2 = Number.parseFloat('6.434') // 6.434
let a3 = Number.parseFloat('6.4.34') // 6.4
let a4 = Number.parseFloat('a6323') // NaN
let a5 = Number.parseFloat(undefined) // NaN
let a6 = Number.parseFloat(null) // NaN
let a7 = Number.parseFloat(false) // NaN

```

- Number.parseInt()
和全局对象 parseInt() 一样。
Number.parseInt(string[, radix])
参数string：要解析的值。 如果此参数不是字符串，则使用toString抽象操作将其转换为字符串。忽略此参数中的前导空格。
参数radix：一个介于2到36之间的整数，代表字符串的基数(数学数字系统中的基)。如果为0则忽略，默认为10进制
返回值： 取 string 参数从左开始不是空字符串开始，如果是数字则开始转换，直到不是数字的字符串（包括小数点，所以是取整数部分）
```js
let a1 = Number.parseInt(' 7d') // 7
let a2 = Number.parseInt('7.434') // 7
let a3 = Number.parseInt('a7323') // NaN
let a4 = Number.parseInt(undefined) // NaN
let a5 = Number.parseInt(null) // NaN
let a6 = Number.parseInt(false) // NaN

```
```js

let a1 = Number.parseInt('1', 0) // 1
let a2 = Number.parseInt('1', 1) // NaN  
let a3 = Number.parseInt('12', 2) // 1 
// 技巧: string 每个字符都不能大于 radix
// 从左到右 如果字符大于右边的值则中断计算
// a - z （忽略大小写）值 分别代表 10 - 35
let a4 = Number.parseInt('123',3) //  Number.parseInt('123',3) 与 Number.parseInt('12',3) 计算一样 值为5

[0,1,2].map(Number.parseInt) // [0,NaN,NaN]

[1,2,3].map(Number.parseInt) // [1, NaN, NaN]

[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(Number.parseInt) // [0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN , 10, 12, 14, 16] 
// parseInt(10,10)  10
// parseInt(11,11)  11 + 1 = 12
// parseInt(12,12)  12 + 2 = 14

```