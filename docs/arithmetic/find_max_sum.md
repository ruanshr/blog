# 数组里找出最大的连续子数组和

[1, 2, -4, 3, -1, 5, 6, -10]

```js

function findMaxSum(arr) {
    let subList = []
    let list = []
    for(let i = 0;i < arr.length;i++) {
        let value = arr[i]
        if(value < 0) {
            list.push(subList)
            subList = []
        } else {

        }
    }
}

```