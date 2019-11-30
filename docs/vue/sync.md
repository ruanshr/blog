# 深入理解 vue 修饰符 sync【 双向数据绑定 】

在说 vue 修饰符 sync 前，我们先看下官方文档 官网介绍[.sync 修饰符](https://cn.vuejs.org/v2/guide/components-custom-events.html#sync)

文档说 vue .sync 修饰符以前存在于 vue1.0 版本里，但是在 2.0 中移除了 .sync 。但是在 2.0 发布之后的实际应用中，我们发现 .sync 还是有其适用之处，比如在开发可复用的组件库时。我们需要做的只是让子组件改变父组件状态的代码更容易被区分。从 2.3.0 起我们重新引入了 .sync 修饰符，但是这次它只是作为一个编译时的语法糖存在。它会被扩展为一个自动更新父组件属性的 v-on 监听器。

例如

```html
<comp :show.sync="true"></comp>
```

会被扩展为

```html
<comp :show="true" @update:show="val => show = val"></comp>
```

当子组件需要更新 show 的值时，它需要显式地触发一个更新事件：

```js
this.$emit('update:show', newVal)
```