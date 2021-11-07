# js 用 void 0 替代 undefined

underscore 源码没有出现 undefined，而用 void 0 代替之。为什么要这么做？我们可以从两部分解读，其一是 undefined 哪里不好了，你非得找个替代品？其二就是替代品为毛要找 void 0？

我们先看第一点，答案很简单，undefined 并不是保留词（reserved word），它只是全局对象的一个属性，在低版本 IE 中能被重写。

```js
var undefined = 10

// undefined -- chrome
// 10 -- IE 8
alert(undefined)
```

事实上，undefined 在 ES5 中已经是全局对象的一个只读（read-only）属性了，它不能被重写。但是在局部作用域中，还是可以被重写的。

```js
;(function() {
  var undefined = 10

  // 10 -- chrome
  alert(undefined)
})()

;(function() {
  undefined = 10

  // undefined -- chrome
  alert(undefined)
})()
```

接下来思考第二个问题，为毛找的替代品是 void 0？

我们来看看 MDN 的解释：

The void operator evaluates the given expression and then returns undefined.

意思是说 void 运算符能对给定的表达式进行求值，然后返回 undefined。也就是说，void 后面你随便跟上一个表达式，返回的都是 undefined，都能完美代替 undefined！那么，这其中最短的是什么呢？毫无疑问就是 void 0 了。其实用 void 1，void (1+1)，void (0) 或者 void "hello"，void (new Date()) 等等，都是一样的效果。更重要的前提是，void 是不能被重写的（cannot be overidden）。

那么，ES5 大环境下，void 0 就没有用武之地了吗？答案是否定的，用 void 0 代替 undefined 能节省不少字节的大小，事实上，不少 JavaScript 压缩工具在压缩过程中，正是将 undefined 用 void 0 代替掉了。
