# Typescript 知识

最近在新环境的日常工作中也需要用到 TypeScript，学习过程中遇到一些疑惑，做了记录

- ts 类型中的?，&lt;&gt;意思是什么？

- 什么是 duck typing？

- constructor 之前的变量定义是什么？

- declare 是什么？

- ts 中 unknown, void, null 和 undefined，never 区别是什么？

- ts 中的泛型约束是什么？

- 数组类型的两种定义方式

- ts 中的类型断言

- 泛型函数与泛型接口

- 如何理解 as const？

- declare global 是什么意思？

- 如何在 TypeScript 环境增加一个全局变量?

- interface 可以继承吗？

- typescript 中的&是什么意思?

- interface 与 type 的区别是什么？

- enum 作为一种类型是什么意思？

- 项目中 xxx.d.ts 的 declare module '\*.scss'是什么意思？declare module 还可以做什么？

- typescript 如何约束 Promise 的类型？

- typescript 中的 keyof 如何使用？

- typescript 中的 typeof 如何使用？

- typescript 中的 non-null operator 是什么？

# ts 类型中的？是什么

```js

before: ?Function;
options?: ?Object;

```

这个是 ts 的 interface 中的一个概念。ts 的 interface 就是“duck typing” 或者“structural subtyping”。类型检查注意关注 this shape that values have

ts 中的?是什么意思呢。Optional Properties

- 并不是 interface 中的所有属性都是 requried 的，一些存在特定条件下，一些根本不存在。

- Optional Properties 适用于"option bags"的设计模式，这种设计模式意思是：我们传递一个对象到函数，这个函数只有几个属性，没有其他更多的属性

- Optional Property 的好处在于，清晰地看清楚有哪些属性，防止传入不属于该 interface 的属性。

- 什么是?和 Optional Properties 呢？interface 的某些非 required 属性名的末尾，添加?这是一个 optional property，其实就是字面意思，条件属性。

Optional Property 只是属性名，也就是 options?: ?Object,中 options 后的问号，那属性值类型前的问号是什么意思，也就是?Object，是什么意思？ 此处的问号代表属性值类型是否可以是 null 类型，但是只有 strictNullChecks 为 on 时，值类型才能为 null。

```js
/**
 * @type {?number}
 * strictNullChecks: true -- number | null
 * strictNullChecks: off -- number
 * */
var nullable
```

例子中，options?:?Object 的意思是 options 的值类型可以是 Object，null（仅在 strictNullChecks 为 true 时允许）。

### ts 类型中的&lt;&gt;什么意思？

```js
deps: Array<Dep>a
newDeps: Array<Dep>
```

ts 中的数组类型与 java 中的定义类似:

```js
let list: number[] = [1, 2, 3]
let list: Array<number> = [1, 2, 3]
```

### 什么是 duck typing?

duck test。如果"走路像鸭子，叫声像鸭子，那么这就是鸭子"。 在 computer programming，用于'判断对象是否可以按照预期的目的使用'。 通常的 typing 中，适用性取决于对象的 type。duck typing 不一样，对象的适用性取决于指定 method 或 property 的存在与否，而不是取决于对象自身的类型

### declare 是什么？

声明这是一个 definition。

declare 是 ts 中用于写定义文件的关键字。
declare 可以定义全局变量，全局函数，全局命名空间，class 等等。
declare 可以按照下面这样去使用：

### ts 中 any，unknown, void, null 和 undefined，never 区别是什么？

- null，undefined 就是 js 中的意思。null 类型的只能是 null 值；undefined 类型的只能是 undefined 值

- any: 任意类型，谨慎使用，避免使 typescript 变成 anyscript 它不会检测其属性及属性的属性

- unknown: 它是任何类型的子类

- void: 通常用于返回值的函数

- never：never occur 从来不会发生的类型，例如永远不会有结果的，抛出异常或者死循环。

```js

let foo: null = null

let bar: undefined = undefined

let $foo = document.querySelector('#foo') as unknow as HTMLDivElement;

```

### ts 中的泛型约束是什么？

**基于 string（boolean, Function）类型**

```js
function loggingIdentity<T extends string>(arg: T): T {
    console.log(arg.length);
    return arg;
}

loggingIdentity("hello"); // 5
loggingIdentity(2); // Argument of type 'number' is not assignable to parameter of type 'string'.
```

