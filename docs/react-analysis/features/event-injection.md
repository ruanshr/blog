---
prev: /react-analysis/features/ref
next: /react-analysis/features/event-dispatch
---

# 事件系统初始化

### 事件模块的注入模式

`React`为了跨平台，对于事件体系的代码做出了一些妥协，采用动态注入的方式让不同的平台对事件核心模块进行插件注入。我们先来看`ReactDOM`的入口文件，里面有这么一句代码：`import './ReactDOMClientInjection';`，这就是注入的开始，这个`js`的代码如下：

```js
import * as EventPluginHub from 'events/EventPluginHub'
import * as EventPluginUtils from 'events/EventPluginUtils'

import {
  getFiberCurrentPropsFromNode,
  getInstanceFromNode,
  getNodeFromInstance
} from './ReactDOMComponentTree'
import BeforeInputEventPlugin from '../events/BeforeInputEventPlugin'
import ChangeEventPlugin from '../events/ChangeEventPlugin'
import DOMEventPluginOrder from '../events/DOMEventPluginOrder'
import EnterLeaveEventPlugin from '../events/EnterLeaveEventPlugin'
import SelectEventPlugin from '../events/SelectEventPlugin'
import SimpleEventPlugin from '../events/SimpleEventPlugin'

EventPluginHub.injection.injectEventPluginOrder(DOMEventPluginOrder)
EventPluginUtils.setComponentTree(
  getFiberCurrentPropsFromNode,
  getInstanceFromNode,
  getNodeFromInstance
)

EventPluginHub.injection.injectEventPluginsByName({
  SimpleEventPlugin: SimpleEventPlugin,
  EnterLeaveEventPlugin: EnterLeaveEventPlugin,
  ChangeEventPlugin: ChangeEventPlugin,
  SelectEventPlugin: SelectEventPlugin,
  BeforeInputEventPlugin: BeforeInputEventPlugin
})
```

通过这两个方法向事件系统注入了平台相关的事件代码，同时确定事件的调用顺序。

### plugin

我们先来看一下一个 plugin 应该长咋样：

```js
const ChangeEventPlugin = {
  eventTypes: {
    change: {
      phasedRegistrationNames: {
        bubbled: 'onChange',
        captured: 'onChangeCapture'
      },
      isInteractive: boolean, // 标志是否高优先级反馈
      registrationName: string,
      dependencies: [
        TOP_BLUR,
        TOP_CHANGE,
        TOP_CLICK,
        TOP_FOCUS,
        TOP_INPUT,
        TOP_KEY_DOWN,
        TOP_KEY_UP,
        TOP_SELECTION_CHANGE
      ]
    }
  },

  _isInputEventSupported: isInputEventSupported,

  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    // 创建event对象并return
  }
}
```

`eventTypes`是以具体事件为`key`的`map`对象，其中每个事件的`phasedRegistrationNames`是指定`props`的名字，`dependencies`是如果需要绑定`change`事件需要同时绑定哪些事件

`extractEvents`是一个方法，用来根据具体真实触发的事件类型等参数，返回对应的事件对象，也可以返回`null`表示当前事件跟这个插件没有关系。

### 注册插件

| 变量名                     | 作用                                                                        |
| -------------------------- | --------------------------------------------------------------------------- |
| `eventPluginOrder`         | 记录插件的调用顺序                                                          |
| `namesToPlugins`           | 以插件名为`key`的插件`map`                                                  |
| `plugins`                  | 按照`eventPluginOrder`顺序存储的插件模块数组                                |
| `eventNameDispatchConfigs` | 按照每个插件中的 eventTypes 中的每一项为`key`，其对应的对象为`value`的对象  |
| `registrationNameModules`  | 存储有`phasedRegistrationNames`或者`registrationName`的插件的事件对应的模块 |

首先调用`injectEventPluginOrder`，设置`eventPluginOrder`

然后调用`injectEventPluginsByName`，把所有插件加入到`namesToPlugins`对象中，并以插件名为`key`

然后调用`recomputePluginOrdering`把所有插件安顺序插入到`plugins`数组中，并对每个插件中的`eventTypes`中的每个事件类型调用`publishEventForPlugin`，设置`eventNameDispatchConfigs`对象，以事件名为`key`存储`dispatchConfig`，也就是上面插件中的`eventTypes.change`对应的对象

然后还需要对每一个`phasedRegistrationNames`里面的项执行`publishRegistrationName`，设置`registrationNameModules`，以事件名为 key 存储模块，同时设置`registrationNameDependencies`，以事件名为`key`存储事件的`dependencies`

`registrationNameModules`在更新 DOM 节点的时候会被用到，`registrationNameDependencies`在绑定事件的使用会被用到。

整个注册过程就是为了初始化设置这些变量，这些变量在后续的`DOM`操作中会扮演比较重要的角色。

### 结构

**eventNameDispatchConfigs**

```js
{
  change: ChangePlugin.eventTypes.change,
  // ...other plugins
}
```

**registrationNameModules**

```js
{
  onChange: ChangePlugin,
  onChangeCapture: ChangePlugin
}
```

**registrationNameDependencies**

```js
{
  onChange: ChangePlugin.eventTypes.change.dependencies,
  onChangeCapture: ChangePlugin.eventTypes.change.dependencies
}
```
