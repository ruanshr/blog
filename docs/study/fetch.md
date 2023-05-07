# fetch请求

```js

fetch("http://localhost:8080/api/test").then(response => {
  // response.json();  返回promise
  // response.text();  返回promise
  // response.header.get 
  return response.json();
}).then(data => {
  console.log(data)
})

```