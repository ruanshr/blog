# Vue 项目中各种痛点问题及方案

### 列表进入详情页的传参问题

例如商品列表页面前往商品详情页面，需要传一个商品 id

```html
<router-link :to="{path: 'detail', query:{id:1}}">详情</router-link>
```

c 页面的路径为http://localhost:8080/#/detail?id=1，可以看到传了一个参数id=1，并且就算刷新页面id也还会存在。此时在c页面可以通过id来获取对应的详情数据，获取id的方式是this.$route.query.id

vue 传参方式有：query、params+动态路由传参

说下两者的区别：

1、query 通过 path 切换路由，params 通过 name 切换路由

```html
// query通过path切换路由
<router-link :to="{path: 'Detail', query: { id: 1 }}">详情</router-link>
// params通过name切换路由
<router-link :to="{name: 'Detail', params: { id: 1 }}">详情</router-link>
```

2、query 通过 this.$route.query来接收参数，params通过this.$route.params 来接收参数。

```js
// query通过this.$route.query接收参数
created () {
    const id = this.$route.query.id;
}

// params通过this.$route.params来接收参数
created () {
    const id = this.$route.params.id;
}
```

3、query传参的url展现方式：/detail?id=1&user=123&identity=1&更多参数

params＋动态路由的url方式：/detail/123

4、params动态路由传参，一定要在路由中定义参数，然后在路由跳转的时候必须要加上参数，否则就是空白页面

注意，params传参时，如果没有在路由中定义参数，也是可以传过去的，同时也能接收到，但是一旦刷新页面，这个参数就不存在了。这对于需要依赖参数进行某些操作的行为是行不通的，因为你总不可能要求用户不能刷新页面吧。

### 本地开发环境请求服务器接口跨域的问题

```js
proxyTable: {
    // 用‘/api’开头，代理所有请求到目标服务器
    '/api': {
        target: 'http://xxx.xx.com', // 接口域名
        changeOrigin: true, // 是否启用跨域
        pathRewrite: { //
          '^/api': ''
        }
    }
}
```
或者

```js
proxyTable: {
    // 用‘/api’开头，代理所有请求到目标服务器
    '/api/moduleA': {
        target: 'http://xxx.xx.com', // 接口域名
        changeOrigin: true, // 是否启用跨域
        pathRewrite: { //
          '^/api/moduleA': ''
        }
    },
    '/api/moduleB': {
        target: 'http://yyy.yy.com', // 接口域名
        changeOrigin: true, // 是否启用跨域
        pathRewrite: { //
          '^/api/moduleB': ''
        }
    }
}
```

### axios封装和api接口的统一管理

xios的封装，主要是用来帮我们进行请求的拦截和响应的拦截。

在请求的拦截中我们可以携带userToken，post请求头、qs对post提交数据的序列化等。

在响应的拦截中，我们可以进行根据状态码来进行错误的统一处理等等。

axios接口的统一管理，是做项目时必须的流程。这样可以方便我们管理我们的接口，在接口更新时我们不必再返回到我们的业务代码中去修改接口

### UI库的按需加载

为什么要使用按需加载的方式而不是一次性全部引入，原因就不多说了。这里以vant的按需加载为例，演示vue中ui库怎样进行按需加载

- 安装： cnpm i vant -S

- 安装babel-plugin-import插件使其按需加载：  cnpm i babel-plugin-import -D

- 在 .babelrc文件中中添加插件配置 

```json
libraryDirectory { 
    
    "plugins": [ 
        // 这里是原来的代码部分
        // …………

        // 这里是要我们配置的代码
        ["import", 
            { 
                "libraryName": "vant", 
                "libraryDirectory": "es", 
                "style": true 
            }
        ] 
    ] 
}
```

- 在main.js中按需加载你需要的插件

```js
// 按需引入vant组件
import {   
    DatetimePicker,   
    Button,   
    List 
} from 'vant';

```

- 使用组件

```js
// 使用vant组件
Vue.use(DatetimePicker)  
    .use(Button)  
    .use(List);

```
PS:除了vant库外，像antiUi、elementUi等，很多ui库都支持按需加载，可以去看文档，上面都会有提到。基本都是通过安装babel-plugin-import插件来支持按需加载的，使用方式与vant的如出一辙


### 如何优雅的只有在当前页面中覆盖ui库中组件的样式

首先我们vue文件的样式都是些在&lt;stype lang="less" scoped&gt;&lt;\style&gt;标签中的，加scoped是为了使得样式只有在当前