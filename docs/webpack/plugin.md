# plugin

plugin(插件) 是 webpack 生态的一个关键部分，它为社区提供了一种强大的方法来扩展 webpack 和开发 webpack 的编译过程。

### Plugin 的作用

关于 Plugin 的作用，引用 webpack 官方的介绍

> Plugins expose the full potential of the webpack engine to third-part developers. Using staged build callbacks, developers can introduce their own behaviors into the webpack build process.

通过插件我们可以扩展 webpack，加入自定义的构建行为，使 webpack 可以执行更官方的任务，拥有更强的构建能力

### Plugin 工作原理

plugin 的工作原理，简单来说，就是 webpack 在编译过程中提供了一些生命周期钩子，我们的插件会在这些钩子事件中注入我们要执行的任务（注册处理器），当 webpack 执行构建的时候，它的 tapable 事件流会自动调用这些钩子，从而触发我们的方法，执行我们的自定义任务。

### webpack 的一些底层逻辑

开发一个 plugin 比开发一个 loader 更高级一些，因为我们会用到一些 webpack 比较底层的内部组件。因此我们需要了解一些 webpack 的底层逻辑。

webpack 内部执行流程

一次完成的 webpack 打包大致是这样的过程：

将命令参数与 webpack 配置文件合并，解析得到参数对象，参数对象传给 webpack 执行得到 Compiler 对象。执行 Compiler 的 run 方法开始编译。每次执行 run 编译都会生成一个 Compilation 对象。触发 Compiler 的 make 方法分析入口文件，调用 compilation 的 buildModule 方法创建主模块对象。生成入口文件 AST（抽象语法数），通过 AST 分析和递归加载依赖模块。

所有模块分析完成后， 执行 compilation 的 seal 方法对每个 chunk 进行整理、优化、封装。最后执行 Compiler 的 emitAssets 方法把生成的文件输出到 output 的目录中

webpack 底层基本流程图

![webpack-plugin](../../images/plugin/webpack-plugin.jpg)

webpck 内部的一些钩子

在 webpack 编译打包的过程中，会触发一些关键事件，为了方便我们直接介入和控制编译过程，webpack 把这些时间封装成接口暴露了处理，这些接口被叫做 hooks（钩子）。开发插件，离不开这些钩子。

Tapable

Tapable 是 webpack 的核心功能库，它为 webpack 提供了统一的插件接口（钩子）类型定义。webpack 中目前有十种 hooks，在 Tapable 源码中可以看到，他们是：

```js
// https://github.com/webpack/tapable/blob/master/lib/index.js
exports.SyncHook = require('./SyncHook')
exports.SyncBailHook = require('./SyncBailHook')
exports.SyncWaterfallHook = require('./SyncWaterfallHook')
exports.SyncLoopHook = require('./SyncLoopHook')
exports.AsyncParallelHook = require('./AsyncParallelHook')
exports.AsyncParallelBailHook = require('./AsyncParallelBailHook')
exports.AsyncSeriesHook = require('./AsyncSeriesHook')
exports.AsyncSeriesBailHook = require('./AsyncSeriesBailHook')
exports.AsyncSeriesLoopHook = require('./AsyncSeriesLoopHook')
exports.AsyncSeriesWaterfallHook = require('./AsyncSeriesWaterfallHook')
```

Tapable 还统一暴露了三个方法给插件，用于注入不同类型的自定义构建行为：

tap： 注册钩子，同步钩子和异步钩子都可以使用

tapAsync： 回调方式注册异步钩子

tapPromise： Promise 方式注册异步钩子。

webpack 里面有几个非常重要的对象，他们是 Compiler，Compilation 和 JavascriptParser。这些对象都基础了 Tapable 类，身上都挂着丰富的钩子，用于注册和调用插件。

Compiler Hooks

Compiler 编译器模块是创建编译实例的主引擎，大多数面向用户的插件都首先在 Compiler 上注册。

Compiler 上暴露的一些常用的钩子：

| 钩子         | 类型              | 什么时候调用                                                           |
| ------------ | ----------------- | -------------------------------------------------------------------- |
| run          | AsyncSeriesHook   | 在编译器开始读取记录前执行                                             |
| compile      | SyncHook          | 在一个新的 compilation 创建之前执行                                    |
| compilation  | SyncHook          | 在一次 compilation 创建后执行插件                                      |
| make         | AsyncParallelHook | 完成一次编译之前执行                                                   |
| emit         | AsyncSeriesHook   | 在生成文件到 output 目录之前执行，回调参数： compilation                |
| afterEmit    | AsyncSeriesHook   | 在生成文件到 output 目录之后执行                                       |
| assetEmitted | AsyncSeriesHook   | 生成文件的时候执行，提供访问产出文件信息的入口，回调参数：file，info       |
| done         | AsyncSeriesHook   | 一次编译完成后执行，回调参数：stats                                     |

Compilation Hooks

Compilation 是 Compiler 用来创建一次新的编译过程的模块。一个 Compilation 实例可以访问所有模块和它们的依赖。在一次编译阶段，模块被加载、封装、优化、分块、散列和还原。

Compilation 也继承了 Tapabl 并提供了很多生命周期钩子。

Compilation 上暴露的一些常用的钩子：

