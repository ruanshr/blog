# Web Components 基本概念及实例教程

&gt; 谷歌公司由于掌握了 Chrome 浏览器，一直在推动浏览器的原生组件，即 Web Components API.
&gt; 相比第三方框架，原生组件简单直接，符合直觉，不用加载任何外部模块，代码量小。目前，它还在不断发展，但已经可以用于生产环境。

### 基本概念

#### Web Components 由这四种技术组成

**自定义元素（Custom Elements）**

**HTML 模板（HTML templates）**

**影子 DOM（Shadow DOM）**

**HTML 导入（HTML Imports）**

#### 对应的接口

1、四种新的 HTML 元素&lt;template&gt;,&lt;content&gt;,&lt;element&gt;,&lt;shadow&gt;

2、与新元素相关的 API 接口：
**HTMLTemplateElement**
**HTMLContentElement**
**HTMLElementElement**
**HTMLShadowElement**

3、HTMLLinkElement 接口的拓展，以及&lt;link&gt;元素

4、一个注册新元素的入口：
**Document.registerElement()**
**Document.createElement()**
**Document.createElementNS()**

5、自定义元素的原型（prototype）可以添加新的生命周期回调（lifecycle callbacks）

6、元素的默认样式中添加新的样式伪类（pseudo-classes）
**:unresolved**

7、影子 DOM

shadow Dom 为 Web 组件中的 DOM 和 CSS 提供了封装。shadow Dom 使得这些东西与主文档的 DOM 保持分离。你也可以在一个 Web 组件外部使用 shadow Dom 本身

为什么要把一些代码和网页上的其他的代码分离？原因之一是，大型站点若 CSS 没有良好的组织，导航的样式可能就泄漏到本不应该去的地方，如主要内容区域，反之亦然。随着站点，应用的扩展，这些的事难以避免。

**ShadowRoot**
**Element.createShadowRoot()**
**Element.getDestinationInsertionPoints()**
**Element.shadowRoot**

8、Event 接口的扩展： Event.path

9、Document 接口的拓展

10、Web Components 的样式

