# webpack5

自从2018年2月，webpack4发布以来，webpack就暂时没有进一步的重大更新，为了保持API的一致性，旧的框架没有做太多改变，遗留了很多的包袱。
阔别2年多后，2020年10月10日，webpack5正式发布，并带来了诸多重大的变更，将会是前端工程师的构建效率与质量大为提升。

本次重大发布的整体发展方向如下：

- 尝试用持久性缓存来提高构建性能

- 尝试用更好的算法和默认值来改进长期缓存。

- 尝试用更好的tree-shaking和代码生成来改善包大小

- 尝试改善与网络平台的兼容性

- 参数在不引人任何破坏性变化的情况下，清理哪些在实现v4功能时处于奇怪状态的内部结构

- 试图通过限制引入突破性的变化来为未来的功能做准备

- 尽可能长时间地保持在v5版本上。

webpack5的Release note 非常长，本文尝试摘出最简练的信息。

### 功能清楚

**清除已弃用的功能** 

所有在webpack4标记即将过去的功能，都已在该版移除。因此在迁移到webpack5之前，清确保你在webpack4运行的构建不会有任何的
功能过期警告。

**不再为Node.js模块 自动引入Polyfills**

不再为Node.js模块自动添加Polyfills。任何项目中有引用Node.js内置模块，在webpack4或之前的版本会自动添加polyfills，但webpack5将不会再
这样做，webpack会投入更多的精力到前端模块的兼容性工作中。

如果你的代码中有引入这些node.js的模块要升级到webpack5，将尽量使用前端的模块，或者自行手动添加适合的polyfills。

而针对那些类库的开发者，请在package.json中定义browser字段，使类库在前端能适用。

**针对长期缓存的优化**

确定的chunk、模块id 和 导出名称

新增了长期缓存的算法。这些算法在生成模式下是默认启用的。

```
chunkIds: "deterministic"
moduleIds: "deteministic"
mangleExports: "deteministic"
```

该算法以确定性的方式为模块和分块分配端的（3或5位）数字ID，这些包大小和长期缓存之前的一种权衡。由于这些配置将使用确定的ID和名称，这意味着生成的缓存失效不频繁。


**真正的内容哈希**

当使用contenthash时，webpack5将使用真正的文件内容哈希值。之前它“只”使用内部结构的哈希值。当只有注释被修改或者变量被重命名时，这对长期缓存会有积极影响。这些变化在压缩后是不可见的。


### 更好的开发支持

**命名代码块ID**

在开发模式下，默认启用的新命名代码块ID短发为模块（和文件）提供了人类可读的名称。模块ID由其路径决定，相对于context。代码块ID由代码块的内容决定。

所以你不需要使用 import (/* webpackChunkName: "name" */ "module") 来调试。但如果你想控制生产环境的文件名，还是有意义的。

可以在生产环境中使用 chunkIds: "named" 在生产环境中使用，但要确保不要不小心暴露模块名的敏感信息。

迁移： 如果你不喜欢在开发环境中改变文件名，你可以通过 chunkIds: "natural" 来使用旧的数字模式


**模块联邦**

webpack5增加了一个新的功能“模块联邦”，它允许多个webpack构建一起工作。从允许时的角度来看，多个构建的模块将表现得像一个巨大的连接模块图。从开发者的角度来看，模块可以从指定的远程构建中导入，并以最小的限制来使用。

**支持崭新的Web平台功能**

对于web 平台的一些支持，webpack5做了更好的完善更新

**JSON 模块**

比如对JSON模块，会与现在的提案保持一致，并且要求进行默认的导出，否则会有警告信息。即使使用默认导出，未使用的属性也会被optimization.mangleExports优化打乱。如果想用自定义的JSON解析器，可以在Rule.parse.parse中指定一个自定义的JSON解析器来导入类似的JSON的文件（例如针对toml、yaml、json5等）

**资源模块**

webpack5 现在已经对表示资源的模块提供了内置支持。这些模块可以向输出文件夹发送一个文件，或者向javascript包注入一个DataURI。无论哪种方式，它们都会给出一个URL来工作。

