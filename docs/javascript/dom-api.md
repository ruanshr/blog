---
prev: /javascript/decorator
next: /javascript/es6-format
---
# before(),after(),prepend(),append()等新增 DOM API

## 1. DOM API 之 before()

这里的 **before()**是个 ChildNode 方法，也就是节点方法。节点方法对应于元素方法。区别在于，节点可以直接是文本节点，甚至注释等。但是，元素必须要有 HTML 标签。

因此，**before()**的参数既可以是 DOM 元素，也可以是 DOM 节点，甚至可以直接字符内容，咦，感觉活脱脱的 jQuery 的 before() API 嘛？没错，真的很类似似，并且语义也是一样的，表示当前节点的前面是 XXX。

语法如下：

void ChildNode.before((节点或字符串)... 其它更多节点);
从语法可以看出 before()方法支持多个参数，并且参数可以是节点对象，也可以是字符串对象。

原生 DOM 的 before() API 和 jQuery 中的 before() API 还是有差别的，在 jQuery 中，before()的参数值是作为 html 字符处理的，但是这里的 before()是作为 text 字符处理的。

如果我们想要在图片前面插入 HTML 内容，可以使用 DOM 节点方式插入

元素 DOM 的 **before()** API 还有一个很棒的特性，那就是可以同时插入多个节点内容

兼容性
**before()** API Chrome54+，Firefox49+才支持，还算比较新，IE edge 目前还未支持

对于团队或公司内部的一些项目，管理平台或者工具之类的 web 页面我们可以放心大胆使用 before()等 API，如果是面向用户对兼容性有要求的项目呢？

很简单，加一段 polyfill JS 代码就可以了，如下（参考自 MDN）：

```js
;(function(arr) {
  arr.forEach(function(item) {
    if (item.hasOwnProperty('before')) {
      return
    }
    Object.defineProperty(item, 'before', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function before() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment()

        argArr.forEach(function(argItem) {
          var isNode = argItem instanceof Node
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)))
        })

        this.parentNode.insertBefore(docFrag, this)
      }
    })
  })
})([Element.prototype, CharacterData.prototype, DocumentType.prototype])
```

注意，上面的 polyfill 并不支持 IE8 及其以下浏览器。也就是 before() API 只能在至少兼容到 IE9 浏览器的项目使用。

和 **insertBefore()**比较

**insertBefore()**作为老牌传统的 API，优势在于兼容性好。不足之处，其语法着实很奇怪，A 元素插到 B 元素前面，需要父元素 parentNode.insertBefore(newNode, referenceNode)，小辈之间的打打闹闹牵扯到父辈，显然事情就会麻烦。至少这么多年下来 insertBefore 的参数究竟是新插入节点在前还是先插入节点在后，我都没有准确记清楚。

但是，before() API 就不一样了，语法仅涉及到插入节点和相对节点，非常好记，不容易出错，而且 API 名称更短。

## 2. DOM API 之 after()

**after()**和 **before()**的语法特性兼容性都是一一对应的，差别就在于语义上，一个是在前面插入，一个是在后面插入。

由于语法类似，因此，就不一个一个示意了，若想直观体验 after()的特性表现，您可以狠狠的点击这里：DOM after()节点 API 方法 demo

然后下面的 JS 代码是对 after() API 的 polyfill，同样地，至少 IE9+浏览器。

```js
;(function(arr) {
  arr.forEach(function(item) {
    if (item.hasOwnProperty('after')) {
      return
    }
    Object.defineProperty(item, 'after', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function after() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment()

        argArr.forEach(function(argItem) {
          var isNode = argItem instanceof Node
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)))
        })

        this.parentNode.insertBefore(docFrag, this.nextSibling)
      }
    })
  })
})([Element.prototype, CharacterData.prototype, DocumentType.prototype])
```

## 3. DOM API 之 replaceWith()
   其语法如下：

ChildNode.replaceWith((节点或字符串)... 更多节点);
表示替换当前节点为其他节点内容。

举个例子，把页面上所有 HTML 注释都替换成可显示的普通文本节点。

如下 JS 代码：

```js
var treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT)

while (treeWalker.nextNode()) {
  var commentNode = treeWalker.currentNode
  // 替换注释节点为文本节点
  commentNode.replaceWith(commentNode.data)
}
```

对我们开发有没有什么启示呢？比方说页面模板可以放在注释中……

同样，如果对兼容性又要求，可以使用下面的 JS polyfill（参考自 MDN）：

```js
function ReplaceWith(Ele) {
  var parent = this.parentNode,
    i = arguments.length,
    firstIsNode = +(parent && typeof Ele === 'object')
  if (!parent) return

  while (i-- > firstIsNode) {
    if (parent && typeof arguments[i] !== 'object') {
      arguments[i] = document.createTextNode(arguments[i])
    }
    if (!parent && arguments[i].parentNode) {
      arguments[i].parentNode.removeChild(arguments[i])
      continue
    }
    parent.insertBefore(this.previousSibling, arguments[i])
  }
  if (firstIsNode) parent.replaceChild(this, Ele)
}
if (!Element.prototype.replaceWith) {
  Element.prototype.replaceWith = ReplaceWith
}

if (!CharacterData.prototype.replaceWith) {
  CharacterData.prototype.replaceWith = ReplaceWith
}
if (!DocumentType.prototype.replaceWith) {
  CharacterData.prototype.replaceWith = ReplaceWith
}
```

## 4. DOM API 之 prepend()

其语法如下：

**ParentNode.prepend((节点或字符串)... 更多节点);**

表示在当前节点的最前面插入其它节点内容（作为子节点）。其意思和 jQuery 中的 prepend() API 是一样的，对 jQuery 熟悉的人学习这几个 API 都是分分钟的事情。

参数值特性什么的和 **before()**,**after()**等方法类似，就不重复展开。

**prepend()**这个 api 要更简单和直接。

兼容性和 **before()**一模一样，对于 IE9+支持项目，可以辅助下面的 polyfill：

```js
;(function(arr) {
  arr.forEach(function(item) {
    if (item.hasOwnProperty('prepend')) {
      return
    }
    Object.defineProperty(item, 'prepend', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function prepend() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment()

        argArr.forEach(function(argItem) {
          var isNode = argItem instanceof Node
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)))
        })

        this.insertBefore(docFrag, this.firstChild)
      }
    })
  })
})([Element.prototype, Document.prototype, DocumentFragment.prototype])
```

## 5. DOM API 之 append()

其语法如下：

**ParentNode.append((节点或字符串)... 更多节点);**

表示在当前节点的最后面插入其它节点内容（作为子节点）。其意思和 jQuery 中的 **append()** API 是一样的，细节上就是不支持 html 字符串直接显示的差别。

polyfill 如下：

```js
;(function(arr) {
  arr.forEach(function(item) {
    if (item.hasOwnProperty('append')) {
      return
    }
    Object.defineProperty(item, 'append', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function append() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment()

        argArr.forEach(function(argItem) {
          var isNode = argItem instanceof Node
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)))
        })

        this.appendChild(docFrag)
      }
    })
  })
})([Element.prototype, Document.prototype, DocumentFragment.prototype])
```
