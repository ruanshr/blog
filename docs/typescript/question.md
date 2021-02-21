
# Typescript常见问题

## 1、null 和 undefined 是其他类型（包括void）的子类型，可以赋值给其他类型，赋值后的类型会变成 null或者 undefined

 默认情况下，编译器会提示错误，这是因为tsconfig.json里有一个配置项是默认打开的

 `strictNullChecks` 参数用于新的严格空检查模式，在严格空检查模式下，null 和 undefined 值都不属于任何一个类型，它们只能赋值给自己这种类型或者 any


## 2、never 和 void 的区别

void表示没有任何类型（可以被赋值为null和undefined）

never表示一个不包含值的类型，即表示永远不存在的值。

拥有void返回值类型的喊声能正常运行，拥有never返回值类型的函数无法正常返回，无法终止，或会抛出异常。

## 3、元组越界问题
```ts
let a: [string, number] = ['aaa',5]
// 数组只能添加 string, number类型的值或者 null，undefined
a.push(6)  // 添加时不会报错,
console.log(a[2]) // 引用越界的元素时会报错

```

## 4、枚举成员的特点

是只读属性，无法修改

枚举成员值默认从0开始递增，可以自定义设置初始值。

```ts
enum Gender {
    BOY = 1,
    GIRL
}

console.log(Gender.BOY)  // 1
console.log(Gender)  // { '1': 'BOY', '2': 'GIRL', BOY: 1, GIRL: 2 }


```

枚举成员值

可以没有初始值

可以是一个队常亮成员的引用

可以是一个常量表达式

可以是一个非常量表达式

```ts
emum Car{
    // const member 常量成员;在编译阶段被计算出结果
    a,  // 没有初始值
    b = Char.a // 对常量成员的引用
    c = 1 + 2  // 常量表达式
    d = Math.random()  // 非常量表达式
    e = '123'.length,  
    // 紧跟在计算成员后面的枚举成员必须有初始值
    f = 6,
    g
}

```

## 5、常量枚举与普通枚举的区别

常量枚举会在编译阶段被删除

枚举成员只能是常量成员

```ts
const enum Colors {
    Red,
    Yellow,
    Blue
}

// 常量枚举会在编译阶段被删除
let myColors = [Colors.Red, Colors.Yellow, Colors.Blue]
```

编译成JS

```js
"use strict"
var myColors = [0 /" Red "/, 1 /* Yellow */, 2 /* Blue */]
```

常量枚举不能包含计算成员，如果包含了计算成员，则会在编译阶段报错

```ts
// 报错
const enum Colors { Red, Yellow, Blue = "blue".length }
console.log(Colors.Red)
```

- 枚举的使用场景

以下代码存在的问题：

可读性差,很难记住数字的含义

可维护性差,硬编码，后续修改的话牵一发动全身

```js
function initByRole(role) {
    if (role === 1 || role == 2) {
        console.log("1,2")
    } else if (role == 3 || role == 4) {
        console.log('3,4')
    } else if (role === 5) {
        console.log('5')
    } else {
        console.log('')
    }
}
```

使用枚举后

```ts
num Role {
  Reporter,
  Developer,
  Maintainer,
  Owner,
  Guest
}

function init(role: number) {
  switch (role) {
    case Role.Reporter:
      console.log("Reporter:1");
      break;
    case Role.Developer:
      console.log("Developer:2");
      break;
    case Role.Maintainer:
      console.log("Maintainer:3");
      break;
    case Role.Owner:
      console.log("Owner:4");
      break;
    default:
      console.log("Guest:5");
      break;
  }
}

init(Role.Developer);
```

## 6、什么是可索引类型接口

一般用來约束数组和对象

```ts
// 数字索引-约束数组
// index是随便取得名字，可以任意取名
// 只要 index得类型是number，那么值得类型必须是string
interface StringArray {
    [index: number]: string
}
let arr:StringArray = [ 'a', 'b' ]
console.log(arr)

// 字符串索引-约束对象
interface StringObject {
    [index: string]: string
}

let obj: StringObject = { name : 't'}

```

## 7、什么是函数类型接口

对方法传入的参数和返回值进行约束

```ts
// 注意区分

// 普通的接口
interface discount{
    getNum:(price: number) => number
}

// 函数类型接口
interface discount2{
    (price: numbuer): number
}

let cost:discount2 = function(price: number): number {
    return price *.7
}
// 也可以使用类型别名
type Add = (x: number, y: number) => number
let add:Add = (a: number, b: number): number => a + b
```


