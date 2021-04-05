---
prev: /javascript/garbage
next: /javascript/html-load
---

# 如何规范 Git 版本分支的管理

在团队开发中，我们需要规范 Git 版本分支的管理，提高开发效率

以下是一些原则建议：

1、最稳定的代码放到master分支上
2、不要直接在master提交代码，通过其他分支的代码进行合并
3、需要从master分支上拉一条develop分支
4、基于develop分支，在此基础上拉分支，比如feature-1、feature-2分支来开发相关新特性
5、新功能开发完后，基于develop分支，再拉出一条release分支，比如 release，然后将feature的相关分支合并到release分支上，接下来将release分支的代码部署到测试环境测试，无bug时，再将release分支合并到develop部署到预发布环境中进行测试，如无任何bug，将develop合并到master分支并部署到生产环境中。
6、上线完成后，在master分支上打个tag，比如v1.0.0

如线上发现bug
1、在当前tag上拉取一条hotfix分支，比如hotfix-1.0.1,并在此分支上进行修复
2、修复完成后，同时将hotfix合并到develop分支合master分支

![git-flow](../images/javascript/git-flow.jpg)