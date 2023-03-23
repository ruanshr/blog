# yarn

### 什么是registry

registry是 模块仓库提供了一个查询服务，也就是我们常说的源。以yarn官方镜像源为例，它的查询服务网址是**https://registry.yarnpkg.com**。
这个网址后面跟上模块名，就会得到一个 JSON 对象，里面是该模块所有版本的信息。比如，访问 https://registry.npmjs.org/vue，就会看到 vue 模块所有版本的信息。
registry 网址的模块名后面，还可以跟上版本号或者标签，用来查询某个具体版本的信息。
https://registry.yarnpkg.com/vue/2.6.10


上面返回的 JSON 对象里面，有一个dist.tarball属性，是该版本压缩包的网址。dist.shasum 属性相当于hash值，在lock和缓存时会使用到，下文会提到。
dist: {
  "shasum": "a72b1a42a4d82a721ea438d1b6bf55e66195c637",
  "tarball":"https://registry.npmjs.org/vue/-/vue-2.6.10.tgz"
},
复制代码我们在执行 yarn install 时，就是向 registry 查询得到上面的压缩包地址进行下载的。
工作中，我们可能有需要修改镜像源的场景，比如修改成淘宝源或者自己公司的私有源。
查看和设置源，可以通过 yarn config 命令来完成
查看当前使用的镜像源
```sh
yarn config get registry
```
修改镜像源（以修改成淘宝源为例）
```sh
yarn config set registry https://registry.npm.taobao.org/
```
依赖版本
yarn的包遵守 semver，即语义化版本。
SemVer 是一套语义化版本控制的约定，定义的格式为
X.Y.Z（主版本号.次版本号.修订号）：
X.主版本号：进行不向下兼容的修改时，递增主版本号
Y.次版本号: 做了向下兼容的新增功能或修改
Z.修订号：做了向下兼容的问题修复
复制代码yarn 中依赖版本范围的表示方法有以下几种：

通过比较器




表示
含义描述


```

<2.0.0
任何小于 2.0.0 的版本


<=3.1.4
任何小于或等于 3.1.4 的版本


>0.4.2
任何大于 0.4.2 的版本


>=2.7.1
任何大于或等于 2.7.1 的版本


=4.6.6
任何等于 4.6.6 的版本


>=2.0.0 <3.1.4
交集，大于或等于 2.0.0 并小于 3.1.4


<2.0.0 || >3.1.4
并集 小于 2.0.0 或者大于 3.1.4

```

如果没有指定运算符，默认为 =

通过连字符




表示
含义描述


```

2.0.0 - 3.1.4
>=2.0.0 <=3.1.4


0.4 - 2
>=0.4.0 <=2.0.0

```

版本号中缺少的那些部分会用数字 0 填充。

X范围
字符 X、x 或者 * 都可以作为通配符，用于填充部分或全部版本号。
被省略的那部分版本号默认为 x 范围。




表示
含义描述


```

*
>=0.0.0 (任意版本)


2.x
>=2.0.0 <3.0.0（匹配主要版本）


3.1.x
> = 3.1.0 < 3.2.0（匹配主要和次要版本）


``（空字符串）
* 或 > = 0.0.0


2
2.x.x 或 > = 2.0.0 < 3.0.0


3.1
3.1.x 或 > = 3.1.0 < 3.2.0




～ 字符范围
同时使用字符 ~ 和次版本号，表明允许 修订号 变更。同时使用字符 ~ 和主版本号，表明允许 次版本 号变更。




表示
含义描述




~3.1.4
>=3.1.4 <3.2.0


~3.1
3.1.x 或 > = 3.1.0 < 3.2.0


~3
3.x 或 > = 3.0.0 < 4.0.0




^ 字符范围
字符 ^ 表明不会修改版本号中的第一个非零数字，3.1.4 里的 3 或者 0.4.2 里的 4。版本号中缺少的部分将被 0 填充，且在匹配时这些位置允许改变。




表示
含义描述




^3.1.4
>=3.1.4 <4.0.0


^0.4.2
>=0.4.2 <0.5.0


^0.0.2
>=0.0.2 <0.0.3

```

