---
prev: /javascript/event-listener
next: /javascript/format
---

# Javascript 异步

JavaScript语言的一大特点就是单线程。单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。因此javascript通过Event Loop，实现异步操作。


```js
console.log(1);
setTimeout(function() {
  console.log(2);
}, 0);
console.log(3);
```

```js
const asyncFun1 = async function asyncFun1() {
  let b = 0
  console.log(4)
  await b = 1
  console.log(5)
};

// const asyncFun2 = async function asyncFun2() {
//   let b = 0
//   console.log(4)
//   await console.log(5), console.log(6), b = 1
//   console.log(7)
};

setTimeout(() => {
  console.log(0)
});

console.log(1)

new Promise(resolve => {
  console.log(2)
}).then(() => {
  console.log(3)
});

asyncFun1()

// asyncFun2()

new Promise(resolve => {
  console.log(8)
}).then(() => {
  console.log(9)
});

// process.nextTick(() => {
//   console.log(10);
// });
```

运行结果 1： 1、2、4、8、3、5、9、0

运行结果 2： 1、2、4、8、10、3、5、9、0

运行结果 3： 1、2、4、5、8、3、6、7、9、0


参考文档 [阮一峰的JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)