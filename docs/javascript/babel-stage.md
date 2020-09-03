---
prev: /javascript/array-function
next: /javascript/bigInt
---

# 如何区分 Babel 中的 stage-0,stage-1,stage-2 以及 stage-3

大家知道，将 ES6 代码编译为 ES5 时，我们常用到 Babel 这个编译工具。大家参考一些网上的文章或者官方文档，里面常会建议大家在.babelrc 中输入如下代码：

```json
{
  "presets": ["es2015", "react", "stage-0"],
  "plugins": []
}
```

.babelrc 配置文件是针对 babel 6 的。Babel 6 做了一系列模块化，不像 Babel 5 一样把所有的内容都加载。比如需要编译 ES6，我们需要设置 presets 为"es2015"，也就是预先加载 es6 编译的相关模块，如果需要编译 jsx，需要预先加载"react"这个模块。
“stage-0”是对 ES7 一些提案的支持，Babel 通过插件的方式引入，让 Babel 可以编译 ES7 代码。当然由于 ES7 没有定下来，所以这些功能随时可能被废弃掉的。

1、stage-0

“stage-0” 包含 stage-1, stage-2 以及 stage-3 的所有功能，同时还另外支持如下两个功能插件：

- transform-do-expressions
- transform-function-bind
  在 React 中，jsx 对条件表达式支持的不是太好，你不能很方便的使用 if/else 表达式，要么你使用三元表达，要么用函数。例如你不能写如下的代码：

```js
var App = React.createClass({
    render(){
        let { color } = this.props;
        return (
            <div className="parents">
                {
                    if(color == 'blue') {
                        <BlueComponent/>;
                    }else if(color == 'red') {
                        <RedComponent/>;
                    }else {
                        <GreenComponent/>; }
                    }
                }
            </div>
        )
    }
})
```

在 React 中只能写成：

```js
var App = React.createClass({
  render() {
    let { color } = this.props
    const getColoredComponent = color => {
      if (color === 'blue') {
        return <BlueComponent />
      }
      if (color === 'red') {
        return <RedComponent />
      }
      if (color === 'green') {
        return <GreenComponent />
      }
    }
    return <div className="parents">{getColoredComponent(color)}</div>
  }
})
```

transform-do-expressions 这个插件就是为了方便在 jsx 写 if/else 表达式而提出的，我们可以重写下代码。

```js
var App = React.createClass({
  render() {
    let { color } = this.props
    return (
      <div className="parents">
        {do {
          if (color == 'blue') {
            <BlueComponent />
          } else if (color == 'red') {
            <RedComponent />
          } else {
            <GreenComponent />
          }
        }}
        }
      </div>
    )
  }
})
```

transform-function-bind 这个插件其实就是提供过 :: 这个操作符来方便快速切换上下文， 如下面的代码：

```js
obj::func
// is equivalent to:
func.bind(obj)

obj::func(val)
// is equivalent to:
func
  .call(obj, val)

  ::obj.func(val)
// is equivalent to:
func.call(obj, val)

// 再来一个复杂点的样例

const box = {
  weight: 2,
  getWeight() {
    return this.weight
  }
}

const { getWeight } = box

console.log(box.getWeight()) // prints '2'

const bigBox = { weight: 10 }
console.log(bigBox::getWeight()) // prints '10'

// Can be chained:
function add(val) {
  return this + val
}

console.log(bigBox::getWeight()::add(5)) // prints '15'
```
或者：
```js
const { map, filter } = Array.prototype;
let sslUrls = document.querySelectorAll('a')
                ::map(node => node.href)
                ::filter(href => href.substring(0, 5) === 'https');

console.log(sslUrls);
```

## 2. stage-1
stage-1除了包含stage-2和stage-3，还包含了下面4个插件：

+ transform-class-constructor-call(Deprecated)
+ transform-class-properties
+ transform-decorators – disabled pending proposal update
+ transform-export-extensions

## stage-2
stage-2 你可以忽略它，但事实上，它很有内涵的。它除了覆盖stage-3的所有功能，还支持如下两个插件：
syntax-trailing-function-commas    尾逗号函数
transform-object-reset-spread

syntax-trailing-function-commas 尾逗号函数，其实就是函数参数支持逗号结尾
transform-object-rest-spread， 其实它是对ES6中解构赋值的一个扩展，因为ES6只支持对数组的解构赋值，对对象是不支持的。


## stage3
stage3的async和await, 解决(Ajax)回调函数的解决方法，可以用同步的思维来写，ES7里面非常强悍的存在。总的来说，它包含如下两个插件:
+ transform-async-to-generator
+ transform-exponentiation-operator
 
transform-async-to-generator主要用来支持ES7中的async和await， 我们可以写出下面的代码：

```js
const sleep = (timeout)=>{
    return new Promise( (resolve, reject)=>{
        setTimeout(resolve, timeout)
    })
}

(async ()=>{
    console.time("async");
    await sleep(3000);
    console.timeEnd("async");
})()
```
还有：
```js
const fetchUsers = (user)=>{
    return window.fetch(`xxx${user}`).then( res=>res.json())
}

const getUser = async (user) =>{
    let users = await fetchUsers(user);
    console.log( users);
}

console.log( getUser("test"))
```
提示： 由于asycn和await是ES7里面的内容，现阶段不建议使用。为了顺利运行上面的代码，建议用webpack进行编译。
 
transform-exponentiation-operator这个插件算是一个语法糖，可以通过**这个符号来进行幂操作，想当于Math.pow(a,b)。如下面的样例
```js
// x ** y

let squared = 2 ** 2;
// 相当于: 2 * 2

let cubed = 2 ** 3;
// 相当于: 2 * 2 * 2

// x **= y

let a = 2;
a **= 2;
// 相当于: a = a * a;

let b = 3;
b **= 3;
// 相当于: b = b * b * b;
```
很简单也很实用。

## 总结
我们了解了stage-0,state-1，stage-2以及stage-3的区别。在进行实际开发时，可以更具需要来设置对应的stage。如果省事懒得折腾，一般设置为stage-0即可。如果为了防止开发人员使用某些太新的功能，我们可以限制到某个特定的stage即可。 更详细的请参考[https://babeljs.io/docs/plugins/preset-stage-0/](https://babeljs.io/docs/plugins/preset-stage-0/)