它们可以通过多种方式被使用：

import url from './image.png' 和在module.rule中设置type: "asset" 当匹配这样的导入时（老方法）

new URL("./image.png", import.meta.url) （新方式）

选择“新的方式”语法是为了允许在没有打包工具的情况下运行代码。这种语法也可以在浏览器中的原生ECMAScript模块中使用。

**原生 Worker 支持**

当把资源的 new URL 和 newWorker/newSharedWorker/navigator.serviceWorker.register结合起来时，webpack 会自动为 web worker 创建一个新的入口点（entrypoint）。

newWorker(newURL("./worker.js",import.meta.url))

选择这种语法也是为了允许在没有打包工具的情况下运行代码。这种语法在浏览器的原生 ECMAScript 模块中也可以使用。

**URIs**

Webpack 5 支持在请求中处理协议。

- 支持data:。

- 支持 Base64 或原始编码。Mimetype 可以在module.rule中被映射到加载器和模块类型。例如：import x from "data:text/javascript,export default 42"。

- 支持file:。

- 支持http(s):，但需要通过new webpack.experiments.s schemesHttp(s)UriPlugin()选择加入。
默认情况下，当目标为 "web "时，这些 URI 会导致对外部资源的请求（它们是外部资源）。

支持请求中的片段。例如：./file.js#fragment。

**异步模块**

Webpack 5 支持所谓的 "异步模块"。这些模块并不是同步解析的，而是基于异步和 Promise 的。

通过 "import "导入它们会被自动处理，不需要额外的语法，而且几乎看不出区别。

通过require()导入它们会返回一个解析到导出的 Promise。

在 webpack 中，有多种方式来拥有异步模块。

- 异步的外部资源(async externals)

- 新规范中的 WebAssembly 模块

- 使用顶层 Await 的 ECMAScript 模块。

**外部资源**

Webpack 5 增加了更多的外部类型来覆盖更多的应用：

promise: 一个评估为 Promise 的表达式。外部模块是一个异步模块，解析值作为模块导出使用。

import。原生的 import() 用于加载指定的请求，外部模块是一个异步模块，解析值作为模块导出。外部模块是一个异步模块。

module: 尚未实现，但计划通过 importxfrom"..." 加载模块。

script: 通过 &lt;script&gt; 标签加载一个 url，并从一个全局变量（以及它的可选属性）中获取输出。外部模块是一个异步模块。

**全新的 Node.js 生态特性**

现在支持 package.json 中的 exports 和 imports 字段。现在起原生支持 Yarn PnP。

更多细节请参见package exports。

### 开发体验的提升

**经过优化的构建目标(target)**

Webpack 5 允许传递一个目标列表，并且支持目标的版本。例如 target: "node14"``target: ["web", "es2020"]。

这是一个简单的方法，为 webpack 提供它需要确定的所有信息：

- 代码块加载机制，以及支持的语法，如箭头函数

**统计**

改进了统计测试格式的可读性和冗余性。改进了默认值，使其不那么冗长，也适合大型构建。

**进度**

ProgressPlugin插件也做了一些优化，现在不仅可以统计模块编译的进度，也可以统计 入口 和 依赖。并且，之前展示进度可能会对构建性能有一定的影响，这次的升级也做了一些性能方面的优化。

**自动添加唯一命名**

在 webpack 4 中，多个 webpack 运行时可能会在同一个 HTML 页面上发生冲突，因为它们使用同一个全局变量进行代码块加载。为了解决这个问题， 需要为 output.jsonpFunction 配置提供一个自定义的名称。

Webpack 5 确实会从 package.json name 中自动推断出一个唯一的构建名称，并将其作为 output.uniqueName 的默认值。

这个值用于使所有潜在的冲突的全局变量成为唯一。

迁移: 由于 package.json 中有唯一的名称，可将 output.jsonpFunction删除。

**自动添加公共路径**

Webpack 5 会在可能的情况下自动确定 output.publicPath。

