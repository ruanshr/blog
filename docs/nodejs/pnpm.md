# pnpm

**1. pnpm介绍**

pnpm 官网 [https://pnpm.io/zh/motivation](https://pnpm.io/zh/motivation)

pnpm 含义为performant npm，意指： 高性能的npm

**2. pnpm 安装**

全局安装 pnpm 

```sh 

npm i pnpm -g

```

查看pnpm版本

```sh 

pnpm -v

pnpm --version

```

**3. pnpm使用**

创建 package.json 文件

```sh 

pnpm init

pnpm init --yes

```

安装项目的所有依赖项

```sh

pnpm install

```

安装依赖

```sh

pnpm add <package>

pnpm add <package> --save

pnpm add <package> --save-dev

```

移除依赖

```sh
# 移除当前项目包
pnpm remove <package>
# 移除全局的依赖包
pnpm remove <package> --global

```

运行脚本

```sh 

pnpm run <command>

```

**4. pnpm简写**

pnpm 命令及其参数的简写同npm完全一致，下面列举最常见的一些用法

```sh
# 安装项目的所有依赖
pnpm i
# 安装运行时依赖
pnpm i <package> -S
# 安装开发时依赖
pnpm i <package> -D

```