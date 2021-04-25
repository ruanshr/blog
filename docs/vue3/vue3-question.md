# Vue3面试题

### vue3.0性能提升主要是通过哪几方面体现的。

1、响应式系统提升

vue2在初始化的时候，对data中的每个属性使用defineProperty调用getter和setter使之变为响应式对象。如果属性值为对象，还会递归调用defineProperty使之变为响应式对象。

vue3使用proxy对象重写响应式。proxy的性能本来比defineProperty好，proxy可以拦截属性的方法、赋值、删除等操作，不需要初始化的时候遍历所有属性、另外有多层属性嵌套的话，只有访问某个属性的时候，才会递归处理下一级的属性。

**优势**

- 可以监听动态新增的属性。
- 可以监听删除的属性
- 可以监听数组的索引和length属性

2、编译优化

优化编译和重写虚拟dom，让首次渲染和更新dom性能有更大的提升。vue2通过标记静态根节点，优化diff算法。 vue3标记和提升所有静态根节点，diff的时候知笔记动态节点内容

**静态提升**

patch flag，跳过静态节点，直接对比动态节点，缓存事件处理函数

3、源码体积的优化

vue3移除了一些不常用的api，例如：inline-template, filter等，使用tree-shaking

### Composition Api与Vue 2.x使用的Options Api有什么区别？

**Options Api**

包含一个描述组件选项（data、methods、props等）的对象options

API开发复杂组件，同一个功能逻辑的代码被拆分到不同选项

使用mixin重用公用代码，也有问题，命名冲突，数据来源不清晰

**composition Api**

vue3新增的一组api，它是基于函数的API，可以更灵活地组织组件的逻辑

解决options api在大型项目中options api不好拆分和重用问题

### Proxy 相对于Object.definePropert有哪些优点

proxy的性能本来比defineProperty好，proxy可以拦截属性的访问，赋值，删除等操作，不需要初始化的时候遍历所有属性，另外有多层属性嵌套的话，只有访问某个属性的时候，才会递归处理下一级的属性

- 可以监听数组变化
- 可以劫持整个对象
- 操作时不是对原对象操作，是new Proxy 返回的一个新对象
- 可以劫持的操作有13种