**Typescript 类型**

Webpack 5 从源码中生成 typescript 类型，并通过 npm 包暴露它们。

迁移：删除 @types/webpack。当名称不同时更新引用。

### 构建优化

**嵌套的 tree-shaking**

webpack 现在能够跟踪对导出的嵌套属性的访问。这可以改善重新导出命名空间 对象时的 Tree Shaking（清除未使用的导出和混淆导出）。
```js
// inner.js
export const a = 1;
export const b = 2;

// module.js
export * as inner from './inner';
// 或 import * as inner from './inner'; export { inner };

// user.js
import * as module from './module';

console.log(module.inner.a);
```
在这个例子中，可以在生产模式下删除导出的b。

**内部模块 tree-shaking**

webpack 4 没有分析模块的导出和引用之间的依赖关系。webpack 5 有一个新的选项 optimization.innerGraph，在生产模式下是默认启用的，它可以对模块中的标志进行分析，找出导出和引用之间的依赖关系。

在这样的模块中：
```js
import { something } from './something';

function usingSomething() {
    return something;
}

export function test(){
    return usingSomething();
}
```
内部依赖图算法会找出 something 只有在使用 test 导出时才会使用。这允许将更多的出口标记为未使用，并从代码包中省略更多的代码。

当设置"sideEffects": false时，可以省略更多的模块。在这个例子中，当 test 导出未被使用时，./something 将被省略。

要获得未使用的导出信息，需要使用 optimization.unusedExports。要删除无副作用的模块，需要使用optimization.sideEffects。可以分析以下标记：

- 1、函数声明 
- 2、类声明 
- 3、默认导出export default 或定义变量以下的：

- 函数表达式
- 类表达式
- 顺序表达式
- /*#__PURE__*/ 表达式
- 局部变量
- 引入的捆绑(bindings)

反馈：如果你发现这个分析中缺少什么，请报告一个问题，我们会考虑增加它。

使用 eval() 将为一个模块放弃这个优化，因为经过 eval 的代码可以引用范围内的任何标记。这种优化也被称为深度范围分析。

**CommonJs Tree Shaking**

webpack 曾经不进行对 CommonJs 导出和 require() 调用时的导出使用分析。

webpack 5 增加了对一些 CommonJs 构造的支持，允许消除未使用的 CommonJs 导出，并从 require() 调用中跟踪引用的导出名称。

支持以下构造：

- exports|this|module.exports.xxx = ...
- exports|this|module.exports = require("...") (reexport)
- exports|this|module.exports.xxx = require("...").xxx (reexport)
- Object.defineProperty(exports|this|module.exports, "xxx", ...)
- require("abc").xxx
- require("abc").xxx()
- 从 ESM 导入
- require() 一个 ESM 模块
- 被标记的导出类型 (对非严格 ESM 导入做特殊处理):
- Object.defineProperty(exports|this|module.exports,"__esModule",{value:true|!0})
- exports|this|module.exports.__esModule=true|!0
- 未来计划支持更多的构造

当检测到不可分析的代码时，webpack 会放弃，并且完全不跟踪这些模块的导出信息（出于性能考虑）。

**开发与生产的一致性问题**

我们试图通过改善两种模式的相似性，在开发模式的构建性能和避免仅在生产模式的产生的问题之间找到一个很好的平衡点。

Webpack 5 默认在两种模式下都启用了 "sideEffects "优化。在 webpack 4 中，由于 package.json 中的"sideEffects"标记不正确，这种优化导致了一些只在生产模式下出现的错误。在开发过程中启用这个优化可以更快更容易地发现这些问题。

在很多情况下，开发和生产都是在不同的操作系统上进行的，文件系统的大小写敏感度不同，所以 webpack 5 增加了一些奇怪的大小写的警告/错误。

**改进 target 配置**

在 webpack 4 中，"target "是在 "web" 和 "node" 之间的一个粗略的选择（还有一些其他的）。Webpack 5 给你更多的选择。target选项现在比以前影响了更多关于生成代码的事情，比如代码块加载方法、代码块的格式、externals 是否默认被启用等等。

