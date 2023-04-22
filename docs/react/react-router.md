# React-router

### 安装

```sh

npm install reat-router-dom

```

### 入门

用 React + [React Router Dom](https://reactrouter.com/en/main/routers/create-browser-router) 创建单页应用非常简单：通过 React.js，我们已经用组件组成了我们的应用。当加入 Router 时，我们需要做的就是将我们的组件映射到路由上，让 Router 知道在哪里渲染它们。下面是一个基本的例子：

**App.tsx**

```tsx
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Login from './Login'
function App() {
  return (
    <div>
      <BrowserRouter>
        <ul>
          <li>
            <NavLink to="/">首页</NavLink>
          </li>
          <li>
            <NavLink to="/about">关于我们</NavLink>
          </li>
          <li>
            <NavLink to="/login">登录</NavLink>
          </li>
        </ul>
        <div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}
export default App
```

**NavLink**

使用一个自定义组件 NavLink 来创建链接。这使得 React Router 可以在不重新加载页面的情况下更改 URL

**Routes**

将显示与 Route 组件的 path 对应的组件（element）。

```tsx
<BrowserRouter>
  <ul>
    {/* 传递值为123 */}
    <li>
      <NavLink to="/about/123">关于我们</NavLink>
    </li>
  </ul>
  <div>
    <Routes>
      {/* 动态字段以冒号开始 */}
      <Route path="/about/:id" element={<About />}></Route>
    </Routes>
  </div>
</BrowserRouter>
```

```tsx
import { useParams, useSearchParams } from 'react-router-dom'
export default function About() {
  const routeParams = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  console.log(routeParams, searchParams.get('type'))
  return <div>About id: {routeParams.id}</div>
}
```

**useParams useSearchParams**

使用 **useParams()** 获取路由传递的一些参数

使用 **useSearchParams()**获取?后的参数

**嵌套路由**

这里我们新增一个文件 Account.tsx,和菜单 Account

**Outlet 将其用于父组件中可以为子路由的元素占位，并最终渲染子路由的元素**

**Account.tsx**

```tsx
import { Outlet } from 'react-router-dom'

export default function Account(props: any) {
  console.log(props)
  return (
    <div>
      我是客户管理
      <Outlet />
    </div>
  )
}
```

**useNavigate 主动调用路由跳转**

**Login.tsx**

```tsx
import { useNavigate } from 'react-router-dom'
export default function Login() {
  const navigate = useNavigate()
  const goHome = () => {
    navigate('/')
    // navigate('/', { replace: true })   替换当前路由
  }
  return <div onClick={goHome}>Login: 去首页</div>
}
```

**404 NotFound**

在配置路由的最后面加一个 path='\*'，意为 上面路由都没有找到 则走 notFount 组件

**路由拦截**

梳理：我们需要实现一个后台管理系统，菜单和路由拦截功能

1、创建 routes.ts 动态路由和固定路由都放于此

2、创建 routerBefore.tsx 这个文件需要实现路由拦截

**routes.ts**

```ts
import Home from '@/views/Home'
import Accont from '@/views/Account'
import AccountLisst from '@/views/accountList'
import Login from '@/views/Login'
export default [
  {
    path: '/',
    meta: {
      title: '首页',
      isLogin: true,
      isMenu: true
    },
    component: Home
  },
  {
    path: '/account',
    meta: {
      title: '客户管理',
      isLogin: true,
      isMeun: true
    },
    component: Accont,
    children: [
      {
        path: 'list',
        meta: {
          title: '客户列表',
          isLogin: true,
          isMenu: true
        },
        component: AccountLisst
      }
    ]
  },
  {
    path: '/login',
    meta: {
      title: '登录'
    },
    component: Login
  }
]
```

路由数组文件有了，下一步 创建路由

**routerBefore.tsx**

```tsx
import { Navigate, useRoutes } from 'react-router-dom'
import routes from './routes-test'
// 渲染路由
const renderRoutes = (routes: any) => {
  return routes.map((item: any) => {
    const route: any = { meta: item.meta, path: item.path }
    if (item.component) {
      // element 要接收react.element类型 item.component 是对象 所以要转一下
      route.element = <item.component />
    }
    if (item.children) {
      route.children = renderRoutes(item.children)
    }
    if (item.redirect) {
      route.element = <Navigate to={item.redirect} />
    }
    return route
  })
}

export default function Router() {
  // useRoutes API 把路由数组整合为 <Router> <Route path="xx" element="xxx"></Route>等 </Router>的路由组件  直接用于BrowserRouter中
  console.log(renderRoutes(routes))
  return useRoutes(renderRoutes(routes))
}
```

**App.tsx**

```tsx
import { BrowserRouter, NavLink } from 'react-router-dom'
import Router from '@/router/routerBefore.ts'
function App() {
  return (
    <div>
      <BrowserRouter>
        <ul>
          <li>
            <NavLink to="/">首页</NavLink>
          </li>
          {/* 增加一个客户管理菜单 */}
          <li>
            <NavLink to="/account">客户管理</NavLink>
            <div style={{ paddingLeft: '12px' }}>
              <NavLink to="/account/list">客户列表</NavLink>
              <br />
            </div>
          </li>
          <li>
            <NavLink to="/login">登录</NavLink>
          </li>
        </ul>
        <div>
          <Router></Router>
          {/* 这里就可以替代原来那一坨Route */}
        </div>
      </BrowserRouter>
    </div>
  )
}
export default App
```

到这一步，已经实现了我们入门篇的代码逻辑

接下来是拦截的核心代码

想想，我们的目标是未登录，只能访问登录页，从哪里切入呢?

渲染的部分 也就是 element。

未登录，路由变化时 进入我们的组件 判断一下 当前页面需要登录不，需要的话重定向到登录 否则 放它走。

所以我们可以在 element 外套一层组件，接收 route。

**beforeRoute.tsx**

```tsx
import { Navigate, useRoutes } from 'react-router-dom'
import routes from './routes-test'
// 拦截
const RouterBeforeEach = (props: { route: any; children: any }) => {
  if (props?.route?.meta?.title) {
    document.title = props.route.meta.title
  }
  const isLogin: boolean = !!Cookies.get('userInfo')
  if (props?.route?.meta?.isLogin) {
    if (!isLogin) {
      return <Navigate to={'/login'} replace />
    }
  }
  const location = useLocation()
  const routerKey = location.pathname
  if (isLogin && ['/login'].includes(routerKey)) {
    return <Navigate to={'/'} replace />
  }
  return <div>{props.children}</div>
}
// 渲染路由
const renderRoutes = (routes: any) => {
  return routes.map((item: any) => {
    const route: any = { meta: item.meta, path: item.path }
    if (item.component) {
      // element 要接收react.element类型 item.component 是对象 所以要转一下
      // 看着里看着里
      route.element = (
        <RouterBeforeEach route={item}>
          <item.component />
        </RouterBeforeEach>
      )
    }
    if (item.children) {
      route.children = renderRoutes(item.children)
    }
    if (item.redirect) {
      route.element = <Navigate to={item.redirect} />
    }
    return route
  })
}

export default function Router() {
  // useRoutes API 把路由数组整合为 <Router> <Route path="xx" element="xxx"></Route>等 </Router>的路由组件  直接用于BrowserRouter中
  console.log(renderRoutes(routes))
  return useRoutes(renderRoutes(routes))
}
```

这样就达到了我们路由拦截的目的。

**路由懒加载**

原理

- **React**利用 **React.lazy**与**import()**实现了渲染时的动态加载
- 利用**Suspense**来处理异步加载资源时页面应该如何显示的问题
- 通过**lazy()** api 来动态**import**需要懒加载的组件
- **import**的组件目前只支持**export default**的形式导出
- **Suspense**来包裹懒加载的组件进行加载，可以设置**fallback**现实加载中效果
- **React.lazy**可以结合**Router**来对模块进行懒加载。

下面我们将对 routes.ts 做调整

**routes.ts**

```tsx
// import Home from '@/views/Home'
// import Accont from '@/views/Account'
// import AccountLisst from '@/views/accountList'
// import Login from '@/views/Login'
// 引入lazy
import { lazy } from 'react'
export default [
  {
    path: '/',
    meta: {
      title: '首页',
      isLogin: true,
      isMenu: true
    },
    // 改为import引用
    component: lazy(() => import('@/views/Home'))
  },
  {
    path: '/account',
    meta: {
      title: '客户管理',
      isLogin: true,
      isMeun: true
    },
    component: lazy(() => import('@/views/Account')),
    children: [
      {
        path: 'list',
        meta: {
          title: '客户列表',
          isLogin: true,
          isMenu: true
        },
        component: lazy(() => import('@/views/accountList'))
      }
    ]
  },
  {
    path: '/login',
    meta: {
      title: '登录'
    },
    component: lazy(() => import('@/views/Login'))
  }
]
```
