# 阿里笔试题

// 1 实现一个方法让页面平滑滚动到顶部，需要动画过度，动画时间可指定
// window.scrollTo(x,y)
```js
function scrollToTopAnimation(time){
	
}
```

// 2
// 实现一个方法，拉平Object
// const obj = { a: { b: { c: 1 } }, d: 1,e:{f:0} }
// flattenObject(obj); // { 'a.b.c': 1, d: 1 ,'e.f':0}
```js
function flattenObject(obj, prefix = ''){
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? prefix + '.' : ''
    const temp = obj[key]
    if(typeof temp === 'object') {
      Object.assign(acc, flattenObject(temp, pre + key))
    } else {
      acc[pre + key] = temp
    }
    return acc
  }, {})
}
```

// 3
// 实现一个方法，可以根据 key 获取到object 对应的值
const data = {
    a:[{b:1},{c:2}],
    b:{bb:{cc:11}}
}
getObjectDataByKey(data,'a[0].b') ==>1
getObjectDataByKey(data,'a[1].c') ==>2
getObjectDataByKey(data,'b.bb.cc') ==>11

```js
function getObjectDataByKey(obj, key){
  key.split('.').forEach(k => {
    const matchs = k.match(/^(\w+)\[(\d+)\]$/)
    if(matchs){
      obj = obj[matchs[1]][matchs[2]]
    } else {
      obj = obj[k]
    }
  })
  return obj
}
```

// 4、请使用原生代码实现一个Events模块，可以实现自定义事件的订阅、触发、移除功能，如
/*
const fn1 = (...args)=>console.log('I want sleep1',...args)
const fn2 = (...args)=>console.log('I want sleep2',...args)
const event = new Events();
event.on('sleep', fn1, 1, 2, 3);
event.on('sleep', fn2, 1, 2, 3);
event.fire('sleep', 4, 5, 6);
// I want sleep1 1 2 3 4 5 6
// I want sleep2 1 2 3 4 5 6

event.off('sleep', fn1);
event.once('sleep', ()=>console.log('I want sleep'));
event.fire('sleep');
*/

// 5、字符串去重、并统计出出现次数最多的那个字符，实现一个方法返回去重后的字符串和出现次数最多的字符
```js
function getUnicleStringAndMaxChar(str) {
  const map = new Map();
  str.split('').forEach((s) => {
 		let count = map.get(s)
    map.set(s, count ? count + 1 : 1)
  })
  let max = 0
  const result = {}
  for(let item of map){
    const [key, value] = item;
    if(value > max) {
      max = value
      result.str = key
      result.count = value
    }
  }
  return result
}
```

// 6  Promise.all 的实现

// 7 斐波那契数列
```js
function fb(n) {
  if(n == 0 || n == 1){
    return 1
  }
  return fb(n - 1) + fb( n - 2)
}

function fb2(n) {
  if(n === 1 || n === 0) {
    return 1
  }
  let temp = [1, 1]
  for(let i = 1; i < n; i++) {
    const [a , b] = temp
    temp = [b , a + b]
  }
  return temp[1]
}
```

// 8 二分查找

// 9 函数节流的实现
```js
function debounce(fun, wait) {
  let timeout
  return function (...args) {
    const ctx = this
    if(timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func.apply(ctx,args)
    }, wait) 
  }
}

```
// 10 假设 Function 原型上没后 bind 方法，请实现一个bind方法，注意参数的处理
```js
Function.prototype.bind = function(obj, ...params) {
  const func = this
  return function handle(...args) {
    if(this instanceof handle) {
      obj = this
    }
    return func.apply(obj, params.concat(args))
  }
};

```


