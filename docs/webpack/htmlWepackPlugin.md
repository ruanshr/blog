# html-webpack-plugin 详解

引言

最近在 react 项目中初次用到了 html-webapck-plugin 插件，用到该插件的两个主要作用：

为 html 文件中引入的外部资源如 script、link 动态添加每次 compile 后的 hash，防止引用缓存的外部文件问题

可以生成创建 html 入口文件，比如单页面可以生成一个 html 文件入口，配置 N 个 html-webpack-plugin 可以生成 N 个页面入口

有了这种插件，那么在项目中遇到类似上面的问题都可以轻松的解决。

在本人项目中使用 html-webpack-plugin，由于对该插件不太熟悉，开发过程中遇到这样或者那样的问题，下面就来说说这个插件。

html-webpack-plugin
插件的基本作用就是生成 html 文件。原理很简单：

将 webpack 中`entry`配置的相关入口 chunk 和 `extract-text-webpack-plugin`抽取的 css 样式 插入到该插件提供的`template`或者`templateContent`配置项指定的内容基础上生成一个 html 文件，具体插入方式是将样式`link`插入到`head`元素中，`script`插入到`head`或者`body`中。
实例化该插件时可以不配置任何参数，例如下面这样：

```js
var HtmlWebpackPlugin = require('html-webpack-plugin')

webpackconfig = {
  // ...
  plugins: [new HtmlWebpackPlugin()]
}
```

不配置任何选项的 html-webpack-plugin 插件，他会默认将 webpack 中的 entry 配置所有入口 thunk 和 extract-text-webpack-plugin 抽取的 css 样式都插入到文件指定的位置。例如上面生成的 html 文件内容如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Webpack App</title>
    <link href="index-af150e90583a89775c77.css" rel="stylesheet" />
  </head>

  <body>
    <script type="text/javascript" src="common-26a14e7d42a7c7bbc4c2.js"></script>
    <script type="text/javascript" src="index-af150e90583a89775c77.js"></script>
  </body>
</html>
```

当然可以使用具体的配置项来定制化一些特殊的需求，那么插件有哪些配置项呢？

html-webpack-plugin 配置项
插件提供的配置项比较多，通过源码可以看出具体的配置项如下：

```js
this.options = _.extend(
  {
    template: path.join(__dirname, 'default_index.ejs'),
    filename: 'index.html',
    hash: false,
    inject: true,
    compile: true,
    favicon: false,
    minify: false,
    cache: true,
    showErrors: true,
    chunks: 'all',
    excludeChunks: [],
    title: 'Webpack App',
    xhtml: false
  },
  options
)
```

title: 生成的 html 文档的标题。配置该项，它并不会替换指定模板文件中的 title 元素的内容，除非 html 模板文件中使用了模板引擎语法来获取该配置项值，如下 ejs 模板语法形式：

```html

<title>{%= o.htmlWebpackPlugin.options.title %}</title>

