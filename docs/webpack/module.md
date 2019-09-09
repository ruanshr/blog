# 模块化

## AMD

require.js 将 AMD 发扬光大，成为 AMD 事实标准。
模块定义和使用：

```js
define(id?, dependencies?, function factory(){

    return moduleContent;

});
```

优点：浏览器直接使用。

## Common.js / CMD

Common.js 模块定义和使用：

```js
var dependency = require('xxx')

// 模块定义
exports.xxx = xxx

// 或者
module.exports = moduleContent
```

CMD 模块定义和使用：

```js
define(function(require, exports, module) {
  var a = require('./a')
  var b = require('./b') // 依赖可以就近书写
})
```

UMD

```js
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['b'], factory)
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('b'))
  } else {
    // Browser globals (root is window)
    root.returnExports = factory(root.b)
  }
})(this, function(b) {
  //use b in some fashion.

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return {}
})
```
