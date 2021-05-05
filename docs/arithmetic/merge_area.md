# 合并区间

给出一个区间的集合，

如： [1, 3)、 [2, 4)、[5, 8)、[15, 20)

请输出将连续区间合并后的结果

[1, 4)、[5, 8)、[15, 20)

```js
function merge(intervals) {
  if (!intervals.length) {
    return intervals
  }
  intervals.sort((a, b) => a[0] - b[0])
  const merged = intervals.slice(0, 1)
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i]
    if (current[0] <= merged[merged.length - 1][1]) {
      merged[merged.length - 1][1] = current[1]
    } else {
      merged.push(current)
    }
  }
  return merged
}

const intervals = [
  [1, 3],
  [2, 4],
  [5, 8],
  [15, 20]
]

merge(intervals)
```