```

filename：输出文件的文件名称，默认为 index.html，不配置就是该文件名；此外，还可以为输出文件指定目录位置（例如'html/index.html'）

**关于 filename 补充两点：**
1、filename 配置的 html 文件目录是相对于 webpackConfig.output.path 路径而言的，不是相对于当前项目目录结构的。
2、指定生成的 html 文件内容中的 link 和 script 路径是相对于生成目录下的，写路径的时候请写生成目录下的相对路径。

template: 本地模板文件的位置，支持加载器(如 handlebars、ejs、undersore、html 等)，如比如 handlebars!src/index.hbs；

**关于 template 补充几点：**
1、template 配置项在 html 文件使用 file-loader 时，其所指定的位置找不到，导致生成的 html 文件内容不是期望的内容。
2、为 template 指定的模板文件没有指定任何 loader 的话，默认使用 ejs-loader。如 template: './index.html'，若没有为.html 指定任何 loader 就使用 ejs-loader

templateContent: string|function，可以指定模板的内容，不能与 template 共存。配置值为 function 时，可以直接返回 html 字符串，也可以异步调用返回 html 字符串。

inject：向 template 或者 templateContent 中注入所有静态资源，不同的配置值注入的位置不经相同。

1、true 或者 body：所有 JavaScript 资源插入到 body 元素的底部
2、head: 所有 JavaScript 资源插入到 head 元素中
3、false： 所有静态资源 css 和 JavaScript 都不会注入到模板文件中

favicon: 添加特定 favicon 路径到输出的 html 文档中，这个同 title 配置项，需要在模板中动态获取其路径值

hash：true|false，是否为所有注入的静态资源添加 webpack 每次编译产生的唯一 hash 值，添加 hash 形式如下所示：

```html
<script type="text/javascript" src="common.js?a3e1396b501cdd9041be"></script>
```

chunks：允许插入到模板中的一些 chunk，不配置此项默认会将 entry 中所有的 thunk 注入到模板中。在配置多个页面时，每个页面注入的 thunk 应该是不相同的，需要通过该配置为不同页面注入不同的 thunk；

excludeChunks: 这个与 chunks 配置项正好相反，用来配置不允许注入的 thunk。

chunksSortMode: none | auto| function，默认 auto； 允许指定的 thunk 在插入到 html 文档前进行排序。

> function 值可以指定具体排序规则；auto 基于 thunk 的 id 进行排序； none 就是不排序

xhtml: true|fasle, 默认 false；是否渲染 link 为自闭合的标签，true 则为自闭合标签

cache: true|fasle, 默认 true； 如果为 true 表示在对应的 thunk 文件修改后就会 emit 文件

showErrors: true|false，默认 true；是否将错误信息输出到 html 页面中。这个很有用，在生成 html 文件的过程中有错误信息，输出到页面就能看到错误相关信息便于调试。

minify: {....}|false；传递 html-minifier 选项给 minify 输出，false 就是不使用 html 压缩，minify 具体配置参数请点击 html-minifier

下面的是一个用于配置这些属性的一个例子：

```js
new HtmlWebpackPlugin({
  title: 'rd平台',
  template: 'entries/index.html', // 源模板文件
  filename: './index.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
  showErrors: true,
  inject: 'body',
  chunks: ['common', 'index']
})
```

配置多个 html 页面
html-webpack-plugin 的一个实例生成一个 html 文件，如果单页应用中需要多个页面入口，或者多页应用时配置多个 html 时，那么就需要实例化该插件多次；

即有几个页面就需要在 webpack 的 plugins 数组中配置几个该插件实例：

```js
// ...
plugins: [
  new HtmlWebpackPlugin({
    template: 'src/html/index.html',
    excludeChunks: ['list', 'detail']
  }),
  new HtmlWebpackPlugin({
    filename: 'list.html',
    template: 'src/html/list.html',
    thunks: ['common', 'list']
  }),
  new HtmlWebpackPlugin({
    filename: 'detail.html',
    template: 'src/html/detail.html',
    thunks: ['common', 'detail']
  })
]
// ...
```

如上例应用中配置了三个入口页面：index.html、list.html、detail.html；并且每个页面注入的 thunk 不尽相同；类似如果多页面应用，就需要为每个页面配置一个；

配置自定义的模板
不带参数的 html-webpack-plugin 默认生成的 html 文件只是将 thunk 和 css 样式插入到文档中，可能不能满足我们的需求；

另外，如上面所述，三个页面指定了三个不同 html 模板文件；在项目中，可能所有页面的模板文件可以共用一个，因为 html-webpack-plugin 插件支持不同的模板 loader，所以结合模板引擎来共用一个模板文件有了可能。

所以，配置自定义模板就派上用场了。具体的做法，借助于模板引擎来实现，例如插件没有配置 loader 时默认支持的 ejs 模板引擎，下面就以 ejs 模板引擎为例来说明；

例如项目中有 2 个入口 html 页面，它们可以共用一个模板文件，利用 ejs 模板的语法来动态插入各自页面的 thunk 和 css 样式，代码可以这样：

```html
<!DOCTYPE html>
<html style="font-size:20px">
  <head>
    <meta charset="utf-8" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    <% for (var css in htmlWebpackPlugin.files.css) { %>
    <link href="<%=htmlWebpackPlugin.files.css[css] %>" rel="stylesheet" />
    <% } %>
  </head>
  <body>
    <div id="app"></div>
    <% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
    <script type="text/javascript" src="<%=htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
    <% } %>
  </body>