此外，对于其中的一些情况，在 "web" 和 "node" 之间的选择过于粗略，我们需要更多的信息。因此，我们允许指定最低版本，例如 "node10.13"，并推断出更多关于目标环境的属性。

现在也允许用一个数组组合多个目标，webpack 将确定所有目标的最小属性。使用数组也很有用，当使用像 "web" 或 "node" 这样没有提供完整信息的目标时（没有版本号）。例如，["web", "es2020"] 结合了这两个部分目标。

有一个目标 "browserslist"，它将使用 browserslist 类库的数据来确定环境的属性。当项目中存在可用的 browserslist 配置时，这个目标也会被默认使用。当没有可用的配置时，默认使用 "web" 目标。

**代码块拆分与模块大小**

现在模块的尺寸比单一的数字更好的表达方式。现在有不同类型的大小。

SplitChunksPlugin 现在知道如何处理这些不同的大小，并将它们用于 minSize 和 maxSize。默认情况下，只有 javascript 大小被处理，但你现在可以传递多个值来管理它们：
```json
module.exports = {
  optimization:{
    splitChunks:{
      minSize:{
        javascript:30000,
        webassembly:50000,
      },
    },
   },
};
```
你仍然可以使用一个数字来表示大小。在这种情况下，webpack 会自动使用默认的大小类型。

mini-css-extract-plugin 使用 css/mini-extra 作为大小类型，并将此大小类型自动添加到默认类型中。

还有其它的一些构建优化，比如单个运行时的改进、模块合并、通用 Tree Shaking 改进、个别生成代码的改进、请参阅详情的 webpack 5 发布资讯。

### 性能优化

**持久缓存**

现在有一个文件系统缓存。它是可选的，可以通过以下配置启用：
```json
module.exports = {
  cache : {
// 1. 将缓存类型设置为文件系统
    type :'filesystem' ,
    buildDependencies : {
      
// 2. 将你的 config 添加为 buildDependency，以便在改变 config 时获得缓存无效
      config : [
          __filename
     ],

      
// 3. 如果你有其他的东西被构建依赖，你可以在这里添加它们
      
// 注意，webpack、加载器和所有从你的配置中引用的模块都会被自动添加
    
        },
  
    },
};
```
重要说明：

默认情况下，webpack 假定 webpack 所在的 nodemodules 目录只被包管理器修改。对 nodemodules 来说，哈希值和时间戳会被跳过。出于性能考虑，只使用包名和版本。只要不指定resolve.symlinks: false，Symlinks(即npm/yarn link)就没有问题(无论如何都要避免)。不要直接编辑 node_modules 中的文件，除非你用 snapshot.managedPaths: []以剔除该优化。当使用 Yarn PnP 时，webpack 假设 yarn 缓存是不可改变的（通常是这样）。你可以使用 snapshot.immutablePaths: [] 来退出这个优化。

缓存将默认存储在 nodemodules/.cache/webpack（当使用 nodemodules 时）或 .yarn/.cache/webpack（当使用 Yarn PnP 时）中。当所有的插件都正确处理缓存时，你可能永远都不需要手动删除它。

许多内部插件也会使用持久性缓存。例如 SourceMapDevToolPlugin (缓存 SourceMap 的生成)或 ProgressPlugin (缓存模块数量)

持久性缓存将根据使用情况自动创建多个缓存文件，以优化对缓存的读写访问。

默认情况下，时间戳将用于开发模式的快照，而文件哈希将用于生产模式。文件哈希也允许在 CI 中使用持久性缓存。

**编译器闲置和关闭**

编译器现在需要在使用后关闭。编译器现在会进入和离开空闲状态，并且有这些状态的钩子。插件可能会使用这些钩子来做不重要的工作。(即将持久缓存缓慢地将缓存存储到磁盘上)。在编译器关闭时--所有剩余的工作应该尽可能快地完成。一个回调标志着关闭完成。

