# 文件下载

下载文件分为两种形式，哪两种方式取决于后台；

- 如果后台服务器的静态目录有可供下载的静态资源，后台人员告知你文件路径，直接 window.location.href 方式获取即可；

- 如果后台服务器无可供下载的静态资源，返回的是一个文件流(response-type: application/octet-stream;charset=UTF-8 )，则使用第二种方式（将文件写入内存，并且创建 a 元素，a 链接 href 属性指向内存中的文件，download 属性指向要下载的文件名，模拟 a 元素的点击事件，进行下载；）

1、 第一种，后台服务器有静态资源且是固定的文件名（GET 方式下载文件）

window.location.href="http://www.域名/template.xlsx(文件名)"

2、第二种，后台返回文件流

解决办法一：本地可测试；推荐使用；

第一步：引入 axios 第三方库

```js
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

第二步：传参、调接口，下载文件

```js
axios
  .post(
    请求路径URL,
    { 参数Params },
    {
      responseType: 'blob'
    }
  )
  .then(function(res) {
    var blob = res.data
    // FileReader主要用于将文件内容读入内存
    var reader = new FileReader()
    reader.readAsDataURL(blob)
    // onload当读取操作成功完成时调用
    reader.onload = function(e) {
      var a = document.createElement('a')
      // 获取文件名fileName
      var fileName = res.headers['content-disposition'].split('=')
      fileName = fileName[fileName.length - 1]
      fileName = fileName.replace(/"/g, '')
      a.download = fileName
      a.href = e.target.result
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  })
```

解决办法二：form 表单提交，本地不可测试；不推荐使用；

```js
var exportForm = $(
  '<form action="/api/cert/download" method="post">\
        <input type="hidden" name="ids" value="' +
    参数ids值 +
    '"/>\
        </form>'
)
$(document.body).append(exportForm)
exportForm.submit()
exportForm.remove()
```
