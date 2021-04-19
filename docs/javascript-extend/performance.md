---
prev: /javascript-extend/performance-monitor
next: /javascript-extend/requestAnimationFrame
---

# Performance - 前端性能监控利器

performance是一个做前端性能监控离不开的API，最好再也没完全加载完成之后再使用，因为很多值必须在页面完全加载之后才能得到。最简单的办法是在window.onload事件中读取各种数据。

### 属性

**timing(PerformanceTiming)**

从输入url到用户可以使用页面的全过程时间统计，会返回一个performanceTiming对象，单位均为毫秒



按触发顺序排列所有属性：

**navigationStart**: 在同一个浏览器上下文，前一个页面（与当前页面不一定同域） unload的时间戳，如果无前一个网页unload，则与fetchStart值相等

**unloadEventStart**: 前一个网页（与当前页面同域）unload的时间戳，如果无前一个网页unload或者前一个网页与当前页面不同域，则为0

**unloadEventEnt**: unloadEventStart相对应，返回前一个网页unload时间绑定的回调函数执行完毕的时间戳

**redirectStart**: 第一个http重定向发送时的时间。有跳转且同域名内的重定向才算，否则值为0

**redirectEnd**: 最后一个http重定向完成的时间。有跳转且是同域名内的重定向才算，否则值为0

**fetchStart**: 浏览器准备好使用http请求抓取文档的时间，这发送在检查本地缓存之前

**domainLookupStart**: DNS域名查询时间开始的时间，如果使用了本地缓存（即无DNS查询）或持久连接，则与fetchStart值相等

**domainLookupEnd**: DNS域名查询时间完成的时间，如果使用了本地缓存（即无DNS查询）或持久连接，则与fetchStart值相等

**connectStart**: http(TCP)开始建立连接的时间，如果是持久连接，则与fetchStart值相等，如果在传输层发送了错误且重新建立连接，则这里显示的是新建立的连接开始的时间

**connectEnd**:  http(TCP)完成建立连接的时间（完成握手），如果是持久连接，则与fetchStart值相等，如果在传输层发送错误且重新建立连接，则这里显示的是新建立的连接完成的时间。【注】这里握手结束，包括安全连接建立完成，socks授权通过


**secureConnectionStart**: https连接开始的时间，如果不是安全连接，则值为0

**requestStart**: http请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存，连接错误重连时，这里显示的也是新建立连接的时间


**responseStart**: http开始接收响应的时间（获取到第一个字节）包括从本地读取缓存

**responseEnd**: http响应全部接收完成的时间（获取到最后一个字节）包括从本地读取缓存

**domLoading**: 开始解析渲染DOM树的时间，此时 Document.readState变为loading，并将抛出readystatechange相关事件

**domInteractive**: 完成解析DOM树的时间，Document.readyState变为interactive，并将抛出readystatechange相关事件
【注】只是DOM树解析完成，这时候并没有开始加载页面内的资源

**domContentLoadedEventStart**: DOM解析完成后，页面内资源加载开始的时间，文档发送DOMContentLoaded事件

**domContentLoadedEventEnd**: DOM解析完成后，网页内资源加载完成的时间（如JS脚本加载执行完毕），文档的DOMContentLoaded事件的结束时间

**domComplete**: DOM树解析完成，且资源也准备就绪的时间，Document.readyState变为complete，并将抛出readystatechange相关事件

**loadEventStart**: load事件发送给文档，也即load回调函数开始执行的时间，如果没有绑定load时间，值为0

**loadEventEnd**: load事件的回调函数执行完毕的时间，如果没有绑定load事件，值为0

### 常用计算

DNS查询耗时： domainLookupEnd - domainLookupStart

TCP链接耗时： connectEnd - connectStart

request请求耗时： responseEnd - responseStart

解析dom树耗时： domComplete - domInteractive

白屏时间： responseStart - navigationStart

domready时间（用户可操作时间节点）： domContentLoadedEventEnd - navigationStart

onload时间（总下载时间）：loadEventEnd - navigationStart

### navigation

旨在告诉开发者当前页面是通过什么方式导航过来的，只有两个属性：type，redirectCount

**type**: 标志页面导航类型,值如下表

| type常数  | 枚举值  |                                   描述       |
| --------  | ------ | ------------------------------------------   | 
| TYPE_NAVIGATE	| 0	 | 普通进入，包括：点击链接、在地址栏中输入 URL、表单提交、或者通过除下表中 TYPE_RELOAD 和 TYPE_BACK_FORWARD 的方式初始化脚本。 |
| TYPE_RELOAD	 | 1	| 通过刷新进入，包括：浏览器的刷新按钮、快捷键刷新、location.reload()等方法。|
| TYPE_BACK_FORWARD	| 2	 | 通过操作历史记录进入，包括：浏览器的前进后退按钮、快捷键操作、history.forward()、history.back()、history.go(num)。 |
| TYPE_UNDEFINED	| 255	| 其他非以上类型的方式进入。 |

注意：稍带个小知识，history.go(url)这种非标准写法目前主流浏览器均不支持，问题可参考[http://stackoverflow.com/questions/6277283/history-gourl-issue](http://stackoverflow.com/questions/6277283/history-gourl-issue)


**redirectCount**: 表示到达最终页面前，重定向的次数，但是这个接口有同源策略限制，即仅能检测同源的重定向。

注意：所有前端模拟的重定向都无法统计到，因为不属于HTTP重定向

### now()

performance.now()是当前时间与performance.timing.navigationStart的时间差，以微秒（百万分之一秒）为单位的时间，与 Date.now()-performance.timing.navigationStart的区别是不受系统程序执行阻塞的影响，因此更加精准。