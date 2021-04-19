---
prev: /javascript-extend/script-tab
next: /javascript-extend/vscode-shortcut
---

# Tree-shaking性能优化实践

### 什么是Tree-shaking

前端中的tree-shaking可以理解为通过工具“摇”我们的JS文件，将其中用不到的代码“摇”掉，是一个性能优化的范畴。具体来说，在webpack项目中，有一个入口文件，相当于一颗数的主干，入口文件有很多依赖的模块，相当于数枝。实践情况中，虽然依赖了某个模块，但其实只是用其中的某些功能，通过tree-shaking，将没有使用的模块摇掉，这样来大道删除无用代码的目的。

### 支持tree-shaking的构建工具

- rullup

- webpack

- closure compiler

tree-shaking较早由rich harris的rollup实现，后来，webpack2也增加了tree-shaking的功能，其实在更早，google closure compiler 也做过类似的事情。三个工具的效果和使用各不相同，使用方法可以通过官网文档去了解。


### tree-shaking的原理

tree -shaking的本质是消除无用的JS代码，无用代码消除在广泛存在于传统的编程语言编译器中，编译器可以判断出某些代码根本不影响输出，然后消除这些代码，这个称为DCE（dead code elimination）

tree-shaking是DCE的一种新的实现，Javascript同传统的编程语言不同的是，javascript巨大多数情况需要通过网络进行加载，然后执行，加载的文件大小越小，整体执行时间更短，所以去除无用代码以减少文件体积，对javascript来说更有意义。

tree-shaking和传统的DCE的方法又不打意义，传统的DCE消除不可能执行的代码，而tree-shaking更关注是消除没有用到的代码


### Dead Code  elimination

Dead Code 一般具有以下几个特征

- 代码不会被执行，不可到达

- 代码执行的结果不会被用到

- 代码只会影响死变量（只写不读）


传统编译型的语言中，都是由编译器将Dead Code从AST（抽象语法数）中删除，那javascript中是谁做DCE呢

首先肯定不是浏览器做DCE，因为当我们的代码送到浏览器，那还谈什么消除无法执行的代码来优化呢，所以肯定是送到浏览器之前的步骤进行优化。

其实也不是上面提到的三个工具，rollup, webpack,cc做的，而是著名的代码压缩优化工具uglify,uglify完成了javascript的DCE



[https://juejin.cn/post/6844903544756109319](https://juejin.cn/post/6844903544756109319 )

