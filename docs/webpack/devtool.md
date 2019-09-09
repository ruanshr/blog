# webpack 不同 devtools 打包对比

## eval

功能: 每个模块都转化为字符串，用 eval()包裹，并在尾部添加# sourceURL，即源文件的相对路径
e.g.

```js
```

chrome 调试时生成的目录:

# source-map

功能:打包的同时生成 sourcemap 文件，在打包文件末尾加上#sourceMappingURL,指向 map 文件位置,是最原始的 source-map 实现方式
e.g.

```js
```

chrome 调试时生成的目录:

## hidden-source-map

功能: 较 source-map，没有#sourceMappingURL（这样就 hide 了 map）

chrome 调试时没有生成额外文件夹

## inline-source-map

功能: 打包后生成的#sourceMappingURL，后接 sourcemap 文件 base64 编码后的字符串（map 文件以字符串的形式存在于行内）
e.g.

```js
```

## eval-source-map

功能: 每个模块转化为字符串，后接#sourceMappingURL(base64)和#sourceURL

e.g.

```js
```

## cheap-source-map

同 source-map，不包含列信息，不包含 loader 的 sourcemap

## 总结

可以发现

凡带有 eval，生成 sourceURL，用 eval()包裹模块

带有 source-map，生成 sourceMappingURL,而生成的 map 根据前缀可为多种形式:

source-map: 单独的 map 文件

inline-source-map: 行内 desource-map

hidden-source-map: 隐藏 map(通过取消#sourceMappingURL)

....

开发环境最佳配置:

cheap-module-eval-source-map

cheap: 不包含列信息

module: 简化 loader 的 sourcemap，支持 babel 预编译

eval: 提高持续构建效率

生产环境最佳配置:

cheap-module-source-map
