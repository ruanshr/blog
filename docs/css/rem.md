# rem适配移动端的原理和应用场景

我们在H5项目终端适配采用的是淘宝那套《flexible实现手淘H5页面的终端适配》方案。主要原理是rem布局。

### 概念

#### em

em 作为font-size的单位时，其代表父元素的字体大小，em作为其他属性单位时，代表自身字体大小

比如父元素font-size:12px

自身元素如果写成: font-size:2em;则自身元素用px表示就是24px（相对父元素字体大小）

但是自身元素设置：width:2em;则自身元素用px表示就是48px（自身设置了font-size:2em,相对自身字体大小）

#### rem

rem作用于非根元素时，相对于根元素字体大小；rem作用于根元素字体大小时，相对于其初始字体大小

比如根元素（html）设置了font-size:12px;非跟元素设置width:2rem;则换成px表示就是24px；

如果根元素设置成font-size:1rem;则根元素换成px就是相对于初始字体大小，一般是12px


#### vm/vh

vw：视口宽度的1/100; vh：视口高度的1/100 

在pc端，视口宽高就是浏览器的宽高

在移动端，这个还不太一样，不过一般设置：

```html

<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
```

代码以显示网页的屏幕宽度定义了视窗宽度。网页的比例和最大比例被设置为100%

### 剖析rem布局原理

假设将屏幕平局分为10份，每一份宽度用一个a表示；即a为屏幕宽度/10;那么

```css
div{ width: 5a; } /** 屏幕宽度的50% **/
```

但是css中没有a这个单位，css有相对单位rem，可以实现借助rem代替a
如：
```css
html{ font-size: 16px;} div { width: 2rem;}
```

那么问题类了？怎么让html元素字体大小恒等于屏幕的1/10呢？如iphone6宽是375px; font-size:37.5px;

```css
html { font-size: width / 10; } div { width:5rem;}
```

用js很容易动态设置html的font-size恒等于屏幕的1/10；我们可以在页面dom ready、resize和屏幕选择中设置

```js
document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
```

如何把设计稿的像素单位换成以rem为单位呢；可以用一个比例来计算；如设计稿宽度为750px；某个元素量得为75px；那么：

75px / 750px = 计算所得 rem / 10rem,所以计算所得rem=75px；所以我们在样式中写width:1rem;实际宽度是75px；同理，如果设计稿总宽度是640px；则1rem=64px
预处理函数可以优化：
$ue-width:750; /** 设计稿图的宽度 **/
```less
@function px2rem($px) { @return #{$px / $ue-width*10}rem;} 

div { width: pm2rem(100);} /** 编译后 div{ width:1.5625rem;} **/

```

### rem 万能吗？

rem是一种弹性布局，它强调等比缩放，100%还原。它和响应式布局不一样，响应式布局强调不同屏幕要有不同的显示，比如媒体查询。

字体并不适合使用rem，字体的大小和字体的宽度，并不成线性关系，所以字体大小不能用rem；由于设置了根元素字体的大小，会影响所有没有设置字体大小的元素，因为字体大小是会继承的。

我们可以在body上做字体修正，比如把body字体大小设置为16px，但如果用户自己设置了更大的字体，此时用户的设置将失效，比如合理的方案是，将其设置为用户默认字体大小
````css
html { font-size: width / 10}
body { font-size: 16px;}
```
字体大小我们可以用媒体查询和em来实现

```css
@media screen and (min-width:320px) {
    body {
        font-size:16px;
    }
} 

@media screen and (min-width:481px) and (max-width:640px) {
    body {
        font-size:18px;
    }
}


@media screen and (min-width:641px) {
    body {
        font-size:20px;
    }
}

div {
    font-size:1.2em;
}
```

在制作H5的页面中，rem并不适合用到段落文本上。所以在flexible整个设配方案中，考虑文本还是使用px作为单位。只不过使用[data-dpr]属性来区分不同dpr下的文体字号大小

```
.selector { width:2rem; border: 1px solid #ddd;}
[data-dpr="1"] .selector { font-size: 14px;}
[data-dpr="2"] .selector { font-size: 28px;}
[data-dpr="3"] .selector { font-size: 42px;}

```

当然你可以给非根元素设置适合的字体

### rem布局方案

从上可以看出最好的弹性布局方案就是rem+js的方案；《flexible实现手淘h5页面的终端适配》就是采用rem+js实现的。flexible主要做了几点

动态改写&lt;meta&gt;标签给&lt;html&gt;元素添加data-dpr属性，并且动态改写data-dpr的值，给&lt;html&gt;元素添加font-size属性，并且动态改写font-size的值

### em可以用来做弹性布局吗

上面知道，一旦某个阶段的字体大小发生变化，其他节点也随之变化，所以不适合，但是可以用来处理字体还是绝妙的


### vm / vh 可以用来做弹性布局？

可以  vm - 视口宽度的1/100; vh - 视口高度的1/100; 