---
order: 5
---

# rem 适配移动端的原理和应用场景

我们在 H5 项目终端适配采用的是淘宝那套《flexible 实现手淘 H5 页面的终端适配》方案。主要原理是 rem 布局。

### 概念

#### em

em 作为 font-size 的单位时，其代表父元素的字体大小，em 作为其他属性单位时，代表自身字体大小

比如父元素 font-size:12px

自身元素如果写成: font-size:2em;则自身元素用 px 表示就是 24px（相对父元素字体大小）

但是自身元素设置：width:2em;则自身元素用 px 表示就是 48px（自身设置了 font-size:2em,相对自身字体大小）

#### rem

rem 作用于非根元素时，相对于根元素字体大小；rem 作用于根元素字体大小时，相对于其初始字体大小

比如根元素（html）设置了 font-size:12px;非跟元素设置 width:2rem;则换成 px 表示就是 24px；

如果根元素设置成 font-size:1rem;则根元素换成 px 就是相对于初始字体大小，一般是 12px

#### vw/vh

vw：视口宽度的 1/100; vh：视口高度的 1/100

在 pc 端，视口宽高就是浏览器的宽高

在移动端，这个还不太一样，不过一般设置：

```html
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
```

代码以显示网页的屏幕宽度定义了视窗宽度。网页的比例和最大比例被设置为 100%

### 剖析 rem 布局原理

假设将屏幕平局分为 10 份，每一份宽度用一个 a 表示；即 a 为屏幕宽度/10;那么

```css
div {
  width: 5a;
} /** 屏幕宽度的50% **/
```

但是 css 中没有 a 这个单位，css 有相对单位 rem，可以实现借助 rem 代替 a
如：

```css
html {
  font-size: 16px;
}
div {
  width: 2rem;
}
```

那么问题类了？怎么让 html 元素字体大小恒等于屏幕的 1/10 呢？如 iphone6 宽是 375px; font-size:37.5px;

```css
html {
  font-size: width / 10;
}
div {
  width: 5rem;
}
```

用 js 很容易动态设置 html 的 font-size 恒等于屏幕的 1/10；我们可以在页面 dom ready、resize 和屏幕选择中设置

```js
document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px'
```

如何把设计稿的像素单位换成以 rem 为单位呢；可以用一个比例来计算；如设计稿宽度为 750px；某个元素量得为 75px；那么：

`75px / 750px = 计算所得 rem / 10rem`,所以计算所得 rem=75px；所以我们在样式中写 width:1rem;实际宽度是 75px；同理，如果设计稿总宽度是 640px；则 1rem=64px
预处理函数可以优化：
$ue-width:750; /** 设计稿图的宽度 **/

```less
@function px2rem($px) { @return #{$px / $ue-width*10}rem;}

div { width: pm2rem(100);} /** 编译后 div{ width:1.5625rem;} **/

```

### rem 万能吗？

rem 是一种弹性布局，它强调等比缩放，100%还原。它和响应式布局不一样，响应式布局强调不同屏幕要有不同的显示，比如媒体查询。

字体并不适合使用 rem，字体的大小和字体的宽度，并不成线性关系，所以字体大小不能用 rem；由于设置了根元素字体的大小，会影响所有没有设置字体大小的元素，因为字体大小是会继承的。

我们可以在 body 上做字体修正，比如把 body 字体大小设置为 16px，但如果用户自己设置了更大的字体，此时用户的设置将失效，比如合理的方案是，将其设置为用户默认字体大小

```css
html {
  font-size: width / 10;
}
body {
  font-size: 16px;
}
```

字体大小我们可以用媒体查询和 em 来实现

```css
@media screen and (min-width: 320px) {
  body {
    font-size: 16px;
  }
}

@media screen and (min-width: 481px) and (max-width: 640px) {
  body {
    font-size: 18px;
  }
}

@media screen and (min-width: 641px) {
  body {
    font-size: 20px;
  }
}

div {
  font-size: 1.2em;
}
```

在制作 H5 的页面中，rem 并不适合用到段落文本上。所以在 flexible 整个设配方案中，考虑文本还是使用 px 作为单位。只不过使用[data-dpr]属性来区分不同 dpr 下的文体字号大小

```
.selector { width:2rem; border: 1px solid #ddd;}
[data-dpr="1"] .selector { font-size: 14px;}
[data-dpr="2"] .selector { font-size: 28px;}
[data-dpr="3"] .selector { font-size: 42px;}

```

当然你可以给非根元素设置适合的字体

### rem 布局方案

从上可以看出最好的弹性布局方案就是 rem+js 的方案；《flexible 实现手淘 h5 页面的终端适配》就是采用 rem+js 实现的。flexible 主要做了几点

动态改写&lt;meta&gt;标签给&lt;html&gt;元素添加 data-dpr 属性，并且动态改写 data-dpr 的值，给&lt;html&gt;元素添加 font-size 属性，并且动态改写 font-size 的值

### em 可以用来做弹性布局吗

上面知道，一旦某个阶段的字体大小发生变化，其他节点也随之变化，所以不适合，但是可以用来处理字体还是绝妙的

### vw/ vh 可以用来做弹性布局？

可以 `vw` - 视口宽度的 1/100; `vh` - 视口高度的 1/100;

```css

.container {
  width: 10vw;
}

```

