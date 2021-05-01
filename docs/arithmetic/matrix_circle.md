# 给定一个m x n大小的矩阵（m行，n列），按螺旋的顺序返回矩阵中的所有元素。

```js

function spiralOrder(matrix) {
    if(!matrix.length) {
        return matrix
    }
    let left = 0;
    let top = 0;
    let right = matrix.length - 1
    let bottom = matrix[0].length - 1
    const arr = []
    while(left < Math.floor((matrix[0].length + 1)/ 2) && left < Math.floor((matrix[0].length + 1) / 2 )) {

        // 上面 从左到右
        for(let i = left; i <= right; i++) {
            arr.push(matrix[top][i])
        }
        
        // 右边 从上到下
        for(let j = top + 1; j <= bottom; j++) {
            arr.push(matrix[j][right])
        }
        
        // 下面 右到左
        for(let m = right - 1; top !== bottom && m >= left ; m--) {
            arr.push(matrix[bottom][m])
        }

        // 左边 下到上
        for(let n = bottom - 1; left !== right && n > top ; n--) {
            arr.push(matrix[n][left])
        }

        left++
        top++
        right--
        bottom--
    }

    return arr
}


```