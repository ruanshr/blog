---
order: 17
---

# 元素宽高

### clientWidth 和 clientHeigh 、 clientTop 和 clientLeft

1、clientWidth 的实际宽度

clientWidth = width + 左右 padding （如果 box-sizing 为 border-box 则表示 width - 左右 border）

2、clientHeigh 的实际高度

clientHeigh = height + 上下 padding （如果 box-sizing 为 border-box 则表示 height - 上下 border）

3、clientTop 的实际宽度

clientTop = boder.top(上边框的宽度)

4、clientLeft 的实际宽度

clientLeft = boder.left(左边框的宽度)

**box-sizing 改变会改变该值（border 有值得情况下）**

### offsetWidth 和 offsetHight 、 offsetTop 和 offsetLeft

1、offsetWidth 的实际宽度

offsetWidth = width + 左右 padding + 左右 boder （如果 box-sizing 为 border-box 则表示 width）

2、offsetHeith 的实际高度

offsetHeith = height + 上下 padding + 上下 boder （如果 box-sizing 为 border-box 则表示 height）

3、offsetTop 实际宽度

offsetTop：当前元素 上边框 外边缘 到 最近的已定位父级（offsetParent） 上边框 内边缘的 距离。如果父

级都没有定位，则分别是到 body 顶部 和左边的距离

4、offsetLeft 实际宽度

offsetLeft：当前元素 左边框 外边缘 到 最近的已定位父级（offsetParent） 左边框 内边缘的             距离。如果父级都没有定位，则分别是到 body 顶部 和左边的距离

**box-sizing 改变不会改变该值**

### scrollWidth 和 scrollHeight 、 scrollTop 和 scrollLeft

1、scrollWidth 实际宽度

scrollWidth：获取指定标签内容层的真实宽度（可视区域宽度+被隐藏区域宽度）。

2、scrollHeight 的实际高度

scrollHeight：获取指定标签内容层的真实高度（可视区域高度+被隐藏区域高度）

3、scrollTop

scrollTop :内容层顶部 到 可视区域顶部的距离。

实例：var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

持续获取高度的方式：

```js
window.addEventListener('scroll', () => {
  var scrollTop =
    document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
})
```

4，scrollLeft

scrollLeft:内容层左端 到 可视区域左端的距离
