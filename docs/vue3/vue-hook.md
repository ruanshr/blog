# Vue hook

### 什么是hooks？

hooks字面意思就是钩子函数，那么什么是钩子函数呢？

钩子函数：钩子函数是在一个时间触发的时候，在系统级捕获到了他，然后做一些操作。一段用以处理系统消息的程序。‘钩子’就是在某个阶段给你一个做某些处理的机会。直白的说法：类似回调函数。

钩子函数：
1、一个函数/方法，在系统消息触发时被系统调用，例如click等事件调用。
2、不是用户自己触发的，例如订阅者发布者模式的实现。

钩子函数的名称是确定的，当系统消息触发，自动会调用。
（1）例如Vue的watch() 函数，用户只需要编写watch()的函数体里面的函数，当页面元素法师变化的时候，系统就会先调用watch()。
（2）例如react的componentWillUpdate函数，用户只需要编写componentWillUpdate的函数体，当组件状态改变要更新时，系统就会调用componentWillUpdate。

常见的钩子函数：
react，vue的生命周期函数，react，vue的自定义质量等修改函数。

### hooks的简单实现

hooks你可以把他理解成一种匹配机制，就是我们在代码中设置一些钩子，然后程序执行时自动去匹配这些钩子，例如下面的例子，我定义了一个start函数，而 Function里面新增了before，after两个钩子，当我们执行startFun函数的时候，会制动先执行before，然后是start，在之后是after

```js
function start(){
    console.log('start 方法执行')
}

Function.prototype.before = function before(fn){
    const self = this
    return function(...args) {
        var ret = self.apply(this,args)
        fn.apply(this, args)
        return ret
    }
}

Function.prototype.after = function after(fn) {
    const self = this
    return function (...args) {
        var ret = self.apply(this, args)
        fn.apply(this, args)
        return ret
    }
} 

let startFn = start.before(()=> { console.log('before 方法执行')}).after(() => { console.log('after 方法执行')})

startFn()

```


在以前我们使用jquery的时候目标人我们需要对ajax的请求做拦截操作，需要在发送请求前我们需要修改header文件，或者我们需要额外的新增请求参数。这样我们使用到了ajax-hook这个插件来实现，ajax-hook的原理就是劫持实现一个XMLHtpRequest的代码对象，然后覆盖全局的XMLHttpRequest,这样-旦上层调用new XMLHttpRequest这样的代码时，其实创建的是ajax-hook的代理对象实例。具体原理与代码实践

```js

hookAjax({
    onreadystatechange: function(xhr) {

    },
    onload: function(xhr){

    },
    open: function(xhr){

    },
    send: function(args,xhr){

    }
})

```

这里面的onreadystatechange,onload,open,send就是所谓的钩子函数

复杂的hooks实现，可以去了解react，vue的声明周期函数，去查看相关的源码实现，其实现的理念或者实现的原理根上述的例子是一样的。


### Vue的声明周期钩子函数

vue的生命周期钩子函数：就是指在一个组件/实例从创建到销毁的过程自动执行的函数，主要为：创建，挂载，更新，销毁四个模块。

在组件、实例的整个声明周期中，钩子函数都是可被自动调用的，且生命周期函数的执行顺序与书写的顺序无关。

具体的描述看图就可以：


从中我们可以看出，vue的生命周期钩子函数，就是在vue的组件的某个阶段给你一个做某些处理的机会。

而这些钩子的实现，从一开始组件的渲染过程中，就已经制定了某些规则。而我们使用者只需要一在特定的钩子函数中去实现你要的逻辑即可。


### 什么是Vue hook？

主要原因是React hook的实现，导致了Vue hook的出现。

React hook就是一些React提供的内置函数，这些函数可以让Function Component和class Component一样能够拥有组件状态（state）以及进行副作用（side effect）。

那么对于目前Vue 3.x的实现中也引入了hook的概念，所以 Vue hook就是一些vue提供的内置函数，这些函数可以让Function Component 和 Class Component一样能够拥有组件状态（state）以及进行副作用（side effect）

### 常用hook介绍

useState、useEffect、useRef、useData、useMounted、useDestroyed、useWatch、useComputed、withHooks、hooks


#### useState

useState理解起来非常简单，和Class Component的Vuex中state一样，都是用来管理组件状态的。因为Function Component 每次执行的时候都会生成新的函数作用域所以同一个组件的不同渲染（render）之间是不能够共用状态的，因此开发者一旦需要在组件中引入状态就需要将原来的Function Component改成Class Component，这使得开发者的体验十分不好。useState就是用来解决这个问题的，他允许Function Component将自己的状态持久化到vue运行时(runtime)的某个地方（memory cell），这样在组件每次重新渲染的时候都可以从这个地方拿到该状态，而且当状态被更新的时候，组件也会重新渲染。

