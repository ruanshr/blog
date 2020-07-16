# DOM 之 addEventListener详解

Vue 官方文档有这么一个说明

> 不要把 .passive 和 .prevent 一起使用，因为 .prevent 将会被忽略，同时浏览器可能会向你展示一个警告。请记住，.passive 会告诉浏览器你不想阻止事件的默认行为。

那么究竟是为什么呢? 这需要说到 DOM 的 addEventListener

一开始，addEventListener 的参数约定是这样的

```js
// useCapture 捕获
addEventListener(type, listener, useCapture)

```

后来，最后一个参数，也就是控制监听器是在捕获阶段执行还是在冒泡阶段执行的 useCapture 参数，变成了可选参数（传 true 的情况太少了），成了：

```js
addEventListener(type, listener[, useCapture ])
```

新版 DOM 规范做了修订：addEventListener() 的第三个参数可以是个对象值了，也就是说第三个参数现在可以是两种类型的值了：

```js

addEventListener(type, listener[, useCapture ])

addEventListener(type, listener[, options ])

```

这个修订是为了扩展新的选项，从而自定义更多的行为，目前规范中 options 对象可用的属性有三个：

```js
addEventListener(type, listener, {
  capture: false,
  passive: false,
  once: false
})
```

三个属性都是布尔类型的开关，默认值都为 false。其中 capture 属性等价于以前的 useCapture 参数；once 属性就是表明该监听器是一次性的，执行一次后就被自动 removeEventListener 掉；passive 属性表示它不会阻止事件的默认行为

### passive

很多移动端的页面都会监听 touchstart 等 touch 事件，像这样：

```js
document.addEventListener("touchstart", function(e){
    ... // 浏览器不知道这里会不会有 e.preventDefault()
})
```

由于 touchstart 事件对象的 cancelable 属性为 true，也就是说它的默认行为可以被监听器通过 preventDefault() 方法阻止，那它的默认行为是什么呢，通常来说就是滚动当前页面（还可能是缩放页面），如果它的默认行为被阻止了，页面就必须静止不动。但浏览器无法预先知道一个监听器会不会调用 preventDefault()，它能做的只有等监听器执行完后再去执行默认行为，而监听器执行是要耗时的，有些甚至耗时很明显，这样就会导致页面卡顿。即便监听器是个空函数，也会产生一定的卡顿，毕竟空函数的执行也会耗时。大部分的滚动事件监听器是不会阻止默认行为的，也就是说大部分情况下，浏览器是白等了。所以，passive 监听器诞生了，passive 的意思是“顺从的”，表示它不会对事件的默认行为说 no，浏览器知道了一个监听器是 passive 的，它就可以在两个线程里同时执行监听器中的 JavaScript 代码和浏览器的默认行为了。

假如在 passive 的监听器里调用了 preventDefault()，也无妨，因为 preventDefault() 不会产生任何效果。

```js
let event = new Event('bar', {
  // 创建一个 type 为 bar 的事件对象，可以被阻止默认行为
  cancelable: true
})

document.addEventListener('bar',function(event) {
    // 在 document 上绑定 bar 事件的监听函数
    console.log(event.defaultPrevented) // false
    event.preventDefault()
    console.log(event.defaultPrevented) // 还是 false，preventDefault() 无效
  },
  { passive: true }
)

document.dispatchEvent(event) // 派发自定义事件
```

Chrome 浏览器给出错误提示
VM416:11 Unable to preventDefault inside passive event listener invocation.

除了上面在 passive 的监听器里调用 preventDefault() 会发出警告外，Chrome 的开发者工具还会

#### 1. 发现耗时超过 100 毫秒的非 passive 的监听器，警告你加上 {passive: true}

#### 2. 给监听器对象增加 passive 属性，监听器对象在普通页面中是获取不到的，可以在 Event Listeners 面板中和通过调用 getEventListeners() Command Line API 获取到

### 如何调用 removeEventListener

以前，在第三个参数是布尔值的时候，addEventListener("bar", listener, true) 添加的监听器，必须用 removeEventListener("bar", listener, true) 才能删除掉。因为这个监听器也有可能还注册在了冒泡阶段，那样的话，同一个监听器实际上对应着两个监听器对象（通过 getEventListeners() 可看到）

那现在 addEventListener("bar", listener, {passive: true}) 添加的监听器该如何删除呢？答案是 removeEventListener("bar", listener) 就可以了，passive 可以省略，原因是：在浏览器内部，用来存储监听器的 map 的 key 是由事件类型，监听器函数，是否捕获这三者组成的，passive 和 once 不在其中，理由显而易见，一个监听器同时是 passive 和非 passive（以及同时是 once 和非 once）是说不通的，如果你添加了两者，那么后添加的不算，浏览器会认为添加过了：

```js
addEventListener('bar', listener, { capture: true })  // 这句算
addEventListener('bar', listener, { capture: false }) // 这句算 执行2次listener

addEventListener('bar', listener, { passive: true })
addEventListener('bar', listener, { passive: false }) // 这句不算

addEventListener('bar', listener, { passive: false })
addEventListener('bar', listener, { passive: true }) // 这句不算
```

所以说在 removeEventListener 的时候不需写 passive 和 once，但 capture 可能要：

```js
addEventListener('bar', listener, { capture: true })
removeEventListener('bar', listener, { capture: true }) // {capture: true} 必须加，当然 {capture: true} 换成 true 也可以
```

### passive 不能保证什么

passive 监听器能保证的只有一点，那就是调用 preventDefault() 无效，至于浏览器对默认行为卡顿的优化，那是浏览器的事情，是在规范要求之外的。鉴于这个新特性本来就是为解决滚动和触摸事件的卡顿而发明的，目前 Chrome 和 Firefox 支持优化的事件类型也仅限这类事件，比如 touchstart，touchmove，wheel 等事件

## 特性检测

modernizr 的检测脚本

```js
var supportsPassiveOption = false
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassiveOption = true
    }
  })
  window.addEventListener('test', null, opts)
} catch (e) {}
```

可以这样用

```js
if (supportsPassiveOption) {
  document.addEventListener('bar', listener, { passive: true }) // 旧浏览器里第三参数会被自动转成 true，不是我们想要的
} else {
  document.addEventListener('bar', listener)
}
```

### 要 passive 都得 passive

对于在同一个 DOM 对象身上添加的同一类型事件的监听器，只要有一个不是 passive 的，那浏览器就无法优化。

参考文档

[https://cn.vuejs.org/v2/guide/events.html](https://cn.vuejs.org/v2/guide/events.html)

[https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

[https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener)