插件和它们各自的作者应该预料到，有些用户可能会忘记关闭编译器。所以，所有的工作最终也应该在空闲状态下完成。当工作正在进行时，应该防止进程退出。

webpack() 用法在被传递回调时自动调用close。

迁移：在使用 Node.js API 时，一定要在完成工作后调用 Compiler.close。

**文件生成**

webpack 过去总是在第一次构建时发出所有的输出文件，但在增量（观察）构建时跳过了写入未更改的文件。假设在 webpack 运行时，没有任何其他东西改变输出文件。

增加了持久性缓存后，即使在重启 webpack 进程时，也应该会有类似监听的体验，但如果认为即使在 webpack 不运行时也没有其他东西改变输出目录，那这个假设就太强了。

所以 webpack 现在会检查输出目录中现有的文件，并将其内容与内存中的输出文件进行比较。只有当文件被改变时，它才会写入文件。这只在第一次构建时进行。任何增量构建都会在运行中的 webpack 进程中生成新的资产时写入文件。

我们假设 webpack 和插件只有在内容被改变时才会生成新的资产。应该使用缓存来确保在输入相同时不会生成新的资产。不遵循这个建议会降低性能。

被标记为 [不可变] 的文件（包括内容哈希），当已经存在一个同名文件时，将永远不会被写入。我们假设当文件内容发生变化时，内容哈希会发生变化。这在一般情况下是正确的，但在 webpack 或插件开发过程中可能并不总是如此。

### 重大变更：长期未解决的问题

**单一文件目标的代码分割**

只允许启动单个文件的目标（如 node、WebWorker、electron main）现在支持运行时自动加载引导所需的依赖代码片段。

这允许对这些目标使用 chunks: "all" 和 optimization.runtimeChunk。

请注意，如果目标的代码块加载是异步的，这使得初始评估也是异步的。当使用 output.library 时，这可能是一个问题，因为现在导出的值是一个 Promise。

**更新了解析器**

enhanced-resolve 更新到了 v5，有以下改进：

- 追踪更多的依赖关系，比如丢失的文件。
- 别名可能有多种选择
- 现在可以别名为 false 了。
- 支持 exports 和 imports 字段等功能。
- 性能提高

**没有 JS 的代码块**

不包含 JS 代码的块，将不再生成 JS 文件。这就允许有只包含 CSS 的代码块。

### 重大变更：未来计划

**实验特性**

在 webpack 5 中，有一个新的 experiments 配置选项，允许启用实验性功能。这使得哪些功能被启用/使用变得很清楚。

虽然 webpack 遵循语义版本化，但它会对实验性功能进行例外处理。实验性功能可能会在 webpack 的次要版本中包含破坏性的变化。当这种情况发生时，我们会在变更日志中添加一个明确的注释。这将使我们能够更快地迭代实验性功能，同时也使我们能够在主要版本上为稳定的功能停留更长时间。

以下的实验功能将随 webpack 5 一起发布。

- 旧的 WebAssembly 支持，就像 webpack 4 一样 (experiments.syncWebAssembly)
- 根据更新的规范(experiments.asyncWebAssembly)，新增 WebAssembly 支持。这使得一个 WebAssembly 模块成为一个异步模块。
- 顶层的 Await第三阶段提案(experiments.topLevelAwait)。在顶层使用 await 使该模块成为一个异步模块。
- 以模块的形式生成代码包 (experiments.outputModule)。这就从代码包中移除了包装器 IIFE，执行严格模式，通过 <scripttype="module"> 进行懒惰加载，并在模块模式下最小化压缩。

请注意，这也意味着 WebAssembly 的支持现在被默认禁用。

**最小 Node.js 版本**

最低支持的 Node.js 版本从 6 增加到 10.13.0(LTS)。

迁移：升级到最新的 Node.js 版本。

**主要的内部架构变更**

这部分内容主要是那些想贡献 webpack 内核，以及加载器、插件开发者需要密切关注的。如果你只是使用 webpack，可以忽略这部分。内容非常多，而且比较难懂。