**基于自定义的 interface**

```js
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}

loggingIdentity(3);  // Error, number doesn't have a .length property
loggingIdentity({length: 10, value: 3}); // 10
```

```js
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type T0 = TypeName<string>; // "string"
type T1 = TypeName<"a">; // "string"
type T2 = TypeName<true>; // "boolean"
type T3 = TypeName<() => void>; // "function"
type T4 = TypeName<string[]>; // "object"

```

**同时支持 type 和 interface 两种类型的泛型约束**

```js
interface reduxModel<T> {
    reducers: T extends string ? {[x in T]: () => void}: T,
}

type TType = "foo" | "bar" | 'baz'
interface TInterface {
    "foo": () => void,
    "bar": () => void,
    'baz': () => void
}

const ireducers = {
    "foo": () => void
}

const model : reduxModel<TType> = {
    reducers: ireducers
    // 正常运行
}

const model : reduxModel<TInterface> = {
    reducers: ireducers
    // Type '{ foo: () => undefined; }' is missing the following properties from type 'TInterface': "bar", 'baz'
}
```

### 数组类型的两种定义方式

**Array<类型>**

Array 后面加一个<>，<>内声明元素类型。

**类型[]**

元素类型后面加一个[]。

### ts 中的类型断言

TypeScript 允许我们覆盖推断和分析出的视图类型为我们想要的任意方式，这种机制叫做类型断言（Type Assertion），类型断言会告诉编译器你比它更加知道具体是哪种类型，编译器不用再二次推断了。 类型断言往往是发生在编译器编译期间，用于提示编译器如何分析我们的代码。

- 语法
- 迁移 js 代码
- 类型断言的问题
- 指定 event 类型
- 慎用 as any 和 as unknown
- type 与类型断言

**语法**

```js
interface Foo {
name: string,
}
type Any = any;

let a:Foo = {} as Foo;
let a:Foo = {} as Any;
```

any 是任意类型的子类型，所以任意类型都可以被 as any，还是建议谨慎使用，避免变为 anyscript。

**迁移 js 代码**

```js
var foo = {};
foo.bar = 123; // Error: property 'bar' does not exist on `{}`
foo.bas = 'hello'; // Error: property 'bas' does not exist on `{}`
interface Foo {
bar: number;
bas: string;
}
var foo = {} as Foo;
foo.bar = 123;
foo.bas = 'hello'; // 注释掉这一行也不会报错
```

**类型断言的问题**

foo.bas = 'hello'; // 注释掉这一行也不会报错 如果是下面的方式就会报错了，会提示缺少 bas 的定义

```js
interface Foo {
  bar: number;
  bas: string;
}
var foo: Foo = {
  bar: 123
}
```

所以说，类型断言是不够严谨的，建议使用 var foo : Foo 这种方式。

指定 event 类型

```js
function handler (event: Event) {
let mouseEvent = event as MouseEvent;
}
function handler(event: Event) {
let element = event as HTMLElement; // HTMLElement 不是一个完全的 event 子类型，因此不能充分重叠，需要加一个 unknown 或者 any
}
```

**二次断言编译提示取消：**

```js
function handler(event: Event) {
let element = event as unknown as HTMLElement; // Okay!
}
```

**慎用 as any 和 as unknown**

通常情况是类型断言 S 和 T 的话，S 为 T 的子类型，或者 T 为 S 的子类型，这种是相对安全的。 假如是用 as any 或者 as unknown，是非常不安全的。慎用！慎用！

```js
// 谨慎使用
as any
as known
```

### type 与类型断言

type keys = 'foo' | 'bar' | 'baz'，obj[key as keys]是什么意思？ 与 variable:type 类似，这是另外一种类型约束。

如果不明白的话，看完下面这个 demo 就明白了。

```js
type keys = 'foo' | 'bar' | 'baz'
const obj = {
  foo: 'a',
  bar: 'b',
  baz: 'c'
}
const test = (key: any) => {
  return obj[key] // 提示错误 type 'any' can't be used to index type '{ foo: string; bar: string; baz: string; }'.
}
```

如何解决这个报错呢？ 第一种方式：类型约束

```js
const test = (key: keys) => {
  return obj[key]
}
```

第二种方式：类型断言（这种方式常用于第三方库的 callback，返回值类型没有约束的情况）

