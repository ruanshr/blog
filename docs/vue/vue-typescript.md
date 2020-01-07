# 在 Vue 项目使用 TypeScript，需要做什么

总所周知，Vue 新版本 3.0 使用 TypeScript 开发，让本来就很火的 TypeScript 受到更多人的关注。虽然 TypeScript 在近几年才火，但其实它诞生于 2012 年 10 月，正式版本发布于 2013 年 6 月，是由微软编写的自由和开源的编程语言。TypeScript 是 JavaScript 的一个超集，扩展了 JavaScript 的语法，添加了可选的静态类型和基于类的面向对象编程。

JavaScript 开发中经常遇到的错误就是变量或属性不存在，然而这些都是低级错误，而静态类型检查恰好可以弥补这个缺点。什么是静态类型？举个栗子：

```js
//javascript
let str = 'hello'
str = 100 //ok

//typescript
let str: string = 'hello'
str = 100 //error: Type '100' is not assignable to type 'string'.
```

可以看到 TypeScript 在声明变量时需要为变量添加类型，如果变量值和类型不一致则会抛出警告。静态类型只在编译时进行检查，而且最终编译出来的代码依然是 JavaScript。即使我们为 string 类型的变量赋值为其他类型，代码也是可以正常运行的。

其次，TypeScript 增加了代码的可读性和可维护性，类型定义实际上就是一个很好的文档，比如在使用函数时，只需要看看参数和返回值的类型定义，就大概知道这个函数如何工作。

# npm

安装 typescript

```
npm install typescript @vue/cli-plugin-typescript -D
```

新增文件
在项目的根目录下创建 shims-vue.d.ts、shims-tsx.d.ts、tsconfig.json

```ts
// shims-vue.d.ts
import Vue from 'vue'

declare module '*.vue' {
  export default Vue
}
```

```ts
// shims-tsx.d.ts
import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    type Element = VNode
    type ElementClass = Vue
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "sourceMap": true,
    "noImplicitThis": false,
    "baseUrl": ".",
    "types": ["webpack-env"],
    "paths": {
      "@/*": ["src/*"]
    },
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "tests/**/*.ts", "tests/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## ESLint 配置

为什么使用 ESLint 而不是 TSLint？
今年 1 月份，TypeScript 官方发布博客推荐使用 ESLint 来代替 TSLint。而 ESLint 团队将不再维护 typescript-eslint-parser，也不会在 Npm 上发布，任何使用 tyescript-eslint-parser 的用户应该改用 @tyescript-eslint/parser。

官方的解释：

我们注意到 TSLint 规则的操作方式存在一些影响性能的体系结构问题,ESLint 已经拥有了我们希望从 linter 中得到的更高性能的体系结构。此外，不同的用户社区通常有针对 ESLint 而不是 TSLint 构建的 lint 规则(例如 React hook 或 Vue 的规则)。鉴于此，我们的编辑团队将专注于利用 ESLint，而不是复制工作。对于 ESLint 目前没有覆盖的场景(例如语义 linting 或程序范围的 linting)，我们将致力于将 ESLint 的 TypeScript 支持与 TSLint 等同起来。

原文

如何使用
AlloyTeam 提供了一套全面的 EsLint 配置规范，适用于 React/Vue/Typescript 项目，并且可以在此基础上自定义规则。
GitHub

安装
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy
配置项的说明查看 AlloyTeam ESLint 规则

配置
在项目的根目录中创建.eslintrc.js，然后将以下内容复制到其中:

```js
module.exports = {
  extends: ['alloy', 'alloy/typescript'],
  env: {
    browser: true,
    node: true
  },
  rules: {
    // 自定义规则
    'spaced-comment': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'grouped-accessor-pairs': 'off',
    'no-constructor-return': 'off',
    'no-dupe-else-if': 'off',
    'no-import-assign': 'off',
    'no-setter-return': 'off',
    'prefer-regex-literals': 'off'
  }
}
```

补充
如果想知道配置项更多使用，可以到 ESLint 官网搜索配置项。

如果使用的是 VScode，推荐使用 ESLint 插件辅助开发。

文件改造
入口文件

```js
main.js 改为 main.ts
vue.config.js 修改入口文件
const path = require('path')
module.exports = {
...
pages: {
index: {
entry: path.resolve(\_\_dirname+'/src/main.ts')
},
},
...
}

