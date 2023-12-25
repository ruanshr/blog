---
order: 4
---

# git 常见错误

### 1、`windows` 使用 `git` 时出现：`warning:LF will be replaced by CRLF`

`windows` 中的换行符为 `CRLF`， 而在`linux`下的换行符为`LF`，所以在执行`add .` 时出现提示，解决办法

```sh
$ rm -rf .git // 删除.git
$ git config --global core.autocrlf false //禁用自动转换
```

然后重新执行：

```sh
$ git init
$ git add .
```
