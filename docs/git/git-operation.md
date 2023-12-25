---
order: 3
---

# git 项目分支 build

### 以下为切换本地分支脚本

```sh

git fetch && git stash && git clean -f

git checkout $1

git branch -D $1

git checkout -b $2 origin/$2

git pull

git status

```

```sh

echo "---------------- change branch -----------"

cd ../xxx

sh ../shell/doGit.sh dev $targetBranch

yarn && yarn build

echo "--------------------done ---------------------"

```
