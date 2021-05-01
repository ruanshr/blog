# 给你一个非空模板串S，一个文本串T，问S在T中出现了多少次

```js


/**
 * 计算模板串S在文本串T中出现了多少次
 * @param S string字符串 模板串
 * @param T string字符串 文本串
 * @return int整型
 */
function kmp( S ,  T ) {
    // write code here
    let count = 0
    for(let i = 0; i < T.length ;i++) {
        if(T.length - i < S.length) {
            break;
        }
        for(let j = 0;j < S.length;j++) {
            if(S[j] !== T[i+j]){
                break
            }
            if(j === S.length - 1) {
                count++
            }
        }
    }
    return count
}

```