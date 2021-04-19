---
prev: /javascript-extend/waterfall
next: /nodejs/gulp-plugin
---

# 使用 cnpm 搭建企业内部私有 NPM 仓库

cnpm 是企业内部搭建 npm 镜像和私有 npm 仓库的开源方案。它同时解决了现有 npm 架构的一些问题。

### 为什么企业需要私有 NPM

主要有如下理由：

- 确保 npm 服务快速、稳定：对于企业来说，上线生产系统的时候，需要花半小时甚至更久等待 npm 模块依赖安装完毕，是不可接受的。部署镜像后，可以确保高速、稳定的 npm 服务。

- 发布私有模块：官方的 npm 上的模块全部是开源的。一些与企业业务逻辑相关的模块可能不适合开源。这部分私有的模块放在私有 NPM 仓库中，使用起来各种方便。

- 控制 npm 模块质量和安全：npm 上的模块质量参差不齐，搭建私有仓库，可以更严格地控制模块的质量和安全，只有经过审核的模块才允许被加入私有仓库。

### cnpm 的特点

- 压缩包等文件从数据库中分离，放在 CDN 上，减轻了数据库的压力，提高了访问速度。

- 使用 MySQL 替换了 CouchDB，更容易部署。同时由于大部分开发者更熟悉 MySQL，因此架设起来更方便。

- CDN 和 MySQL 都可以方便地扩展。

### 5 分钟部署

部署 cnpm 只需 5 分钟。

#### 依赖

- Node
- MySQL
- Redis
- qiniu CND (或其他 CDN)

#### 部署过程

获取代码

```
# https://github.com/cnpm/cnpmjs.org.git

git clone git://github.com/fengmk2/cnpmjs.org.git $HOME/cnpmjs.org
cd $HOME/cnpmjs.org
```

### 创建 MySQL 表

```
; mysql -u yourname -p
mysql> use cnpmjs;
mysql> source docs/db.sql
```

然后编写配置文件 config/config.js：

```js
module.exports = {
  debug: false,
  enableCluster: true, // enable cluster mode
  mysqlServers: [
    {
      host: 'localhost',
      port: 3306,
      user: 'cnpmjs',
      password: 'cnpmjs123'
    }
  ],
  mysqlDatabase: 'cnpmjstest',
  redis: {
    host: 'localhost',
    port: 6379
  },
  nfs: null, //use your own CND here
  enablePrivate: true, // enable private mode, only admin can publish, other use just can sync package from source npm
  admins: {
    admin: 'admin@cnpmjs.org'
  },
  syncModel: 'exist'
}
```

安装依赖

```
make install
```

启动

```
; npm run start

Starting cnpmjs.org ...
Start nodejs success. PID=27175
```

好了，部署完成！

客户端设置
服务跑起来之后，企业员工需要在自己的电脑上配置下客户端。

首先安装 cnpm 客户端：
``
npm install -g cnpm

```
在自己的脚本的启动文件（例如.zshrc 或.bashrc)中添加别名:

```

echo "#lnpm alias\nalias lnpm='cnpm --registry=http://localhost:7001\
 --registryweb=http://localhost:7002\
 --cache=$HOME/.npm/.cache/lnpm\
 --userconfig=$HOME/.lnpmrc'" >> $HOME/.zshrc && source $HOME/.zshrc

```
注意用自己的仓库信息替换上面命令的相关部分。

之后就可以用 lnpm 命令访问企业的内部 NPM 了，各种接口和 NPM 一样。

注意，目前 cnpm 的权限控制比较简单，只有 admin 用户有权 publishNPM 模块。如果你的企业需要灵活的权限控制，需要自行开发。

```
