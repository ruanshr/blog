# nvm安装及使用

在我们的日常开发中经常会遇到这种情况：手上有好几个项目，每个项目的需求不同，进而不同项目必须依赖不同版的 NodeJS 运行环境。如果没有一个合适的工具，这个问题将非常棘手

**1、 卸载本地的node版本**


**2、 nvm 下载**

[nvm-setup](https://github.com/coreybutler/nvm-windows/releases) 

找到nvm-setup.exe 或者 nvm-setup.zip下载

**3、 nvm 安装**

点击下载安装包，选择nvm的安装目录（不能选有空格的文件夹，例如：Program Files） 选择 symlink路径 (建议在安装目录下增加 nodejs)
例如nvm的安装目录是 D:/Program/nvm 那么 symlink的目录是 D:/Program/nvm/nodejs

**4、nvm 命令**

查看nvm 版面

```sh
nvm -v
```

安装 node版本

```sh
# nvm install node版本
nvm install 14.18.0

```

离线安装node版本

[v14.18.0](https://nodejs.org/download/release/v14.18.0/) （可以通过改变url上的版本号获取对应的版本）

找到 XXX.win-x64.zip

下载解压到 D:/Program/nvm/v14.18.0目录下

切换版本

```sh

nvm use 14.18.0
## 执行后会在 D:/Program/nvm 下增加 nodejs软链接连接v14.18.0目录

```

**5、项目node版本**

不同项目需要切换不同的node版本
可以通过在项目目录下加.npmrc文件，然后在项目中执行 **nvm use** 即可

```
v16

```

**Q&A**

1、安装后 npm执行提示错误

检查当前版本的是否有npm，如果没有则需要离线安装该版本





