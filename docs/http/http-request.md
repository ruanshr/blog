#  一个TCP连接是可以发多少个http请求？

### 现代浏览器在与服务器建立了一个tcp连接后是否会在一个http请求完成后断开？什么情况会断开

在http/1.0中，一个服务器在发送完一个http响应后，会断开tcp连接，但是这样每次请求都会重新建立和断开tcp连接，代价过大，所以虽然标准中没有设定，某些服务器对Connection:keep-alive的header进行了支持，意思是完成这个http请求之后，不要断开http请求使用的tcp连接。这样的好处是连接可以被重复使用，之后发送http请求的时候不需要重新建立tcp连接以及如果谓词连接，那么SSL的开销也可以避免

头一次访问，有初始化连接和SSL开销


初始化连接和SSL开销消失了，说明使用的是同一个tcp连接


持久连接：既然维持tcp连接好处这么多，http/1.1就把connection头写进标准，并且默认开启持久连接，除非请求中写明Connection:close，那么浏览器和服务器之前是会维持一段时间的tcp连接，不会一个请求结束就断开。


### 一个tcp连接可以对应几个http请求

如果维持连接，一个tcp连接是可以发送多个http请求的

### 一个tcp连接中http请求发送可以一起发送吗（比如一起发三个请求，再三个响应一起接收）？

http/1.1 存在一个问题，单个tcp连接在同一时刻只能处理一个请求，意思是说：两个请求的生命周期不能重叠，任意两个http请求从开始到结束的时间在同一个tcp连接里不能重叠

虽然http/1.1 规范中规定了pipelining来试图解决这个问题，但是这个功能在浏览器中默认是关闭的。

先来看一下pipelining是什么，RFC 2616中规范了

> A client that supports persistent connections MAY "pipeline" its requests (i.e., send multiple requests without waiting for each response). A server MUST send its responses to those requests in the same order that the requests were received. 一个支持持久连接的客户端可以在一个连接中发送多个请求（不需要等待任意请求的响应）。收到请求的服务器必须按照请求收到的顺序发送响应。


至于标准为什么这么设定，我们可以大概推崇一个原因：由于http/1.1是个文本协议，同时返回的内容也并不能屈服对应于那个发送的请求，所以顺序必须维持一致。

Pipelining这种设想看起来比较美好，但是在实践中会出现许多问题：

- 一些代理服务器不能正确的处理http pipelining

- 正确的流水线实现是复杂的

- head-of-line Blocking连接头阻塞：在建立起一个TCP连接之后，假设客户端在这个连接联系向服务器发送了几个请求。按照标准，服务器应该照收到请求的顺序返回结果，假如服务器在处理首个请求时花费了大量时间，那么后面所有的请求都需要等着首个请求结束才能响应

所以现代浏览器默认是不开启HTTP pipelining的

但是,http2提供了multiplexing多路传输特性，可以在一个TCP连接中同时完成多个http请求。至于multiplexing具体怎么实现的就是另一个问题了。我们可以看下使用http2的效果


绿色的是发起请求到请求返回的等待时间，蓝色是响应的下载时间，可以看到都是在同一个connection，并行完成的。

所以这个问题也有了答案：在http/1.1 存在pipelining技术可以完成这个多个请求同时发生，但是由于浏览器默认关闭，所以可以认为这个是不可行的。在http2中由于multiplexing特点的存在，多个http请求可以在同一个tcp连接中并行进行。

那么在http/1.1时代，浏览器是如何提高页面加载效率的呢？主要有下面两点：

1、维持和服务器已经建立的tcp连接，在同一连接上顺序处理多个请求
2、和服务器建立多个tcp连接

### 为什么有时候刷新页面不需要重新建立SSL连接?

TCP连接有的时候会被浏览器和服务器维持一段时间。TCP不需要重新建立，SSL自然也会使用之前的。

### 浏览器对同一host建立TCP连接到数量有没有限制？

假设我们还处在http/1.1时代，那个时候没有多路传输，当浏览器拿到一个有几十张图片的网站该怎么办呢？肯定不能只开一个tcp连接顺序下载，那样用户肯定等得很难受，但是如果每个图片都开一个tcp连接发http请求，那么电脑或者服务器都可能受不了，要是有1000张图片的话总不能开1000个tcp连接吧，你的电脑同意nat也不一定会同意。

所以答案是：有。Chrome最多允许对同一个host建立6个tcp连接，不同的浏览器有一些区别

https://developers.google.com/web/tools/chrome-devtools/network/issues#queued-or-stalled-requestsdevelopers.google.com