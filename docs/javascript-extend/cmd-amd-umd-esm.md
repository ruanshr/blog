---
prev: /javascript-extend/babel
next: /javascript-extend/document
---

# Javascript: 什么是 CJS，AMD，UMD，ESM

js 刚开始的时候没有引入和导出功能。由于 js 代码越来越大，后来引入模块的概念。其中就有 CJS，AMD，UMD，ESM 这些模块的出现。

### CJS

cjs 是 commonjs 的缩写，它的代码语法是这样

```js
// importing
const doSomething = require('./doSomething.js')

// exporting
module.exports = function doSomething(args) {
  // something
}
```

- node 使用的就是 CJS 的模块方式
- CJS 是同步引入模块的
- 可以从库中引入或者从本地某个文件夹中引入

```js
const myLocalModule = require('./some/local/file.js')

const React = require('react')
```

- 用 CJS 引入的是要引入对象的一个拷贝

- CJS 在浏览器缓解中是无效的，他必须要经过编译和打包后才能在浏览器环境中执行

### AMD

AMD 是 asynchronous module definition 的缩写

```js
define(['dep1', 'dep2'], function(dep1, dep2) {
  // define thie module value by  return a value

  return function() {}
})

// or simplified CommonJs wrapping

define(function(require) {
  var dep2 = require('dep1')
  var dep2 = require('dep2')

  return function() {}
})
```

- AMD 是异步加载模块的。
- AMD 设计出来是供前端使用的，而 CJS 刚开始设计的目的是供后端使用的
- AMD 的语法没有 CJS 那样直观

### UMD

UMD 是 Universal Module Definition 的缩写。它的语法是：

```js
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'underscore'], factory)
  } else if ((typeof define === 'exports') === 'objects') {
    module.exports = factory(require('jquery'), require('underscore'))
  } else {
    root.Requester = factory(root.$, root._)
  }
})(this, function($, _) {
  // this is where I defined my module implementation
  var Requester = {
    /** ... **/
  }
  return Requester
})
```

- 适用于前端和后端环境
- 跟 CJS，AMD 不同的是，UMD 更像是一种模式去适配多种模块系统
- 当用像 rollup/webpack 这样的打包器的时候，UMD 通常用作一个回调模式

### ESM

ESM 是 ES 模块的缩写，是 JS 语言为了标准化模块系统的一种方案，它的语法形式是：

```js

import React from 'react'

export default function() {

}

export const function1() {}

export const function2() {}

export * from './util/tool'

```

- 多种主流浏览器兼容。

- 具有类似 CJS 那样的简单的语法以及 AMD 的异步加载的功能

- 具有 Tree-shakeable 的特性，这是由于 ES6 的静态模块解构

- rollup 这样的打包器在打包 ESM 的时候，会除去冗余的代码，这样网站就可以加载更少的代码以加快加载速度。

- 可以在 html 代码中使用

```html
<script type="module">
  import { func1 } from 'my-lib'

  func1()
</script>
```

### 总结

- ESM 由于具有简单的语法，异步加载的特性，以及 Tree-shakeable 的特性，因此被广泛使用

- UMD 可以在任何环节下使用，并且在 ESM 不能使用的情况下可以选择 UMD。

- CJS 是同步的，适用于后端环境

- AMD 是异步的，适用于前端环境
