# 找出有序数组旋转的最小值

[4,5,6,7,0,1,2]

```js
// 分治法
function findMix(nums) {
    let low = 0
    let high = nums.length - 1
    while( low < high ) {
        let mid = Math.floor( (high + low) / 2 )
        if(nums[low] < nums[mid]) {
            high = mid
        } else if(nums[low] === nums[mid]) {
            low += 1
        } else {
            low = mid
        }
    }
    return nums[low]
}
```