```

## vue 组件文件

随着 TypeScript 和 ES6 里引入了类，在一些场景下我们需要额外的特性来支持标注或修改类及其成员。 装饰器（Decorators）为我们在类的声明及成员上通过元编程语法添加标注提供了一种方式。

Vue 也为我们提供了类风格组件的 TypeScript 装饰器，使用装饰器前需要在 tsconfig.json 将 experimentalDecorators 设置为 true。

## 安装 vue 装饰器

vue-property-decorator 库完全依赖 vue-class-component，在安装时要一起装上

```js
npm install vue-class-component vue-property-decorator -D
```

## 改造.vue

只需要修改 srcipt 内的东西即可，其他不需要改动

```ts
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import draggable from 'vuedraggable'

@Component({
  created(){

  },
  components:{
    draggable
  }
})
export default class MyComponent extends Vue {
  /* data */
  private ButtonGrounp:Array<any> = ['edit', 'del']
  public dialogFormVisible:boolean = false

  /*method*/
  setDialogFormVisible(){
    this.dialogFormVisible = false
  }
  addButton(btn:string){
    this.ButtonGrounp.push(btn)
  }

  /*compute*/
  get routeType(){
    return this.$route.params.type
  }
}
</script>
```

类成员修饰符，不添加修饰符则默认为 public

public：公有，可以自由访问类的成员
protected：保护，类及其继承的子类可访问
private：私有，只有类可以访问
Prop
!: 为属性使用明确的赋值断言修饰符，了解更多看文档

```js
import { Component, Vue, Prop } from "vue-property-decorator";
export default class MyComponent extends Vue {
...
@Prop({type: Number,default: 0}) readonly id!: number
...
}
```

等同于

```js
export default {
...
props:{
id:{
type: Number,
default: 0
}
}
...
}
```

Watch

```js
import { Component, Vue, Watch } from "vue-property-decorator";
export default class MyComponent extends Vue {
...
@Watch('dialogFormVisible')
dialogFormVisibleChange(newVal:boolean){
// 一些操作
}
...
}
```

等同于

```js
export default {
...
watch:{
dialogFormVisible(){
// 一些操作
}
}
...
}
```

Provide/Inject

```js
// App.vue
import {Component, Vue, Provide} from 'vue-property-decorator'
@Component
export default class App extends Vue {
@Provide() app = this
}

// MyComponent.vue
import {Component, Vue, Inject} from 'vue-property-decorator'
@Component
export default class MyComponent extends Vue {
@Inject() readonly app!: Vue
}
```

等同于

```js
// App.vue
export default {
  provide() {
    return {
      app: this
    }
  }
}

// MyComponent.vue
export default {
  inject: ['app']
}
```

更多装饰器使用，参考 vue-property-decorator 文档

全局声明
_.d.ts 文件
目前主流的库文件都是 JavaScript 编写，TypeScript 身为 JavaScript 的超集，为支持这些库的类型定义，提供了类型定义文件（_.d.ts），开发者编写类型定义文件发布到 npm 上，当使用者需要在 TypeScript 项目中使用该库时，可以另外下载这个包，让 JS 库能够在 TypeScript 项目中运行。

比如：md5 相信很多人都使用过，这个库可以将字符串转为一串哈希值，这种转化不可逆，常用于敏感信息进行哈希再发送到后端进行验证，保证数据安全性。如果我们想要在 TypeScript 项目中使用，还需要另外下载 @tyeps/md5，在该文件夹的 index.d.ts 中可以看到为 md5 定义的类型。

```js
/// <reference types="node" />

declare function md5(message: string | Buffer | Array<number>): string;

declare namespace md5 {}

export = md5;
```

TypeScript 是如何识别 \*.d.ts
TypeScript 在项目编译时会全局自动识别.d.ts 文件，我们需要做的就是编写.d.ts，然后 TypeScript 会将这些编写的类型定义注入到全局提供使用。

为 vue 实例添加属性/方法
当我们在使用 this.$route或一些原型上的方法时，typescript无法进行推断，在编译时会报属性$route 不存在的错误，需要为这些全局的属性或方法添加全局声明

对 shims-vue.d.ts 做修改，当然你也可以选择自定义\*.d.ts 来添加声明

```js
import Vue from 'vue';
import VueRouter, { Route } from 'vue-router'

