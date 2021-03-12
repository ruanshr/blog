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