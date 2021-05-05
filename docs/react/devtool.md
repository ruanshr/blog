# react-devtools 安装

有时候看网上各路大神，写如何安装 react-devtools，大神就是大神，好多步骤一笔带过，导致一些学习者看的一脸懵逼，今天我给大家讲超级简单的 react-devtools 安装步骤，相信看过的小伙伴儿不存在懵逼状态，那就开始吧！首先声明一下，必须安装 Node 哦，都准备学 react 了，node 都不叫事儿了吧，Let's go!

1.首先打开官网：https://github.com/facebook/react-devtools

进去 v3 分支，地址：https://github.com/facebook/react-devtools/tree/v3，直接download ZIP 格式

![devtools](../images/react/devtools.png)

2.知道下载位置，解压到自己可以找见的目录下，进入到 react-devtools-3 目录，cnpm i 一下安装一下依赖

3.再进入到 react-devtools-3/shells/chrome 切换到 chrome 目录下，运行 node build.js，当前目录下会生成 build 目录 这个 build 目录下的 unpacked 目录就是 chrome 中所需 react-devtools 的工具扩展程序包

4.打开谷歌浏览器，网址输入 chrome://extensions/，

![devtools](../images/react/devtools-1.png)

选择 react-detools-3 目录下的 shells->chrome 中 build 目录中的 unpacked 即可

到此 react-devtools 安装成功!

![devtools](../images/react/devtools-2.png)