```js
const test = (key:any) => {
return obj[key as keys] ;
}
```

需要注意：obj[key as keys]中 keys 的类型可以少于 obj 的类型，反过来 obj 的属性不能少于 keys 的类型。

### 泛型函数与泛型接口

泛型函数

想想一个场景，我们希望函数的输入与输出类型一致。 你可能会这样做，但这并不能保障输入与输出类型一致。

```js
function log(value: any): any {
  return value
}
```

通过泛型函数可以精准实现：函数名后加一个&lt;T&gt;这里的 T 可以理解为泛型的名字。指定输入类型为 T，返回值为 T。

```js
function log<T>(value: T): T {
  return value
}
```

这是一个泛型函数实例，如何定义一种泛型函数类型呢？

```js
type Log = <T>(value: T) => T
```

使用泛型函数类型约束函数：

```js
let log: Log = function<T>(value: T): T {
  return value
}
```

泛型接口

接口所有属性灵活，输入输出一致即可。

```js
interface Log {
  <T>(value: T): T;
}
let myLog: Log = log
myLog('s') // "s"
myLog(1) // 1
```

接口所有属性必须为同一类型。

```js
interface Log<T> {
  (value: T): T;
}
let myLog: Log<string> = log
myLog('s') // "s"
myLog(1) // Error
```

ts 中的&lt;&gt;

在 ts 中，遇到&lt;&gt;的话，尖括号中间大多情况下都是类型。

```js
Array<string>
<string>[]
function <T>(value: T): T { ... }
type MyType = <T>(value : T) => T
interface MyInterface<T> { (value: T): T }


```

如何理解 as const？

为了解决 let 赋值问题的，将一个 mutable 的变量改为 readonly。
避免将类型推断为联合类型。
为了解决 let 赋值问题的，将一个 mutable 的变量改为 readonly。

```js
let x = 'hello'
x = 'world' // 报错
```

第一种方式 const

```js
const x = 'hello'
```

第二种方式 "hello"类型

```js
let x: 'hello' = 'hello'
x = 'world' //
```

第三种方式 discriminated unions

```js
type Shape =
| { kind: "circle", radius: number }
| { kind: "square", sideLength: number }
function getShapes(): readonly Shape[] {
  // to avoid widening in the first place.
  let result: readonly Shape[] = [
  { kind: "circle", radius: 100, },
  { kind: "square", sideLength: 50, },
  ];
  return result;
}


```

第四种方式 as const

.tsx 类型文件

```js
// Type '10'
let x = 10 as const;

// Type 'readonly [10, 20]'
let y = [10, 20] as const;

// Type '{ readonly text: "hello" }'
let z = { text: "hello" } as const;


```

非.tsx 类型文件

```js
// Type '10'
let x = <const>10;

// Type 'readonly [10, 20]'
let y = <const>[10, 20];

// Type '{ readonly text: "hello" }'
let z = <const>{ text: "hello" };

```

优化 discriminated unions

```js
function getShapes() {
  let result = [
  { kind: "circle", radius: 100, },
  { kind: "square", sideLength: 50, },
  ] as const;
  return result;
}

for (const shape of getShapes()) {
// Narrows perfectly!
if (shape.kind === "circle") {
console.log("Circle radius", shape.radius);
}
else {
console.log("Square side length", shape.sideLength);
}
}


```

避免将类型推断为联合类型。

避免将类型推断为 (boolean | typeof load)，而是推断为[boolean, typeof load]。

```js
export function useLoading() {
  const [isLoading, setState] = React.useState(false);
  const load = (aPromise: Promise<any>) => {
    setState(true);
    return aPromise.finally(() => setState(false));
  };
  return [isLoading, load] as const; // infers [boolean, typeof load] instead of (boolean | typeof load)[]
}

```

### declare global 是什么意思？

是为了在全局命名空间做声明，比如为对象增加一个未定义的属性。

为 Window 增加 csrf 的定义

```js
declare global {
  interface Window {
    csrf: string;
  }
}

```

为 String 增加 fancyFormat 的定义

```js
declare global {
// Here, declare things that go in the global namespace, or augment
// existing declarations in the global namespace *
  interface String {
    fancyFormat(opts: StringFormatOptions): string;
  }
}


```

注意 global 作用域只能用于导出模块或者外部的模块声明

