# Javascript 获取日期范围

Javascript获取日期范围

例如起始日期是2021/02/01 获取下年的日期，结果为2022/02/01

```js

const date = new Date("2021/02/01")

date.setFullYear(date.getFullYear() + 1)

```

根据当前时间想获取下一年零两个月五天七时八分九秒的区间日期

```js
/**
 * 获取日期范围
 * @param date {Date}
 * @param rule {String} [年(y)|月(M)|日(d)|时(h)|分(m)|秒(s)|毫秒(S)]
 * @param direction {Number} [-1|1]
 * @returns {Date}
 * @exmaple
 *   getDateRange(Date.now(), "1y2M3d4h5m6s7S");
 */

 function getDateRange(date, rule, direction = 1) {
    const startDate = new Date(date);
    const endDate = new Date(date)
    const o = {
      y: 'FullYear',
      M: 'Month',
      d: 'Date',
      h: 'Hours',
      m: 'Minutes',
      s: 'Seconds',
      S: 'Millisconds'
    }

    for(const key in o) {
      const reg = new RegExp(`([0-9]+)${key}`);
      const method = o[key];
      const matchs = rule.match(reg)
      if(matchs) {
         const num = matchs[1] >> 0
         rule = rule.replace(matchs[0], '')
         endDate[`set${method}`](startDate[`get${method}`]() + (num * direction))
      }
    }
    return endDate

 }

```