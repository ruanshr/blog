# vue 之 router 钩子函数

## 模块一：全局导航钩子函数

- 1、vue router.beforeEach（全局前置守卫）

beforeEach 的钩子函数，它是一个全局的 before 钩子函数， （before each）意思是在 每次每一个路由改变的时候都得执行一遍。

它的三个参数：

to: (Route 路由对象) 即将要进入的目标 路由对象 to 对象下面的属性： path params query hash fullPath matched name meta（在 matched 下，但是本例可以直接用）

from: (Route 路由对象) 当前导航正要离开的路由

next: (Function 函数) 一定要调用该方法来 resolve 这个钩子。 调用方法：next(参数或者空) \*\*\*必须调用

next(无参数的时候): 进行管道中的下一个钩子，如果走到最后一个钩子函数，那么 导航的状态就是 confirmed （确认的）

next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。

- 应用场景：可进行一些页面跳转前处理，例如判断需要登录的页面进行拦截，做登录跳转

```js
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    //判断该路由是否需要登录权限
    if (cookies('token')) {
      //通过封装好的cookies读取token，如果存在，name接下一步如果不存在，那跳转回登录页
      next() //不要在next里面加"path:/",会陷入死循环
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath } //将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})
```

- 应用场景，进入页面登录判断、管理员权限判断、浏览器判断

```js
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('ms_username')
  if (!role && to.path !== '/login') {
    next('/login')
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    if (role === 'admin') {
      next()
    } else {
      next('/403')
    }
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      })
    } else {
      next()
    }
  }
})
```


- 应用场景，记录历史访问页面，缓存数据退出重新登录到该页面的时候是没有历史访问页面的，跳到指定页面就不能用go(-1)，需要用replace代替

```js
const routeHistory = []
router.afterEach((to, from, next) => {
  const { name } = to
  const toIndex = routeHistory.findIndex(name)
  if (toIndex > -1) {
    routeHistory.splice(toIndex, 1)
  }
  routeHistory.push(to.name)
})
window.addEventListener('popstate', function onPopstate( ) {
  routeHistory.pop()
})
```

- 2、vue router.afterEach（全局后置守卫）

router.beforeEach 是页面加载之前，相反 router.afterEach 是页面加载之后

## 模块二：路由独享的守卫(路由内钩子)

可以在路由配置上直接定义 beforeEnter 守卫

```js

const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ],

```

这些守卫与全局前置守卫的方法参数是一样的

## 模块三：组件内的守卫(组件内钩子)

- 1、beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`

  }

```

- 2. 路由钩子在实际开发中的应用场景

(一) 清除当前组件中的定时器

当一个组件中有一个定时器时, 在路由进行切换的时候, 可使用 beforeRouteLeave 将定时器进行清楚, 以免占用内存:

beforeRouteLeave (to, from, next) {
window.clearInterval(this.timer) //清楚定时器
next()
}

(二) 当页面中有未关闭的窗口, 或未保存的内容时, 阻止页面跳转

如果页面内有重要的信息需要用户保存后才能进行跳转, 或者有弹出框的情况. 应该阻止用户跳转，结合 vuex 状态管理（dialogVisibility 是否有保存）

```js

beforeRouteLeave (to, from, next) {
 //判断是否弹出框的状态和保存信息与否
 if (this.dialogVisibility === true) {
    this.dialogVisibility = false //关闭弹出框
    next(false) //回到当前页面, 阻止页面跳转
  }else if(this.saveMessage === false) {
    alert('请保存信息后退出!') //弹出警告
    next(false) //回到当前页面, 阻止页面跳转
  }else {
    next() //否则允许跳转
  }
```

(三) 保存相关内容到 Vuex 中或 Session 中

当用户需要关闭页面时, 可以将公用的信息保存到 session 或 Vuex 中

```js
 beforeRouteLeave (to, from, next) {
    localStorage.setItem(name, content); //保存到localStorage中
    next()
}
```