## 8、什么是类类型接口

如果接口用于一个类的话，那么接口会表示“行为的抽象”

对类的约束，让类去实现接口，类可以实现多个接口

接口只能约束类的公有成员，实例属性/方法，无法约束私有成员，构造函数，静态属性/方法

```ts
// 接口可以在面向对象编程中表示为行为的抽象
interface Speakable {
    name: string
    // 括号里的:用来约束函数的参数
    // 括号后的:用来约束函数的返回值
    speak(word: string): void

}


interface Speakable2 {
    age: numner
}

class Dog implements Speakable1, Speakable2 {
    name: string
    age: number = 1
    speak(words: string) {
        console.log(words)
    }
}

let dog = new Dog()
dog.speak('汪汪汪')

```

## 9、什么是混合类型接口

一个对象可以同时作为函数和对象使用

```ts

interface FnType {
    (getName: string): string
}

interface MixedType extends FnType {
    name: string
    age: number
}

```

```ts
interface Counter {
    (start: number): string
    interval: number
    reset(): void
}

function getCounter(): Counter {
    let counter = <Counter> function(start: number){}
    counter.interval = 123
    counter.reset = () => {}
    return counter
}

let c = getCounter()
c(10)
c.reset()
c.interval = 5.0

```

## 10、什么是函数重载

在java中的函数重载，指的是两个或者两个以上的同名函数，参数类型不同或者参数个数不同。函数重载的好处是：不需要为功能享受的函数起不同的名字。

在Typescript中，表现为给同一个函数提供多个函数类型定义，适用于接收不同的参数和返回不同结果的情况。

TS实现函数重载的时候，要求定义一系列的函数声明，在类型最宽泛的版本中实现重载（前面的是函数声明，目的是约束参数类型和个数，最后的函数实现是重载，表示要遵循前面的函数声明。一般在最后的函数实现时使用any类型）

函数重载在实际应用中使用的比较少，一般会用联合类型或泛型代替

函数重载的声明只用于类型检查阶段，在编译后悔被删除

TS编译在处理重载的时候，会查询函数声明列表，从上到下知道疲惫成功为止，所以要把最容易匹配的类型写到前面

```ts

function attr(val: string): string

function attr(val: number): number

function attr(val: any): any

attr('a')
attr('1')
```

上面的写法声明完函数后必须实现函数重载，也可以只声明函数

```ts

interface Cloner{
    clone(animal: Animal): Animal
}

interface Cloner{
    clone(animal: Sheep): Sheep
}

interface Cloner{
    clone(animal: Dog): Dog
    clone(animal: Cat): Cat
}

// 后面写的接口中的函数声明优先级高

interface Cloner {
    clone(animal: Dog): Dog
    clone(animal: Cat): Cat
    clone(animal: Sheep): Sheep
    clone(animal: Animal): Animal
}

```

## 11、什么是访问控制修饰符

```ts

class Father{
    str: string             // 默认是 public
    public name: string     // 在定义的类中，类的实例，子类，子类实例都可以访问
    protected age: number    // 只能在定义的类和子类中访问，不允许通过实例（定义的类的实例和子类实例）访问
    private money: number   // 只能在定义的类中访问，类的实例、子类、子类实例都不可以访问

    constructor(name: string, age: number, money: number){
        this.name = name
        this.age = age
        this.money = money
    }

    getName(): string{
        return this.name
    }
    setName(name: string){
        this.name = name
    }
    getAge(): number {
        return this.age
    }
}


const fa = new Father('张三',48,1000000)

console.log(fa.name) // 张三
console.log(fa.age)  // error
console.log(fa.money) // error
console.log(fa.getAge()) // 48

class Child extends Father{
    constructor(name: string, age: number, money: number){
      // 在super方法之前不能使用this,可以写其他
      super(name, age, money)  
      // super 方法之后可以使用this对象
    }

    desc() {
        console.log(`name: ${name}, age: ${age}, money: ${money} `)
    }
}


let child = new Child('李四', 18, 0)
console.log(child.name)   // 李四
console.log(child.age)    // error
console.log(child.money)  // error
```

## 12、重写（override） vs 重载（overload)

重写是指子类重写“继承”自父类中的方法。虽然TS与JAVA相似，但是TS中的继承本身上函数JS的“继承”机制-原型链继承机制

