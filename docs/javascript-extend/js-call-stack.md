---
prev: /javascript-extend/input
next: /javascript-extend/js-call-stack
---

# JS 调用堆栈

Javascript 程序内部的执行机制

### 执行上下文

**执行上下文**的类型，总共有三类

**全局执行上下文**: 这是默认的，最基础的执行上下文。不在任何函数中的代码都位于全局执行上下文中。共有两个过程：1、创建有全局对象，在浏览器中这个全局对象就是 window 对象。2、将 this 指针指向这个全局对象，一个程序中只能存在一个执行上下文

**函数执行上下文**：每次调用函数时，都会为改函数创建一个新的执行上下文。每个函数都拥有自己的执行上下文，但是只有在函数被调用的时候才会被创建。一个程序中可以存在多个函数执行上下文，这些函数执行上下文按照特定的顺序执行一系列步骤。

**eval 函数执行上下文**：运行在 eval 函数中的代码也获得了自己的执行上下文。eval 方法是在运行时对脚本进行解释执行，而普通的 javascript 会有一个预处理的过程。所以会有一些性能上的损失；eval 也存在一个安全问题，因为他可以执行传给他的任何字符串，所以永远不要传入字符串或者来历不明和不受信任源的参数。

### 执行栈

执行栈，也叫调用栈具有 LIFO（last in, first out 后进先出）结构，用于存储在代码执行期间创建的所有执行上下文。

当 Javascript 引擎首次读取脚本时，会创建一个全局执行上下文并将其 push 到当前执行栈中。每当法师函数调用时，引擎都会为该函数创建一个新的执行上下文并 push 到当前执行栈的栈顶。

引擎会运行执行上下文在执行栈栈顶的函数，根据 LIFO 规则，当函数运行完成后，其对应的执行上下文会从执行栈中 pop 出，上下文控制权将转到当前执行栈的下一个执行上下文。

### 执行上下文是如何被创建的

执行上下文分两个阶段创建：1）创建阶段；2）执行阶段

**创建阶段**

在任意的 Javascript 代码被执行前，执行上下文处于创建阶段，在创建阶段总共发送了三件事情：

- 1、确定 this 的值，也被称为 this binding

- 2、lexicaEnviroment（词法环境）组件被创建

- 3、VariableEnvironment（变量环境）组件被创建

因此，执行上下文可以在概念上表示如下：

```js
ExecutionContext = {
  ThisBinding = <this value>,
  lexicalEnvironment = { ... },
  VariableEnvironment = { ... }
}

```

**This binding**

在全局执行上下文中，this 的值指向全局对象，在浏览器中，this 的值指向 window 对象

在函数执行上下文中，this 的值取决于函数的调用方式，如果它被一个对象引用调用，那么 this 的值被设置为该对象，否则 this 的值被设置为全局对象或者 undefined（严格模式下）

**词法环境 lexical Environment**

官方 ES6 文档将词法环境定义为：

> 词法环境是一种规范类型，基于 ECMASCRIPT 代码的词法前台结构来定义表示符与特定变量和函数的关联关系。词法环境有环境记录（environment record）和可能为空引用（null）的外部词法环境组成。

简而言之，词法环境是一个包含标识符变量映射的结构。（这里的标识符表示变量/函数的名称，变量是对实际对象【包括函数类型对象】或原始值的引用）在词法环境中，有两个组成部分：（1）环境记录（environment record） （2）对外部环境的引用

- 1、环境记录是存储变量和函数声明的实际位置

- 2、对外部环境的引用意味着它可以访问其外表词法环境

**全局环境**（在全局执行上下文中）是一个没有外表环境词法环境的词法环境。全局环境的外部环境引用为 null，它拥有一个全局对象（window 对象）及其关联的方法和属性（例如数组方法）以及在任何用户自定义的全局变量，this 的值指定这个全局对象

**函数环境** 用户在欢声中定义的变量被存储在环境记录中，包含了 arguments 对象，对外部环境引用可以是全局环境，也可以是包含内部欢声的外部函数环境。

注意：对于函数环境而言，环境记录还包含了一个 arguments 对象，该对象包含了索引和传递给函数的参数之间的映射以及传递给函数的参数的长度（数量）

环境记录同样也有两种类型：

- 声明性环境记录存储变量，函数和参数。一个函数环境包含声明性环境记录

- 对象环境记录用于定义在全局执行上下文中出现的变量和函数的关联。全局环境包含对象环境记录

抽象地说，词法环境的伪代码中看起来像这样：

```js
GlobalExectionContext = { // 全局执行上下文
  LexicalEnvironment: {   // 词法环境
    EnvironmentRecord: {  // 环境记录
      Type: "Object",     // 全局环境
    },
    outer: <null>         // 对外部环境的引用
  }
}

FunctionExectionContext = {// 函数执行上下文
  LexicalEnvironment: {    // 词法环境
    EnvironmentRecord: {   // 环境记录
      Type: "Declarative"  // 函数环境
    },
    outer: <Global or outer function environment reference> // 对外部环境的引用
  }
}

```

**变量环境 Variable Environment**：

变量环境是一个词法环境，因此它具有上面定义的词法环境的所有属性

在 ES6 中，词法环境（LexicalEnvironment 组件）和变量环境（VariableEnvironment 组件）的区别在于前者用于存储函数声明和变量（let 和 const）绑定，而后者仅用于存储变量（var）绑定。

**变量提示**的原因：在创建阶段，函数声明存储在环境中，而变量会被设置为 undefined（在 var 的情况下）或者保存未初始化（在 let 和 const 的情况下）。所以这就是为什么可以在声明之前访问 var 定义的变量（尽管是 undefined），但如果在声明之前访问 let 和 const 定义的变量就会提示引用错误的原因。这就是所谓的变量提升。

### 执行阶段

此阶段，完成对所有变量的分配，最后执行代码

如果 Javascript 引擎在源代码中声明的实际位置找不到 let 变量的值，那么将为其分配 undefined 值

### 打印函数调用栈

```js
function getFunctionName(func) {
  if (typeof func === 'function' || typeof func === 'object') {
    var nameMatch = func.toString().match(/function\s*([\w\$]*)\s*\(/)
    return nameMatch && nameMatch[1]
  }
}

if (!console.trace) {
  console.trace = function trace() {
    var stack = []
    var caller = arguments.callee.caller
    while (caller) {
      stack.unshift(getFunctionName(caller))
      caller = caller && caller.caller
    }
    console.log('function on stack:\n' + stack.join('\n'))
  }
}
```
