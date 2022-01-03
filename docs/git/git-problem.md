---
prev: /git/git-operation
next: /git/git-summary
---

# git常见错误


### 1、windows使用git时出现：warning:LF will be replaced by CRLF

windows中的换行符为 CRLF， 而在linux下的换行符为LF，所以在执行add . 时出现提示，解决办法

```js
$ rm -rf .git // 删除.git
$ git config --global core.autocrlf false //禁用自动转换
```

然后重新执行：

```
$ git init
$ git add .
```