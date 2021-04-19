---
prev: /javascript-extend/babel-stage
next: /javascript-extend/cmd-amd-umd-esm
---

# Babel中的 stage-x 及 Babel 7

大家知道，将 ES6 代码编译为 ES5 时，我们常用到 Babel 这个编译工具。大家参考一些网上的文章或者官方文档，里面常会建议大家在.babelrc 中输入如下代码：

```json
{
  "presets": ["es2015", "react", "stage-0"],
  "plugins": []
}
```

首先，这个配置文件是针对 babel 6 的。Babel 6 做了一系列模块化，不像 Babel 5 一样把所有的内容都加载。比如需要编译 ES6，我们需要设置 presets 为"es2015"，也就是预先加载 es6 编译的相关模块，如果需要编译 jsx，需要预先加载"react"这个模块。

#### 1、stage-0

它包含 stage-1, stage-2 以及 stage-3 的所有功能，同时还另外支持如下两个功能插件：

**transform-do-expressions**
**transform-function-bind**

#### 2、stage-1

它包含 stage-2 和 stage-3，还包含了下面 4 个插件：

**transform-class-constructor-call(Deprecated)**
**transform-class-properties**
**transform-decorators – disabled pending proposal update**
**transform-export-extensions**

#### 3、stage-2

它除了覆盖 stage-3 的所有功能，还支持如下两个插件：

**syntax-trailing-function-commas**
**transform-object-reset-spread**

#### 4、stage3

它包含如下两个插件:
**transform-async-to-generator**
**transform-exponentiation-operator**

### babel 7

babel7更加灵活的配置，取消stage，使用按需配置插件，并且支持预设配置功能

安装babel 7

```
npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/runtime
npm install --save @babel/polyfill
# 选择需要安装的插件

# 辅助@babel/runtime，@babel/runtime的作用是提供统一的模块化的helper
npm install -D @babel/plugin-transform-runtime

# 编译类
npm install -D @babel/plugin-proposal-class-properties

# 将const或者let变量编译成var变量
npm install -D @babel/plugin-transform-block-scoping

# 将class关键字转化成传统基于原型的类
npm install -D @babel/plugin-transform-classes

# 将箭头函数编译成普通函数
npm install -D @babel/plugin-transform-arrow-functions  
```

```json
{
  "presets": [
    "@babel/preset-env",
    {
      "targets": {
        "edge": "17",
        "firefox": "60",
        "chrome": "67",
        "safari": "11.1"
      }
    }
  ],
  "plugins": ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties"]
}
```
