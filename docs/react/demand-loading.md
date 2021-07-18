# React 配置 antd 按需加載

### 安装依赖 react-app-rewired customize-cra babel-plugin-import

```

npm i react-app-rewired customize-cra -D

npm i babel-plugin-import -D

```

在根目录创建 config-overrides.js

```js
const path = require('path')
const { override, fixBabelImports } = require('customize-cra')

module.exports = {
  webpack: override(
    // 通过babel-plugin-import按需加载
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css'
    })
  )
}
```

### babel-plugin-import 配置中的 libraryName， style 属性

1、模块化导入 js 配置 { "libraryName": "antd" }

```js
// 代码这样写
import { Button } from 'antd'
ReactDOM.render(<Button>按钮</Button>)
// 转换后
var _button = require('antd/lib/button')
ReactDOM.render(<_button>按钮</_button>)
```

2、以模块化方式导入 js 和 CSS 配置 { "libraryName": "antd", style: "css" }

```js
// 代码这样写
import { Button } from 'antd'
ReactDOM.render(<Button>按钮</Button>)
// 转换后
var _button = require('antd/lib/button')
require('antd/lib/button/style/css')
ReactDOM.render(<_button>按钮</_button>)
```

3、模块化导入 js 和 css（LESS/Sass 源文件）配置 { "libraryName": "antd", style: true }

```js
// 代码这样写
import { Button } from 'antd'
ReactDOM.render(<Button>按钮</Button>)
// 转换后
var _button = require('antd/lib/button')
require('antd/lib/button/style')
ReactDOM.render(<_button>按钮</_button>)
```

4、其他模块导入，添加配置 libraryName

```js
// 代码写 import { Button } from "antd"

{
  "libraryName": "antd",
  "style": true,   // or 'css'
}
// 代码写 import { debounce } from "lodash"
{
  "libraryName": "lodash",
  "libraryDirectory": "",
  "camel2DashComponentName": false,  // default: true
}
// 代码写 import { Button } from "@material-ui/core"
{
  "libraryName": "@material-ui/core",
  "libraryDirectory": "components",  // default: lib
  "camel2DashComponentName": false,  // default: true
}

```
5、.babelrc文件配置
```
// .babelrc
"plugins": [
  ["import", { "libraryName": "antd", "libraryDirectory": "lib"}, "antd"],
  ["import", { "libraryName": "antd-mobile", "libraryDirectory": "lib"}, "antd-mobile"]
]
```

[传送门 ant-design-babel-plugin-import](https://github.com/ant-design/babel-plugin-import)

