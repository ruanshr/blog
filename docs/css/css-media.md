# CSS Media 媒体查询使用大全，完整媒体查询总结

### 前面的话

一说到响应式设计，肯定离不开媒体查询 media。一般认为媒体查询是 CSS3 的新增内容，实际上 CSS2 已经存在了，CSS3 新增了媒体属性和使用场景(IE8-浏览器不支持)。本文将详细介绍媒体查询的内容

### 媒介类型

在 CSS2 中，媒体查询只使用于`<style></style>`和`<link>`标签中，以 media 属性存在

media 属性用于为不同的媒介类型规定不同的样式

| 属性       | 描述                                         |
| ---------- | -------------------------------------------- |
| screen     | 计算机屏幕（默认值）                         |
| tty        | 电传打字机以及使用等宽字符网格的类似媒介     |
| tv         | 电视类型设备（低分辨率、有限的屏幕翻滚能力） |
| projection | 放映机                                       |
| handheld   | 手持设备（小屏幕、有限的带宽）               |
| print      | 打印预览模式 / 打印页                        |
| braille    | 盲人用点字法反馈设备                         |
| aural      | 语音合成器                                   |
| all        | 适合所有设备                                 |

真正广泛使用且所有浏览器都兼容的媒介类型是'screen'和'all'

```html
<style media="screen">
  .box {
    height: 100px;
    width: 100px;
    background-color: lightblue;
  }
</style>
<div class="box"></div>
```

### 媒体属性

媒体属性是 CSS3 新增的内容，多数媒体属性带有“`min-`”和“`max-`”前缀，用于表达“小于等于”和“大于等于”。这避免了使用与 HTML 和 XML 冲突的“`<`”和“`>`”字符

[注意]媒体属性必须用括号`()`包起来，否则无效

下表中列出了所有的媒体属性

```
  width | min-width | max-width
  height | min-height | max-height
  device-width | min-device-width | max-device-width
  device-height | min-device-height | max-device-height
  aspect-ratio | min-aspect-ratio | max-aspect-ratio
  device-aspect-ratio | min-device-aspect-ratio | max-device-aspect-ratio
  color | min-color | max-color
  color-index | min-color-index | max-color-index
  monochrome | min-monochrome | max-monochrome
  resolution | min-resolution | max-resolution
  scan | grid
```

**【1】颜色（color）**

指定输出设备每个像素单元的比特值。如果设备不支持输出颜色，则该值为 `0`

向所有能显示颜色的设备应用样式表

```html
<style>
  @media (color) {
    .box {
      height: 100px;
      width: 100px;
      background-color: lightblue;
    }
  }
</style>
<div class="box"></div>
```

**【2】颜色索引（color-index）**

颜色索引指定了输出设备中颜色查询表中的条目数量，如果没有使用颜色查询表，则值等于 `0`

向所有使用至少 256 个索引颜色的设备应用样式表(下列代码无显示，说明返回值为 `0`)

```html
<style>
  @media (min-color-index: 256) {
    .box {
      height: 100px;
      width: 100px;
      background-color: lightgreen;
    }
  }
</style>
<div class="box"></div>
```

**【3】宽高比（aspect-ratio）**

宽高比描述了输出设备目标显示区域的宽高比。该值包含两个以“`/`”分隔的正整数。代表了水平像素数（第一个值）与垂直像素数（第二个值）的比例

向可视区域是正方形或者是宽屏的设备应用样式表

```html
<style>
  @media (min-aspect-ratio: 1/1) {
    .box {
      height: 100px;
      width: 100px;
      background-color: lightgreen;
    }
  }
</style>
<div class="box"></div>
```

**【4】设备宽高比（device-aspect-ratio）**

设备宽高比描述了输出设备的宽高比。该值包含两个以“`/`”分隔的正整数。代表了水平像素数（第一个值）与垂直像素数（第二个值）的比例

向宽高比为 `16:9` 的特殊宽屏设备应用样式表

```html
<style>
  @media (device-aspect-ratio: 16/9) {
    .box {
      height: 100px;
      width: 100px;
      background-color: pink;
    }
  }
</style>
<div class="box"></div>
```

