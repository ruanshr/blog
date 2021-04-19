---
prev: /javascript-extend/requestAnimationFrame
next: /javascript-extend/rule
---

# 什么是REST？什么是RESTful？

![logo](../images/common/1.jpg)

## 1、REST来源
REST：是一组架构约束条件和原则，REST是Roy Thomas Fielding在他2000年的博士论文中提出的。 Roy Thomas Fielding是HTTP协议（1.0版和1.1版）的主要设计者、Apache服务器作者之一、Apache基金会第一任主席

## 2、什么是REST
REST（Representational State Transfer）：表现层状态转移，一种软件架构风格，不是标准。既然不是标准，我可以遵守，也可以不遵守！！！ 什么是表现层状态转移：

- Representational （表现层） 
- State Transfer（状态转移）：通过HTTP动词实现。

总结：URL定位资源，HTTP动词（GET，POST，PUT，DELETE）描述操作。

## 3、什么是RESTful

基于REST构建的API就是RESTful风格

## 4、如何设计RESTful风格的API

- 1.路径设计

在RESTful架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有名词，而且所用的名词往往与数据库的表名对应，一般来说，数据库中的表都是同种记录的”集合”（collection），所以API中的名词也应该使用复数。 举例来说，有一个API提供动物园（zoo）的信息，还包括各种动物和雇员的信息，则它的路径应该设计成下面这样。

```
https://api.example.com/v1/zoos 
https://api.example.com/v1/animals 
https://api.example.com/v1/employees
```

- 2.HTTP动词设计
对于资源的具体操作类型，由HTTP动词表示，常用的HTTP动词如下：

```
请求方式	含义
GET	获取资源（一项或多项）
POST	新建资源
PUT	更新资源（客户端提供改变后的完整资源）
DELETE	删除资源
```
如何通过URL和http动词获悉要调用的功能：
```
请求方式	含义
GET	/zoos	列出所有动物园
POST	/zoos	新建一个动物园
GET	/zoos/ID	获取某个指定动物园的信息
PUT	/zoos/ID	更新某个指定动物园的信息（提供该动物园的全部信息）
DELETE	/zoos/ID	删除某个动物园
GET	/zoos/ID/animals	列出某个指定动物园的所有动物
DELETE	/zoos/ID/animals/ID	删除某个指定动物园的指定动物
```
## RESTFul API的一些最佳实践原则：
- 1、使用HTTP动词表示增删改查资源， GET：查询，POST：新增，PUT：更新，DELETE：删除
- 2、返回结果必须使用JSON
- 3、HTTP状态码，在REST中都有特定的意义：200,201,202,204,400,401,403。比如401表示用户身份认证失败，403表示你验证身份通过了，但这个资源你不能操作。
- 4、如果出现错误，返回一个错误码： 10000=通用参数错误10001=资源未找到
- 5、API 必须有版本的概念, v1, v2
- 6、使用Token令牌来做用户身份的校验与权限分级
- 7、url中大小写不敏感，不要出现大写字母
- 8、使用中划线而不是使用下划线做URL路径中字符串连接
- 9、有一份漂亮的文档

## RESTFul API好用吗？
某些情况好用，某些情况不好用。什么情况好用，什么情况不好用呢？

- 1、一个经验性的总结：对于开放的API，比如豆瓣、新浪微博、GitHub，好用，非常合适
- 2、对于内部开发，不好用
- 3、REST是一种软件架构风格，不是标准。既然不是标准，可以遵守，也可以不遵守！