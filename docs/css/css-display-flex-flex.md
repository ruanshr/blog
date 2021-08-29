# flex 属性的那些事

css3 中弹性布局的项样式 flex 值可以有很多种
例如 flex: none; flex: auto; flex: 1; flex: 0;等等

我们知道 flex 是组合多个属性的简写属性 flex-grow; flex-shrink ; flex-basis ;

### flex 值

元素默认的 flex 值为 0 1 auto;
当设置 flex: auto; 表示: 1 1 auto;
当设置 flex: none; 表示: 0 0 auto;
当设置 flex: 1 表示: 1 1 0%;
当设置 flex: 0 表示：0 1 0%;

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。

### 那么 flex-basis 为 0% 和 auto 有什么区别呢？

1、同一权重下,flex-basis 设置为 auto 则元素的宽度可以根据 width 来计算宽度的；如果 flex-basis 设置为数字类的值，则元素的宽度由 flex-basis 计算得出，尽管设置了 with 也无效。

2、权重高样式 width 是可以重新设置元素的宽度的。

3、只要父容器设置了 display: flex; 项元素是行内元素，它的 width 也可以生效。