使用 **yarn add [package-name]** 命令安装依赖，默认使用的是 ^ 范围。
需要注意的是，如果一个比较器包含有预发布标签的版本，它将只匹配有相同 major.minor.patch 的版本。
例如 >=3.1.4-beta.2，可以匹配 3.1.4-beta.3，但不会匹配 3.1.5-beta.3 版本。
依赖类型
dependences 代码运行时所需要的依赖，比如vue，vue-router。
devDependences 开发依赖，就是那些只在开发过程中需要，而运行时不需要的依赖，比如babel，webpack。
peerDependences 同伴依赖，它用来告知宿主环境需要什么依赖以及依赖的版本范围。
如果宿主环境没有对应版本的依赖，在安装依赖时会报出警告。
比如包 eslint-plugin-import 中有依赖：
```json
 "peerDependencies": {
    "eslint": "2.x - 5.x"
  },
```
在install时，如果宿主环境没有 2.x-5.x 版本的 eslint,cli就会抛出警告。但不会自动帮我们安装，仍然需要手动安装。

optionalDependencies 可选依赖，这种依赖即便安装失败，Yarn也会认为整个依赖安装过程是成功的。
可选依赖适用于那些即便没有成功安装可选依赖，也有后备方案的情况。
bundledDependencies 打包依赖，在发布包时，这个数组里的包都会被打包打包到最终的发布包里，需要注意 bundledDependencies 中的包必须是在devDependencies或dependencies声明过的。
缓存
yarn 会将安装过的包缓存下来，这样再次安装相同包的时候，就不需要再去下载，而是直接从缓存文件中直接copy进来。
可以通过命令 yarn cache dir 查看yarn的全局缓存目录。我的缓存目录在 /Library/Caches/Yarn/v1 下。

可以看出，yarn 会将不通版本解压后的包存放在不同目录下，目录以
```sh 
npm-[package name]-[version]-[shasum]` 
```
复制代码来命名。shasum 即上文中 registry 获取的 dist.shasum。
我们可以通过命令查看已经缓存过的包。
yarn cache list    列出已缓存的每个包

yarn cache list --pattern &lt;pattern&gt;  列出匹配指定模式的已缓存的包
复制代码例如执行 yarn cache list --pattern vue

yarn.lock
yarn.lock 中会准确的存储每个依赖的具体版本信息，以保证在不同机器安装可以得到相同的结果。

下面以@babel/code-frame为例，看看yarn.lock 中会记录哪些信息。

第一行 "@babel/code-frame@7.0.0-beta.54"
包的name和语义化版本号，这些都来自package.json中的定义。
version 字段，记录的是一个确切的版本。
resolved 字段记录的是包的URL地址。其中hash值，即上文的 dist.shasum。
dependencies 字段记录的是当前包的依赖，即当前包在 package.json 的 dependencies 字段中的所有依赖。

Yarn 在安装期间，只会使用当前项目的 yarn.lock 文件（即 顶级 yarn.lock 文件），会忽略任何依赖里面的 yarn.lock 文件。在顶级 yarn.lock 中包含需要锁定的整个依赖树里全部包版本的所有信息。
yarn.lock文件是在安装期间，由 Yarn 自动生成的，并且由yarn来管理，不应该手动去更改，更不应该删除yarn.lock文件，且要提交到版本控制系统中，以免因为不同机器安装的包版本不一致引发问题。
Yarn install过程
首次执行 yarn install 安装，会按照 package.json 中的语义化版本，去向 registry 进行查询，并获取到符合版本规则的最新的依赖包进行下载，并构建构建依赖关系树。 比如在 package.json 中指定 vue 的版本为 ^2.0.0，就会获取符合 2.x.x
的最高版本的包。然后自动生成 yarn.lock 文件，并生成缓存。
之后再执行 yarn install，会对比 package.json 中依赖版本范围和 yarn.lock 中版本号是否匹配。

版本号匹配，会根据 yarn.lock 中的 resolved 字段去查看缓存， 如果有缓存，直接copy，没有缓存则按照 resolved 字段的url去下载包。
版本号不匹配，根据 package.json 中的版本范围去 registry 查询，下载符合版本规则最新的包，并更新至 yarn.lock 中。

模块扁平化
上面提到，在安装依赖时，会解析依赖构建出依赖关系树。
比如我项目的首层依赖(即当前项目的dependence和devDependences中的依赖，不包括依赖的依赖)中有A，B，C三个包，A 和 B包同时依赖了相同版本范围的D包。那么这部分的依赖关系树是这样的：
├── A    				
│ └── D    
├── B    				
│ └── D  
├── C 
复制代码如果按照这样的依赖关系树直接安装的话，D模块会在A包和B包的 node_modules中都安装，这样会导致模块冗余。
为了保证依赖关系树中没有大量重复模块，yarn在安装时会做dedupe（去重）操作，它会遍历所有节点，逐个将模块放在根节点下面，也就是当前项目的 node-modules 中。当发现有相同的模块时，会判断当前模块指定的 semver 版本范围是否交集，如果有，则只保留兼容版本，如果没有则在当前的包的 node-modules 下安装。
所以上面的说的情况，最终安装完成是下面这样的，A，B，C，D包都会安装在第一层 node-modules 下。
├── A    				
├── B    				
├── C 
├── D
复制代码如果A包和B包依赖的是不兼容的版本，假设A包依赖的是D@1版本的包，B包依赖的是D@2版本。则最终安装的结果如下：
├── A    				
├── B    
│ └── D@2 
├── C 
├── D@1
复制代码当代码中 require 或 import 某个模块时，会从当前 package 的 node-modules 里中开始找，找不到就到当前package的上一层 node-modules 里找，这样一直找到全局的node_modules。
所以上面的安装的树结构，可以保证每个 package 都能获取到所需要版本的包。
常用的yarn命令

yarn install 安装依赖

yarn install / yarn  在本地 node_modules 目录安装 package.json 里列出的所有依赖
yarn install --force 重新拉取所有包，即使之前已经安装的（所以以后别在删除node-modules了...）
yarn install --modules-folder &lt;path&gt; 为 node_modules 目录指定另一位置，代替默认的 ./node_modules
yarn install --no-lockfile 不读取或生成 yarn.lock 文件
yarn install --production[=true|false] / --production / --prod 只安装 dependence下的包，不安装 devDependencies 的包

```