重载是指为同一个函数提供多个类型定义

```ts

class Animal {
    speak(word: string): string {
        return `animal speak : ${word}`
    }
}

class Cat extends Animal {
    speak(word: string): string {
        return `cat speak : ${word}`
    }
}


let cat = new Cat()
console.log(cat.speak('hello'))


/**=====================================**/

function double(val: number): number
function double(val: string): string
function double(val: any): any {
    if(typeof(val) === 'number'){
        return val * 2
    }
    return val + val
}

let r = double(3)
console.log(r)   // 6
let k = double('3')
console.log(k)  // '33'
```

## 13、继承 vs 多态

继承： 子类继承父类，子类除了拥有父类是的所有特性外，还有一些更具体的特性

多态： 由继承而产生了相关的不同的类，对同一个方法可以有不同的响应

```ts

class Animal {
    speak(word: string): string {
        return `animab speak : ${word}`
    }
}

class Cat extends Animal {
    speak(word: string): string {
        return `cat speak : ${word}`
    }
}

class Dog extends Animal {
    speak(word: string): string {
        return `Dog speak: ${word}`
    }
}

let cat = new Cat()
console.log(cat.speak('hello'))
let dog = new Dog()
console.log(dog.speak('hello'))

```


## 14、什么是泛型

泛型是指在定义函数、接口或者类的时候，不预先指定具体的类型，使用时再去指定类型的一种特性

可以吧泛型理解为代表类型的参数

```ts

function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = []
    for (let i = 0; i < len; i++ ) {
        result[i] = value
    }
    return result
}


```


## 15、什么是类型谓词

类型包含函数： 要自定义一个类型包含，只需要简单地为这个类型包含定义一个函数即可，这个函数的返回值是一个类型谓词

类型谓词的衣服为 parameterName is Type 这种形式，其中parameterName必须是当前函数前面里的一个参数名

```ts

interface Bird { 
    fly()
    layEggs()
}

interface Fish {
    swim()
    layEggs()
}

function getSmallPet(): Fish | Bird {
    return
}

let pet = getSmallPet()

pet.layEggs()

// 当使用联合类型时，如果不用类型短语，默认只会从中获取共有的部分
(pet as Fish).swin()

pet.swim()


// 使用类型谓词
function isFish(pet: Fish | Bird): pet is Fish {

    return (pet as Fish).swim !== undefined
}

if (isFish(pet)) {
    pet.swim()
} else {
    pet.fly()
}
```

## 16、可选链运算符的使用

可选链运算符是一种先检查属性是否存在，再尝试访问该属性的运算符，其符合为?.

如果运算符左侧的操作数?.计算为undefined或者null，则表达式求值为undefined，否则，正常出发模板属性访问，方法或者函数调用。

可选链运算符处于 stage3阶段，使用 @babel/plugin-proposal-optional-chaining 插件可以提前使用，TS 3.7版本正式支持使用，以前的版本会报错。
```ts

a?.b;
// 相当于 a == null ? undefined : a.b;
// 如果 a 是 null/undefined，那么返回 undefined，否则返回 a.b 的值.

a?.[x];
// 相当于 a == null ? undefined : a[x];
// 如果 a 是 null/undefined，那么返回 undefined，否则返回 a[x] 的值

a?.b();
// 相当于a == null ? undefined : a.b();
// 如果 a 是 null/undefined，那么返回 undefined
// 如果 a.b 不是函数的话，会抛类型错误异常，否则计算 a.b() 的结果

```

## 17、typeof class 和直接用 class作为类型有什么区别

```ts

class Greeter {
    static message = 'hello'
    greet() {
      return Greeter.message
    }
}

// 获取的是实例的类型，该类型可以获取实例对象上的属性/方法
let greeter1: Greeter = new Greeter()
console.log(greeter1.greet())  // hello

// 获取的是类的类型，该类型可以获取类上面的静态属性/方法
let greeterTwo: typeof Greeter = Greeter
greeterTwo.message = 'hey'

let greeter2:Greeter = new greeterTwo()
console.log(greeter2.greet()) // hey

```

## 17、如何在 Node 中使用 TS

安装相关声明文件，如：@types/node；

因为 node 模块遵循 CommonJS 规范，一些 node 模块（如：express）的声明文件，用 export = xxx 导出模块声明。TS 进行类型推导时，会无法推断导致报错。所以需要使用 import xxx from "xxx" 或者 import xxx = "xxx" 导入 node 模块

