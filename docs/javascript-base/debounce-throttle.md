---
prev: /javascript/date-function
next: /javascript/decorator
---

# 防抖（debounce）和节流（throttle）

### 防抖debounce

所谓防抖，就是指触发事件后在n秒内函数只能执行一次，如果在n秒内又触发了事件，则会重新计算函数执行事件

```js
// 非立即执行
function debounce(func, wait) {
  let timeout;
  return function () {
    let ctx = this
    let args = [].slice.call(arguments)
    if(timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(ctx, args)
    }, wait)
  }
}

// 立即执行
function debounce2(func, wait, immediate) {
  let timeout
  return function (){
    let ctx = this
    let args = [].slice.call(arguments)
    if(timeout) clearTimeout(timeout)
    if(immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if(callNow) func.apply(ctx, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(ctx, args)
      }, wait)
    }
  }
}

```

### 节流（throttle）

所谓节流，就是指连续触发事件单是在n秒中只执行一次函数。节流会稀释函数的执行频率

```js
// 时间戳版
function throttle(func ,wait) {
  let previous = 0
  return function (){
    let now = Date.now()
    let ctx = this
    let args = [].slice.call(arguments)
    if(now - previous > wait) {
       func.apply(ctx, args)
       previous = now
    }
  }
}

// 定时器版
function throttle2(func, wait) {
  let timeout
  return function() {
    let ctx = this
    let args = [].slice.call(arguments)
    if(!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(ctx, args)
      }, wait)
    }
  }

}
```