---
order: 5
---
# link 与 @import 区别

两者都是外部引用`CSS`的方式，但是存在一定的区别：

1：`link`是`XHTML`标签，除了加载`CSS`外，还可以定义`RSS`等其他事务；`@import`属于`CSS`范畴，只能加载`CSS`。

2：link引用CSS时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。

3：link是XHTML标签，无兼容问题；@import是在CSS2.1提出的，低版本的浏览器不支持。

4：link支持使用Javascript控制DOM去改变样式；而@import不支持