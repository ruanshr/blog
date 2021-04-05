---
prev: /http/http-cdn
next: /http/http-request
---

# CORS跨域资源共享

CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。

它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制

### 简介

CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。

整个CORS通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。

因此，实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信

### 两种请求

浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

只要同时满足以下两大条件，就属于简单请求。

1) 请求方法是以下三种方法之一：

HEAD、GET、POST

2）HTTP的头信息不超出以下几种字段：

Accept、Accept-Language、Content-Language、Last-Event-ID、Content-Type（只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain）

这是为了兼容表单（form），因为历史上表单一直可以发出跨域请求。AJAX 的跨域设计就是，只要表单可以发，AJAX 就可以直接发。

凡是不同时满足上面两个条件，就属于非简单请求。

浏览器对这两种请求的处理，是不一样的。


为了支持CORS跨域访问，常在过滤器或者拦截器中添加的配置如下：

```js

response.setHeader("Access-Control-Allow-Origin","*");

response.setHeader("Access-Control-Allow-Methods","POST,OPTIONS,GET");

response.setHeader("Access-Control-Allow-headers","accept,x-requested-with,Content-Type,X-Custom-header");

response.setHeader("Access-Control-Allow-Credentials",true);

response.setHeader("Access-Control-Max-Age",3600);

```
- **Access-Control-Allow-Origin**

必填字段，取值可以是请求时的Origin字段的值，也可以是*表示接受任意域名的请求。

- **Access-Control-Allow-Methods**

必填字段，取值是逗号分隔的一个字符串，设置服务器支持的跨域请求的方法。注意为了避免多次OPTIONS请求，返回的是所有支持的方法，逗号分隔

- **Access-Control-Allow-Headers**

可选字段，CORS请求时默认支持6个基本字段，**XMLHttpRequest.getResponseHeader()**方法：

**Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma**。

如果需要支持其他Headers字段，必须在Access-Control-Allow-Headers里面指定。

- **Access-Control-Allow-Credentials**

可选字段，布尔值类型，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中；如果设为true，即表示服务器允许在请求中包含Cookie，一起发给服务器。

注意该值只能设为true，如果服务器不允许浏览器发送Cookie，删除该字段即可

- **Access-Control-Max-Age**

可选字段，用来指定预检请求的有效期，单位为秒，在此期间不用发出另一条预检请求，不指定时即使用默认值，Chrome默认5秒。

常用浏览器有不同的最大值限制，Firefox上限是24小时 （即86400秒），Chrom是10分钟（即600秒）。

注意Access-Control-Max-Age设置针对完全一样的url，当url包含路径参数时，其中一个url的Access-Control-Max-Age设置对另一个url没有效果。