# typescript 内置类型

- Exclude&lt;T, U&gt; – 从 T 中剔除可以赋值给 U 的类型。

- Extract&lt;T, U&gt; – 提取 T 中可以赋值给 U 的类型。

- NonNullable – 从 T 中剔除 null 和 undefined。

- ReturnType – 获取函数返回值类型。

- InstanceType – 获取构造函数类型的实例类型。

### extends 用户继承关系

extends 关键很早就有了，但是作用很单一，用来表示继承接口或一个类，例如：

```js
class Animal {
  name: string
}
class Dog extends Animal {
  breed: string
}
```

用户条件表达式
typescript 2.8 引入了条件类型表达式，长这个样子:

```js
T extends U ? X : Y
```

看起来是不是有点像三元运算符: condition ? result(1) : result(2)，用大白话可以表示为:

如果 T 包含的类型 是 U 包含的类型的 ‘子集’，那么取结果 X，否则取结果 Y。

再举几个 ts 预定义条件类型的例子，加深理解:

```js
type NonNullable<T> = T extends null | undefined ? never : T;  // 如果泛型参数 T 为 null 或 undefined，那么取 never，否则直接返回T。
let demo1: NonNullable<number>; // => number，因为number不是null | undefined的子集
let demo3: NonNullable<undefined>; // => never，因为never是null | undefined的子集

```

T extends U ? X : Y 中的 X 或 Y 不一定就是一个固定值，也可以是一个新的表达式，这样就一值递归下去：

```js
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;  // "string"
type T2 = TypeName<true>;  // "boolean"
type T3 = TypeName<() => void>;  // "function"
type T4 = TypeName<string[]>;  // "object"

```

**分布式有条件类型**

如果有条件类型里待检查的类型是 naked type parameter，那么它也被称为“分布式有条件类型”。 分布式有条件类型在实例化时会自动分发成联合类型。 例如，实例化 T extends U ? X : Y，T 的类型为 A | B | C，会被解析为(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)。

例子：

```js
type T10 = TypeName<string | (() => void)> // "string" | "function"
type T12 = TypeName<string | string[] | undefined> // "string" | "object" | "undefined"
type T11 = TypeName<string[] | number[]> // "object"
```

有条件类型的分布式的属性可以方便地用来过滤联合类型：

type Diff&lt;T, U&gt; = T extends U ? never : T; // 移除 T 中与 U 中重合的元素
//注意，不是差集，差集是指除去重合后 T 与 U 的剩下元素集合 ,而这里去重后，仅保留 T 的剩余元素
type Filter&lt;T, U&gt; = T extends U ? T : never; // 移除 T 中不与 U 中重合的元素 ，仅保留重合元素，即交集

```js
type T30 = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'> // "b" | "d"
type T31 = Filter<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'> // "a" | "c"
type T32 = Diff<string | number | (() => void), Function> // string | number
type T33 = Filter<string | number | (() => void), Function> // () => void
```

与联合类型和交叉类型相似，有条件类型不允许递归地引用自己。比如下面的错误。

```js
type ElementType<T> = T extends any[] ? ElementType<T[number]> : T;  // Error

```

ElementType 引用了自身，编译错误

### keyof

一个常见的 JavaScript 模式是从对象中选取属性的子集过滤值。

```js
function pluck(o, names) {
  return names.map(n => o[n]) //按属性names子集，过滤子集的值
}
```

下面是如何在 TypeScript 里使用此函数，通过 索引类型查询和 索引访问操作符，和上面的例子一样，只是通过泛型加了约束，校验属性的有效性：

```js
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {   //对入参增加约束
  return names.map(n => o[n]);    //过滤的代码不变
}

interface Person {
    name: string;
    age: number;
}
let person: Person = {
    name: 'Jarid',
    age: 35
};
let strings: string[] = pluck(person, ['name']); // ok, ["Jarid"]

```

编译器会检查 name 是否真的是 Person 的一个属性。 本例还引入了几个新的类型操作符。 首先是 keyof T， 索引类型查询操作符。 对于任何类型 T， keyof T 的结果为 T 上已知的公共属性名的联合。 例如：

```js
let personProps: keyof Person; // 'name' | 'age'
```

keyof Person 是完全可以与 'name' | 'age'互相替换的。 不同的是如果你添加了其它的属性到 Person，例如 address: string，那么 keyof Person 会自动变为 'name' | 'age' | 'address'。 你可以在像 pluck 函数这类上下文里使用 keyof，因为在使用之前你并不清楚可能出现的属性名。 但编译器会检查你是否传入了正确的属性名给 pluck：

```js
pluck(person, ['age', 'unknown']) // error, 'unknown' is not in 'name' | 'age'
```

### intfer

infer 关键词常在条件类型中和 extends 关键词一同出现，表示将要推断的类型，作为类型变量可以在三元表达式的 True 部分引用。而 下文中 ReturnType 正是使用这种方式提取到了函数的返回类型。

- 用在函数中

- 可以表示函数中的入参或函数的返回值。

用于函数入参
示例如下：

```js
type ParamType<T> = T extends (param: infer P) => any ? P : T;

```

在这个条件语句 T extends (param: infer P) => any ? P : T 中，infer P 表示待推断的函数参数。

整句表示为：如果 T 能赋值给函数(param: infer P) => any，则结果类型是 函数(param: infer P) => any 类型中的参数 P，否则返回为 T。

```js
interface User {
  name: string;
  age: number;
}

type Func = (user: User) => void

type Param = ParamType<Func> // Param = User
type AA = ParamType<string> // string
```

用于函数反回值
我们就用内置函数 ReturnType 为例

```js
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

infer 出现在函数的返回值中，细节可以参考下文的 ReturnType 章节

构造函数中
简单来说，构造函数也是函数的特例，本质上用法相同，唯一区别在于构造函数本身的 new 语法。

用于提取构造函数中参数（实例）类型：
一个构造函数可以使用 new 来实例化，因此它的类型通常表示如下：

```js
type Constructor = new (...args: any[]) => any;
```

当 infer 用于构造函数类型中，可用于参数位置 new (...args: infer P) => any; 和返回值位置 new (...args: any[]) => infer P;。

因此就内置如下两个映射类型：

```js
// 获取参数类型
type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never;

// 获取实例类型
type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;

class TestClass {

  constructor(
    public name: string,
    public string: number
  ) {}
}

type Params = ConstructorParameters<typeof TestClass>;  // [string, numbder]

type Instance = InstanceType<typeof TestClass>;         // TestClass

```

注意：infer 关键字这个类型变量只能在 true 的分支中使用，也就是说 infer R ? R : any 不可以写成 infer R ? any : R

#### ReturnType

**ReturnType&lt;T&gt;**的作用是用于获取函数 T 的返回类型。

定义：

```js
// node_modules/typescript/lib/lib.es5.d.ts

/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

```

在这个条件语句

```js
T extends (...args: any) => infer R? R : any
```

中，infer P 表示待推断的函数返回值。

示例：

```js
type T0 = ReturnType<() => string>; // string
type T1 = ReturnType<(s: string) => void>; // void
type T2 = ReturnType<<T>() => T>; // {}
type T3 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
type T4 = ReturnType<any>; // any
type T5 = ReturnType<never>; // any
type T6 = ReturnType<string>; // Error
type T7 = ReturnType<Function>; // Error
```

[https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)
