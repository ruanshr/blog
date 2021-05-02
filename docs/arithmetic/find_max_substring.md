# 找出字符串中最长最多重复的子串

```js

function findMaxSubString(str) {
    //定义一个对象，对象的每个属性是出现连续重复的字符，属性的属性值是该字符重复的个数
    function maxRepectSubString(str, substr) {
        let count = 0
        for(let i = 0; i < str.length;i++) {
            if(str.length - i < substr.length){
                break
            }
            if(str[i] !== substr[0]) {
                continue
            }
            let exist = true
            for(let j = 1; j < substr.length; j++) {
                if(str[i + j] !== substr[j]) {
                    exist = false
                    break
                }
            }
            if(exist) {
                count += 1
            }
        }
        return {
            substr,
            count
        }
    }
    
}

```