# Redux 详解与在小程序中应用

## 什么是 Redux

​ Redux 我们可以把它理解成一个状态管理器，可以把状态（数据）存在 Redux 中，以便增、删、改。例如：

从服务器上取一个收藏列表，就可以把取回来的列表数据用 Redux 管理，多个页面共享使用，不用把数据传来传去。
A 页面改变了一个状态，B 页面要收到通知，做相应的操作。
​ Redux 是一个给 JS 应用使用的可预测的状态容器，也就是说结果是可预测的，每一次改动会有确定的结果，正如函数式编程思想里的相同的参数会返回相同的结果。

​ Redux 的状态会存储在单一的数据源中（存储在对象树中），这样，读取和共享就非常方便，不必去考虑会取错。状态是只能直接读取的，不能直接修改，修改只能通过发送事件（action）统一处理，这样便于分析事件，也可以避免随处修改状态造成竞态条件。统一处理状态时用纯函数（reducers 中的函数）来修改状态，这些函数只是一个勾子，当需要修改状态树时 Redux 会来调用，你可以编写不同的函数来处理不同 action 对应的状态，或者复用一个函数来处理多种 action。

## 为什么要用

​ 简单来说就是使不易维护的数据变得维护简单，以小程序举例：多个页面要共享一套数据，而且这些数据是随时可能从网络上获取更新或增减的（如页面跳转时要带数据过去（非基本类型的数据），这时如果用 app 中的全局变量来暂存，存的变量多了，以后维护是个大麻烦，别人接手代码也会很烦恼。），还有一个地方的数据有改变，其他地方要收到通知等这些场景就可以使用 Redux 来做，如果你没有遇到这些问题，说明你的项目还没有到这些复杂的阶段，可以暂不考虑用 Redux。

## Redux 的四个部件

redux-recycle

- Action：

action 是一个事件，用来描述发生了什么事，例如用户点击了一个刷新按钮，就会产生一个获取最新数据的事件，Action 就是用来标识这个事件的，Action 是一个 JS 对象，拥有 2 个属性，一个 type,一个 data，type 用来表示该 action 的类型，data 为新的状态数据，既然是对象当然还可以带上一些其他的属性，在处理状态的时候使用。

- Reducer：
  reducer 是一个处理状态的函数，真正的状态数据处理就是在这个函数里，reducer 接受两个参数，一个是修改前的状态（state）对象，一个是 action。可以在 reducer 中判断 action 的 type 属性来确定是一个什么事件然后对 state 做相应的处理，并返回新的 state。

- Store：
  store 是 Redux 的 CPU，状态处理器，它提供了一些 api 给我们使用，如：

getState 方法，可以获取到最新的状态对象树。
subscribe 方法用来订阅状态的更新，该方法接受一个函数做为监听器，并会返回一个注销订阅的函数，以便我们在不需要订阅时注销改监听器。
dispatch 方法用来分发事件，它接受一个 action 作参数，把事件发出去。
State：state 是存储的数据，数据会以对象树的结构来管理，这里要注意，Store 每次传给 reducer 的 state 是整个 state 对象树中对应该 reducer 名字（key）的子对象。

​ 事件发出后 store 会派 reducer 去处理事件，得到新的 state，然后通知给各个监听器有新的变化（观察者模式）。

总体来说 Redux 就像是一个快递仓库（store），里面的货物（state）按地域分别存储，每当有一个新的货物进来（dispatch），处理程序或人员（reducer）就会去按地名（type）添加到仓库对应的位置，然后仓库通知（subscribe）快递员来取货物。

在小程序中使用 Redux
先看目录结构：

```
project
|--app.js
|--libs
| |--redux-min.js
|--store
| |--actions
| | |--index.js
| | |--person.js
| |--reducers
| | |--index.js
| | |--person.js
| |--types
| | |--index.js
| | |--person.js
|--index.js
```

以存储人的年龄信息为例说一下步骤：

- 1、引入 redux 的 lib，（redux-min.js）。文章最后有 demo，libs 文件夹里有可以直接使用的库，下载即可。

- 2、建立 actions,reducers,types 文件夹，这三个文件夹中的 index.js 只是为了在有多个文件时做统一导出，如不需要可去掉。

action

```js
// actions/person.js
function personAction(data) {
  return {
    type: UPDATE_AGE,
    data
  }
}

export const ageChange = (age = 20) => {
  return personAction({ age: age })
}
```

reducers：

```js
// reducers/person.js
const person = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_AGE:
      return {
        ...state,
        age: action.data.age
      }
    default:
      return state
  }
}

export default person
```

types:

```js
// types/person.js
export const UPDATE_AGE = 'UPDATE_AGE'
```

- 3、配置和创建 redux：

```js
//store/index.js
import { createStore, combineReducers } from '../libs/redux.min'
import rootReducer from './reducers/index'

export default function configAndCreateStore() {
  return createStore(combineReducers(rootReducer))
}
```

- 4、在 app.js 中引入全局的 store，并模拟 1 秒后通过 redux 修改年龄：

```js
import Store from './store/index'
import { ageChange } from './store/actions/index'

const $store = Store()

App({
  onLaunch: function() {
    const that = this
    //1秒后修改年龄为25岁
    setTimeout(() => {
      that.store.dispatch(ageChange(25))
    }, 1000)
  },
  store: $store,
  globalData: {
    userInfo: null
  }
})
```

- 5、在页面中订阅状态更改通知，获取新状态，页面生命周期结束时取消订阅：

```js
// pages/index.js

//获取应用实例
  const app = getApp()
  onLoad: function () {
    this.unSubscribe = app.store.subscribe(() => {
      let person = app.store.getState().person
      console.log('store.subscribe person:', person)
      //这里要做个判断，当收到的状态与页面上已有的状态不一致时才去操作页面，可能会频繁收到订阅消息，要小心操作
    })
  },
  onUnload() {
    this.unSubscribe()
  },
  onShow(){
    //在任何时候都可以获取到当前最新的状态树，要灵活使用
    let person = app.store.getState().person
    console.log('store.subscribe person:', person)
  }
```

任何时候都可以获取到当前最新的状态树，不一定要在订阅监听器函数中，要灵活使用。

## 一些使用建议（以网络请求回数据为例）

如果是多页面要共享的数据，建议用 Redux 来管理。
如果修改数据后多处需要收到通知的情况，建议用 Redux 来管理。
如果是一些一次性的数据（如收藏功能，返回结果就是一个收藏成功或失败，提示一下用户后就不再使用该结果了），未来不需要再利用，那么不建议用 Redux 来处理，直接去请求服务器处理结果就好。

## 扩展

​ Redux 可以使用中间件来改变 action 的处理流程，可以分类处理 action，如 redux-thunk 中间件，它可以使 dispatch 接受一个函数做为 action，该函数中可以进行异步网络请求等，从而实现用 Redux 处理网络请求并管理返回结果