</html>
```

你可能会对代码中的上下文 htmlWebpackPlugin 数据感到迷惑，这是啥东东？其实这是 html-webpack-plugin 插件在生成 html 文件过程中产生的数据，这些数据对 html 模板文件是可用的。

自定义模板上下文数据
html-webpack-plugin 在生成 html 文件的过程中，插件会根据配置生成一个对当前模板可用的特定数据，模板语法可以根据这些数据来动态生成 html 文件的内容。

那么，插件生成的特殊数据格式是什么，生成的哪些数据呢？从源码或者其官网都给出了答案。从源码中可以看出模板引擎具体可以访问的数据如下:

```js
var templateParams = {
    compilation: compilation,
    webpack: compilation.getStats().toJson(),
    webpackConfig: compilation.options,
    htmlWebpackPlugin:
    files: assets,
    options: self.options
};
```

从中可以看出，有四个主要的对像数据。其中 compilation 为所有 webpack 插件提供的都可以访问的一个编译对象，此处就不太做介绍，具体可以自己查资料。下面就对剩下的三个对象数据进行说明。

webpack
webpack 的 stats 对象；注意一点：

这个可以访问的 stats 对象是 htm 文件生成时所对应的 stats 对象，而不是 webpack 运行完成后所对应的整个 stats 对象。

webpackConfig
webpack 的配置项；通过这个属性可以获取 webpack 的相关配置项，如通过 webpackConfig.output.publicPath 来获取 publicPath 配置。当然还可以获取其他配置内容。

htmlWebpackPlugin
html-webpack-plugin 插件对应的数据。它包括两部分：

htmlWebpackPlugin.files: 此次 html-webpack-plugin 插件配置的 chunk 和抽取的 css 样式。该 files 值其实是 webpack 的 stats 对象的 assetsByChunkName 属性代表的值，该值是插件配置的 chunk 块对应的按照 webpackConfig.output.filename 映射的值。例如对应上面配置插件各个属性配置项例子中生成的数据格式如下：

```json
{
    "htmlWebpackPlugin": {
    "files": {
    "css": [ "inex.css" ],
    "js": [ "common.js", "index.js"],
    "chunks": {
    "common": {
    "entry": "common.js",
    "css": [ "index.css" ]
    },
    "index": {
    "entry": "index.js",
    "css": ["index.css"]
    }
}
```

这样，就可以是用如下模板引擎来动态输出 script 脚本

```html
<% for (var chunk in htmlWebpackPlugin.files.chunks) { %>

<script type="text/javascript" src="<%=htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>

<% } %>
```

htmlWebpackPlugin.options: 传递给插件的配置项，具体的配置项如上面插件配置项小节所描述的。
插件事件
不知道你发现没有，html-webpack-plugin 插件在插入静态资源时存在一些问题：

在插入 js 资源只能插入 head 或者 body 元素中，不能一些插入 head 中，另一些插入 body 中
不支持在 html 中文件内联\*，例如在文件的某个地方用&lt;script src="xxx.js?\_\_inline"&gt;&lt;/script&gt;来内联外部脚本
为此，有人专门给插件作者提问了这个问题；对此插件作者提供了插件事件，允许其他插件来改变 html 文件内容。具体的事件如下：

Async（异步事件）:

    * html-webpack-plugin-before-html-generation
    * html-webpack-plugin-before-html-processing
    * html-webpack-plugin-alter-asset-tags
    * html-webpack-plugin-after-html-processing
    * html-webpack-plugin-after-emit

Sync（同步事件）:

    * html-webpack-plugin-alter-chunks

这些事件是提供给其他插件使用的，用于改变 html 的内容。因此，要用这些事件需要提供一个 webpack 插件。例如下面定义的 MyPlugin 插件。

```js
function MyPlugin(options) {
  // Configure your plugin with options...
}

MyPlugin.prototype.apply = function(compiler) {
  // ...
  compiler.plugin('compilation', function(compilation) {
    console.log('The compiler is starting a new compilation...')

    compilation.plugin('html-webpack-plugin-before-html-processing', function(
      htmlPluginData,
      callback
    ) {
      htmlPluginData.html += 'The magic footer'
      callback(null, htmlPluginData)
    })
  })
}
module.exports = MyPlugin
```

然后，在 webpack.config.js 文件中配置 Myplugin 信息：

```js
plugins: [new MyPlugin({ options: '' })]
```
