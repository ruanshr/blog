---
prev: /javascript-extend/module
next: /javascript-extend/part2
---

# MVC，MVP，MVVM

### MVC

MVC模式的意思是，软件可以分成三个部分


- 视图（View）：用户界面

- 控制器（Controller）：业务逻辑

- 模型（Model）：数据保存


各部分之间的通信方式如下


- 1、View 传达指令到Controller

- 2、Controller完成业务逻辑后，要求Model改变状态

- 3、Model将新的数据发送到View，用户得到反馈

所有通信都是单向的

### MVP

MVP模式将Controller改名为Presenter，同时改变了通信方向