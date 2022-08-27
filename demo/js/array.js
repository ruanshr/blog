// 数组去重方法1 
// const arr = [1,2,3,1];
// const result = Array.from(new Set(arr))
// console.log(result)

// // 数组去重方法2 
// const result2 = arr.filter((item, index, arr) => arr.indexOf(item) === index)
// console.log(result2)

const arr = [1,2,[3,4,[6]]]
const result3 = arr.join(',').split(',')  
console.log(result3)
// 能够将数组降维，但数组的类型变成字符串了
const result4 = arr.join(',').split(',').map(Number)
console.log(result4)

// 降一维
const result5 = arr.flat()
console.log("result5:", result5);
// 降维(任意)， 将数组打平
function flat(arr, array = []) {
  return arr.reduce((acc, item) => {
    if(Array.isArray(item)) {
      return flat(item, acc)
    }
    return acc.concat(item)
  }, array);
}

console.log("flat:", flat(arr))

// Array.proptotype.every
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];
const result10 = animals.slice(0,2) // 截取前2个
const result11 = animals.slice(-2)  // 截取后2个
// 获取倒数第三个
const [camel] = animals.slice(-3)
console.log("result10==>", result10, result11, camel)