# Vue3做了哪些优化

### 设计目标

问题:
随着功能的增长，复杂组件的代码变得越来越难维护

缺少一种比较干净的在多个组件之间提取和复用逻辑的机制

类型推断不够友好

bundle的时间太久了

**Vue3经过长达两三年时间的筹备，做了哪些事情**

- 更小

- 更快

- Typescript支持

- API设计一致性

- 提高自身可维护性

- 开发更多底层功能


### 更小

Vue3 移除一些不常用的API

引入tree-shaking,可以将无用模块“剪辑”，仅打包需要的，使打包的整体体积变小

### 更快

主要体现在编译方面

- diff算法优化

- 静态提升

- 事件监听缓存

- SSR优化

### 更友好

Vue3 兼顾Vue2的options API的同时还推出 component API，大大增加了代码逻辑组织和代码复用能力

```js
// 一个火球鼠标位置的函数

import { toRefs， reactive } from 'vue'
function useMouse() {
    const state = reactive({x: 0, y: 0})
    const update = e => {
        state.x = e.pageX
        state.y = e.pageY
    }
    onMounted(() => {
        window.addEventListener('mousemove', update)
    })
    
    onUnMounted(() => {
        window.removeEventListener('mouseove', update)
    })

    return toRefs(state)
}

```

我们只需要调用这个函数，即可获得x、y的坐标，完全不用关注实现过程

试想一下，如果很多类似的第三方库，我们只需要调用即可，不必关注实现过程，开发效率大大提高

同时,Vue3是基于Typescript编写的，可以享受到自动的类型定义提示


### 优化方案

Vue3 从很多层面都做了优化，可以分成三个方面

- 源码

- 性能

- 语法API


#### 源码

源码可以从两个层面展开

1）源码管理

2）Typescript

- 源码管理

Vue3整个源码是通过monorepo的方式维护的，根据功能将不同的模块拆分到package目录下面不同的子目录中




这样使得模块拆分更细化，职责划分更明确，模块之间的依赖关系也根据明确，开发人员也更容易阅读、理解和更高所有模块源码，提高代码的可维护性

另外一些package（比如 reactivity 响应式库） 是可以独立于Vue使用的，这样如果用户只想使用Vue3的响应式能力，可以单独依赖这个响应式库而不用依赖整个Vue

- Typescript

Vue3是基于typescript 编写的，提供了更好的类型检查，能支持复杂的类型推导


#### 性能

Vue3是从什么哪些方面对性能进行进一步优化的？

- 体积优化

- 编译优化

- 数据劫持优化

这里讲述数据劫持

在Vue2中，数据劫持是通过Object.defineProperty,这个API有一些缺点，并不能检查对象属性的添加和删除

```js

Object.defineProperty(data, 'a', {
    get() {
        // track
    },
    set() {
        // trigger
    }
})

```

尽管Vue 为了解决这个问题提供了set 和 delete实例方法，但对于用户来说，还是增加了一定的负担。同时在面对嵌套层级比较深的情况下，就存在性能问题


相比较下，vue3是通过proxy监听整个对象，那么对于删除还是新增当然也能监听到。同时Proxy并不能监听到内部深层次的对象的变化，而Vue3的处理方式是在getter中去递归响应式，这样的好处是真正访问到的内部对象才会变成响应式，而不是无脑递归

#### 语法API

这里当然说的就是composition API，其中两大显著的优化：

- 优化逻辑组织

- 优化逻辑复用


##### 逻辑组织

一张图，我们可以很直观地感受到Composition API 在逻辑组织方面的优势


相同功能的代码在编写在一块，而不是像options API 那样，各个功能的代码混成一块


##### 逻辑复用

在vue2中，我们是通过mixin实现功能混合，如果多个mixin混合，会存在两个非常明显的问题，命名冲突和数据来源不清晰

而通过Composition这种形式，可以将一些复用的代码抽离出作为一个函数，只要的使用方法直接进行调用即可。

同样是上午获取的鼠标位置的例子

```js
import { useMousePosition } from './hooks/mouse'

export default {
    setup() {
        const { x, y } = useMousePosition()
        return { x, y}
    }
}
```

可以看到，整个数据来源清晰了，技术去编写更多的hook函数，也不会出现命名冲突的问题