```js
//  源码
export function useState(initial) {
    ensureCurrentInstance()
    const id = ++callIndex
    const state = currrentInstance.$data._state
    const updater = newValue => {
        sate[id] = newValue
    }
    if(isMounting) {
        currentInstance.$set(state, id, initial)
    }
    return [state[id], updater]
}

```

使用方法如下：

```js

const [ count, setCount] = useState(0)

const [state, setState] = useState({
    status: 'pending',
    data: null,
    error: null
})

const handleTextChange = (value) => {
    setState({
        status: 'changed',
        data: value,
        error: null
    })
}

<div>{count}</div>
<... onClick=setCount(count + 1) ... >
<div>{state}</div>
onChange=handleTextChange(count)
```

useState接收一个initial变量作为状态的初始值，返回值是一个数组。返回数组的第一个元素代表当前state的最小值，第二个元素时一个用来更新state的函数，这里是要注意的是state和setState这两个变量的命名不是固定的，应该根据业务的时间情况选择不同的名字，可以是setA和setB，也可以是setC和setD这类的命名。需要注意的是setState这个是全量替代。

在实际开发中，一个组件可能不止一个state，如果组件有多个state，则可以在组件内部多次调用useState，这些使用类似Vuex里面的state使用。



#### useEffect

useEffect是用来使Function Component也可以进行副作用。那么什么是副作用？通俗的讲就是发生了变化所引起的一系列后面影响。而hook的实现主要还是需要挂靠在组件/实例中的，因此它主要就是实现创建，更新，销毁这三方面的信息反馈。

```js
//源码
export function useEffect(rawEffect, deps) {
    ensureCurrentInstance()
    const id = ++callIndex
    if(isMounting) {
        const cleanup = () => {
            const { current } = cleanup
        }
        if(current) {
            current()
            cleanup.current = null
        }
        
        effect.current = rawEffect

        currentInstance._effectStore[id] = {
            effect,
            cleanup,
            deps
        }

        currentInstance.$on('hook:mounted', effect)
        currentInstance.$on('hook:destoryed', cleanup)

        if(!deps || deps.length > 0) {
            currentInstance.$on('hook:updated', effect)
        }
    } else {
        const record = currentInstance._effectStore[id]
        const { effect, cleanup, deps: prevDeps = [] } = record
        record.deps = deps
        if(!deps || deps.some((d,i) => d !== prevDeps[i])) {
            cleanup()
            effect.current = rawEffect
        }
    }
}

```

从源码可以看出，，effect hooks其实就是在life-cycle hooks 的mounted和updated中执行的side effect function、一旦当前实例执行挂载和更新方法的时候，执行一次自己绑定effect方法。在一些不需要在updated的时候，也强制执行的场景，可以传入第二个deps，如果deps是个空数组，则不需要在updated的时候再次执行effect方法

```js
useEffect(rawEffect, deps)
```


useEffect的第一个参数rawEffect是要执行的副作用函数，它可以是任意的用户自定义函数，用户可以在这个函数里面操作一些流程器的API或者和外部环境进行交互，这个函数会在每次组件渲染完成之后被调用。

而我们从源码中可以看到，useEffect的实现涉及到组件的三个生命周期，mounted，updated，destoryed，副作用逻辑的执行细节由参赛deps控制

1、mounted时，固定地执行一次
2、如果deps未指定，为空，则每次updated后都执行一次
3、如果deps为空数组，则updated后不执行
4、如果deps指定了依赖项，则当相应的依赖项的值改变时，执行一次

通过参赛，我们可以为useEffect指定3种信息：

1、rawEffect - 副作用逻辑内容
2、清理逻辑 - 通过rawEfect的返回值定义
3、依赖 - 定义何时需要重复执行副作用逻辑

其中，清理逻辑，会在2种情况下执行：

1、rawEffect需要重复执行之前，清理上次运行所带来的副作用
2、组件销毁时

```js

useEffect(() => {
    window.addEventListener('resize' handleResize)
    return () => {
        window.removeEventListener('resize', handleResize)
    }

})

```

### useRef

useRef是用来在组件不同渲染之间共用一些数据的，它的作用和我们在Vue Class Compponent里面为$ref.XXX 赋值是一样的，那么它的一些特性就跟refs是类似：

1、组件更新之后，可以获得最新的状态，值
2、值不需要响应式处理
3、独立于其他作用域之外，不污染其他作用域
4、useRef 返回的是对象