**【5】设备高度（device-height）**

设备高度描述了输出设备的高度

向显示在最小高度 1000px 的屏幕上的文档应用样式表

```html
<style>
  @media (min-device-height: 1000px) {
    .box {
      height: 100px;
      width: 100px;
      background-color: pink;
    }
  }
</style>
<div class="box"></div>
```

**【6】设备宽度（device-width）**

设备宽度描述了输出设备的宽度

向显示在最小宽度 1000px 的屏幕上的文档应用样式表

```html
<style>
  @media (min-device-width: 1000px) {
    .box {
      height: 100px;
      width: 100px;
      background-color: lightblue;
    }
  }
</style>
<div class="box"></div>
```

**【7】网格（grid）**

网格判断输出设备是网格设备还是位图设备。如果设备是基于网格的（例如电传打字机终端或只能显示一种字形的电话），该值为 `1`，否则为 `0`

向非网格设备应用样式表

```html
<style>
  @media (grid: 0) {
    .box {
      height: 100px;
      width: 100px;
      background-color: lightgreen;
    }
  }
</style>
<div class="box"></div>
```

**【8】高度（height）**

高度描述了输出设备渲染区域（如可视区域的高度或打印机纸盒的高度）的高度

向高度大于 800px 的可视区域的设备应用样式表

```html
<style>
  @media (min-height: 800px) {
    .box {
      height: 100px;
      width: 100px;
      background-color: lightgreen;
    }
  }
</style>
<div class="box"></div>
```

**【9】宽度（width）**

宽度描述了输出设备渲染区域的宽度

向宽度大于 800px 的可视区域的设备应用样式表

```html
<style>
  @media (min-width: 800px) {
    .box {
      height: 100px;
      width: 100px;
      background-color: lightgreen;
    }
  }
</style>
<div class="box"></div>
```

**【10】黑白（monochrome）**

黑白指定了一个黑白（灰度）设备每个像素的比特数。如果不是黑白设备，值为 0

向非黑白设备应用样式表

```html
<style>
  @media (monochrome: 0) {
    .box {
      height: 100px;
      width: 100px;
      background-color: lightgreen;
    }
  }
</style>
<div class="box"></div>
```

**【11】方向（orientation）**

方向指定了设备处于横屏（宽度大于宽度）模式还是竖屏（高度大于宽度）模式

值：`landscape(横屏)` | `portrait(竖屏)`

向竖屏设备应用样式表

```html
<style>
  @media (orientation: portrait) {
    .box {
      height: 100px;
      width: 100px;
      background-color: lightgreen;
    }
  }
</style>
<div class="box"></div>
```

**【12】分辨率（resolution）**

分辨率指定输出设备的分辨率（像素密度）。分辨率可以用每英寸（dpi）或每厘米（dpcm）的点数来表示

[注意]关于屏幕三要素(屏幕尺寸、分辨率、像素密度)的相关内容移步至此

向每英寸至少 90 点的设备应用样式

```html
<style>
  @media (min-resolution: 90dpi) {
    .box {
      height: 100px;
      width: 100px;
      background-color: lightgreen;
    }
  }
</style>
<div class="box"></div>
```

**【13】扫描（scan）**

扫描描述了电视输出设备的扫描过程

值： `progressive` | `interlace`

语法

媒体查询包含了一个 CSS2 已有的媒介类型(或称为媒体类型)和 CSS3 新增的包含一个或多个表达式的媒体属性，这些媒体属性会被解析成真或假

当媒体查询为真时，相关的样式表或样式规则就会按照正常的级联规则被应用。即使媒体查询返回假， `<link>` 标签上带有媒体查询的样式表仍将被下载（只不过不会被应用）

```html
<link rel="stylesheet" href="style.css" media="print" />

<div class="box"></div>
```

media 并不是'print'，所以媒体查询为假。但是，style.css 文件依然被下载

逻辑操作符

操作符 not、and、only 和逗号(,)可以用来构建复杂的媒体查询

**and**

and 操作符用来把多个媒体属性组合起来，合并到同一条媒体查询中。只有当每个属性都为真时，这条查询的结果才为真

