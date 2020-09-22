/**
* 评测题目: 选择三个及以上你熟悉题目完成 时间40分钟，
* 尽量使用es6 语法和新api编写
* 请自行编写每个方法的单测方法，如需运行自行在控制台运行


// 1 实现一个方法让页面平滑滚动到顶部，需要动画过度，动画时间可指定
// window.scrollTo(x,y)
function scrollToTopAnimation(time){
	
}

// 2
// 实现一个方法，拉平Object
// const obj = { a: { b: { c: 1 } }, d: 1,e:{f:0} }
// flattenObject(obj); // { 'a.b.c': 1, d: 1 ,'e.f':0}
function flattenObject(obj){
  
}

// 3
// 实现一个方法，可以根据 key 获取到object 对应的值
const data = {
    a:[{b:1},{c:2}],
    b:{bb:{cc:11}}
}
getObjectDataByKey(data,'a[0].b') ==>1
getObjectDataByKey(data,'a[1].c') ==>2
getObjectDataByKey(data,'b.bb.cc') ==>11

function getObjectDataByKey(obj, key){
}

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

// 6  Promise.all 的实现

// 7 斐波那契数列

function fb(n) {
  if(n == 0 || n == 1){
return 1
  }
  return n - 1 + fb( n -1)
}

// 8 二分查找

// 9 函数节流的实现

function deb(fun, time) {
const timer = null
return function() {
if(timer) {
clearTimeout(timer)
}
timer = setTimeout(fn, time)

}

}

// 10 假设 Function 原型上没后 bind 方法，请实现一个bind方法，注意参数的处理
Function.prototype.bind = function(obj, ...params) {
const that = this
return function(...args) {
   return that.apply(obj, params.concat(args)
}

};

