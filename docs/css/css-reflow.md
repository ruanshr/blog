---
prev: /css/css-position
next: /css/css-standard
---

# 重绘和重排

### render树的构建


浏览器取回代码后，首先会构造DOM树，根据HTML标签，构造DOM数
之后会解析CSS样式，解析的顺序是浏览器的样式->用户自定义的样式->页面的link标签等引进来的样式->写在style标签里面的内联样式

最后根据DOM树以及解析的CSS样式，构造render树，render树中，会把DOM树中没有的元素给去除，比如head标签以及里面的内容，以及display:none的元素也会别去除

一旦render树构建完成，浏览器会把树里面的内容绘制在屏幕上
```js

<html>
 <head>
  <title>test page</title>
 </head>
 <body>
    <h1>welcome come</h1>
    <div style="display:none">
       hide content
    </div>
    <div>
        <img src="...">
    </div>
    ...

 </body>
</html>
```
构造的DOM树如下

```js

documentElement (html)
  head
    title
  body
    h1
      [text node]
    div 
      [text node]
    div 
      img
    ...

```

### 重绘（repaint）和重排（reflow）
当DOM的变化影响了元素的几何属性（宽或高），浏览器需要重新计算元素的几何属性，同样其他元素的几何属性和位置也会受到影响。浏览器会使渲染树中受影响的步伐失效，并重新构造渲染树。这个过程称为重排。完成重排后，浏览器会重新绘制受影响的步伐到屏幕，这个过程称为重绘。并不是所有的DOM变化都会影响几何属性，比如改变一个元素的背景颜色并不会影响元素的宽和高，这个情况下只会发生重绘。

重排必然导致重绘，所以应该设法怎么避免触发多次重排


### 重排何时发生
1、添加或者删除可见的DOM元素
2、元素位置改变
3、元素尺寸改变
4、元素内容改变
5、页面渲染初始化
6、浏览器窗口尺寸改变

### 浏览器的自动优化
```js
const $ele = document.querySelector('#myDiv')
$ele.style.borderLeft = '1px'
$ele.style.borderRight = '2px'
$ele.style.padding = '5px'

```

虽然元素的样式改变了三次，但是浏览器并不是每次都马上触发的。浏览器通过队列或修改并批量执行来优化重排过程，但是有时候会（不知不觉的）强制刷新队列并要求计划任务立即执行。获取布局信息的操作会导致队列刷新，比如：
```js
offsetTop,offsetLeft,offsetWidth,offsetHeight
scrollTop,scrollLeft,scrollWidth,scrollHeight
clientTop,clientLeft,clientWidth,clientHeight
getComputedStyle() 
```
因此，尽量不要在修改样式或者布局信息时查询样式，因为查询的时候会强制重排，导致浏览器无法优化多次重排


使用绝对定位页面上的动画元素，将其脱离文档流，可以有效的防止重排。比如有时候做动画特效是，通过设置position:absolute可以有效的减少重排。

### 只触发重绘有哪些
```js
color	border-style
visibility	background
text-decoration	background-image
background-position	background-repeat
outline-color	outline
outline-style	border-radius
outline-width	box-shadow
background-size	
```

### transform是否可以避免重排重绘问题
使用CSS3的transform来实现动画是否可以避免重排问题？或者说浏览器针对这一部分做了其他优化？

CSS的最终表现分为以下四部：recalculate style -> layout -> Paint Setup and Paint -> Composite Layers
就是查找并计算样式 -> 排布 -> 绘制 -> 组合层
也就是说重排必定导致重绘，而查询属性会强制发送重排。

由于transform是位于Composite Layers 层的，而width，left，margin等则位于Layout层，在Layout层发生的改变必定导致 Paint Setup and Paint -> Composite Layers,所以相对而言使用transform实现的动画效果肯定比left这些更加流畅

### Composite Layers
浏览器在渲染过程中会将一些含有特殊样式的DOM结构绘制于其他图层，有点类似于PhotoShop的图层概念。一张图片在PotoShop是由多个图层组合而成，而浏览器最终显示的页面实际也是有多个图层构成的。

下面这些因素都会导致新图层的创建：
```js
进行3D或者透视变换的CSS属性
使用硬件加速视频解码的<video>元素
具有3D（WebGL）上下文或者硬件加速的2D上下文的<canvas>元素
组合型插件（即Flash）
具有有CSS透明度动画或者使用动画式Webkit变换的元素
具有硬件加速的CSS滤镜的元素
```