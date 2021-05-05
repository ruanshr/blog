---
prev: /javascript-extend/for-of
next: /javascript-extend/html-load
---

# history 栈

DOM window 对象通过 history 对象提供了对浏览器的会话历史的访问。它允许你在用户浏览历史中向前和向后跳转，同时从 HTML5 开始提供了对 history 栈中内容的操作

### 在 history 中跳转

使用 back() ,forward() 和 go() 方法完成在用户历史记录中向后和向前的跳转
这和用户点击浏览器中退回按钮的效果相同。类似的，也可以向前跳转（如果点击了后退按钮）

### 利用 HTML5 的 history.replaceState()修改当前页面的 URL

HTML5 为 history 对象添加了两个新方法，history.pushState()和 history.replaceState()，用来在浏览历史中添加和修改记录。state 属性用来保存记录对象，而 popstate 事件用来监听 history 对象的变化

```js
// http://xxx.xx.com/a/b.html

history.replaceState(null, null, '/c/d.html')

// http://xxx.xx.com/c/d.html

// 页面并没有重新刷新，只是改变了地址栏地址
```

**history.pushState**
history.pushState()方法向浏览器历史添加了一个状态(增加一个记录)。pushState()方法带有三个参数：一个状态对象、一个标题(现在被忽略了)以及一个可选的 URL 地址

```js
history.pushState(state, title, url)
```

state object —— 状态对象是一个由 pushState()方法创建的、与历史纪录相关的 javascript 对象。当用户定向到一个新的状态时，会触发 popstate 事件。事件的 state 属性包含了历史纪录的 state 对象。如果不需要这个对象，此处可以填 null

title —— 新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填 null

URL —— 这个参数提供了新历史纪录的地址。新 URL 必须和当前 URL 在同一个域，否则，pushState()将丢出异常。这个参数可选，如果它没有被特别标注，会被设置为文档的当前 URL