以下咱们来介绍一些最主要的一些内部架构的变更。

**新的插件运行顺序**

现在 webpack 5 中的插件在应用配置默认值之前就会被应用。这使得插件可以应用自己的默认值，或者作为配置预设。但这也是一个突破性的变化，因为插件在应用时不能依赖配置值的设置。

迁移：只在插件钩子中访问配置。或者最好完全避免访问配置，并通过构造函数获取选项。

**运行时模块**

大部分的运行时代码被移到了所谓的"运行时模块"中。这些特殊模块负责添加运行时代码。它们可以被添加到任何块中，但目前总是被添加到运行时块中。"运行时需求"控制哪些运行时模块（或核心运行时部件）被添加到代码包中。这确保了只有使用的运行时代码才会被添加到代码包中。未来，运行时模块也可以添加到按需加载的块中，以便在需要时加载运行时代码。

在大多数情况下，核心运行代码时允许内联入口模块，而不是用 __webpack_require__ 来调用它。如果代码包中没有其他模块，则根本不需要使用 __webpack_require__。这与模块合并很好地结合在一起，即多个模块被合并成一个模块。在最好的情况下，根本不需要运行时代码。

迁移：如果你在插件中注入运行时代码到 webpack 运行时，可以考虑使用 RuntimeModules 来代替。

**序列化**

我们添加了一个序列化机制，以允许在 webpack 中对复杂对象进行序列化。它有一个可选的语义，所以那些应该被序列化的类需要被明确地标记出来（并且实现它们的序列化）。大多数模块、所有的依赖关系和一些错误都已经这样做了。

迁移：当使用自定义模块或依赖关系时，建议将它们实现成可序列化的，以便从持久化缓存中获益。

**用于缓存的插件**

增加了一个带有插件接口的 Cache 类。该类可用于写入和读取缓存。根据配置的不同，不同的插件可以为缓存添加功能。MemoryCachePlugin 增加了内存缓存功能。FileCachePlugin 增加了持久性（文件系统）缓存。FileCachePlugin 使用序列化机制将缓存项目持久化到磁盘上或从磁盘上恢复。

**Tapable 插件升级**

webpack 3 插件的 compat 层已经被移除。它在 webpack 4 中已经被取消了。一些较少使用的 tapable API 被删除或废弃。

迁移：使用新的 tapable API。

**Main/Chunk/ModuleTemplate 废弃**

打包模板已经重构。MainTemplate/ChunkTemplate/ModuleTemplate 被废弃，现在 JavascriptModulesPlugin 负责 JS 模板。

在那次重构之前，JS 输出由 Main/ChunkTemplate 处理，而另一个输出（即 WASM、CSS）则由插件处理。这样看起来 JS 是一等公民，而其它输出是二等。重构改变了这一点，所有的输出都由他们的插件处理。

依然可以侵入部分模板。钩子现在在 JavascriptModulesPlugin 中，而不是 Main/ChunkTemplate 中。(是的，插件也可以有钩子，我称之为附加钩子。)有一个兼容层，所以 Main/Chunk/ModuleTemplate 仍然存在，但只是将 tap 调用委托给新的钩子位置。

迁移：按照 deprecation 消息中的建议。主要是指向不同位置的钩子。

**入口文件的新增配置**

在 webpack 5 中，入口文件除了字符串、字符串数组，也可以使用描述符进行配置了，如：

```json
module.exports = {
  entry:{
    catalog: {      
        import: './catalog.js',
    }, 
  },
};

```
此外，也可以定义输出的文件名，之前都是通过 output.filename 进行定义的：

```json
module.exports = {
  entry : {
    about : {
        import: './about.js',
        filename : 'pages/[name][ext]' 
    },
  },
};

```

另外，入口文件的配置，新增了文件依赖定义、生成类库的格式类型（commonjs 或 amd），也可以设置运行时的名字，以及代码块加载的方式，更多细节可以参考完整的发布记录。

**排序与 ID**