[注意]在不使用 not 或 only 操作符的情况下，媒体类型是可选的，默认为 all

满足横屏以及最小宽度为 700px 的条件应用样式表

`@media all and (min-width: 700px) and (orientation: landscape) { ... }`
　　由于不使用 not 或 only 操作符的情况下，媒体类型是可选的，默认为 all，所以可以简写为

`@media (min-width: 700px) and (orientation: landscape) { ... }`

**or**

将多个媒体查询以逗号分隔放在一起；只要其中任何一个为真，整个媒体语句就返回真，相当于 or 操作符

满足最小宽度为 700 像素或是横屏的手持设备应用样式表

`@media (min-width: 700px), handheld and (orientation: landscape) { ... }`
**not**

not 操作符用来对一条媒体查询的结果进行取反

[注意]not 关键字仅能应用于整个查询，而不能单独应用于一个独立的查询

**only**

only 操作符表示仅在媒体查询匹配成功时应用指定样式。可以通过它让选中的样式在老式浏览器中不被应用

`media="only screen and (max-width:1000px)"{...}`
　　上面这行代码，在老式浏览器中被解析为 media="only"，因为没有一个叫 only 的设备，所以实际上老式浏览器不会应用样式

`media="screen and (max-width:1000px)"{...}`
　　上面这行代码，在老式浏览器中被解析为 media="screen"，它把后面的逻辑表达式忽略了。所以老式浏览器会应用样式

所以，在使用媒体查询时，only 最好不要忽略

**方法**

`window.matchMedia()`方法用来检查 CSS 的 mediaQuery 语句

[注意]IE9-浏览器不支持，可以使用第三方函数库 matchMedia.js

**属性**

`window.matchMedia()`方法接受一个 mediaQuery 语句的字符串作为参数，返回一个 MediaQueryList 对象。该对象有 media 和 matches 两个属性

media：返回所查询的 mediaQuery 语句字符串
matches：返回一个布尔值，表示当前环境是否匹配查询语句

```js
var result = window.matchMedia('(min-width: 600px)')
console.log(result.media) //'(min-width: 600px)'
console.log(result.matches) // true
```

可以根据 matchMedia()方法的 matches 属性的不同结果，进行对应的设置

```js
var result = window.matchMedia('(min-width: 600px)')
if (result.matches) {
  //
} else {
  //
}
```

[注意]如果 `window.matchMedia` 无法解析 `mediaQuery` 参数，`matches` 属性返回的总是 `false`，而不是报错

```js
var result = window.matchMedia('123')
console.log(result.matches) //false
```

**事件**

`window.matchMedia` 方法返回的 `MediaQueryList` 对象有两个方法，用来监听事件：`addListener` 方法和 `removeListener` 方法

// 指定回调函数
`mql.addListener(mqCallback);`
// 撤销回调函数
`mql.removeListener(mqCallback);`
　　注意，只有 mediaQuery 查询结果发生变化时，才调用指定的回调函数

所以，如果想要 mediaQuery 查询未变化时，就显示相应效果，需要提前调用一次函数

下面这个例子是当页面宽度小于 1000px 时，页面背景颜色为品红色；否则为淡蓝色

```js
var mql = window.matchMedia('(min-width: 1000px)')
mqCallback(mql)
mql.addListener(mqCallback)
function mqCallback(mql) {
  if (mql.matches) {
    document.body.background = 'pink'
  } else {
    document.body.background = 'lightblue'
  }
}
```

打印样式

媒体查询的一个常用功能是打印样式的设置，主要是背景清除、字体颜色变黑等

```css
@media print {
  *,
  *:before,
  *:after {
    background: transparent !important;
    color: #000 !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  a,
  a:visited {
    text-decoration: underline;
  }
  a[href]:after {
    content: '(' attr(href) ')';
  }
  abbr[title]:after {
    content: '(' attr(title) ')';
  }
  a[href^='#']:after,
  a[href^='javascript:;']:after {
    content: '';
  }
  pre,
  blockquote {
    border: 1px solid #999;
    /*只有opera浏览器起作用，避免在元素内部插入分页符*/
    page-break-inside: avoid;
  }
  thead {
    display: table-header-group;
  }
  tr,
  img {
    page-break-inside: avoid;
  }
  img {
    max-width: 100% !important;
  }
  p,
  h2,
  h3 {
    /*元素内部发生分页时，最少保留3行*/
    orphans: 3;
    /*元素内部发生分页时，元素顶部最少保留3行*/
    windows: 3;
  }
  h2,
  h3 {
    /*避免在元素后面插入一个分页符*/
    page-break-after: avoid;
  }
}
```