declare module '\*.vue' {
export default Vue;
}

declare module 'vue/types/vue' {
interface Vue {
$api: any;
    $bus: any;
$router: VueRouter;
    $route: Route;
}
}
```

自定义类型定义文件
当一些类型或接口等需要频繁使用时，我们可以为项目编写全局类型定义，
根路径下创建@types 文件夹，里面存放\*.d.ts 文件，专门用于管理项目中的类型定义文件。

这里我定义个 global.d.ts 文件：

```js
//declare 可以创建 \*.d.ts 文件中的变量，declare 只能作用域最外层
//变量
declare var num: number

//类型
type StrOrNum = string | number

//函数
declare function handler(str: string): void

// 类
declare class User {}

//接口
interface OBJ {
  [propName: string]: any;
  [propName: number]: any;
}

interface RES extends OBJ {
  resultCode: number;
  data: any;
  msg?: string;
}
```

解放双手，transvue2ts 转换工具
改造过程最麻烦的就是语法转换，内容都是一些固定的写法，这些重复且枯燥的工作可以交给机器去做。这里我们可以借助 transvue2ts 工具提高效率，transvue2ts 会帮我们把 data、prop、watch 等语法转换为装饰器语法。

安装

```js
npm i transvue2ts -g
```

使用
安装完之后，transvue2ts 库的路径会写到系统的 path 中，直接打开命令行工具即可使用，命令的第二个参数是文件的完整路径。
执行命令后会在同级目录生成转换好的新文件，例如处理 view 文件夹下的 index.vue，转换后会生成 indexTS.vue。

处理单文件组件

transvue2ts D:\typescript-vue-admin-demo\src\pages\index.vue
=>
输出路径：D:\typescript-vue-admin-demo\src\pages\indexTS.vue
处理文件夹下的所有 vue 组件文件

transvue2ts D:\typescript-vue-admin-demo\src\pages
=>
输出路径：D:\typescript-vue-admin-demo\src\pagesTS
补充
不要以为有工具真就完全解放双手，工具只是帮我们转换部分语法。工具未能处理的语法和参数的类型定义，还是需要我们去修改的。要注意的是转换后注释会被过滤掉。

该工具作者在掘金对工具的介绍和实现思路

关于第三方库使用
一些三方库会在安装时，包含有类型定义文件，使用时无需自己去定义，可以直接使用官方提供的类型定义。

node_modules 中找到对应的包文件夹，类型文件一般都会存放在 types 文件夹内，其实类型定义文件就像文档一样，这些内容能够清晰的看到所需参数和参数类型。

这里列出一些在 Vue 中使用三方库的例子：

element-ui 组件参数
使用类型定义

```js
import { Component, Vue } from "vue-property-decorator";
import { ElLoadingComponent, LoadingServiceOptions } from 'element-ui/types/loading'

let loadingMark:ElLoadingComponent;
let loadingConfig:LoadingServiceOptions = {
lock: true,
text: "加载中",
spinner: "el-icon-loading",
background: "rgba(255, 255, 255, 0.7)"
};

@Component
export default class MyComponent extends Vue {
...
getList() {
loadingMark = this.$loading(loadingConfig);
    this.$api.getList()
.then((res:RES) => {
loadingMark.close();
});
}
...
}
```

element-ui/types/loading，原文件里还有很多注释，对每个属性都做出描述

```js
export interface LoadingServiceOptions {
target?: HTMLElement | string
body?: boolean
fullscreen?: boolean
lock?: boolean
text?: string
spinner?: string
background?: string
customClass?: string
}
export declare class ElLoadingComponent extends Vue {
close (): void
}
declare module 'vue/types/vue' {
interface Vue {
\$loading (options: LoadingServiceOptions): ElLoadingComponent
}
}
```

vue-router 钩子函数
使用类型定义

```js
import { Component, Vue } from 'vue-property-decorator'
import { NavigationGuard } from 'vue-router'

