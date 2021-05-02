# 一年中的第几天

```js
function isYunYear(year) {
    if(year % 400 === 0) {
        return true     
    }
    return  year % 4 === 0 && year % 100 !== 0
}

function getDays(str) {
  const [year, month, day] = str.split('-').map(s => parseInt(s))
  const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let totalDays = day
  for (let i = 0; i < month - 1; i++) {
    totalDays += months[i]
    if(i > 2 && isYunYear(year)) {
        totalDays += 1
    }
  }
  return totalDays
}

getDays('2020-2-2')
```