相对单位

如果媒体查询@media 使用的是相对单位，如 rem，这里有一个坑需要着重强调一下

一般而言，rem 是相对于 HTML 的字体大小的。但是，由于媒体查询的级别非常高，它并不是 HTML 的子元素，不是相对于 HTML，而是相对于浏览器的，而浏览器的默认字体大小是 16px

如果 HTML 设置字体大小为 12px，设置如下媒体查询

`media="only screen and (max-width:1rem)"`
　　实际上，max-width 等于 16px，而不是 12px

而正是由于媒体查询是相对于浏览器的， 所以使用 rem 就没有必要，完全可以使用 em 来替代

`media="only screen and (max-width:1em)"`
媒体查询多用于响应式网页中。

1.初始化设置：

在 `HTML` 文件中，网页顶部<head></head>标签中插入一句话：

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

这句话在于对响应式网页做一个初始化设置，主要包括：

`name="viewport"`：标记显示设备为视口；

`width = device-width`：宽度等于当前设备的宽度；

initial-scale：初始的缩放比例（默认设置为 1.0）；
minimum-scale：允许用户缩放到的最小比例（默认设置为 1.0）；
maximum-scale：允许用户缩放到的最大比例（默认设置为 1.0）；  
user-scalable：用户是否可以手动缩放（默认设置为 no，因为我们不希望用户放大缩小页面）。

### 2.解决 IE 浏览器的兼容性问题：

因为 IE 浏览器(IE8)不支持 HTML5 和 CSS3 中的 media，所以要加载用于解决 IE 浏览器兼容性问题的 JS 文件：

```html
<!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>

  <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
<![endif]-->
```

两个`<script></script>`标签中的 src 属性所指向的文件链接地址为固定地址中的文件，直接异地引用就好，不用下载到本地引用。

### 3.设置 IE 的渲染方式为最高：

现在有很多人的 IE 浏览器都升级到 IE9 以上，这个时候会有很多诡异的事情发生，例如现在是 IE9 的浏览器，但是浏览器的文档模式却是 IE8，为了防止这种情况，我们需要下面这段代码来让 IE 的文档模式永远都是最新：

`<meta http-equiv="X-UA-Compatible"content="IE=edge">`

当然还有一个更给力的写法：

`<meta http-equiv="X-UA-Compatible"content="IE=Edge，chrome=1">`

这段代码后面加了一个 chrome=1，这是由于 Google Chrome Frame（谷歌内嵌浏览器框架 GCF），如果用户电脑安装这个 chrome 插件，就可让电脑内的 IE 浏览器规避版本因素，使用 Webkit 引擎及 V8 引擎进行排版及运算。当然如果用户没装这个插件，这段代码就会让 IE 浏览器以最高的文档模式展现效果。

### 4.CSS3 media 媒体查询的写法：

```css
@media screen and (max-width: 960px) {
  body {
    background: #000;
  }
}
```

这是一个 media 的标准写法，在 CSS 文件中，意为：当页面小于 960px 时执行以下 CSS 代码，具体内容暂不用管。

对于上述代码中的 screen，意为在告知设备在打印页面时使用衬线字体，在屏幕上显示时用无衬线字体。目前很多网站都会直接省略 screen,从而不需要考虑用户打印网页的需求，所以又有这种写法：

```css
@media (max-width: 960px) {
  body {
    background: #000;
  }
}
```

本着思维严谨的原则，个人不会采用这种写法。

### 5.CSS3 媒体查询主体代码组合：

在响应式网页布局中需要持续运用媒体查询代码组合，主要作用在于判断所适配屏幕的宽度，并根据各种宽度条件套用不同的 CSS 样式。

