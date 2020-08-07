
```js
console.log(1)

new Promise((resolve, reject) => {
  console.log(2)
}).then(() => {
  console.log(3)
})

setTimeout(() => {
  console.log(4)
})

new Promise((resolve, reject) => {
  console.log(5)
}).then(() => {
  console.log(6)
})

setTimeout(() => {
  console.log(7)
})
console.log(8)



```






```js
Promise.resolve().then(() => {
  console.log(1)
  setTimeout(() => {
    console.log(2)
  })
})

setTimeout(() => {
  console.log(3)
  Promise.resolve().then(() => {
    console.log(4)
  })
})

// 
```
