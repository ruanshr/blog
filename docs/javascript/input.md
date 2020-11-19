# input 上传图片并压缩

上传图片需要的步骤

1，获取 input 上传 file 文件

2，转化为 base64 文件

3，压缩

4，转换为 blob 文件

5，上传。

```js

/**
 * 上传文件
*/
uploadImg (blob, base64) {
  // 接收到回调函数 获取到压缩后 图片文件，然后上传就可以了
  const formData = new FormData()
  // 需要给文件名添加后缀扩展名，否则传到后端的是一个没有扩展名的文件
  formData.append('file', blob, '.jpg')
  formData.append('filename', blob + '.jpg')
  // 此处我自己封装的api接口，大家可以无视，就是上传提交的意思
  api.uploadImg(formData)
  .then(res => {
    console.log(res)
  })
},
/**
 * 获取到的二进制文件 转 base64文件
 * @param blob
 */
blobToBase64 (blob) {
  const self = this // 绑定this
  const reader = new FileReader() //实例化一个reader文件
  reader.readAsDataURL(blob) // 添加二进制文件
  reader.onload = function (event) {
    const base64 = event.target.result // 获取到它的base64文件
    const scale = 0.99 // 设置缩放比例 （0-1）
    self.compressImg(base64, scale, self.uploadImg) // 调用压缩方法
  }
},
/**
 * 压缩图片方法
 * @param base64 ----baser64文件
 * @param scale ----压缩比例 画面质量0-9，数字越小文件越小画质越差
 * @param callback ---回调函数
 */
compressImg (base64, scale, callback) {
  console.log(`执行缩放程序，scale=${scale}`)
  // 处理缩放，转换格式
  // 下面的注释就不写了，就是new 一个图片，用canvas来压缩
  const img = new Image()
  img.src = base64
  img.onload = function () {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.setAttribute('width', this.width)
    canvas.setAttribute('height', this.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    // 转成base64 文件
    let base64 = canvas.toDataURL('image/jpeg')
    // 根据自己需求填写大小 我的目标是小于3兆
    while (base64.length > 1024 * 1024 * 3) {
      scale -= 0.01
      base64 = canvas.toDataURL('image/jpeg', scale)
    }
    // baser64 TO blob 这一块如果不懂可以自行百度，我就不加注释了
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bytes = atob(arr[1])
    const bytesLength = bytes.length
    const u8arr = new Uint8Array(bytesLength)
    for (let i = 0; i < bytes.length; i++) {
      u8arr[i] = bytes.charCodeAt(i)
    }
    const blob = new Blob([u8arr], { type: mime })
    // 回调函数 根据需求返回二进制数据或者base64数据，我的项目都给返回了
    callback(blob, base64)
  }
}
```

```js

function drawShotImage(target) {
  var imgCanvas = document.createElement('canvas')
  imgCanvas.width = area.width
  imgCanvas.height = area.height
  var imgContext = imgCanvas.getContext('2d')
  var anonyImg = new Image()
  anonyImg.setAttribute('crossorigin', 'anonymous') // 注意设置图片跨域应该在图片加载之前
  // 如果图片有缓存则onload方法写在src赋值之前
  anonyImg.onload = function() {
    var sorceImgWidth = anonyImg.width
    var sorceImgHeight = anonyImg.height
    imgContext.drawImage(
      anonyImg,
      area.sx * area.scaleX,
      area.sy * area.scaleY,
      area.swidth * area.scaleX,
      area.sheight * area.scaleY,
      area.x,
      area.y,
      area.width,
      area.height
    )
    var imgBase64 = imgCanvas.toDataURL('image/png')
    console.log(
      '%c\n       ',
      'font-size:' + area.height + 'px;background:url("' + imgBase64 + '") no-repeat 0 0;'
    )
    ajaxImageCharacters(imgBase64.split(',')[1])
  }

  anonyImg.src = target.src;
}
```
