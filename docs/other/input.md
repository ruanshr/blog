#

```js
var readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.on('line', function(line) {
  var result = line.split(' ')
  console.log(result)
  rl.close()
})
```

```js
var readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
var line = 3
var resultList = []
rl.on('line', function(line) {
  if (resultList.length < line) {
    var result = line.split(' ')
    resultList.push(result)
  } else if (resultList.length === line) {
    console.log(resultList)
  }
  rl.close()
})
```
