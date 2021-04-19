---
prev: /javascript-extend/history
next: /javascript-extend/html5
---

# HTML页面加载和解析流程 

1. 用户输入网址（假设是个html页面，并且是第一次访问），浏览器向服务器发出请求，服务器返回html文件。 

2. 浏览器开始载入html代码，发现&lt;head&gt;标签内有一个&lt;link&gt;标签引用外部CSS文件。 

3. 浏览器又发出CSS文件的请求，服务器返回这个CSS文件。 

4. 浏览器继续载入html中&lt;body&gt;部分的代码，并且CSS文件已经拿到手了，可以开始渲染页面了。 

5. 浏览器在代码中发现一个&lt;img&gt;标签引用了一张图片，向服务器发出请求。此时浏览器不会等到图片下载完，而是继续渲染后面的代码。 

6. 服务器返回图片文件，由于图片占用了一定面积，影响了后面段落的排布，因此浏览器需要回过头来重新渲染这部分代码。 

7. 浏览器发现了一个包含一行Javascript代码的&lt;script&gt;标签，赶快运行它。 

8. Javascript脚本执行了这条语句，它命令浏览器隐藏掉代码中的某个&lt;style&gt;（style.display=”none”）。杯具啊，突然就少了这么一个元素，浏览器不得不重新渲染这部分代码。 

9. 终于等到了&lt;/html&gt;的到来，浏览器泪流满面…… 

10. 等等，还没完，用户点了一下界面中的“换肤”按钮，Javascript让浏览器换了一下＜link＞标签的CSS路径。 

11. 浏览器召集了在座的各位&lt;div&gt;&lt;span&gt;&lt;ul&gt;&lt;li&gt;们，“大伙儿收拾收拾行李，咱得重新来过……”，浏览器向服务器请求了新的CSS文件，重新渲染页面。

因此，一般情况下，css放head标签里，js引用放最后

**link并不会阻塞dom tree的生成，但是会阻塞paint（也有可能是render tree）**,个人理解，应该是link阻止了css tree,从而导致paint延迟

**script标签肯定是会阻塞dom解析的，假如浏览器遇到它，会下载它并执行里面的内容，才去继续解析下面的dom**，解决办法有两个，一是在script标签上加上async,一是使用createElement动态创建script