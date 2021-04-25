# link



如果我们 import 的时候添加 webpackPrefetch:
```js
const { default: _ } = await import(/* webpackChunkName: "lodash" */ /* webpackPrefetch: true */ 'lodash');
```
就会以&lt;link rel="prefetch" as="script"&gt;的形式预拉取 lodash 代码

这个异步加载的代码不需要手动点击 button 触发，webpack 会在父 chunk 完成加载后，闲时加载 lodash 文件。

webpackPreload 是预加载当前导航下可能需要的资源，他和 webpackPrefetch 的主要区别是：

1、preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。

2、preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。

3、 preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。

一句话总结：

webpackChunkName 是为预加载的文件取别名，webpackPrefetch 会在浏览器闲置下载文件，webpackPreload 会在父 chunk 加载时并行下载文件