```
yarn add

yarn add package-name 会安装 latest 最新版本。
yarn add &lt;package...&gt;  安装包到dependencies中
yarn add &lt;package...&gt; [--dev/-D]  用 --dev 或 -D 安装包到 devDependencies
yarn add &lt;package...&gt; [--peer/-P]  用 --peer 或者 -P 安装包到 peerDependencies
yarn add &lt;package...&gt; [--optional/-O] 用 --optional 或者 -O 安装包到 optionalDependencies 
yarn add &lt;package...&gt; [--exact/-E] 用 --exact 或者 -E 会安装包的精确版本。默认是安装包的主要版本里的最新版本。 比如说， yarn add foo@1.2.3 会接受 1.9.1 版，但是 yarn add foo@1.2.3 --exact 只会接受 1.2.3 版。
yarn add <package...> [--tilde/-T]  用 --tilde 或者 -T 来安装包的次要版本里的最新版。 默认是安装包的主要版本里的最新版本。 比如说，yarn add foo@1.2.3 --tilde 会接受 1.2.9，但不接受 1.3.0。
```

yarn config 管理配置文件

```sh
yarn config get &lt;key&gt; 查看配置key的值
yarn config list 查看当前的配置
yarn config delete &lt;key&gt; 从配置中删除配置key
yarn config set &lt;key&gt; &lt;value&gt; [-g|--global] 设置配置项 key 的值为 value

```

其他常用命令
```
yarn list 查询当前工作文件夹所有的依赖
yarn info <package> [<field>]  查看包信息，可以查看特定
yarn remove <package...>  从依赖里移除名包，同时更新你 package.json 和 yarn.lock 文件。
yarn <script> [<args>] 执行用户自定义的脚本

```
详细日志模式
运行yarn命令时，增加参数 --verbose，这对排查错误时很有帮助
```sh
yarn <command> --verbose
```

```sh

yarn config set cache-folder

```