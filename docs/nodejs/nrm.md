# npm 切换下载安装包的仓库

### 直接使用npm命令切换

1、设置使用淘宝镜像

```

npm config set registry + 需要切换的仓库地址

npm config set registry https://registry.npm.taobao.org

```


2、查看当前资源，看是否切换成功，成功后可直接使用cnpm命令

```

npm config get registry

```

3、还原npm仓库

```
npm config set registory https://registry.npmjs.org

```

### 使用nrm快捷切换npm默认仓库

1、安装

```
# 安装nrm
npm i -g nrm
 
# 列出所有npm源
nrm ls

```

```
$ nrm ls

  npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
* taobao ----- https://registry.npm.taobao.org/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/

```

前面有*的代表当前使用的仓库。

2、切到npm，使用nrm use npm

```js

$ nrm use npm

　　Registry has been set to: https://registry.npmjs.org/

```

3、测试所有仓库响应的时间

```
$ nrm test

* npm ---- 1130ms
  yarn --- 2339ms
  cnpm --- 1986ms
  taobao - 704ms
  nj ----- Fetch Error
  npmMirror  9314ms
  edunpm - Fetch Error
  
  ```