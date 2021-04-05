---
prev: /javascript/jslint
next: /javascript/p6-questions
---

# orientation 

移动端的浏览器一般支持window.orientation 这个参数，通过这个参数可以判断手机是属于横屏还是竖屏状态，从而根据实际需求而执行相应的程序。通过添加监听事件onorientationchange,进行执行就可以了

```js

function orientationchange(event) {
  if([0, 180].includes(window.orientation)) {
      console.log('landscape', event)
  }
  if([90, -90].includes(window.orientation)) {
      console.log('portrait', event)
  }
}
window.addEventListener('orientationchange', orientationchange, false)

// window.addEventListener('resize', orientationchange, false)


```