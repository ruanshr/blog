---
prev: /git/git-flow
next: /http/domain
---

# git 统计项目代码行数

```
git log --author="" --pretty=tformat: --numstat | awk '{ add += $1;subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'
```
