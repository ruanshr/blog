# vite2.0 搭建 Vue3移动端项目

### 涉及技术

vite版本、vue3、ts、集成路由、集成vuex、集成axios、配置Vant3、移动端适配、请求代理

### 步骤

**vite + ts + vue3只需要一行代码**

```
npm init @vitejs/app vue-app --template vue-ts

```

**配置路由**

```
npm install vue-router@4 --save
```

> 在src下新建router目录，新建index.ts文件


```ts

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouterRecordRaw> =  [
    {
        path: '/',
        name: 'Home',
        meta: {
            title: '首页',
            keepAlive: true
        },
        component: () => import('../views/Home/index.vue')
    },
    {
        path:'/login',
        name:'Login',
        meta: {
            title:'登录',
            keepalive: true
        },
        component: () => import('../views/Login/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    route
})

export default router
```

在 main.ts 挂载路由

```js

import { createApp } from 'vue'

import App from './App.vue'

import router from  './router'

createApp(App)
.use(router)
.mount('#app')

```

**配置数据中心vuex ( 4.x) 版本** 

- 安装

```
npm i vuex@next --save
```

- 配置

在src下创建store目录，并在store下创建index.ts

```js

import { createStore } from 'vuex'
export default createStore({
    state: {
        listData:[]
        num: 0
    },
    mutations: {
        setData(state, value){
            state.listData = value
        },
        setNum(state, num) {
            state.num = num
        }
    },
    actions: {
        setData({ commit }, value ) {
            commit('setData', value)
        }
    }
})

```

- 挂载

在main.ts 挂载数据中心

```js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App)
.use(router)
.use(store)
.mount('#app')

```

**Vant3**

- 安装

```js

npm i vant@next -S
```

> vite版本不需要配置组件的按需加载，因为Vant 3.0内部所有模块都是基于ESM编写的，天然举报按需引入的功能，但是样式必须全部引入

在main.ts全局引入样式

```js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ant from 'vant'

import  'vant/lib/index.css'
createApp(App)
.use(router)
.use(store)
.use(ant)
.mount('#app')

```

**移动端适配**

安装postcss-pxtorem 

```
npm install postcss-pxtorem -D

```

在跟目录下创建postcss.config.js

```js

module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 37.5,
            // vant 官方跟字体大小是37.5
            propList: ['*'],
            selectorBlackList: ['.norem']
            //过滤掉.norem- 开头的class,不进行rem转换
        }
    }
}

```

在根目录src中新建util目录下新建rem.ts 等比适配文件

```js
// rem 等比适配置文件
// 基准大小
const baseSize = 37.5
// 注意此值要与postcss.config.js中文件中的rootValue保持一致
function setRem() {
    // 当前页面宽度相对于375宽的缩放比例，可根据自己需要修改，一般设计稿都是宽750（图方便可以拿到设计图后改过来）
    const scale = document.documentElement.clientWidth / 375
    document.documentElement.style.fontSize  = baseSize * Math.min(scale, 2) + 'px'
}
//初始化
setRem()

// 改变窗口大小时重新设置 rem
window.onresize = function onresize() {
    setRem()
}
```

- 在main.ts引入

```js
import './utils/rem'
```

**配置网络请求axios**

- 安装

```
npm i -s axios

```

- 配置axios

在src创建utils文件夹，并在utils下创建request.ts

```js

import axios from 'axios'

const service = axios.create({
    baseUrl,
    timeout: 5000
})

service.interceptors.request.use(
    config => {
        const token = window.localStorage.getItem('accessToken')
        if(token) {
            config.headers.common.Authorization = token
        }
        return config
    }
)

service.interceptors.response.use(
    response => {
        const res = response.data
        if(response.status !== 200) {
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res
        }
    }, 
    error => {
        return Promise.reject(error)
    }
)

export default service

```

- 使用

```js

import request from './utils/request'
request({url: 'profile', method: 'get'})
.then(res => {
    console.log(res)
})
```


**配置请求代理**

vite.config.ts

```js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue’
import path from 'path'

export default defineConfig({
    plugins:[vue()],
    base:'./',
    resolve: {
        alias:{
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        port: 4000,
        open: true,
        proxy: {
            '/api': 'http://localhost:3000'
        },
        cors: true
    }
})

```

以上，一个最基本的一段段开发配置完成

