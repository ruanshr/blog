# VueCLI3.0 之 scoped 与深度选择器 deep

在开发的过程中经常遇到过 css 属性污染全局样式问题。

解决这个问题，需要了解 style 标签的 scoped 属性和 deep 深度作用选择器

vue 提出了页面的模块化和模板组件化的思想。也就是把界面进行模块化划分，每一部分都可以作为一个独立的模块，然后拼成一个完整的界面。

经常使用的模块可以进行封装，作为通用的组件，很方便。

那么 scoped 属性到底是个什么东西呢？

## scoped 属性起源

在模块化编程下，为了模块之间样式不互相污染所以 vue 中引入了 scoped 的概念。

在 vue 的组件中，style 标签使用 scoped 标签后，定义的样式仅作用在当前组件内部，从而避免了污染其他组件。这样从某种意义上就体现了模块化的思想。

那么 vue 是怎么实现 style 标签的 scoped 化的呢？

## scoped 的原理

Vue 中实现 style 标签的 scoped 化，是通过标签的私有化来实现的。

Vue 通过在 DOM 节点上以及相应 css 样式上添加不重复的唯一标识 data-v-hash 的方式，来保证 DOM 节点和 css 样式的唯一性，从而实现模块的私有化。

Vue 的 css 样式是通过 PostCSS 进行转译实现的。Scoped 渲染遵循以下规则：

- 1. 将 DOM 节点添加唯一标识 data 属性，例如 data-v-d5989cea，来保持唯一性
- 2. 将转译后的 css 样式，每一条属性结尾添加 data 标识（[data-v-d5989cea]），从而保证和 DOM 节点进行匹配并且私有化样式。
- 3. 若组件内部引用其他组件，则仅给组件的最外层添加 data 标识

e.g.

```html
<template>
  <div class="container">
    <div class="content"></div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    background-color: #ccc;
    padding: 100px;
    .content {
      background-color: rgb(149, 102, 211);
      height: 100px;
    }
  }
</style>
```

编译后的样式

```html
<div class="container" data-v-d5989cea>
  <div class="content" data-v-d5989cea></div>
</div>

<style>
  .container[data-v-d5989cea] {
    background-color: #ccc;
    padding: 100px;
  }
  .container .content[data-v-d5989cea] {
    background-color: #9566d3;
    height: 100px;
  }
</style>
```

## 穿透 scoped 样式

实际项目中经常会组件中引用其他通用组件，那么在父组件中直接修改子组件的样式是不能实现子组件样式变化的，而又不想去掉 scoped 属性。

那怎么办呢？

所以深度作用选择器 deep 就派上用场了，可以在父组件内使用/deep/来穿透 scoped 样式，从而控制子组件样式。

```html
<template>
  <div class="container">
    <div class="content">
      <x-icon type="ios-arrow-right" size="20"></x-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    background-color: #ccc;
    padding: 100px;
    .content {
      background-color: rgb(149, 102, 211);
      height: 100px;
      /deep/ .vux-x-icon-ios-arrow-right {
        background-color: #000;
      }
    }
  }
</style>
```

```html
<style>
  .container[data-v-d5989cea] {
    background-color: #ccc;
    padding: 100px;
  }
  .container .content[data-v-d5989cea] {
    background-color: #9566d3;
    height: 100px;
  }
  /**     样式中多了这个        **/
  .container[data-v-d5989cea] .vux-x-icon-ios-arrow-right {
    background-color: #000;
  }
</style>
```

在使用第三方组件库时也会经常遇到另外一个问题，即第三方组件库进行渲染的时候仅最外层加上了 data 值，其内部的标签没有 data 值，那么如果要修改组件内部的样式，使用 deep 深度选择器也不起作用了。

那怎么办呢？

想到了最简单的方法，就是使用 css 样式覆盖，组件内建立一个不添加 scoped 属性的 style 标签（一个 vue 文件是可以有多个 style 标签的）。这样就可以直接进行控制样式了。

但是这样又会产生一个新的问题，如果在其他模块内也使用了此组件，组件的样式就受到了之前模块的影响了。

为了解决这个问题，需要在模块内覆盖样式的时候，在样式的前面加上一个组件外层 div 的唯一 id 就可以了。
