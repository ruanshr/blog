---
prev: /http/http304
next: /javascript/array-function
---

# 简单请求与复杂请求
这两种请求的区别主要在于是否会触发CORS（Cross-Origin Resuource Sharing）预检请求

### 简单请求

#### 1、请求方式
- GET
- POST
- HEAD

#### 2、不能指定要请求头header，以下头部信息除外
- Accept
- Accept-Language
- Content-Language
- Content-Type

#### 3、Content-Type的值仅限于下列三者之一
- text/plain
- multipart/form-data 文件上传时要使用的数据类型
- application/x-www-form-urlencoded 最常见的post的数据类型，也是表单提交的数据类型，jquery的ajax默认也是这个

#### 4、关于XMLHttpRequestUpload
- 请求中的任意XMLHttpRequestUpload对象均没有注册任何事件监听器。
- XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload属性访问

#### 请求中没有使用ReadableStream对象

### 复杂请求
- 不符合简单请求的就是复杂请求

### 相关案例

#### 跨域ajax两次请求，一次为option（复杂请求）

- 跨域
- 请求为复杂请求

解决办法
1、改为简单请求（去掉header等）
2、服务端设置： Access-Control-Max-Age
并不会完全去掉预检查option请求，但是会检查一次，后续请求在到底过期时间之前均不再进行option预请求


### 扩展资料
XMLHttpRequest会遵循同源策略（same-origin policy）也即脚本只能访问相同协议/相同主机名/相同端口的资源，如果要突破这个限制，那就需要跨域，此时需要遵守CORS（Cross-origin resource Sharing） 机制，那么，允许跨域，不就是服务端设置 Access-Control-Allow-Origin: * 就可以了吗？普通的请求才是这样的， 除此之外，还又一种请求叫preflighted request

prefligihted request在发送真正的请求前，会先发送options的预请求（preflight request），用于试探服务端是否能接受真正的请求，如果options获得的回应是拒绝性质的，比如404\403\500等http状态，就会停止 post，put等请求的发出。

第一个options的请求是由Web服务器处理跨域访问引发的。options是一种“预检请求”，浏览器在处理跨域访问的请求是如果判断请求为复杂请求，则会先向服务器发送一条预检请求，根据服务器返回的内容浏览器判断服务器是否允许该请求访问。如果web服务器采用cors的方式支持跨域访问，在处理复杂请求时这个预检请求时不可避免的