| 钩子                 | 类型            | 什么时候调用                                                                                                                                                                                                    |
| -------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| buildModule          | SyncHook        | 在模块开始编译之前触发，可以用于修改模块                                                                                                                                                                        |
| succeedModule        | SyncHook        | 当一个模块被成功编译，会执行这个钩子                                                                                                                                                                            |
| finishModules        | AsyncSeriesHook | 当所有模块都编译成功后被调用                                                                                                                                                                                    |
| seal                 | SyncHook        | 当一次 compilation 停止接收新模块时触发                                                                                                                                                                         |
| optimizeDependencies | SyncBailHook    | 在依赖优化的开始执行                                                                                                                                                                                            |
| optimize             | SyncHook        | 在优化阶段的开始执行                                                                                                                                                                                            |
| optimizeModules      | SyncBailHook    | 在模块优化阶段开始时执行，插件可以在这个钩子里执行对模块的优化，回调参数：modules                                                                                                                               |
| optimizeChunks       | SyncBailHook    | 在代码块优化阶段开始时执行，插件可以在这个钩子里执行对代码块的优化，回调参数：chunks                                                                                                                            |
| optimizeChunkAssets  | AsyncSeriesHook | 优化任何代码块资源，这些资源存放在 compilation.assets 上。一个 chunk 有一个 files 属性，它指向由一个 chunk 创建的所有文件。任何额外的 chunk 资源都存放在 compilation.additionalChunkAssets 上。回调参数：chunks |
| optimizeAssets       | AsyncSeriesHook | 优化所有存放在 compilation.assets 的所有资源。回调参数：assets                                                                                                                                                  |

JavascriptParser Hooks
　　 Parser 解析器实例在 Compiler 编译器中产生，用于解析 webpack 正在处理的每个模块。我们可以用它提供的 Tapable 钩子自定义解析过程。

JavascriptParser 上暴露的一些常用的钩子：

| 钩子      | 类型         | 什么时候调用                                                 |
| --------- | ------------ | ------------------------------------------------------------ |
| evaluate  | SyncBailHook | 在计算表达式的时候调用。                                     |
| statement | SyncBailHook | 为代码片段中每个已解析的语句调用的通用钩子                   |
| import    | SyncBailHook | 为代码片段中每个 import 语句调用，回调参数：statement,source |
| export    | SyncBailHook | 为代码片段中每个 export 语句调用，回调参数：statement        |
| call      | SyncBailHook | 解析一个 call 方法的时候调用，回调参数：expression           |
| program   | SyncBailHook | 解析一个表达式的时候调用，回调参数：expression               |

对 webpack 底层逻辑和 tapable 钩子有了这些了解后，我们就可以进一步尝试开发一个插件了。

四、如何开发一个 webpack plugin
plugin 的基本结构
　　一个 webpack plugin 由如下部分组成：


一个命名的 Javascript 方法或者 JavaScript 类。
它的原型上需要定义一个叫做 apply 的方法。
注册一个事件钩子。
操作 webpack 内部实例特定数据。
功能完成后，调用 webpack 提供的回调。
　　一个基本的 plugin 代码结构大致长这个样子：

```js
// plugins/MyPlugin.js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('My Plugin', stats => {
      console.log('Bravo!')
    })
  }
}
module.exports = MyPlugin
```

这就是一个最简单的 webpack 插件了，它注册了 Compiler 上的异步串行钩子 done，在钩子中注入了一条控制台打印的语句。根据上文钩子的介绍我们可以知道，done 会在一次编译完成后执行。所以这个插件会在每次打包结束，向控制台首先输出这句 Bravo!。


![webpack-plugin](../../images/plugin/webpack-plugin-1.jpg)

开发一个文件清单插件
　　我希望每次 webpack 打包后，自动产生一个打包文件清单，上面要记录文件名、文件数量等信息。

思路：
显然这个操作需要在文件生成到 dist 目录之前进行，所以我们要注册的是 Compiler 上的 emit 钩子。
emit 是一个异步串行钩子，我们用 tapAsync 来注册。
在 emit 的回调函数里我们可以拿到 compilation 对象，所有待生成的文件都在它的 assets 属性上。
通过 compilation.assets 获取我们需要的文件信息，并将其整理为新的文件内容准备输出。
然后往 compilation.assets 添加这个新的文件。
　　插件完成后，最后将写好的插件放到 webpack 配置中，这个包含文件清单的文件就会在每次打包的时候自动生成了。

实现：

```js
// plugins/FileListPlugin.js
class FileListPlugin {
  constructor(options) {
    // 获取插件配置项
    this.filename = options && options.filename ? options.filename : 'FILELIST.md'
  }
  apply(compiler) {
    // 注册 compiler 上的 emit 钩子
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
      // 通过 compilation.assets 获取文件数量
      let len = Object.keys(compilation.assets).length
      // 添加统计信息
      let content = `# ${len} file${len > 1 ? 's' : ''} emitted by webpacknn`
      // 通过 compilation.assets 获取文件名列表
      for (let filename in compilation.assets) {
        content += `- ${filename}n`
      }
      // 往 compilation.assets 中添加清单文件
      compilation.assets[this.filename] = {
        // 写入新文件的内容
        source: function() {
          return content
        },
        // 新文件大小（给 webapck 输出展示用）
        size: function() {
          return content.length
        }
      }
      // 执行回调，让 webpack 继续执行
      cb()
    })
  }
}
module.exports = FileListPlugin
```

在 webpack.config.js 中配置我们自己写的 plugin：

```js
plugins: [
  new MyPlugin(),
  new FileListPlugin({
    filename: '_filelist.md'
  })
]
```

npm run build 执行，可以看到生成了 \_filelist.md 文件：


![webpack-plugin](../../images/plugin/webpack-plugin-2.jpg)


![webpack-plugin](../../images/plugin/webpack-plugin-3.jpg)


总结
　　本文总结了 webpack plugin 的工作原理、wepack 底层执行的基本流程以及介绍了 tapable 和常用的 hooks，最后通过两个小例子演示了如何自己开发一个 webpack 插件。

开发插件并非难如登天的事情，当遇到通过配置无法解决的问题，又一时找不到好的插件时，不如试试自己编写一个插件来解决，相信我，你会越来越强的！