webpack 曾经在编译阶段以特定的方式对模块和代码块进行排序，以递增的方式分配 ID。现在不再是这样了。顺序将不再用于 ID 的生成，取而代之的是，ID 生成的完全控制在插件中。优化模块和代码块顺序的钩子已经被移除。

迁移：在编译阶段，你不能再依赖模块和代码块的顺序了。

**从数组到集合(Set)**

- Compilation.modules 现在是一个集合
- Compilation.chunks 现在是一个集合
- Chunk.files 现在是一个集合

存在一个适配层但会打印废弃的警告。

迁移: 使用集合方法代替数组方法。

**文件系统与信息变更**

webpack 5 中，一个是需要使用 Compilation.fileSystemInfo 替代 file/contextTimestamps，获取文件的时间戳信息，另一个是新增Compiler.modifiedFiles 以便更容易引用更改后的文件。

另外，还新增了一个类似于 compiler.inputFileSystem 和 compiler.outputFileSystem 的新 API compiler.intermediateFileSystem，用于所有不被认为是输入或输出的 fs 操作，如写入 records，缓存或输出 profiling。

**模块热替换**

HMR 运行时已被重构为运行时模块。HotUpdateChunkTemplate 已被合并入 ChunkTemplate 中。ChunkTemplates 和 plugins 也应处理 HotUpdateChunk 了。

HMR 运行时的 javascript 部分已从核心 HMR 运行时钟分离了出来。其他模块类型现在也可以使用它们自己的方式处理 HMR。在未来，这将使得 HMR 处理诸如 mini-css-extract-plugin 或 WASM 模块。

迁移：此为新功能，无需迁移。

import.meta.webpackHot 公开了与 module.hot 相同的 API。当然可以在 ESM 模块（.mjs，package.json 中的 type: "module"）中使用，这些模块不能访问 module。

**工作队列**

webpack 曾经通过函数调用函数的形式来进行模块处理，还有一个 semaphore 选项限制并行性。 Compilation.semaphore 已被移除，现在可以使用异步队列处理，每个步骤都有独立的队列：

- Compilation.factorizeQueue：为一组 dependencies 调用模块工厂。
- Compilation.addModuleQueue：将模块添加到编译队列中（可以使用缓存恢复模块）
- Compilation.buildQueue：必要时构建模块（可将模块存储到缓存中）
- Compilation.rebuildQueue：如需手动触发，则会重新构建模块
- Compilation.processDependenciesQueue：处理模块的 dependencies。

这些队列会有一些 hook 来监听并拦截工作的进程。未来，多个编译器会同时工作，可以通过拦截这些队列来进行编译工作的编排。

迁移：此为新功能，无需迁移。

**模块和 chunk 图**

webpack 曾经在依赖关系中存储了已解析的模块，并在 chunk 中存储引入的模块。但现已发生变化。所有关于模块在模块图中如何连接的信息，现在都存储在 ModulGraph 的 class 中。所有关于模块与 chunk 如何连接的信息现在都已存储在 ChunkGraph 的 class 中。依赖于 chunk 图的信息也存储在相关的 class 中。

以下列举一些模块的信息已被移动的例子：

- Module connections -> ModuleGraph
- Module issuer -> ModuleGraph
- Module optimization bailout -> ModuleGraph (TODO: check if it should ChunkGraph instead)

当从缓存中恢复模块时，webpack 会将模块从图中断开。现在已无需这么做。一个模块不存储图形的任何信息，技术上可以在多个图形中使用。这会使得缓存变得更加容易。这部分变化中大多数都有一个适配层，当使用时，它会打印一个弃用警告。

迁移：在 ModuleGraph 和 ChunkGraph 上使用新的 API。

**模块 Source Types**

Modules 现在必须通过 Module.getSourceTypes() 来定义它们支持的源码类型。根据这一点，不同的插件会用这些类型调用 source()。对于源类型为 javascript 的 JavascriptModulesPlugin 会将源代码嵌入到 bundle 中。源类型 webassembly 的 WebAssemblyModulesPlugin 会 emit 一个 wasm 文件。同时，也支持自定义源类型，例如，mini-css-extract-plugin 会使用源类型为 stylesheet 将源码嵌入到 css 文件中。

