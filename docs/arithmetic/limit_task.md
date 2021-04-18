# 实现限制同时运行任务数的函数limitRunTask


```js

function createTask(ms) {
  return () => {
    console.log('start', ms)
    return new Promise((r) => setTimeout(() => {
       console.log('end', ms)
        r(ms)
    }, ms))
  } 
}

const taskList = Array(5).fill(0).map((_, i) => createTask(i * 1000))

Promise.all(taskList.map(task => task())).then(res => console.log(res))

// start
```


```js


limitRunTask(taskList, 2).then((res) => console.log(res))

function limitRunTask(taskList, limit) {
    const list = []
    function run(tasks) {
        if(!tasks.length) {
            return Promise.resolve(list)
        }
        return Promise.all(tasks.map(task => task())).then((res) => {
            list.push(...res)
            return run(taskList.splice(0, limit))
        })
    }
    return run(taskList.splice(0, limit))
}

```