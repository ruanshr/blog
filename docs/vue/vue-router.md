# 路由插件vue-router

### 安装

```
npm install vue-router

```

### 引入vue-router



```js

import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash", // hash | history | abstract
  routes: [
    {path:"/", component: Home }
    {path:"/about", component: About }
  ]
})

new Vue({
  router,
  render: (h) => h(App)
})


<template>
  <Layout>
     <RouterView />

     <RouterLink to="/">首页</RouterLink>
  </Layout>
</template>

```