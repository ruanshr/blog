---
order: -2
---
# CSS 面试题2

**1、介绍一下标准的CSS的盒子模型？与IE的合作模型有什么不同的？**

标准合作模型：宽度=内容宽度（content） + border + padding + margin

IE盒子模型：宽度= 内容宽度（content + border + padding ） + margin


**2、box-sizing属性**

用来控制元素的盒子模型的解析模式，默认为content-box

content-box： W3C的标准合作模型，设置元素的height/width属性指的是content部分的高、宽

border-box：IE盒子模型，设置元素的height/width属性指的是border + padding + content 部分的高/宽


**CSS选择器有哪些？哪些属性可以继承**

CSS选择符: id 选择器 、类选择器、标签选择器、相邻选择器、子选择器，后代选择器、通配符选择器、属性选择器、伪类选择器

可继承的属性: font-size,font-family,color

不可继承的样式： border,padding,margin,width,height

优先级（就近原则）： !important > id > class > tag （!important比内联优先级高）

**CSS优先级算法如何计算**

元素选择符：1

class选择符: 10

id选择符：100

元素标签: 1000

- !important声明的样式优先级最高，如果冲突再进行计算
- 如果优先级相同，则选择最后出现的样式
- 继承得到的样式的优先级最低

**CSS3新增伪类有哪些** 
:first-of-type选择属于其父元素的首个元素
:last-of-type选择属于其父元素的最后元素
:only-of-type选择属于其复数选元素唯一的元素
:only-child选择属于其父元素的唯一子元素
:nth-child(n) 选择属于其父元素的第n个子元素
:enabled :disabled 表单控件的禁用状态
:checked 单选框或复选框被选中

**如何居中div？如何居中一个浮动元素？如何让绝对定位的div居中**



**display有哪些值？说明他们的作用**

inline(默认) 内联 （设置宽和高不生效）
none         隐藏
block        块显示 （设置宽和高生效，占一行）
table        表格显示
list-item    项目列表
inline-block 行内块 （设置宽和高生效，占空间根据宽和高）

**position的值有哪些？**

static（默认）： 按照正常文档进行排列

relative:

absolute:

fixed:

sticky:

 

**有一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度**

外层div使用position：relative；高度要求自适应的div使用position: absolute; top: 100px; bottom: 0; left: 0

**png、jpg、gif 这些图片格式解释一下，分别什么时候用。有没有了解过webp？**

png是便携式网络图片（Portable Network Graphics）是一种无损数据压缩位图文件格式.优点是：压缩比高，色彩好。 大多数地方都可以用。
jpg是一种针对相片使用的一种失真压缩方法，是一种破坏性的压缩，在色调及颜色平滑变化做的不错。在www上，被用来储存和传输照片的格式。
gif是一种位图文件格式，以8位色重现真色彩的图像。可以实现动画效果.
webp格式是谷歌在2010年推出的图片格式，压缩率只有jpg的2/3，大小比png小了45%。缺点是压缩的时间更久了，兼容性不好，目前谷歌和opera支持。

**style标签写在body后与body前有什么区别？**

页面加载自上而下 当然是先加载样式。
写在body标签后由于浏览器以逐行方式对HTML文档进行解析，当解析到写在尾部的样式表（外联或写在style标签）会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在windows的IE下可能会出现FOUC现象（即样式失效导致的页面闪烁问题）

 **CSS属性overflow属性定义溢出元素内容区的内容会如何处理?**

参数是scroll时候，必会出现滚动条。
参数是auto时候，子元素内容大于父元素时出现滚动条。
参数是visible时候，溢出的内容出现在父元素之外。
参数是hidden时候，溢出隐藏。 


**CSS Sprites**

将一个页面涉及到的所有图片都包含到一张大图中去，然后利用CSS的 background-image，background- repeat，background-position 的组合进行背景定位。利用CSS Sprites能很好地减少网页的http请求，从而大大的提高页面的性能；CSS Sprites能减少图片的字节。
