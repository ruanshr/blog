# vite + react 项目搭建

### Vite 概述

与 Vue CLI 类似，Vite 也是一个提供基本项目脚手架和开发服务器的构建工具。

然而，Vite 并不是基于 Webpack 的，它有自己的开发服务器，利用浏览器中的原生 ES 模块。这种架构使得 Vite 比 Webpack 的开发服务器快了好几个数量级。Vite 采用 Rollup 进行构建，速度也更快。

### 基于 vite 的搭建基础模板

现在 vite 生态已经比较完善了，所以自己搭建一个脚手架，由 webpack 转向 vite，这一步极大的提升了开发体验。

[vite 官网中文文档](https://cn.vitejs.dev/)

### 1、创建基本模板项目

```sh
npm init vite@latest
yarn create vite
// 根据提示选择配置即可 vite 提供的选项很少，只有 react 或 react + ts
```

2、配置环境变量
vite 提供了开发模式和生产模式

这里我们可以建立 4 个 .env 文件，一个通用配置和三种环境：开发、测试、生产。

env 文件中的变量名建议以 VITE_APP 开头，和 vue cli 中的 VUE_APP 相同 ，用法也一致
.env 文件 通用配置 用来配置一些公用的，例子：网页的 title VITE_APP_TITLE=hello
1).env.dev 文件 开发环境配置 以 api url 为例 VITE_APP_PROXY_URL=/api
2).env.test 文件 测试环境配置 以 api url 为例 VITE_APP_PROXY_URL=/api
3).env.prod 文件 测试环境配置 以 api url 为例 VITE_APP_PROXY_URL=/apiProd

在写 api 的时候可以这么使用

```js
const baseUrl = import.meta.env.VITE_APP_PROXY_URL
export const getTabList = (params) => {
  return axios({
    method: 'post',
    url: baseUrl + 'QueryTabReq',
    data: params
  })
}
```

命令行界面 package.json

```json
{
  "script": {
    "dev": "vite --mode dev",
    "build": "vite build --mode prod"
  }
}
```

### 3、配置 alias 别名 @

配置别名 像 vue cli 一样 以@引入文件

如果 path 或者\_\_dirname 报红，需要安装支持@types/node 到本地 npm i @types/node -D

vite.config.js

```js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

配置了@别名之后去引入文件发现没有智能提示，需要根目录添加一个 tsconfig.json 文件

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

### 4、配置 proxy 代理

vite.config.js 中配置 server

```js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\api/, '')
      }
    }
  }
})
```

### 5、安装 Ant design 按需引入

```sh

npm install antd --save
## 按需引入
npm install less less-loader vite-plugin-style-import -D
```

vite.config.js

```js
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import';

plugins:[
 react()
 createStyleImportPlugin({
    resolves: [AntdResolve()]
 })
]
```

安装 less vite.config.js

```js

css: {
    preprocessorOptions: {
      less: {
        modifyVars: { // 更改主题在这里
          'primary-color': '#52c41a',
          'link-color': '#1DA57A',
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  }
```

使用 antd app.jsx

```tsx
import { Button } from 'antd'
function Home() {
  return <Button>Hi antd</Button>
}
```
