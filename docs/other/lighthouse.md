# Lighthouse

Lighthouse 前端性能优化测试工具

在前端开发中，对于自己开发的 app 或者 web page 性能的好坏，一直是让前端开发很在意的话题。我们需要专业的网站测试工具，让我们知道自己的网页还有哪些需要更为优化的方面，我自己尝试了一款工具：Lighthouse，感觉还不错，记录下来，也顺便分享给用得着的伙伴。

Lighthouse 分析 web 应用程序和 web 页面，收集关于开发人员最佳实践的现代性能指标和见解，让开发人员根据生成的评估页面，来进行网站优化和完善，提高用户体验。

### 1、在 chrome 开发者工具中使用 lighthouse

Lighthouse 是直接集成到 chrome 开发者工具中的，位于‘Audits’面板下。

首先，你得下载安装 了 chrome 浏览器，相信每个做开发的人员都应该拥有 chrome 浏览器。

其次，在 chrome 浏览器中打开你需要测试的网站，按 f12 进入开发者调试模式，点击‘Audits’选项，看到如下界面：

然后点击“Run audits”，之后就是等待生成评估界面。


<!-- ![lighthouse](../images/section/lighthouse_1.png) -->

### 2、使用 Node Cli

lighthouse 依赖 node 8 或者更高的 node 版本

首先全局安装 lighthouse:

```
npm install -g lighthouse
# or use yarn:
# yarn global add lighthouse

```

然后在终端输入命令，我使用的是百度首页地址

```
$ lighthouse https://www.baidu.com
```

然后会生成一个评估的 html 页面，直接在浏览器中打开进行查看即可。

在这里面你可以看到它给你各个方面的建议，比如图片、css、js 这些文件的处理，还有 html 里面标签的使用，缓存处理等建议，可以根据这些来对网站进行优化。

<!-- ![lighthouse](../images/section/lighthouse_report.png) -->

### 3、附上 Lighthouse 的 git 地址，更为详细的内容，可以去参考 git：https://github.com/GoogleChrome/lighthouse