## 18、不要使用如下类型 Number，String，Boolean、Object，应该使用类型number、string、boolean、object

```ts
/* 错误 */
function reverse(s: String): String;

/* OK */
function reverse(s: string): string;
```

## 19、为什么在 exclude 列表里的模块还会被编译器使用

有时候是被 tsconfig.json 自动加入的，如果编译器识别出一个文件是模块导入目标，它就会加到编译列表里，不管它是否被排除了。因此，要从编译列表中排除一个文件，你需要在排除它的同时，还要排除所有对它进行 import 或使用了 ///指令的文件

## 20、tsconfig配置说明

```json
{
    "compilerOptions": {

        /**************基础配置**************/
        /**************基础配置**************/
        /**************基础配置**************/

        /* 开启增量编译：TS 编译器在第一次编译的时候，会生成一个存储编译信息的文件，下一次编译的时候，会根据这个文件进行增量的编译，以此提高 TS 的编译速度 */
        // "incremental": true,
        /* 指定存储增量编译信息的文件位置 */
        // "tsBuildInfoFile": "./",

        /* 打印诊断信息 */
        // "diagnostics": true,
        /* 打印输出的文件 */
        // "listEmittedFiles": true,
        /* 打印编译的文件（包括引用的声明文件）*/
        // "listFiles": true,

        /* 指定 ECMAScript 的目标版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */
        // "target": "es5",
        /* 指定模块代码的生成方式: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
        // "module": "commonjs",

        /* 指定要包含在编译中的库文件——引用类库——即申明文件，如果输出的模块方式是 es5，就会默认引入 "dom","es5","scripthost"  */
        /* 如果在 TS 中想要使用一些 ES6 以上版本的语法，就需要引入相关的类库 */
        // "lib": [],

        /* 允许编译 JS 文件 */
        // "allowJs": true,
        /* 检查 JS 文件*/
        // "checkJs": true,

        /* 指定 JSX 代码生成的模式: 'preserve', 'react-native', or 'react'. */
        /* 'react' 模式下：TS 会直接把 jsx 编译成 js */
        /* 'preserve' 模式下：TS 不会把 jsx 编译成 js，会保留 jsx */
        // "jsx": "preserve",


        /**************声明文件相关配置**************/
        /**************声明文件相关配置**************/
        /**************声明文件相关配置**************/

        /* 生成相应的类型声明文件 —— '.d.ts' */
        // "declaration": true,
        /* 声明文件的输出路径 */
        // "declarationDir": "./d",
        /* 只生成声明文件，不生成 JS */
        // "emitDeclarationOnly": true,
        /* 声明文件目录，默认 node_modules/@types */
        // "typeRoots": [],
        /* 要导入的声明文件包，默认导入上面声明文件目录下的所有声明文件 */
        // "types": [],


        /* 将多个相互依赖的文件合并并且把编译后的内容输出到一个文件里
         * 可以用在产出 AMD 模块的场景中
         * "module":"amd" 时，当一个模块引入了另外一个模块，编译的时候会把这两个模块的编译结果合并到一个文件中
         */
        // "outFile": "./",
        /* 指定编译文件的输出目录 */
        // "outDir": "./out",
        /* 指定输入文件的根目录，用于控制输出目录的结构 */
        // "rootDir": "./",

        /* 启用项目编译 */
        // "composite": true,

        /*  输出的时候移除注释 */
        // "removeComments": true,

        /* 不输出文件 */
        // "noEmit": true,
        /* 发生错误时不输出文件 */
        // "noEmitOnError": true,

        /* 不生成 helper 函数，以前的话设置为 true 后，需要额外安装 ts-helpers */
        /* 类似于 babel ，会给每个文件都生成 helper 函数，会使得最终编译后的包的体积变大 */
        // "noEmitHelpers": true,
        /* 现在可以通过 tslib（TS 内置的库）引入 helper 函数，！！！文件必须是模块 ！！！ */
        /* 编译后自动引入 var tslib_1 = require("tslib") */
        // "importHelpers": true,

        /* 当目标是 ES5 或 ES3 的时候提供对 for-of、扩展运算符和解构赋值中对于迭代器的完整支持 */
        // "downlevelIteration": true,

        /* 把每一个文件转译成一个单独的模块 */
        // "isolatedModules": true,


        /**************严格检查配置**************/
        /**************严格检查配置**************/
        /**************严格检查配置**************/

        /* 开启所有的严格检查配置 */
        "strict": true,
        /* 不允许使用隐式的 any 类型 */
        // "noImplicitAny": true,

        /* 不允许把 null、undefined 赋值给其他类型变量 */
        // "strictNullChecks": true,

        /* 不允许函数参数双向协变 */
        // "strictFunctionTypes": true,

        /* 使用 bind/call/apply 时，严格检查函数参数类型 */
        // "strictBindCallApply": true,

        /* 类的实例属性必须初始化 */
        // "strictPropertyInitialization": true,

        /* 不允许 this 有隐式的 any 类型，即 this 必须有明确的指向*/
        // "noImplicitThis": true,

        /* 在严格模式下解析并且向每个源文件中注入 "use strict" */
        // "alwaysStrict": true,

        /**************额外的语法检查配置，这种检查交给 eslint 就行，没必要配置**************/
        /**************额外的语法检查配置，这种检查交给 eslint 就行，没必要配置**************/
        /**************额外的语法检查配置，这种检查交给 eslint 就行，没必要配置**************/

        /* 有未使用到的本地变量时报错 */
        // "noUnusedLocals": true,

        /* 有未使用到的函数参数时报错 */
        // "noUnusedParameters": true,

        /* 每个分支都要有返回值 */
        // "noImplicitReturns": true,

        /* 严格校验 switch-case 语法 */
        // "noFallthroughCasesInSwitch": true,

        /**************模块解析配置**************/
        /**************模块解析配置**************/
        /**************模块解析配置**************/

        /* 指定模块的解析策略: 'node' (Node.js) or 'classic' (TypeScript pre-1.6)*/
        /* 若未指定，那么在使用了 --module AMD | System | ES2015 时的默认值为 Classic，其它情况时则为 Node */
        // "moduleResolution": "node",

        /* 在解析非绝对路径模块名的时候的基准路径 */
        // "baseUrl": "./",

        /* 基于 'baseUrl' 的路径映射集合 */
        // "paths": {},

        /* 将多个目录放在一个虚拟目录下，用于运行时 */
        /* 当自己编写的库和开发的代码都输出到一个目录下时，开发代码和库的位置不一样，开发代码引入库的路径就会不对 */
        // "rootDirs": [],
        // "rootDirs": ["src","out"],

        /* 允许 export = xxx 导出 ，并使用 import xxx form "module-name" 导入*/
        // "esModuleInterop": true,

        /* 当模块没有默认导出的时候，允许被别的模块默认导入，这个在代码执行的时候没有作用，只是在类型检查的时候生效 */
        // "allowSyntheticDefaultImports": true,


        /* 不要 symlinks 解析的真正路径 */
        // "preserveSymlinks": true,

        /* 允许在模块中以全局变量的方式访问 UMD 模块内容 */
        // "allowUmdGlobalAccess": true,


        /************** Source Map 配置**************/
        /************** Source Map 配置**************/
        /************** Source Map 配置**************/

        /* 指定 ts 文件位置 */
        // "sourceRoot": "",

        /* 指定 map 文件存放的位置 */
        // "mapRoot": "",

        /* 生成目标文件的 sourceMap */
        // "sourceMap": true,

        /* 将代码与sourcemaps生成到一个文件中，要求同时设置了--inlineSourceMap 或--sourceMap 属性*/
        // "inlineSources": true,

        /* 生成目标文件的 inline sourceMap —— 源文件和 sourcemap 文件在同一文件中，而不是把 map 文件放在一个单独的文件里*/
        // "inlineSourceMap": true,

        /* 生成声明文件的 sourceMap */
        // "declarationMap": true,

        /************** 实验性的配置**************/
        /************** 实验性的配置**************/
        /************** 实验性的配置**************/

        /* 启用装饰器 */
        // "experimentalDecorators": true,

        // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */


        /**************高级配置**************/
        /**************高级配置**************/
        /**************高级配置**************/

        /* 强制区分大小写 */
        // "forceConsistentCasingInFileNames": true

}

    /* 指定需要编译的单个文件列表 */
    // "files": [],

    /* 指定需要编译的文件/目录 */
    // "include": [
    //    // 只写一个目录名等价于 "./src/**/*"
    //    "src"
    //  ]

    /* 需要排除的文件或目录 */
    // "exclude": []

    /* 配置文件继承 */
    // "extends": "./tsconfig.base.json"

}
```