如当屏幕宽度等于 960px 时，将网页背景色变为红色：

```css
@media screen and (max-device-width: 960px) {
  body {
    background: red;
  }
}
```

如当屏幕宽度最大为 960px（小于 960px）时，将网页背景色变为黑色：

```css
@media screen and (max-width: 960px) {
  body {
    background: #000;
  }
}
```

如当屏幕宽度最小为 960px（大于 960px）时，将网页背景色变为桔色：

```css
@media screen and (min-width: 960px) {
  body {
    background: orange;
  }
}
```

更为常见的是混合使用，如当屏幕宽度介于 960px 和 1200px 之间时，将网页背景色变为黄色：

```css
@media screen and (min-width:960px) and(max-width:1200px){
　　body{

　　　　background:yellow;

　　}
}
```

### 6.总体开发思路：

使用 CSS3 中媒体查询的大致思路就是判断网页在不同设备中所处的宽度范围，这样的范围可能有三种（PC、平板、手机），也可能有四种（PC、平板、中大屏手机、小屏手机），当然也可能只需要两种（平板、手机，PC 端单独开发一版时可不作为 CSS3 媒体查询的使用对象），并为各种宽度范围情况下的所需页面元素套用不同的 CSS 样式，从而适配各种设备。

### 7.响应式网页开发中的宽度问题：

在实际开发中，通常需要设置响应式网页宽度的最大值，一旦忽略最大宽度，臃肿或零散的网页布局都会造成视觉洪灾，也就是我们常说的看起来很 low。
另外谈谈目前显示设备中的网页宽度问题（由于篇幅问题，就不从工业革命开始扯了），目前最为常见的宽度基本上都是：大于或等于 960px 的 PC 端（1920px、1600px、1440px、1280px、1140px、960px）、960px 至 640px 之间的平板端（768px、640px）以及 640px 以下的手机端（480px、320px），以上宽度存在已久，且显示设备中的网页宽度会长期处于这样的状态下，在响应式网页宽度设计上，基本从这几个尺寸考虑就已经足够。

### 8.media 媒体查询所有参数汇总：

媒体查询器中还包含并不常用的相关功能，悉如示下：

width:浏览器可视宽度，

height:浏览器可视高度，

device-width:设备屏幕的宽度，

device-height:设备屏幕的高度，

orientation:检测设备目前处于横向还是纵向状态，

aspect-ratio:检测浏览器可视宽度和高度的比例(例如：aspect-ratio:16/9)，

device-aspect-ratio:检测设备的宽度和高度的比例，

color:检测颜色的位数（例如：min-color:32 就会检测设备是否拥有 32 位颜色），

color-index:检查设备颜色索引表中的颜色（他的值不能是负数），

monochrome:检测单色楨缓冲区域中的每个像素的位数（这个太高级，估计咱很少会用的到），

resolution:检测屏幕或打印机的分辨率(例如：min-resolution:300dpi 或 min-resolution:118dpcm)，

grid：检测输出的设备是网格的还是位图设备。

9.扩展——在 CSS2 中同样有媒体查询：

media 媒体查询并不是 CSS3 诞生之后的专用功能，早在 CSS2 开始就已经支持 media，比如：

在 HTML 文件中的`<head></head>`标签中写入这句：

```html
<link rel="stylesheet" type="text/css" media="screen" href="style.css" />
```

以上是 CSS2 实现的衬线用法，href 属性中写入在某单一显示设备中链接的 CSS 文件，但仅供入门，

如要判断移动设备是否为纵向放置的显示屏，可以这样写：

```html
<link rel="stylesheet" type="text/css" media="screen and (orientation:portrait)" href="style.css" />
```

如要让小于 960px 的页面执行指定的 CSS 样式文件，可以这样写：

```html
<link rel="stylesheet" type="text/css" media="screen and (max-width:960px)" href="style.css" />
```

当然，CSS2 中的媒体查询方法放到现在并不推荐使用，最大的弊端在于这样会增加页面 http 的请求次数，增加页面负担，使用 CSS3 中的媒体查询才是目前的最佳方法。
