# Vue 开发的 36 个技巧

Vue 3.x 的 Pre-Alpha 版本。后面应该还会有 Alpha、Beta 等版本,预计至少要等到 2020 年第一季度才有可能发布 3.0 正式版
所以应该趁还没出来加紧打好 Vue2.x 的基础;

## 1、require.context()

1.场景:如页面需要导入多个组件,原始写法:

```js
import titleCom from '@/components/home/titleCom'
import bannerCom from '@/components/home/bannerCom'
import cellCom from '@/components/home/cellCom'
components: {
  titleCom, bannerCom, cellCom
}
```

2.这样就写了大量重复的代码,利用 require.context 可以写成

```js
const path = require('path')
const files = require.context('@/components/home', false, /\.vue$/)
const modules = {}
files.keys().forEach(key => {
  const name = path.basename(key, '.vue')
  modules[name] = files(key).default || files(key)
})

components: modules
```

这样不管页面引入多少组件,都可以使用这个方法

3.API 方法

实际上是 webpack 的方法,vue 工程一般基于 webpack,所以可以使用
require.context(directory,useSubdirectories,regExp)
接收三个参数:
directory：说明需要检索的目录
useSubdirectories：是否检索子目录
regExp: 匹配文件的正则表达式,一般是文件名
