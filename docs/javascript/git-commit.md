# GIT 命令及版本管理

### 命令

**分支**

```
git branch 创建分支

git branch 查看分支列表
git branch -v 查看所有分支的最后一次操作
git branch -vv 查看当前分支
git brabch -b 分支名 origin/分支名 创建远程分支到本地
git branch --merged 查看别的分支和当前分支合并过的分支
git branch --no-merged 查看未与当前分支合并的分支
git branch -d 分支名 删除本地分支
git branch -D 分支名 强行删除分支

git checkout -b 创建并切换到新建的分支上
git checkout 切换分支

git branch origin :分支名 删除远处仓库分支
git merge 分支名 合并分支到当前分支上

```

**暂存**

```
git stash 暂存当前修改
git stash pop 恢复暂存并删除暂存记录
git stash apply 恢复最近的一次暂存
git stash list 查看暂存列表
git stash drop 暂存名(例：stash@{0}) 移除某次暂存
git stash clear 清除暂存

```

**回退**

```
git reset --hard HEAD^ 回退到上一个版本
git reset --hard ahdhs1(commit_id) 回退到某个版本
git checkout -- file撤销修改的文件(如果文件加入到了暂存区，则回退到暂存区的，如果文件加入到了版本库，则还原至加入版本库之后的状态)
git reset HEAD file 撤回暂存区的文件修改到工作区

```

**标签**

```
git tag 标签名 添加标签(默认对当前版本)
git tag 标签名 commit_id 对某一提交记录打标签
git tag -a 标签名 -m '描述' 创建新标签并增加备注
git tag 列出所有标签列表
git tag -d 标签名 删除本地标签

git show 标签名 查看标签信息
git push origin 标签名 推送标签到远程仓库
git push origin --tags 推送所有标签到远程仓库
git push origin :refs/tags/标签名 从远程仓库中删除标签

```

**其他操作**

```
git push origin test 推送本地分支到远程仓库
git rm -r --cached 文件/文件夹名字 取消文件被版本控制
git reflog 获取执行过的命令
git log --graph 查看分支合并图
git merge --no-ff -m '合并描述' 分支名 不使用Fast forward方式合并，采用这种方式合并可以看到合并记录
git check-ignore -v 文件名 查看忽略规则
git add -f 文件名 强制将文件提交
git reflog 打印所有的日志,假如：ABC三个节点，回退到B后，仍旧打印所有日志
```

**创建仓库**

```
git init 初始化
git remote add origin url 关联远程仓库
git pull
git fetch 获取远程仓库中所有的分支到本地
```

**忽略已加入到版本库中的文件**

```
git update-index --assume-unchanged file 忽略单个文件
git rm -r --cached 文件/文件夹名字 (. 忽略全部文件)
```

**取消忽略文件**

```
git update-index --no-assume-unchanged file
```

**拉取、上传免密码**

```
git config --global credential.helper store
```

### 版本管理

**GitFlow** git 的一个操作流程标准。包含如下几个关键分支：

1. master：主分支 develop：主开发分支，包含确定即将发布的代码；

2. feature：新功能分支，一般一个新功能对应一个分支，对于功能的拆分需要比较合理，以避免一些后面不必要的代码冲突；

3. release：发布分支，发布时候用的分支，一般测试时候发现的 bug 在这个分支进行修复；

4. hotfix：热修复分支，紧急修 bug 的时候用。

**GitFlow** 的优势有如下几点：

1. 并行开发：GitFlow 可以很方便的实现并行开发。每个新功能都会建立一个新的 feature 分支，从而和已经完成的功能隔离开来，而且只有在新功能完成开发的情况下，其对应的 feature 分支才会合并到主开发分支上（也就是我们经常说的 develop 分支）。另外，如果你正在开发某个功能，同时又有一个新的功能需要开发，你只需要提交当前 feature 的代码，然后创建另外一个 feature 分支并完成新功能开发。然后再切回之前的 feature 分支即可继续完成之前功能的开发。

2. 协作开发：GitFlow 还支持多人协同开发，因为每个 feature 分支上改动的代码都只是为了让某个新的 feature 可以独立运行。同时我们也很容易知道每个人都在干啥。

3. 发布阶段：当一个新 feature 开发完成的时候，它会被合并到 develop 分支，这个分支主要用来暂时保存那些还没有发布的内容，所以如果需要再开发新的 feature，我们只需要从 develop 分支创建新分支，即可包含所有已经完成的 feature 。

4. 支持紧急修复：GitFlow 还包含了 hotfix 分支。这种类型的分支是从某个已经发布的 tag 上创建出来并做一个紧急的修复，而且这个紧急修复只影响这个已经发布的 tag，而不会影响到你正在开发的新 feature。

GitFlow流程图:

![gitflow](../images/javascript/git-gitflow-1.png)

**feature** 分支都是从 **develop** 分支创建，完成后再合并到 **develop** 分支上，等待发布

![gitflow](../images/javascript/git-gitflow-2.png)

当需要发布时，我们从 **develop** 分支创建一个 **release** 分支

然后这个 release 分支会发布到测试环境进行测试，如果发现问题就在这个分支直接进行修复。在所有问题修复之前，我们会不停的**重复发布->测试->修复->重新发布->重新测试**这个流程。

![gitflow](../images/javascript/git-gitflow-3.png)

发布结束后，这个 release 分支会合并到 develop 和 master 分支，从而保证不会有代码丢失。

![gitflow](../images/javascript/git-gitflow-4.png)

master 分支只跟踪已经发布的代码，合并到 master 上的 commit 只能来自 release 分支和 hotfix 分支。

**hotfix** 分支的作用是紧急修复一些 Bug。它们都是从 master 分支上的某个 tag 建立，修复结束后再合并到 **develop** 和 **master** 分支上。

![gitflow](../images/javascript/git-gitflow-5.png)
