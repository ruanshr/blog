---
prev: /react-analysis/features/hydrate
next: /react-analysis/features/event-injection
---

# coerceRef

在调和子节点得过程中，会对`ReactElement`中得`ref`进行处理，主要是处理`string ref`，把他转换成一个方法，这个方法主要做的事情就是设置`instance.refs[stringRef] = element`，相当于把他转换成了`function ref`

对于更新得过程中`string ref`是否变化需要对比得是`current.ref._stringRef`，这里记录了上一次渲染得时候如果使用得是`string ref`他的值是什么

`owner`是在调用`createElement`的时候获取的，通过`ReactCurrentOwner.current`获取，这个值在更新一个组件前会被设置，比如更新`ClassComponent`的时候，调用`render`方法之前会设置，然后调用`render`的时候就可以获取对应的`owner`了。

```js
// 调用
existing.ref = coerceRef(returnFiber, current, element)

function coerceRef(returnFiber: Fiber, current: Fiber | null, element: ReactElement) {
  let mixedRef = element.ref
  if (mixedRef !== null && typeof mixedRef !== 'function' && typeof mixedRef !== 'object') {
    // dev code

    if (element._owner) {
      const owner: ?Fiber = (element._owner: any)
      let inst
      if (owner) {
        const ownerFiber = ((owner: any): Fiber)
        // 提醒
        inst = ownerFiber.stateNode
      }
      // 提醒
      const stringRef = '' + mixedRef
      // Check if previous string ref matches new string ref
      if (
        current !== null &&
        current.ref !== null &&
        typeof current.ref === 'function' &&
        current.ref._stringRef === stringRef
      ) {
        return current.ref
      }
      const ref = function (value) {
        let refs = inst.refs
        if (refs === emptyRefsObject) {
          // This is a lazy pooled frozen object, so we need to initialize.
          refs = inst.refs = {}
        }
        if (value === null) {
          delete refs[stringRef]
        } else {
          refs[stringRef] = value
        }
      }
      ref._stringRef = stringRef
      return ref
    } else {
      // 提醒
    }
  }
  return mixedRef
}
```

### commitAttachRef

在`commitRoot`最后阶段，`commitAllLifecycle`的时候，如果又`Ref`得`side effect`，则会调用该方法

该方法很简单，获取`ref`作用得节点，并根据`ref`的类型，调用方法，或者赋值`ref.current`，因为`ref`已经在`coerceRef`处理过了，不会存在还是`string`得情况。

```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref
  if (ref !== null) {
    const instance = finishedWork.stateNode
    let instanceToUse
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance)
        break
      default:
        instanceToUse = instance
    }
    if (typeof ref === 'function') {
      ref(instanceToUse)
    } else {
      ref.current = instanceToUse
    }
  }
}
```

### commitDetachRef

卸载`ref`，设置为`null`

在`commitAllHostEffects`的时候会统一对所有有`ref`的`side effect`的节点先卸载`ref`，后续会统一再设置。

```js
function commitDetachRef(current: Fiber) {
  const currentRef = current.ref
  if (currentRef !== null) {
    if (typeof currentRef === 'function') {
      currentRef(null)
    } else {
      currentRef.current = null
    }
  }
}
```
