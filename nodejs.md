## 1. 为什么要学Node.js
* 基本的网页开发：前端（css/html/js），服务端(node.js/java/php等)，运维部署
* 作为前端开发，通过Node.js学习服务端，可以在js不用学习另一门新语言基础上，较容易上手
## 2、Node.js是什么
* 把Chrome的v8引擎（JavaScript引擎）移植出来，开发独立的JavaScript运行环境。代码只是特殊格式的字符串，JavaScript引擎可以去执行和解析
node.js的特性：事件驱动和非堵塞IO模型
* npm：世界上最大的开源生态系统，大多数js相关的包都放在npm上，方便开发人员下载
## 3、Node.js的JavaScript（没有DOM和BOM）
* ECMAScript: js基础语法
* 核心模块   
 > fs 文件操作模块 
 
 > http 网络服务构造模块 
 
 > OS 操作系统模块 
 
 > path 路径处理模块 
 
 > url 路径操作模块
 
* 等等
* 第三方模块
* 自定义模块
## 4. 模块系统
* node没有全局作用域。在Node.js中，通过require方法加载和执行多个JavaScript脚本文件。文件与文件之间由于是模块作用域，
即使加载执行多个文件，可以完全避免变量命名冲突污染。但是某些情况下，模块与模块是需要进行通信的，可通过require方法得

* 加载文件模块导出的接口对象。即：
> 模块作用域
> 通过require方法，加载文件模块和执行里面的代码
> 通过require方法，得加载文件模块导出的接口对象exports 

## 4.1 模块加载
```javascript

//  模块加载器
function loadModule(filename, module, require) {
	const wrappedSrc = `(function(module, exports, require) {
			${fs.readFileSync(filename, 'utf8')}
		})(module, module.exports, require);`;
	eval(wrappedSrc);
}



// 定义require函数
const require = (moduleName) => {
	const id = require.resolve(moduleName);
	if(require.cache[id]){
		return require.cache[id].exports
	}
	const module = {
		exports: {},
		id:id
	}
	require.cache[id] = module;
	loadModule(id, module, require);
	return module.exports;
}

// 加载缓存
require.cache = {}

// 解析模块名称，返回模块id
require.resolve = (moduleName) => {
	//resolve moduleName
}

```
## 4.2 require的加载规则
* 即根据模块标识来加载即：require（'模块标识符'）

* 1、自己写的模块
> 路径形式的模块：1./ 当前目录，不可省略 , 2../ 上一级目录，不可省略 3.js 后缀名可以省略

> var b = require('./foo.js')

> var b = require('./foo')

* 2、核心模块
> 核心模块的本质也是文件,已经被编译到了二进制文件中(下载后，编译在node.exe)，我们只需要按照名字来加载就可以了

> var http = require('http')

> var fs = require('fs')

* 3、第三方模块
> 凡是第三方模块都必须通过 npm 来下载

> 使用的时候就可以通过 require('包名') 的方式来进行加载才可以使用
> 如：
```javascript
var vue = require('vue')
   //  整个加载过程中：
   //  先找到当前文件所处目录中的 node_modules 目录
   //  node_modules/vue
   //  node_modules/vue/
   //  node_modules/vue/package.json
   //  node_modules/vue/package.json 文件中的 main 属性
   //  main 属性中就记录了 vue 的入口模块
   //  如果 package.json文件不存在或者main指定的入口模块是也没有，自动找该目录下的 index.js，index.js
   //  是作为一个默认备选项
   //  如果以上所有任何一个条件都不成立，进入上一级目录找 node_modules
   //  按照这个规则依次往上找，直到磁盘根目录还找不到，最后报错：Can not find moudle xxx
   //  一个项目有且仅有一个 node_modules 而且是存放到项目的根目录
   //  - 优先从缓存加载：再次加载某个模块，不会执行里面的代码，但可以从缓存中拿到其中的接口对象，
   //  这样可以避免重复加载，提高模块加载效率
```


## 5. Node.js中其他成员
* 在每一个模块中，除了require、exports等模块相关的API外，还有两个特殊成员

>  __dirname 动态获取当前文件模块所属目录的绝对路径

> __filename 动态获取当前文件的绝对路径

* 在文件操作中，相对路径是是不可靠的，因为在node文件操作路径被设计为相对于执行 node 命令所处的终端路径，所以在文件操作中的相对路径都统一转为 动态的绝对路径
在拼接过程中，为了避免手动拼接带来的低价错误，使用path.join(__dirname, './a.txt')来辅助拼接

* 补充：模块中的路径标识和这里的路径无关


## 6、node Debugger
### 6.1 chrome 调试
chrome地址栏输入：chrome://inspect/#devices
点击 Open dedicated DevTools for Node
在需要打断点的地方加入debugger
控制台输入 node --inspect-brk ./index.js
node --inspect-brk (any your file path) 此命令也可以调试其他nodeJs应用

### 6.2  vscode 调试 node
   左边菜单栏打开调试面板（ctrl + shift + D）

   点击配置（开始调试三角形旁边的齿轮）

  选择 node （生成 .vscode 和 launch.js）

   参考链接  https://code.visualstudio.com/docs/editor/debugging#_launch-configurations
   
 ```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "startWebpack",
            "program": "${workspaceFolder}\\node_modules\\webpack\\bin\\webpack.js",
            "args": ["--inline","--progress"],
            "cwd": "${workspaceFolder}",
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
        }
    ]
}

 ```
