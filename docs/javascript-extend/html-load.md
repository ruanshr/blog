---
prev: /javascript-extend/history
next: /javascript-extend/html5
---

# HTML 页面加载和解析流程

1. 用户输入网址（假设是个 html 页面，并且是第一次访问），浏览器向服务器发出请求，服务器返回 html 文件。

2. 浏览器开始载入 html 代码，发现&lt;head&gt;标签内有一个&lt;link&gt;标签引用外部 CSS 文件。

3. 浏览器又发出 CSS 文件的请求，服务器返回这个 CSS 文件。

4. 浏览器继续载入 html 中&lt;body&gt;部分的代码，并且 CSS 文件已经拿到手了，可以开始渲染页面了。

5. 浏览器在代码中发现一个&lt;img&gt;标签引用了一张图片，向服务器发出请求。此时浏览器不会等到图片下载完，而是继续渲染后面的代码。

6. 服务器返回图片文件，由于图片占用了一定面积，影响了后面段落的排布，因此浏览器需要回过头来重新渲染这部分代码。

7. 浏览器发现了一个包含一行 Javascript 代码的&lt;script&gt;标签，赶快运行它。

8. Javascript 脚本执行了这条语句，它命令浏览器隐藏掉代码中的某个&lt;style&gt;（style.display=”none”）。杯具啊，突然就少了这么一个元素，浏览器不得不重新渲染这部分代码。

9. 终于等到了&lt;/html&gt;的到来，浏览器泪流满面……

10. 等等，还没完，用户点了一下界面中的“换肤”按钮，Javascript 让浏览器换了一下＜ link ＞标签的 CSS 路径。

11. 浏览器召集了在座的各位&lt;div&gt;&lt;span&gt;&lt;ul&gt;&lt;li&gt;们，“大伙儿收拾收拾行李，咱得重新来过……”，浏览器向服务器请求了新的 CSS 文件，重新渲染页面。

因此，一般情况下，css 放 head 标签里，js 引用放最后

**link 并不会阻塞 dom tree 的生成，但是会阻塞 paint（也有可能是 render tree）**,个人理解，应该是 link 阻止了 css tree,从而导致 paint 延迟

**script 标签肯定是会阻塞 dom 解析的，假如浏览器遇到它，会下载它并执行里面的内容，才去继续解析下面的 dom**，解决办法有两个，一是在 script 标签上加上 async,一是使用 createElement 动态创建 script
