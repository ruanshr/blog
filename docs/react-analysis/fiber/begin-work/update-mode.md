# updateMode

在 react16 之后，加入了一些模式，比如`AsyncMode`，可以通过`React.unstable_AsyncMode` 来进行调用，使用方式类似组件，在应用的最外层包裹

```js
<AsyncMode>
  <App />
</AsyncMode>
```

这个意思就是他对于所有的子元素都启用了异步渲染。

`React.unstable_AsyncMode`本身只是一个`Symbol`，在遇到该元素时，`performUnitOfWork`会做对应的处理

对于`mode`节点，他的`mode`会遗传给他的所有子节点，所以`AsyncMode`的子节点都是`AsyncMode`的

```js
function updateMode(current, workInProgress) {
  var nextChildren = workInProgress.pendingProps.children;
  if (hasContextChanged()) {
    // Normally we can bail out on props equality but if context has changed
    // we don't do the bailout and we have to reuse existing props instead.
  } else if (nextChildren === null || workInProgress.memoizedProps === nextChildren) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress);
  }
  reconcileChildren(current, workInProgress, nextChildren);
  memoizeProps(workInProgress, nextChildren);
  return workInProgress.child;

```