```js

const [count , setCount ] = useState
const num = useRef(count)

const addCount = () => {
    let sum = count++ 
    setCount(sum)
    num.current = num
    console.log(count, num.current)
}

```

可以看出， num.current 永远是最新的值，而count获取到的是上一次render的值，这就是useRef的使用场景

### useData

useData 我们可以理解为Vue Class Function里面的$data,也可以认为与useState类似，不同的是，useData不提供更新器。只是作为数据变量的声明，修改调用

```js

export function useData(initial) {
    const id = ++callIndex
    const state = currentInstance.$data._state
    if(isMounting) {
        currentInstance.$set(state, id, initial)
    }
    return state[id]
}

```

源码中的currentInstance就是实例化的组件Vue class Function 里面调用$set 就是跟$data的某个对象赋值

使用方法如下：

```js

const data = useData({
    count: 0
})
console.log(data.count)

```

### useMounted

useMounted需要在 mounted 事件中执行的逻辑。

```
//源码
export function useMounted(fn) {
  useEffect(fn, [])
}

```

看源码 useEffect 的参数 deps 指定为空数组的话，fn 就不在 updated 后执行了 – 即仅在 mounted 时执行一次，与vue class Function 里面的mounted() 一样。

使用方法如下：
```js
useMounted(() => {
    console.log('mounted!')
})

```
### useDestroyed

useDestroyed需要在 destroyed 事件中执行的逻辑。
```js
//源码
export function useDestroyed(fn) {
  useEffect(() => fn, [])
}

```
看源码 useEffect 的参数 deps 指定为空数组的话，fn 就不在 updated 后执行了 – 即仅在 destroyed 时执行一次，与vue class Function 里面的destroyed()一样。

使用方法如下：
```js
useDestroyed(() => {
    console.log('destroyed!')
})
```

### useUpdated

useUpdated就是Vue class Function 组件更新后执行的操作逻辑
```js
//源码
export function useUpdated(fn, deps) {
  const isMount = useRef(true)
  useEffect(() => {
    if (isMount.current) {
      isMount.current = false
    } else {
      return fn()
    }
  }, deps)
  
  ```
其实现方式还是通过 useEffect 实现，通过 useRef 声明一个标志变量，避免 useEffect 的副作用逻辑在 mounted 中执行。数据方式变动的时候，都会实现这个钩子函数。

使用方法如下：
```js
useUpdated(() => {
    console.log('updated!')
})

```
### useWatch

useWatch 就是给组件添加 watch 方法，用于监听数据变化的改动逻辑
```js
export function useWatch(getter, cb, options) {
  ensureCurrentInstance()
  if (isMounting) {
    currentInstance.$watch(getter, cb, options)
  }
}

```
currentInstance就是实例化的组件 Vue class Function 直接通过组件实例的 $watch 方法实现。

使用方法如下：
```js
useWatch(() => data.count, (val, prevVal) => {
    console.log(`count is: ${val}`)
})
h('button', { on: { click: () => {
      data.count++
}}}, 'count++')
```

data.count 每次的变化，useWatch 这个钩子函数都会执行一次。

### useComputed

useComputed 就是给组件添加 computed 属性，用于动态获取数据
```js
export function useComputed(getter) {
  ensureCurrentInstance()
  const id = ++callIndex
  const store = currentInstance._computedStore
  if (isMounting) {
    store[id] = getter()
    currentInstance.$watch(getter, val => {
      store[id] = val
    }, { sync: true })
  }
  return store[id]
}

```

数据存储在了内部对象 _computedStore 中。而其本质上就是通过组件 Vue class Function 实例的 $watch 实现。

使用方法如下：
```js
const double = useComputed(() => data.count * 2)
h('button', { on: { click: () => {
      data.count++
}}}, 'count++')

```
data.count 每次的变动，double 会自动跟着变化。

### withHooks

withHooks就是一个Vue 版的函数式组件。
```js
export function withHooks(render) {
  return {
    data() {
      return {
        _state: {}
      }
    },
    created() {
      this._effectStore = {}
      this._refsStore = {}
      this._computedStore = {}
    },
    render(h) {
      callIndex = 0
      currentInstance = this
      isMounting = !this._vnode
      const ret = render(h, this.$attrs, this.$props)
      currentInstance = null
      return ret
    }
  }
}

```
h函数是createElement，生产一个VNode节点，即html DOM节点