**新的伪类 :host、:host()、:host-content()**
**新的伪元素 ::shadow 和::content**
**新的组合器（combinator） :/deep/**

### 自定义元素（Custom Elements）

&gt; 创建自己的自定义 HTML 元素，可以有自己的脚本行为和 CSS 样式。自定义元素的一个优势是它的生命周期反应，这允许将行为附加到新元素的“生命周期”的不同部分

启动自定义元素关键在于 Document.registerElement()方法，此方法向浏览器注册一个新元素，该元素默认使用 HTMLElement 接口（如果您创建了类似&lt;mytag&gt;的标签，但不注册，它将会使用 HTMLUnknowElement 接口。您也可以在例如&lt;button&gt;这样的原生元素的基础上创建自定义元素，不过如此一来就不能使用自定义标签名，比如&lt;my-button&gt;,而要使用&lt;button is="my-button"&gt;这样的语法了）。

### 生命周期回调（liftcycle callbacks）

自定义元素可以使用以下生命周期回调函数：
**createdCallback - 注册元素时执行**
**attachedCallback - 元素插入 DOM 时执行**
**detachedCallback - 元素被移除 DOM 时执行**
**attributeChangeCallback - 元素的属性被增，删，改时执行**

### 实例

上面介绍了 Web Components 的一些基本概念，接下来配合这些基本概念，我们将配备一些实例。

下图是一个用户卡片。

Web Components 基本概念及实例教程
本文演示如何把这个卡片，写成 Web Components 组件。网页只要插入下面的代码，就会显示用户卡片。

&lt;user-card&gt;&lt;/user-card&gt;
注意：这种自定义的 HTML 标签，称为自定义元素（custom element）。根据规范，自定义元素的名称必须包含连词线，用与区别原生的 HTML 元素。所以，&lt;user-card&gt;不能写成&lt;usercard&gt;。

customElements.define()

自定义元素需要使用 JavaScript 定义一个类，所有&lt;user-card&gt;都会是这个类的实例。

```js
class UserCard extends HTMLElement {
  constructor() {
    super()
  }
}
```

上面代码中，UserCard 就是自定义元素的类。注意，这个类的父类是 HTMLElement，因此继承了 HTML 元素的特性。

接着，使用浏览器原生的**customElements.define()**方法，告诉浏览器&lt;user-card&gt;元素与这个类关联。

```js
window.customElements.define('user-card', UserCard)
```

自定义元素的内容

自定义元素&lt;user-card&gt;目前还是空的，下面在类里面给出这个元素的内容。

```js
class UserCard extends HTMLElement {
  constructor() {
    super()
    const img = document.createElement('img')
    img.src = 'https://semantic-ui.com/images/avatar2/large/kristy.png'
    img.classList.add('image')

    const container = document.createElement('div')
    container.classList.add('container')

    const name = document.createElement('p')
    name.classList.add('name')
    name.innerText = 'User Name'

    const email = document.createElement('p')
    email.classList.add('email')
    email.innerText = 'yourmail@qq.com'

    const botton = document.createElement('button')
    button.classList.add('button')
    button.innerText = 'Follow'

    container.append(name, email, button)
    this.append(img, container)
  }
}
```

上面代码最后一行，this.append()的 this 表示自定义元素实例。

完成这一步以后，自定义元素内部的 DOM 结构就已经生成了。

#### template 标签

使用 JavaScript 写上一节的 DOM 结构很麻烦，Web Components API 提供了&lt;template&gt;标签，类似 vue 书写组件的方式，可以在它里面使用 HTML 定义 DOM。

```html
<template id="userCardTemplate">
  <img class="image" src="https://semantic-ui.com/images/avatar2/large/kristy.png" />
  <div class="container">
    <p class="name">User Name</p>
    <p class="email">yourmail@qq.com</p>
    <button class="button">follow</button>
  </div>
</template>
```

然后，改写一下自定义元素的类，为自定义元素加载&lt;template&gt;

```js
class UserCard extends HTMLElement {
  constructor() {
    super()
    const templateElem = document.querySelector('#userCardTemplate')
    const content = templateElem.content.cloneNode(true)
    this.append(content)
  }
}
```

上面代码中，获取&lt;template&gt;节点以后，克隆了它的所有子元素，这是因为可能有多个自定义元素的实例，这个模板还要留给其他实例使用，所以不能直接移动它的子元素。

到这一步为止，完整的代码如下

```html
<body>
  <user-card></user-card>
  <template id="userCardTemplate">
    <img class="image" src="https://semantic-ui.com/images/avatar2/large/kristy.png" />
    <div class="container">
      <p class="name">User Name</p>
      <p class="email">yourmail@qq.com</p>
      <button class="button">follow</button>
    </div>
  </template>
  <script type="text/javascript">
    class UserCard extends HTMLElement {
      constructor() {
        super()
        const templateElem = document.querySelector('#userCardTemplate')
        const content = templateElem.content.cloneNode(true)
        this.createShadowRoot().append(content)
      }
    }
    window.customElements.define('user-card', UserCard)
  </script>
</body>
```

#### 添加样式

自定义元素还没有样式，可以给它指定全局样式，比如下面这样。

user-card {
/_ ... _/
}
但是，组件的样式应该与代码封装在一起，只对自定义元素生效，不影响外部的全局样式。所以，可以把样式写在&lt;template&gt;里面，类似 scss 里面使用 scoped 的标签。

```html
<template id="userCardTemplate">
  <style>
    :host {
      display: flex;
      align-items: center;
      width: 450px;
      height: 100px;
      background-color: #d4d4d4;
      border: 1px solid #d5d5d5;
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
      border-radius: 3px;
      overflow: hidden;
      padding: 10px;
    }
    .image {
      flex: 0 0 auto;
      width: 100px;
      height: 100px;
      vertical-align: middle;
      border-radius: 5px;
    }
    .container {
      box-sizing: border-box;
      padding: 20px;
    }
    .container > .name {
      font-size: 20px;
      font-weight: 600;
      line-height: 1;
      margin: 0;
      margin-bottom: 5px;
    }
    .container > .email {
      opacity: 0.75;
      line-height: 1;
      margin: 0;
      margin-bottom: 15px;
    }

    .container > .button {
      padding: 10px 25px;
      font-size: 12px;
      border-radius: 5px;
      text-transform: uppercase;
    }
  </style>
  <img class="image" src="https://semantic-ui.com/images/avatar2/large/kristy.png" />
  <div class="container">
    <p class="name">User Name</p>
    <p class="email">yourmail@qq.com</p>
    <button class="button">follow</button>
  </div>
</template>
```

注意：上面代码中，&lt;template&gt;样式里面的:host 伪类，指代自定义元素本身。

#### 自定义元素的参数

&lt;user-card&gt;内容现在是在&lt;template&gt;里面设定的，为了组件复用，我们希望把它改成传递参数的形式

```html
<user-card
  image="https://semantic-ui.com/images/avatar2/large/kristy.png"
  name="User Name"
  email="yourmail@qq.com"
>
</user-card>
```

那么&lt;template&gt;代码也相应改造

```html
<template>
  <img class="image" />
  <div class="container">
    <p class="name"></p>
    <p class="email"></p>
    <button class="button">follow</button>
  </div>
</template>
```

最后，改一下类的代码，把参数加到自定义元素里面

```js
class UserCard extends HTMLElement {
  constructor() {
    super()
    const templateElem = document.querySelector('#userCardTemplate')
    const content = templateElem.content.cloneNode(true)
    content.querySelector('.img').setAttribute('src', this.getAttribute('image'))
    content.querySelector('.container>.name').innterText = this.getAttribute('name')
    content.querySelector('container>.email').innerText = this.getAttribute('email')
    this.createShadowRoot().append(content)
  }
}
```

#### Shadow DOM

我们不希望用户能够看到&lt;user-card&gt;的内部代码，Web Component 允许内部代码隐藏起来，这叫做 Shadow DOM，即这部分 DOM 默认与外部 DOM 隔离，内部任何代码都无法影响外部。

自定义元素的 this.attachShadow()方法开启 Shadow DOM，详见下面的代码。

```js
class UserCard extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'closed'})
    const templateElem = document.querySelector('#userCardTemplate')
    const content = templateElem.content.cloneNode(true)
    content.querySelector('.image').setAttribute('src', this.getAttribute('image'))
    content.querySelector('.container>.name').innterText = this.getAttribute('name')
    content.querySelector('.container>.email').innerText = this.getAttribute('email')
    shadow.append(content)
  }
}
```

上面代码中，this.attachShadow()方法的参数{ mode: 'closed' }，表示 Shadow DOM 是封闭的，不允许外部访问。

至此，这个 Web Component 组件就完成了，完整代码可以访问这里。可以看到，整个过程还是很简单的，不像第三方框架那样有复杂的 API。


#### 与用户互动


```js

this.$button = shadow.querySelector('button');
this.$button.addEventListener('click', () => {
 // do something
});

```


## 面向未来的原生Web Components UI组件库 xy-ui

git地址: https://github.com/XboxYan/xy-ui


参考链接：

http://www.ruanyifeng.com/blog/2019/08/web_components.html

https://react.docschina.org/docs/web-components.html