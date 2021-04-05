# 算法

## 杨辉三角

```js

/**

1 
1 1
1 2 1
1 3 3 1

**/

function combination(m, n) {
  if(n === 0){
    return 1
  } else if(m === n) {
    return 1
  } else {
    return combination(m-1, n-1) + combination(m-1, n)
  }
}


function print(n) {
  for(let i = 0; i < n; i++) {
    let arr = []
    for(let j = 0; j <= i; j++) {
      arr.push(combination(i, j))
    }
    console.log(arr.join(' '))
  }
}
```