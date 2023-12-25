---
order: 16
---

# 事件监听

很久以前，`addEventListener()` 的参数约定是这样的：

```js
addEventListener(type, listener, useCapture)
```

后来，最后一个参数，也就是控制监听器是在捕获阶段执行还是在冒泡阶段执行的 `useCapture` 参数，变成了可选参数（传 `true` 的情况太少了），成了：

```js
addEventListener(type, listener[, useCapture ])
```

17 年底，DOM 规范做了修订：`addEventListener()` 的第三个参数可以是个对象值了，也就是说第三个参数现在可以是两种类型的值了：

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

三个属性都是布尔类型的开关，默认值都为 `false`。其中 `capture` 属性等价于以前的 `useCapture` 参数；`once` 属性就是表明该监听器是一次性的，执行一次后就被自动 `removeEventListener` 掉，还没有浏览器实现它；`passive` 属性是本文的主角，`Firefox` 和 `Chrome` 已经实现，先看个 `Chrome` 官方的视频介绍（单击播放）：

很多移动端的页面都会监听 `touchstart` 等 `touch` 事件，像这样：

```js
document.addEventListener("touchstart", function(e){
... // 浏览器不知道这里会不会有 e.preventDefault()
})
```

由于 `touchstart` 事件对象的 `cancelable` 属性为 `true`，也就是说它的默认行为可以被监听器通过` preventDefault()` 方法阻止，那它的默认行为是什么呢，通常来说就是滚动当前页面（还可能是缩放页面），如果它的默认行为被阻止了，页面就必须静止不动。但浏览器无法预先知道一个监听器会不会调用 `preventDefault()`，它能做的只有等监听器执行完后再去执行默认行为，而监听器执行是要耗时的，有些甚至耗时很明显，这样就会导致页面卡顿。视频里也说了，即便监听器是个空函数，也会产生一定的卡顿，毕竟空函数的执行也会耗时。

视频里还说了，有 80% 的滚动事件监听器是不会阻止默认行为的，也就是说大部分情况下，浏览器是白等了。所以，`passive` 监听器诞生了，`passive` 的意思是“顺从的”，表示它不会对事件的默认行为说 `no`，浏览器知道了一个监听器是 `passive` 的，它就可以在两个线程里同时执行监听器中的 `JavaScript` 代码和浏览器的默认行为了。

下面是在 `Chrome` for `Android` 上滚动 `cnn.com` 页面的对比视频，右边在注册 `touchstart` 事件时添加了` {passive: true}` 选项，左边没有，可以看到，右边的顺畅多了。

假如在一个 `passive` 的监听器里执行了 `preventDefault()` 会怎么样？
假如有人不小心在 `passive` 的监听器里调用了 `preventDefault()`，也无妨，因为 `preventDefault()` 不会产生任何效果。用自定义事件演示一下这种情况：

```js
let event = new Event('foo', {
  // 创建一个 type 为 foo 的事件对象，可以被阻止默认行为
  cancelable: true
})

document.addEventListener(
  'foo',
  function (event) {
    // 在 document 上绑定 foo 事件的监听函数
    console.log(event.defaultPrevented) // false
    event.preventDefault()
    console.log(event.defaultPrevented) // 还是 false，preventDefault() 无效
  },
  {
    passive: true
  }
)

document.dispatchEvent(event) // 派发自定义事件
```

同时，浏览器的开发者工具也会发出警告：

`Chrome` 下：

`Firefox` 下：

开发者工具的支持
除了上面在 `passive` 的监听器里调用 `preventDefault()` 会发出警告外，`Chrome` 的开发者工具还会：

1. 发现耗时超过 `100` 毫秒的非 `passive` 的监听器，警告你加上 `{passive: true}`：

2) 给监听器对象增加 `passive` 属性，监听器对象在普通页面中是获取不到的，可以在` Event Listeners` 面板中和通过调用`getEventListeners()` `Command Line API` 获取到：