Augmentations for the global scope can only be directly nested in external modules or ambient module declarations.

如何在 TypeScript 环境增加一个全局变量?

比如我们想要实现下面的效果，但是会报错 Property 'INITIAL_DATA' does not exist

```js
<script>
  window.__INITIAL_DATA__ = {
    "userID": "536891193569405430"
  };
</script>

const initialData = window.**INITIAL_DATA**; // 报错


```

使用类型断言

```js
const initialData = (window as any).**INITIAL_DATA**;
type InitialData = {
  userID: string;
};

const initialData = (window as any).**INITIAL_DATA** as InitialData;
const userID = initialData.userID; // Type string


```

声明全局变量

```js
declare var **INITIAL_DATA**: InitialData;
const initialData = **INITIAL_DATA**;
const initialData = window.**INITIAL_DATA**;
```

在 es 模块中，有 import，export 的，需要这样做:

```js
export function someExportedFunction() {
// ...
}

declare global {
  var **INITIAL_DATA**: InitialData;
}
const initialData = window.**INITIAL_DATA**;


```

如果在很多文件都用到的话，可以用一个 globals.d.ts 文件。

利用 interface 合并

```js
interface Window {
  __INITIAL_DATA__: InitialData;
}
const initialData = window.__INITIAL_DATA__
```

在 js 模块中需要像下面这样：

```js
export function someExportedFunction() {
  // ...
}

declare global {
  interface Window {
    __INITIAL_DATA__: InitialData;
  }
}

const initialData = window.__INITIAL_DATA__;
```

### interface 可以继承吗？

可以的。

```js
interface Base {
    foo: string;
}

interface Props extends Base {
    bar: string
    baz?: string
}

const test = (props: Props) => {
    console.log(props);
}

test({ foo: 'hello' }) // Property 'bar' is missing in type '{ foo: string; }' but required in type 'Props'
test({ foo: 'hello', bar: 'world' })
```

当 Props 继承了 Base 之后，实际上它最终变成了下面这样：

```js
interface Props extends Base {
    foo: string;
    bar: string
    baz?: string
}
```

Props 可以覆盖 Base 吗？可以，但是只能是 required 覆盖 optional，optional 不能覆盖 required。

```js
// ✅
interface Base {
    foo?: string;
}

interface Props extends Base {
    foo: string;
    bar: string
    baz?: string
}
// ❌
interface Base {
    foo: string;
}

interface Props extends Base {
    foo?: string;
    bar: string
    baz?: string
}
```

### typescript 中的&是什么意思?

在 react 的 dts 文件中有这样一个定义。

```js
type PropsWithChildren<P> = P & { children?: ReactNode }
```

typescript 中的&指的是交叉类型。

```js
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// These interfaces are composed to have
// consistent error handling, and their own data.

type ArtworksResponse = ArtworksData & ErrorHandling
type ArtistsResponse = ArtistsData & ErrorHandling

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message)
    return
  }

  console.log(response.artists)
}
```

知道&是 ts 中的交叉类型以后，我们就明白 PropsWithChildren 的意思了，而且也明白为什么 react 的函数式组件会比普通函数组件多了 children 属性。

它的意思是 PropsWithChildren 类型是 P 和对象{children?: ReactNode}的交叉类型，也就是通过&连接两个对象之后，最终生成的对象是拥有 children 这个可选属性的。

### interface 与 type 的区别是什么？

An interface can be named in an extends or implements clause, but a type alias for an object type literal cannot. An interface can have multiple merged declarations, but a type alias for an object type literal cannot.
interface 可以继承（比如用 extends），type 不可以
interface 可以实现有多个合并声明，type 不可以
enum 作为一种类型是什么意思？

在阅读 pixi.js 的源码中，发现有将 enum 作为了一种类型。

enum 也可以作为一种类型去约束。

```js
// pixi/constants
export enum BLEND_MODES {
    NORMAL = 0,
    ADD = 1,
    MULTIPLY = 2,
    SCREEN = 3,
    OVERLAY = 4,
}

export enum ANOTHER_ENUM {
    FOO = 5,
    BAR = 6
}

import { BLEND_MODES } from '@pixi/constants';

export class Sprite extends Container
{
    public blendMode: BLEND_MODES;
    constructor(){
        this.blendMode = BLEND_MODES.NORMAL; // 最佳
        //  this.blendMode = 0 这样是可以的，次之
        //  this.blendMode = ANOTHER_ENUM.FOO 这样ts会报错
    }
}

```

