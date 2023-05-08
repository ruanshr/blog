# svg图片

1、svg文件中svg标签需要添加 xmlns="http://www.w3.org/2000/svg" 属性才能显示



2、svg 转成base64代码实现

```js
function transformSvgToBase64(svgElement){
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const encodedData = window.btoa(svgString);
  return `data:image/svg+xml;base64,${encodedData}`;
}
```