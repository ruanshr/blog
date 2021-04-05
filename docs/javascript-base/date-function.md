---
prev: /javascript-base/custom-function
next: /javascript-base/debounce-throttle
---

# javascript 日期Date详解

Date()构造函数有四种基本形式

```js
new Date();
new Date(value);
new Date(dateString);
new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);

```

**Date.length**

可接收参数个数，值为7

**Date.now()**

返回自 1970 年 1 月 1 日 00:00:00 (UTC) 到当前时间的毫秒数。

**Date.prototype.getDate()**

根据本地时间，返回一个指定的日期对象为一个月中的哪一日（从1--31）

**Date.prototype.getDay()**

根据本地时间，返回一个具体日期中一周的第几天，0 表示星期天。对于某个月中的第几天（从0--6）

**Date.prototype.getFullYear()**

根据本地时间返回指定日期的年份

**Date.prototype.getHours()**

根据本地时间，返回一个指定的日期对象的小时

**Date.prototype.getMilliseconds()**

根据本地时间，返回一个指定的日期对象的毫秒数

**Date.prototype.getMinutes()**

根据本地时间，返回一个指定的日期对象的分
钟数

**Date.prototype.getMonth()**

根据本地时间，返回一个指定的日期对象的月份，为基于0的值（0表示一年中的第一月）

**Date.prototype.getSeconds()**

根据本地时间，返回一个指定的日期对象的秒数

**Date.prototype.getTime()**

根据本地时间，返回一个时间的格林威治时间数值

```js
const currentDate = new Date()

console.log(currentDate.getFullYear())  // 2020

console.log(currentDate.getMonth())  // 6 

console.log(currentDate.getDay())  // 5

console.log(currentDate.getDate())  // 10

const invalidDate = new Date('a')

console.log(invalidDate instanceof Date) // true

console.log(invalidDate.getTime()) // NaN

// 由于safair浏览器不支持将2020-07-01 00:00:00转换成时间
// 转换成功才返回date对象，否则返回undefined
function parseDate(date) {
  let result
  if (typeof date === 'string') {
    date = date.replace(/-/g,'/') 
  }
  result = new Date(date)
  if(result instanceof Date && result.getTime()){
    return result
  }
}

```