---
prev: /react-analysis/base/react-api
next: /react-analysis/base/react-children
---

# ReactElement

ReactElement 通过`createElement`创建，调用该方法需要传入三个参数：

- type
- config
- children

`type`指代这个`ReactElement`的类型

- 字符串比如`div`，`p`代表原生`DOM`，称为`HostComponent`
- `Class`类型是我们继承自`Component`或者`PureComponent`的组件，称为`ClassComponent`
- 方法就是`functional Component`
- 原生提供的`Fragment、AsyncMode`等是`Symbol`，会被特殊处理
- TODO: 是否有其他的

从源码可以看出虽然创建的时候都是通过`config`传入的，但是`key`和`ref`不会跟其他 config 中的变量一起被处理，而是单独作为变量出现在`ReactElement`上。

在最后创建`ReactElement`我们看到了这么一个变量`$$typeof`，在这里可以看出来他是一个常量：`REACT_ELEMENT_TYPE`，但有一个特例：`ReactDOM.createPortal`的时候是`REACT_PORTAL_TYPE`，不过他不是通过`createElement`创建的，所以他应该也不属于`ReactElement`

```js
export function createElement(type, config, children) {
  // 处理参数

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props)
}

const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  }

  return element
}
```

`ReactElement`只是一个用来承载信息的容器，他会告诉后续的操作这个节点的以下信息：

- `type`类型，用于判断如何创建节点
- `key`和`ref`这些特殊信息
- `props`新的属性内容
- `$$typeof`用于确定是否属于`ReactElement`

这些信息对于后期构建应用的树结构是非常重要的，**而 React 通过提供这种类型的数据，来脱离平台的限制**