项目中 xxx.d.ts 的 declare module '\*.scss'是什么意思？declare module 还可以做什么？

项目中 xxx.d.ts 的 declare module '\*.scss'是什么意思？

```js
// externals.d.ts
declare module '_.scss'
```

默认情况下 import style from 'style.scss'在 ts 的 ide 校验器里会报错，那就用 d.ts 假定定义所有 scss 结尾的文件是 module。--社长
假设将 declare module '\*.scss'注释掉，ide 会报错，但是可以通过 lint。

### declare module 还可以做什么？

当我们引入了一个微软官方@types/\*中不存在的自定义包时，ide 会报错。

例如下面这样：

如何解决这个报红的错误呢？declare module

```js
// typing.d.ts
declare module 'visual-array'

```

这样爆红就消失了。

### typescript 如何约束 Promise 的类型？

Promise 泛型函数

```js
interface Promise<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult>;
}
interface foo {
  bar: () => Promise<string>;
  baz: () => Promise<number[]>;
  car: id => Promise<boolean[]>;
}
```

### typescript 中的 keyof 如何使用？

最简

```js
type Point = { x: number; y: number };
type P = keyof Point; // 'x' | 'y'
let foo: P = 'x';
let bar: P = 'y';
let baz: P = 'z'; // ❌

```

常用

```js
interface Person {
  name: string;
  age: number;
  location: string;
}
type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[]; // "length" | "push" | "pop" | "concat" | ...
type K3 = keyof { [x: string]: Person }; // string

type P1 = Person["name"]; // string
type P2 = Person["name" | "age"]; // string | number
type P3 = string["charAt"]; // (pos: number) => string
type P4 = string[]["push"]; // (...items: string[]) => number
type P5 = string[][0]; // string

```

### keyof 使得函数类型安全（type-safe）

```js
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]; // Inferred type is T[K]
}
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
  obj[key] = value;
}
let x = { foo: 10, bar: "hello!" };
let foo = getProperty(x, "foo"); // number
let bar = getProperty(x, "bar"); // string
let oops = getProperty(x, "wargarbl"); // Error! "wargarbl" is not "foo" | "bar"
setProperty(x, "foo", "string"); // Error!, string expected number
```

### Partial,Required,Readonly,Pick 泛型工具类型的实现原理

```js
type Partial<T> = {
  [P in keyof T]? : T[P];
}
type Required<T> = {
  [P in keyof T]?- : T[P];
}
type Readonly<T> = {
  readonly [P in keyof T] : T[P];
}
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

```

### typescript 中的 typeof 如何使用？

js 中的 typeof 主要用于表达式上下文，而 ts 中的 typeof 主要用于类型上下文。

```js
let s = 'hello'
let n: typeof s
// ^ = let n: string
type Predicate = (x: unknown) => boolean
type K = ReturnType<Predicate>
// ^ = type K = boolean
function f() {
  return { x: 10, y: 3 }
}
type P = ReturnType<typeof f>
// ^ = type P = {
// x: number;
// y: number;
// }
```

### typescript 中的 non-null assert operator 是什么？

非 null 断言操作符：当为 null 时，发生断言，抛出异常。 可选链：当为 null/undefined 时，返回 undefined。

非空断言操作符和可选链操作符测试

```js
// Non-Null Assertion Operator

const obj = null;

interface Entity {
  name?: string;
}

// 非空断言操作符
function nonNull(e?: Entity) {
  const s = e!.name; // 发生断言，抛出 TypeError
}

try {
  nonNull(obj);
} catch (e) {
  console.error("nonNull catch", e); // TypeError: Cannot read property 'name' of null
}

// 可选链
function optionalChaining(e?: Entity) {
  const s = e?.name;
  console.log(s); // undefined
}

optionalChaining(obj);

```

用于函数返回值空检测

```js
function returnNullFunc() {
  return null;
}

try {
  returnNullFunc()!.age;
} catch (e) {
  console.error("returnNullFunc", e); // TypeError: Cannot read property 'age' of null
}

function returnNonNullFunc() {
  return {
    age: "18"
  };
}
returnNonNullFunc()!.age;

```
