# 复数乘法

```js

function complexNumberMulti(str1, str2) {
    let num1Arr = str1.split('+').map(s => parseInt(s))
    let num2Arr = str2.split('+').map(s => parseInt(s))
    let [[a = 0,b = 0],[c = 0,d = 0]] = [num1Arr, num2Arr]
    const result = [a*c - b*d, b*c + a*d]
    return `${result[0]}+${result[1]}i`
}

```