createElement(也就是h)是vuejs里的一个函数。这个函数的作用就是生成一个 VNode节点，render 函数得到这个 VNode 节点之后，返回给 Vue.js 的 mount 函数，渲染成真实 DOM 节点，并挂载到根节点上。而withHooks 就是返回一个包装过的 Vue 实例配置，给组件 Vue class Function 提供了hooks+VNode的使用方法。关于详细的createElement的介绍，大家可以去查看相关文档或者看vue的源码 vue 源码解读

使用方法如下：
```js
const Foo = withHooks(h => {
  const data = useData({
    count: 0
  })

  const double = useComputed(() => data.count * 2)

  useWatch(() => data.count, (val, prevVal) => {
    console.log(`count is: ${val}`)
  })

  useMounted(() => {
    console.log('mounted!')
  })
  useUpdated(() => {
    console.log('updated!')
  })
  useDestroyed(() => {
    console.log('destroyed!')
  })

  return h('div', [
    h('div', `count is ${data.count}`),
    h('div', `double count is ${double}`),
    h('button', { on: { click: () => {
      // still got that direct mutation!
      data.count++
    }}}, 'count++')
  ])
})

```

所有vue hook 里面的钩子函数在withHooks里面都可以使用，withHooks的这种方式，可以独立于组件之外的且包含了一系列类似组件的功能都可以使用。这样的好处就是可以相对独立又互相不影响。跨组件代码就可以去去复用，嵌套层级少，易维护，且代码颗粒度小，逻辑清晰等。
注：withHooks 如果我们在实际开发中，不需要再页面上渲染元素，比如我们根据每个接口或者条件，来给页面弹出Toast 或则MessageBox 等无需页面挂载的组件。那么withHooks 就不需要有 return ,只需要写业务逻辑即可。
值得注意的是，使用了vue hook 的时候，vue的写法需要改变：

```js
//vue 通用写法
new Vue({
  el: 'app',
  render: h => h(App) //App为页面组件
})
//vue hook 引用写法
new Vue({
  el: "#app",
  render: h => {
    return h("div", [h(Foo), h(App)]) //
  }
})

```
App为页面组件， Foo 就是 withHooks 的函数库组件 div 就是我们这些组件挂载的父类元素 h 里面的参数遵循
Vue里createElement 参数。具体详细的说明，请查看Vue源码解析(4)-createElement

### hooks

hooks 这个方法的出现，功能与原理就是Vue mixin ，在组件中引用的方式上稍微不一样了点，其他的与Vue mixin 一模一样。看源码就很清楚了
```js
export function hooks (Vue) {
  Vue.mixin({
    beforeCreate() {
      const { hooks, data } = this.$options
      if (hooks) {
        this._effectStore = {}
        this._refsStore = {}
        this._computedStore = {}
        this.$options.data = function () {
          const ret = data ? data.call(this) : {}
          ret._state = {}
          return ret
        }
      }
    },
    beforeMount() {
      const { hooks, render } = this.$options
      if (hooks && render) {
        this.$options.render = function(h) {
          callIndex = 0
          currentInstance = this
          isMounting = !this._vnode
          const hookProps = hooks(this.$props)
          Object.assign(this._self, hookProps)
          const ret = render.call(this, h)
          currentInstance = null
          return ret
        }
      }
    }
  })
}

```

从源码我们知晓hooks 返回的就是实例化的组件，所以在使用之前我们需要Vue.use(hooks)，这样才可以直接在Vue class Function中使用。而hooks返回的属性对象，自动合并进组件的自身实例中，这样数据就可以在当前组件模板上直接使用了。

使用方法如下：
```JS
import { hooks, useData, useComputed } from 'vue-hooks'
Vue.use(hooks)
new Vue({
  template: `
    <div @click="data.count++">
      {{ data.count }} {{ double }}
    </div>
  `,
  hooks() {
    const data = useData({
      count: 0
    })
    const double = useComputed(() => data.count * 2)
    return {
      data,
      double
    }
  }
})

```

hooks 方法的使用，给我们在使用mixin的选择上，新增了另外一种有别与mixin的缺点的方式，这种新方式的出现，能解决mixin带来的诸多问题，同时也能够可以对组件开发更加抽象化，也可以是的一些公共的方法或者一些在业务场景中共同的业务逻辑抽离出来，可以做到高复用的，易维护。
但是也有一些不足与缺点。比如useEffect这个方式使用的依赖性与特殊性。稍微不熟悉整体链路的，往往会导致一些问题出现。比如引起render的死循环等。
Vue hooks 的出来，这种函数式的组件，给了我们新的视野，就像我们使用 vue-property-decorator 结合Ts对 Vue class Function 来实践一样。也是对于编码方面新的尝试。类似 Java 
