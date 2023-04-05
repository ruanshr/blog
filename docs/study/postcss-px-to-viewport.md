# 适配转换 postcss-px-to-viewport

移动端设配打包工具

1、下载插件

```sh

npm i postcss-px-to-viewport -D

```

2、创建配置文件 postcss.config.js

```js

module.epxorts = {
  plugins: {
    "postcss-px-to-viewport": {
       "viewportWith": 375  // 设计稿
    }
  }
}

```

![vant官网](https://vant-contrib.gitee.io/vant/#/zh-CN/home)
