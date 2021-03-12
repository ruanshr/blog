# shims-vue.d.ts

shims-vue.d.ts 是为了 typescript 做的适配定义文件，因为.vue 文件不是一个常规的文件类型，ts 是不能理解 vue 文件是干嘛的，
加这一段是是告诉 ts，vue 文件是这种类型的。
这一段删除，会发现 import 的所有 vue 类型的文件都会报错。

```js
/**
 * shims-vue.d.ts的作用
 * 为了 typescript 做的适配定义文件，因为.vue 文件不是一个常规的文件类型，ts 是不能理解 vue 文件是干嘛的，
 * 加这一段是是告诉 ts，vue 文件是这种类型的。
 * 可以把这一段删除，会发现 import 的所有 vue 类型的文件都会报错。
 */
declare module '*.vue' { //declare声明宣告， 声明一个ambient module(即:没有内部实现的 module声明)
  import Vue from 'vue'
  export default Vue
}

declare module 'vue-echarts'  // 引入vue-echarts

```