`Firefox` 的开发者工具目前还没有这些。

现在该如何调用 `removeEventListener`？
以前，在第三个参数是布尔值的时候，`addEventListener("foo", listener, true)` 添加的监听器，必须用 `removeEventListener("foo", listener, true)` 才能删除掉。因为这个监听器也有可能还注册在了冒泡阶段，那样的话，同一个监听器实际上对应着两个监听器对象（通过 `getEventListeners()` 可看到）。

那现在 `addEventListener("foo", listener, {passive: true}) `添加的监听器该如何删除呢？答案是 `removeEventListener("foo", listener)` 就可以了，`passive` 可以省略，原因是：在浏览器内部，用来存储监听器的 `map` 的 `key` 是由事件类型，监听器函数，是否捕获这三者组成的，`passive` 和 `once` 不在其中，理由显而易见，一个监听器同时是 `passive` 和非 `passive`（以及同时是 `once` 和非 `once`）是说不通的，如果你添加了两者，那么后添加的不算，浏览器会认为添加过了：

```js
addEventListener('foo', listener, { passive: true })
addEventListener('foo', listener, { passive: false }) // 这句不算

addEventListener('bar', listener, { passive: false })
addEventListener('bar', listener, { passive: true }) // 这句不算
```

所以说在 removeEventListener 的时候永远不需写 `passive` 和 `once`，但 `capture` 可能要：

```js
addEventListener('foo', listener, { capture: true })
removeEventListener('foo', listener, { capture: true })
// {capture: true} 必须加，当然 {capture: true} 换成 true 也可以
```

### `passive` 不能保证什么

`passive` 监听器能保证的只有一点，那就是调用 `preventDefault()` 无效，至于浏览器对默认行为卡顿的优化，那是浏览器的事情，是在规范要求之外的。鉴于这个新特性本来就是为解决滚动和触摸事件的卡顿而发明的，目前 `Chrome` 和 `Firefox` 支持优化的事件类型也仅限这类事件，比如 `touchstart`，`touchmove`，`wheel `等事件，具体的事件列表我无法提供，也许得研读源码才行。

但我可以列举几个浏览器不优化的事件类型，还附带 demo：

除了这三种事件类型外，所有 `Cancelable` 为 `true` 的事件类型理论上都是可以有这种优化的， 可以看看这个 `UI` 事件类型列表，还有这个触摸事件类型列表，注意 `Cancelable` 列。

`Firefox` 的 `APZ` 优化
在 `passive` 规范之前，`Firefox` 就已经有了自己对滚动触摸行为卡顿问题的优化，其中有个关键做法是，不尊重 `preventDefault()`：如果在一定时间之内没有调用 `preventDefault()`，那 `Firefox` 就假定你不会阻止默认滚动了，比如执行下面这句后，页面会无法滚动：

```js
addEventListener('wheel', function (e) {
  e.preventDefault()
})
```

但执行这句后照样能滚动：

```js
addEventListener('wheel', function (e) {
  sleep(300)
  e.preventDefault() // 这句在 Firefox 中无效
})
```

这篇博客讲了 `APZ` 优化：`Smoother scrolling in Firefox 46 with APZ`

特性检测
下面是从 `Modernizr` 里复制的检测脚本：

```js
var supportsPassiveOption = false
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function () {
      supportsPassiveOption = true
    }
  })
  window.addEventListener('test', null, opts)
} catch (e) {}
```

可以这么用：

```js
if (supportsPassiveOption) {
  document.addEventListener('foo', listener, { passive: true })
  // 旧浏览器里第三参数会被自动转成 true，不是我们想要的
} else {
  document.addEventListener('foo', listener)
}
```

要 `passive` 都得 `passive`
对于在同一个 `DOM` 对象身上添加的同一类型事件的监听器，只要有一个不是 `passive` 的，那浏览器就无法优化。
