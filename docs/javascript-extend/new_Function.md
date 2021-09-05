# new Function() 语法

学习《ECMAScript6 入门》中的模板字符串的案例中看到了 new Function()创建函数的语法

```js
const str = 'return ' + 'Hello ${name}！'
const func = new Function('name', str)
func('Jack') // Hello Jack！
```

上面的代码传入 name 参数和字符串函数体，字符串函数体由模板字符串提供，非常简洁方法

这是个很少被用到的新建函数的方法，但是有时候不得不使用它

### 语法

新建函数的语法：

```js
const func = new Function([arg1, [, ...argN]], functionBody)
```

换句话说，函数的参数（或更确切地说，各参数的名称），首先出现，而函数体在最后，所有参数都写成字符串形式，通过查看示例，可以更容易理解，这是一个有两个参数的函数

```js
const sum = new Function('a', 'b', 'return a + b')

console.log(sum(1, 2))
```

如果所要新建的欢声没有参数，那么 new Function() 只要一个函数体参数；

```js
const sayHi = new Function('alert("Hello")')

sayHi() // Hello
```

这个方式与其他方式最主要的不同点在于，函数是有运行时传入的字符串创建的，之前的所有声明都要求程序员在脚本中编写功能代码。但 new Function 允许将任何字符串转换为函数，例如，我们可以从服务器接收新函数然后执行它。

#### 闭包

通常函数将它所创建的位置记录在特殊属性[[environment]]中。它引用了创建地点的词法环境，但当使用 new Function() 创建函数时，其[[environment]]不是引用当前的词法环境，而是引用全局环境。

这个特殊的 new Function 表面看起来很奇怪，但在实际中显得非常有用，想象一下，我们必须冲字符串创建一个函数。在编写脚本时不知道该函数的代码（这就是我们不使用常规函数的原因）但在执行过程中将会制动，我们可能会从服务器或者其他来源收到它。

也许我们希望它能够访问外部的局部变量？

问题是在 Javascript 发布到生成之前，它是使用 minifier 压缩的 -- 一个通过删除额外的注释，空格来缩小代码的特殊程序，而且，重要的是，会将局部遍历重命名为较短的变量。

所以，即使我们可以在 new Function 中访问外部词汇环境，我们也会遇到 mimifiers 的问题。

而这时，new Function 的特色可以让我们免于犯错。

它强制执行更好的代码，如果我们需要将某些东西传递给由 new Function 创建的函数，我们应该将它作废参数显示传递（可以避免直接读取外部变量时产生的问题。）

### 总结

- 语法：

```js
let func = new Function(arg1, arg2, ..., body);
```

历史原因，参数也可以以逗号分隔的列表的形式给出。

这三个意思相同：

```js
new Function('a', 'b', 'return a + b') // 基础语法
new Function('a,b', 'return a + b') // 逗号分隔
new Function('a , b', 'return a + b') // 逗号加空格分隔
```

使用 new Function 创建的函数，其[[Environment]]引用全局词法环境，而不是包含该函数的外部词法环境。因此，他们不能使用外层的变量。但这确实很好，因为它可以使我们免于错误。明确地传递参数在架构上是一种更好的方法，并且不会在使用 minifiers 时不会产生问题。
