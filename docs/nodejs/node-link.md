---
prev: /nodejs/koa
next: /nodejs/npx
---

# npm link

npm link用来在本地项目和本地npm模块之间建立连接，可以在本地进行模块测试

具体用法：

1. 项目和模块在同一个目录下，可以使用相对路径

npm link ../module

2. 项目和模块不在同一个目录下

cd到模块目录，npm link，进行全局link

cd到项目目录，npm link 模块名(package.json中的name)

3. 解除link

解除项目和模块link，项目目录下，npm unlink 模块名

解除模块全局link，模块目录下，npm unlink 模块名