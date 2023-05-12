---
prev: /react-analysis/index
next: /react-analysis/base/react-element
---

# React

> 虽然平时我们都喜欢说我们用React作为我们的核心框架，但其实大部分人都不知道React到底是个什么东东。事实上自从Facebook把React和ReactDOM分包发布之后，React就不仅仅是一开始的前端框架了，如果在15版本之后去看一下react和react-dom的源码大小，你就会发现，react仅仅1000多行代码，而react-dom却将近2w行。是的你没看错，而且你很可能也没有想错，其实大部分的框架逻辑都在react-dom当中，那么react到底是什么呢？

关于版本，本书是在React16+的基础上写的，React16相较于之前的版本是核心上的一次重写，虽然主要的API都没有变化，但是增加了很多能力。并且首次引入了Fiber的概念，之后新的功能都是围绕Fiber进行实现，比如AsyncMode，Profiler等。

我们来看一下React暴露出来的API

```js
const React = {
  Children: {
    map,
    forEach,
    count,
    toArray,
    only,
  },

  createRef,
  Component,
  PureComponent,

  createContext,
  forwardRef,

  Fragment: REACT_FRAGMENT_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  unstable_AsyncMode: REACT_ASYNC_MODE_TYPE,
  unstable_Profiler: REACT_PROFILER_TYPE,

  createElement: __DEV__ ? createElementWithValidation : createElement,
  cloneElement: __DEV__ ? cloneElementWithValidation : cloneElement,
  createFactory: __DEV__ ? createFactoryWithValidation : createFactory,
  isValidElement: isValidElement,

  version: ReactVersion,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals,
};
```

请先无视__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

### Children

这个对象提供了一堆帮你处理**props.children**的方法，因为children是一个类似数组但是不是数组的数据结构，如果你要对其进行处理可以用**React.Children**外挂的方法。

### createRef

新的ref用法，React即将抛弃```<div ref="myDiv" />```这种```string ref```的用法，将来你只能使用两种方式来使用ref

```js

class App extends React.Component{

  constructor() {
    this.ref = React.createRef()
  }

  render() {
    return <div ref={this.ref} />
    // or
    return <div ref={(node) => this.funRef = node} />
  }

}

```

### Component & PureComponent

这两个类基本相同，唯一的区别是**PureComponent**的原型上多了一个标识

```js

if (ctor.prototype && ctor.prototype.isPureReactComponent) {
  return (
    !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
  );
}

```

这是检查组件是否需要更新的一个判断，```ctor```就是你声明的继承自```Component or PureComponent```的类，他会判断你是否继承自```PureComponent```，如果是的话就```shallowEqual```比较```state```和```props```。

**顺便说一下：React中对比一个ClassComponent是否需要更新，只有两个地方。一是看有没有shouldComponentUpdate方法，二就是这里的PureComponent判断**

### createContext

使用方法

```js

const { Provider, Consumer } = React.createContext('defaultValue')

const ProviderComp = (props) => (
  <Provider value={'realValue'}>
    {props.children}
  </Provider>
)

const ConsumerComp = () => (
  <Consumer>
    {(value) => <p>{value}</p>}
  </Consumber>
)

```

### forwardRef

```forwardRef```是用来解决HOC组件传递```ref```的问题的，所谓```HOC```就是```Higher Order Component```，比如使用redux的时候，我们用connect来给组件绑定需要的state，这其中其实就是给我们的组件在外部包了一层组件，然后通过```...props```的方式把外部的props传入到实际组件。```forwardRef```的使用方法如下：

```js

const TargetComponent = React.forwardRef((props, ref) => (
  <TargetComponent ref={ref} />
))

```

这也是为什么要提供```createRef```作为新的```ref```使用方法的原因，如果用```string ref```就没法当作参数传递了。

### 类型

```
Fragment: REACT_FRAGMENT_TYPE,
StrictMode: REACT_STRICT_MODE_TYPE,
unstable_AsyncMode: REACT_ASYNC_MODE_TYPE,
unstable_Profiler: REACT_PROFILER_TYPE,
```

这四个都是```React```提供的组件，但他们呢其实都只是占位符，都是一个```Symbol```，在```React```实际检测到他们的时候会做一些特殊的处理，比如```StrictMode```和```AsyncMode```会让他们的子节点对应的```Fiber```的```mode```都变成和他们一样的```mode```


### createElement & cloneElement & createFactory & isValidElement

```createElement```可谓是```React```中最重要的API了，他是用来创建```ReactElement```的，但是很多同学却从没见过也没用过，这是为啥呢？因为你用了```JSX```，```JSX```并不是标准的```js```，所以要经过编译才能变成可运行的```js```，而编译之后，```createElement```就出现了：

```js

// jsx
<div id="app">content</div>

// js
React.createElement('div', { id: 'app' }, 'content')
```

```cloneElement```就很明显了，是用来克隆一个```ReactElement```的

```createFactory```是用来创建专门用来创建某一类```ReactElement```的工厂的

```js
export function createFactory(type) {
  const factory = createElement.bind(null, type);
  factory.type = type;
  return factory;
}
```

他其实就是绑定了第一个参数的```createElement```，一般我们用JSX进行编程的时候不会用到这个API

```isValidElement```顾名思义就是用来验证是否是一个```ReactElement```的，基本也用不到。