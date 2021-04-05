#  SSR解决了什么问题

### 1、是什么

server-side rendering 我们称其为SSR，意为服务端渲染

指由服务侧完成页面的HTML结构拼接的页面处理技术，发送到浏览器，然后为其绑定状态和事件，成为完全可交互页面的过程


**传统web开发**

网页内容载服务端渲染完成，一次性传输到浏览器


打开页面查看源码，浏览器拿到的是全部的DOM结构


**单页面应用SPA**

单页面应用优秀的用户体验，使其逐渐成为主流，页面内容有JS渲染出来，这种方式成为客户端渲染


打开页面查看源码，浏览器拿到的仅有宿主元素#app，并没有内容


**服务端渲染**

SSR解决方案，后端渲染出完整的首屏的DOM结构返回，前端拿到的内容包括首屏及完整SPA结构，应用激活后依然按照SPA方式运行

看完前端发展，我们再看看Vue官方对SSR的解释：

> Vue.js是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出Vue组件，进行生成DOM和操作DOM，然而，也可以将同一个组件渲染为服务器端的HTML字符串，将他们之间发送到浏览器，最后将这些静态标记“激活”为客户端上完全可交互的应用程序。服务器渲染的Vue.js应用程序也可以被认为是“同构”或者“通用”，因为应用程序的大部分代码都可以在服务端和客户端上运行。

我们从上面解析可以得出以下结论

- Vue SSR是一个在SPA上进行改良的服务端渲染

- 通过Vue SSR渲染的页面，需要在客户端激活才能实现交互

- Vue SSR将包含两部分：服务端渲染的首屏，包含交互的SPA

### 解决了什么

SSR 主要解决了以下两种问题：

- SEO: 搜索引擎优先爬取页面HTML结构，使用SSR时，服务端已经生成了和页面相关联的HTML，有利于SEO

- 首屏呈现渲染： 用户无需等待页面所有JS加载完成就可以看到页面视图（压力来到了服务器，所以需要权衡哪些用服务端渲染，哪些交给客户端）


但是使用SSR同样存在以下的缺点：

- 复杂度：整个项目的复杂度

- 库的支持，代码兼容

- 性能问题

1）每个请求都是n个实例的创建，不然会污染，消耗会变得好大

2）缓存node serve，nginx判断当前用户没有过去，如果没有过期的话就缓存，用刚刚的结果

3）降级： 监控CPU，内存占用过多，就SPA，返回单个的壳

- 服务器的负载变大，相对于前后端分离服务器只需要提供静态资源来说，服务器负载更大，所以要谨慎使用

所以在我们选择是否使用SSR前，我们需要慎重问问自己这些问题：

1.需要SEO的阳是否只有少数几个，这些是否需要预渲染（prerender spa plugin）实现

2.首屏的请求响应逻辑是否复杂，数据返回是否大量且缓慢

### 如何实现

对于同构开发，我们依然使用webpack打包，我们要解决两个问题：服务端首屏渲染和客户端激活

这里需要生成一个服务器bundle文件用于服务端首屏渲染和一个客户端bundle文件用于客户端激活



代码结构  除了两个不同的入口之外，其他结构和之前Vue应用完全相同


路由配置

```js

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 导出工厂函数
export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            // 客户端没有编译器，这里就写成渲染函数
            { path: '/', component: { render: h => h('div', 'index page')}},
            { path: '/detail', component: { render: h => h('div', 'detail page')}},
        ]
    })
}

```

主文件main.js


跟之前不同，主文件是负责创建vue实例的工厂，每次请求均会有独立的vue实例创建

```js

import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
// 导出Vue实例工厂函数，为每次请求创建独立实例
// 上下文用于给vue实例传递参数
export function createApp(context) {
    const router = createRouter()
    const app = new Vue({
        router,
        context,
        render: h => h(App)
    })

    return { app, router }
}


```

编写服务端入口src/entry-server.js


它的任务是创建Vue实例并根据传入url指定首屏

```js
import { createApp } from './main'
// 返回一个函数，接收请求上下文，返回创建的vue实例
export default context => {
    // 这里返回一个Promise，确保路由或组件准备就绪
    return new Promise((resolve, reject) => {
        const { app, router } = createApp(context)
        // 跳转到首屏的地址
        router.push(context.url)
        // 路由就绪，返回结果
        router.onReady(() => {
            resolve(app)
        }, reject)
    })
}

```

编写客户端入entry-client.js

客户端入口只需要创建vue实例并执行挂载，这一步称为激活

```js

import { createApp } from './main'
// 创建vue，  router 实例
const { app, router } = createApp()
// 路由就绪，执行挂载
router.onReady(() => {
    app.$mount('#app')
})

```

对于webpack进行配置

安装依赖

```
npm install webpack-node-externals loadsh.merge -D
```

对vue.config.js进行配置

```js
// 两个插件分别负责打包客户端和服务端
const VueSSRServerPlugin = requre

```

对脚本进行配置，安装依赖

```
npm i cross-env -D 
```

定义创建脚本package.json

```json

```

> 执行打包： npm run build


最后修改宿主文件 /public/index.html

```html

```

> 是服务端渲染入口位置，注意不能为了好看而在前面加空格

安装Vuex

```
npm install -S vuex
```

客户端数据预取处理 main.js

```js

Vue.mixin({
    beforeMount() {

    }
})

```



修改服务器启动文件

```js
// 获取文件路径
const resolve = dir => require('path').resolve(__dirname, dir)
// 第一步：开放dist/client 目录，关闭默认下载index页面的选项，不然到不了后面路由
app.use(express.static(resolve('../dist/client'), {index: false}))
// 第二步：获得一个createBundleRenderer
const { createBundleRenderer } = require('vue-server-render')
// 第三步：服务端打包文件地址
const bundle = resolve('../dist/server/vue-ssr-server-bundle.json')
// 第四步：创建渲染器
const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: require('fs').readFileSync(resolve('../public/index.html'), 'utf8'),
    clientManifest: require(resolve('../dist/client/vue-ssr-clientmanifest.json'))
})

app.get('*', async (req, res) => {
    // 设置url和title两个重要参数
    const context = {
        title: 'ssr text',
        url: req.url
    }
    const html = await renderer.renderToString(context)
    req.send(html)
})

```



### 小结

- 使用SSR不存在单例模式，每次用户请求都会创建一个新的vue实例

- 实现SSR需要实现服务端首屏渲染和客户端激活

- 服务端异步获取数据 asyncData可以分为首屏异步获取和切换组件获取

1）首屏异步获取数据，在服务端预渲染的时候就应该已经完成

2）切换组件通过mixin混入，在beforeMount钩子完成数据获取