@Component
export default class MyComponent extends Vue {
  beforeRouteUpdate: NavigationGuard = function(to, from, next) {
    next()
  }
}
```

在 vue-router/types/router.d.ts 中，开头就可以看到钩子函数的类型定义。

```js
export type NavigationGuard<V extends Vue = Vue> = (
to: Route,
from: Route,
next: (to?: RawLocation | false | ((vm: V) => any) | void) => void
) => any
```

还有前面所使用到的 Router、Route，所有的方法、属性、参数等都在这里被描述得清清楚楚

```js
export declare class VueRouter {
constructor (options?: RouterOptions);

app: Vue;
mode: RouterMode;
currentRoute: Route;

beforeEach (guard: NavigationGuard): Function;
beforeResolve (guard: NavigationGuard): Function;
afterEach (hook: (to: Route, from: Route) => any): Function;
push (location: RawLocation, onComplete?: Function, onAbort?: ErrorHandler): void;
replace (location: RawLocation, onComplete?: Function, onAbort?: ErrorHandler): void;
go (n: number): void;
back (): void;
forward (): void;
getMatchedComponents (to?: RawLocation | Route): Component[];
onReady (cb: Function, errorCb?: ErrorHandler): void;
onError (cb: ErrorHandler): void;
addRoutes (routes: RouteConfig[]): void;
resolve (to: RawLocation, current?: Route, append?: boolean): {
location: Location;
route: Route;
href: string;
normalizedTo: Location;
resolved: Route;
};

static install: PluginFunction<never>;
}
export interface Route {
path: string;
name?: string;
hash: string;
query: Dictionary<string | (string | null)[]>;
params: Dictionary<string>;
fullPath: string;
matched: RouteRecord[];
redirectedFrom?: string;
meta?: any;
}
```

自定义三方库声明
当使用的三方库未带有 \*.d.ts 声明文件时，在项目编译时会报这样的错误：

```js
Could not find a declaration file for module 'vuedraggable'. 'D:/typescript-vue-admin-demo/node_modules/vuedraggable/dist/vuedraggable.umd.min.js' implicitly has an 'any' type.
Try `npm install @types/vuedraggable` if it exists or add a new declaration (.d.ts) file containing `declare module 'vuedraggable';`

```

大致意思为 vuedraggable 找不到声明文件，可以尝试安装 @types/vuedraggable(如果存在)，或者自定义新的声明文件。

安装 @types/vuedraggable
按照提示先选择第一种方式，安装 @types/vuedraggable，然后发现错误 404 not found，说明这个包不存在。感觉这个组件还挺多人用的（周下载量 18w），没想到社区居然没有声明文件。

自定义声明文件
无奈只能选择第二种方式，说实话自己也摸索了有点时间（主要对这方面没做多了解，不太熟悉）

首先在 node_modules/@types 下创建 vuedraggable 文件夹，如果没有 @types 文件夹可自行创建。vuedraggable 文件夹下创建 index.d.ts。编写以下内容：

```js
import Vue from 'vue'
declare class Vuedraggable extends Vue{}
export = Vuedraggable
```

重新编译后没有报错，解决问题。

建议及注意事项
改造过程
在接入 TypeScript 时，不必一次性将所有文件都改为 ts 语法，原有的语法也是可以正常运行的，最好就是单个修改
初次改造时出现一大串的错误是正常的，基本上都是类型错误，按照错误提示去翻译进行修改对应错误
在导入 ts 文件时，不需要加 .ts 后缀
为项目定义全局变量后无法正常使用，重新跑一遍服务器（我就碰到过...）
遇到问题
面向搜索引擎，前提是知道问题出在哪里
多看仔细文档，大多数一些错误都是比较基础的，文档可以解决问题
Github 找 TypeScript 相关项目，看看别人是如何写的
写在最后
抽着空闲时间入门一波 TypeScript，尝试把一个后台管理系统接入 TypeScript，毕竟只有实战才能知道有哪些不足，以上记录都是在 Vue 中如何使用 TypeScript，以及遇到的问题。目前工作中还未正式使用到 TypeScript，学习新技术需要成本和时间，大多数是一些中大型的公司在推崇。总而言之，多学点总是好事，学习都要多看多练，知道得越多思维就会更开阔，解决问题的思路也就越多。
