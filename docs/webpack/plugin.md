# plugin 

plugin(插件) 是 webpack生态的一个关键部分，它为社区提供了一种强大的方法来扩展webpack和开发webpack的编译过程。

### Plugin的作用

关于Plugin的作用，引用webpack官方的介绍

> Plugins expose the full potential of the webpack engine to third-part developers. Using staged build callbacks, developers can introduce their own behaviors into the webpack build process.

通过插件我们可以扩展webpack，加入自定义的构建行为，使webpack可以执行更官方的任务，拥有更强的构建能力

### Plugin工作原理

plugin的工作原理，简单来说，就是webpack在编译过程中提供了一些生命周期钩子，我们的插件会在这些钩子事件中注入我们要执行的任务（注册处理器），当webpack执行构建的时候，它的tapable事件流会自动调用这些钩子，从而触发我们的方法，执行我们的自定义任务。

### webpack的一些底层逻辑

开发一个plugin比开发一个loader更高级一些，因为我们会用到一些webpack比较底层的内部组件。因此我们需要了解一些webpack的底层逻辑。

webpack内部执行流程

一次完成的webpack打包大致是这样的过程：

将命令参数与webpack配置文件合并，解析得到参数对象，参数对象传给webpack执行得到Compiler对象。执行Compiler的run 方法开始编译。每次执行run编译都会生成一个Compilation对象。触发Compiler的make方法分析入口文件，调用compilation的buildModule方法创建主模块对象。生成入口文件AST（抽象语法数），通过AST分析和递归加载依赖模块。

所有模块分析完成后， 执行compilation的seal方法对每个chunk进行整理、优化、封装。最后执行Compiler的emitAssets方法把生成的文件输出到output的目录中


webpack底层基本流程图




webpck内部的一些钩子

