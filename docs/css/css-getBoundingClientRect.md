# Element.getBoundingClientRect

Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。

如果是标准盒子模型，元素的尺寸等于 width/height + padding + border-width 的总和。如果 box-sizing: border-box，元素的的尺寸等于 width/height

返回值是一个 DOMRect 对象，这个对象是由该元素的 getClientRects() 方法返回的一组矩形的集合，就是该元素的 CSS 边框大小。返回的结果是包含完整元素的最小矩形，并且拥有 left, top, right, bottom, x, y, width, 和 height 这几个以像素为单位的只读属性用于描述整个边框。除了 width 和 height 以外的属性是相对于视图窗口的左上角来计算的。

DOMRect 示例图空边框盒（译者注：没有内容的边框）会被忽略。如果所有的元素边框都是空边框，那么这个矩形给该元素返回的 width、height 值为 0，left、top 值为第一个 CSS 盒子（按内容顺序）的 top-left 值。

当计算边界矩形时，会考虑视口区域（或其他可滚动元素）内的滚动操作，也就是说，当滚动位置发生了改变，top 和 left 属性值就会随之立即发生变化（因此，它们的值是相对于视口的，而不是绝对的）。如果你需要获得相对于整个网页左上角定位的属性值，那么只要给 top、left 属性值加上当前的滚动位置（通过 window.scrollX 和 window.scrollY），这样就可以获取与当前的滚动位置无关的值

该 API 返回的 DOMRect 对象在现代浏览器中可以被修改。而对于返回值为 DOMRectReadOnly 的旧版本，返回值并不能被修改。在 IE 和 Edge 浏览器中，无法向他们返回的 ClientRect 对象添加缺失的属性，对象可以防止 x 和 y 的回填。

由于兼容性问题（见下文），尽量仅使用 left, top, right, 和 bottom.属性是最安全的。

返回的 DOMRect 对象中的属性不是自己的属性。 当使用 in 和 for...in 运算符时能成功查找到返回的属性，但使用其他 API（例如 Object.keys（））查找时将失败。 而且，ES2015 和更高版本的功能（如 Object.assign（）和对象 rest/spread）将无法复制返回的属性
