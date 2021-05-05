---
prev: /javascript-extend/for-of
next: /javascript-extend/html-load
---

# history栈

DOM window对象通过history对象提供了对浏览器的会话历史的访问。它允许你在用户浏览历史中向前和向后跳转，同时从HTML5开始提供了对history栈中内容的操作

### 在history中跳转

使用back() ,forward() 和 go() 方法完成在用户历史记录中向后和向前的跳转
这和用户点击浏览器中退回按钮的效果相同。类似的，也可以向前跳转（如果点击了后退按钮）


### 利用HTML5的history.replaceState()修改当前页面的URL

HTML5为history对象添加了两个新方法，history.pushState()和history.replaceState()，用来在浏览历史中添加和修改记录。state属性用来保存记录对象，而popstate事件用来监听history对象的变化

```js

// http://xxx.xx.com/a/b.html

history.replaceState(null, null, '/c/d.html')

// http://xxx.xx.com/c/d.html

// 页面并没有重新刷新，只是改变了地址栏地址
```

**history.pushState**
history.pushState()方法向浏览器历史添加了一个状态(增加一个记录)。pushState()方法带有三个参数：一个状态对象、一个标题(现在被忽略了)以及一个可选的URL地址

```js
history.pushState(state, title, url);
```
state object —— 状态对象是一个由pushState()方法创建的、与历史纪录相关的javascript对象。当用户定向到一个新的状态时，会触发popstate事件。事件的state属性包含了历史纪录的state对象。如果不需要这个对象，此处可以填null

title —— 新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填null

URL —— 这个参数提供了新历史纪录的地址。新URL必须和当前URL在同一个域，否则，pushState()将丢出异常。这个参数可选，如果它没有被特别标注，会被设置为文档的当前URL