## npm命令
### 1， 安装命令
```
 // 全局安装
 npm install 模块名 -g
 // 本地安装
 npm install 模块名
 // 一次性安装多个
 npm install 模块1 模块2 模块3 
 // 安装开发时依赖包
 npm install 模块名 --save-dev
 // 安装运行时依赖包
 npm install 模块名 --save
 
```
### 2， 查看安装的目录
```
 // 查看项目中模块所在的目录
 npm root
 // 查看全局安装的模块所在目录
 npm root -g
 
```
### 3， 查看npm的所有命令命令
```
npm help

```
### 4，查看某个包的各种属性
```
// 查看某个包对于各种包的依赖关系
 npm view 模块名 dependencies
 
```
### 5，查看包的源文件地址
```
 // 查看包的源文件地址
 npm view 模块名 repository.url
 
```
### 6，查看当前模块依赖的node最低版本号
```
npm view 模块名 engines

```
### 7，查看模块的当前版本号
```
 npm view 模块名 version
 // 需要注意的是查看到的模块版本是该模块再远程仓库的版本号，并不是当前项目中所依赖的版本号。
 // 查看当前项目中应用的某个模块的版本号的命令为
 npm list 模块名 version
 
```
### 8，查看模块的历史版本和当前版本
```
npm view 模块名 versions

```
### 9，查看一个模块的所有信息
```
npm view 模块名

```
### 10，查看npm使用的所有文件夹
```
 npm help folders
 
```
### 11，用于更改包内容后进行重建
```
 npm rebuild 模块名
 
```
### 12，检查包是否已经过时
```
 // 此命令会列出所有已经过时的包，可以及时进行包的更新
 npm outdated

```
### 13，更新node模块
```
 npm update 模块名
 // 当然你也可以update 该模块到指定版本
 npm update 模块名 @版本号
 // 如果安装到最新版本可以使用以下命令
 npm install 模块名@latest 
 // 如果当前的版本号为2.5.1，是没办法进行npm update 模块名 @2.3.1 将模块版本号变为2.3.1的，
 // 当然，你可以先uninstall，然后进行install @2.3.1

```
### 14，卸载node模块
```
npm uninstall 模块名

```
### 15，访问package.json的字段文档
```
npm help json

```
### 16，发布一个npm包的时候，需要检验某个包名是否已经存在
```
npm search 模块名

```
### 17，npm init：引导你创建一个package.json文件，包括名称、版本、作者这些信息
```
npm init -y

```
### 18，npm -v 查看npm的版本

### 19，查看某个模块的bugs列表界面（issue）
```
  npm bugs 模块名
  // 例如运行npm bugs vue则会打开vue仓库的issue

```
### 20，打开某个模块的仓库界面
```
 npm repo 模块名
 // 例如运行npm repo vue则会打开vue线上仓库

```
### 21，打开某个模块的文档
```
 npm docs 模块名
 // 例如运行npm docs vue则会打开vue的readme.md文档

```
### 22，打开某个模块的主页
```
  npm home 模块名
 // 例如运行npm home vue则会打开vue模块的主页
 
```
### 23，查看当前已经安装的模块
 ```
 npm list
 // 当然我们也可以限制输入的模块层级，例如
 npm list --depth=0
 
 
 ```

## 版本控制
我们使用node开发时，经常需要依赖一些模块，我们进行了下载之后，便一直在该版本的模块环境下进行开发，但是线上的服务器一般都是根据依赖来配置文件，重新下载各个模块，
但是保不齐某个模块的版本已经更新了，这时线上的包会更新到最新的版本，但你的代码还是依据老版本来写的，这时可能会产生一些不知名的Bug,

首先看npm包的版本号的格式X.Y.Z,版本好的格式遵循semver 2.0规范，其中X为主版本号，只有更新了不向下兼容的API时进行修改主版本号，Y为次版本号，当模块增加了向下兼容的功能时进行修改，Z为修订版本号，当模块进行了向下兼容的bug修改后进行修改,这就是“语义化的版本控制”。