模块类型与源类型间没有关系。即使模块类型为 json，也可以使用源类型为 javascript 和模块类型为 webassembly/experimental 的 javascript 和 webassembly。

迁移：自定义模块需要实现这些新的接口方法。

**全新的观察者**

webpack 所使用的观察者已重构。它之前使用的是 chokidar 和原生依赖 fsevents（仅在 OSX 上）。现在它在只基于原生的 Node.js 中的 fs。这意味着在 webpack 中已经没有原生依赖了。

它还能在监听时捕捉更多关于文件系统的信息。目前，它还可以捕获 mtimes 和监视事件时间，以及丢失文件的信息。为此，WatchFileSystem API 做了一点小改动。在修改的同时，我们还将 Arrays 转换为 Sets，Objects 转换为 Maps。

**SizeOnlySource after emit**

webpack 现在使用 SizeOnlySource 替换 Compilation.assets 中的 Sources，以减少内存占用。

**ExportsInfo**

重构了模块导出信息的存储方式。ModuleGraph 现在为每个 Module 提供了一个 ExportsInfo，它用于存储每个 export 的信息。如果模块仅以副作用的方式使用，它还存储了关于未知 export 的信息，

对于每个 export，都会存储以下信息：

- 是否使用 export? 是否使用并不确定。（详见 optimization.usedExports）
- 是否提供 export? 是否提供并不确定。（详见 optimization.providedExports）
- 能否重命名 export 名? 是否重命名，也不确定
- 如果 export 已重新命名，则为新名称。（详见 optimization.mangleExports）
- 嵌套的 ExportsInfo，如果 export 是一个含有附加信息的对象，那么它本身就是一个对象
- 用于重新导出命名空间对象：import * as X from "..."; export { X };
- 用于表示 JSON 模块中的结构

**代码生成阶段**

编译的代码生成功能作为单独的编译阶段。它不再隐藏在 Module.source() 和 Module.getRuntimeRequirements() 中运行了。这应该会使得流程更加简洁。它还运行报告该阶段的进度。并使得代码生成在剖析时更加清晰可见。

迁移：Module.source() 和 Module.getRuntimeRequirements() 已弃用。使用 Module.codeGeneration() 代替。

**依赖关系参考**

webpack 曾经有一个单一的方法和类型来表示依赖关系的引用（Compilation.getDependencyReference 会返回一个 DependencyReference）该类型用于引入关于该引用的所有信息，如 被引用的模块，已经引入了哪些 export，如果是弱引用，还需要订阅一些相关信息。把所有这些信息构建在一起，拿到参考的成本就很高，而且很频繁（每次有人需要一个信息）。

在 webpack5 中，这部分代码库被重构了，方法进行了拆分。

- 引用的模块可以从 ModuleGraphConnection 中读取
- 引入的导出名，可以通过 Dependency.getReferencedExports() 获取
- Dependency 的 class 上会有一个 weak 的 flag排序只与 HarmonyImportDependencies 相关，可以通过 sourceOrder 属性获取

**Presentational Dependencies**

这是 NormalModules 的一种新 Dependencies 类型：Presentational Dependencies

这些 dependencies 只在代码生成阶段使用，但在模块图构建过程中未使用。所以它们永远不能引用模块或影响导出/导入。

这些依赖关系的处理成本较低，webpack 会尽可能地使用它们

**弃用 loaders**

- null-loader

已被弃用。使用

```json
module.exports = {
  resolve: {
    alias: {
      xyz$: false,
    },
  },
};
```

或者使用绝对路径

```json
module.exports = {
  resolve: {
    alias: {
      [path.resolve(__dirname,'....')]: false,
    },
  },
};

```

### 总结

webpack 5 的大部分工作围绕优化展开，去除了 4 中有废弃的内容，新增了长期缓存，优化了内核等。本文只是挑重点为大家说明，具体变更请大家参考官方文档。
