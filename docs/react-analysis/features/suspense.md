---
prev: /react-analysis/features/suspense-component
next: /react-analysis/features/suspense-lazy
---

# 挂起任务的含义

### suspense

`React`中的`suspendedTime`用来记录的是还没有被提交但是已经被更新的任务，在这里首先我要讲解一个概念，那就是`finishedWork`。一开始我以为`finishedWork`存储的是`workInProgress`，也就是`current`的引用，那存的不就是自己么，但是后来我弄清楚了。试想我们从`renderRoot`开始做的事情都是在`workInProgress`上操作的，这个对象通过调用

```js
nextUnitOfWork = createWorkInProgress(nextRoot.current, null, nextRenderExpirationTime)

export function createWorkInProgress(
  current: Fiber,
  pendingProps: any,
  expirationTime: ExpirationTime
): Fiber {
  let workInProgress = current.alternate
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode)
    workInProgress.elementType = current.elementType
    workInProgress.type = current.type
    workInProgress.stateNode = current.stateNode

    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    workInProgress.pendingProps = pendingProps

    workInProgress.effectTag = NoEffect

    // The effect list is no longer valid.
    workInProgress.nextEffect = null
    workInProgress.firstEffect = null
    workInProgress.lastEffect = null
  }

  workInProgress.childExpirationTime = current.childExpirationTime
  workInProgress.expirationTime = current.expirationTime

  workInProgress.child = current.child
  workInProgress.memoizedProps = current.memoizedProps
  workInProgress.memoizedState = current.memoizedState
  workInProgress.updateQueue = current.updateQueue
  workInProgress.firstContextDependency = current.firstContextDependency

  workInProgress.sibling = current.sibling
  workInProgress.index = current.index
  workInProgress.ref = current.ref

  return workInProgress
}
```

注意这里返回的是一个新的对象，在更新的过程中我们对于需要更新的节点都会创建这么一个对象，并对其拷贝属性。对于原始类型的数据那么是值拷贝，对于引用类型是否是引用拷贝呢？答案是：对于在更新过程中需要改变的对象，会创建一个新的对象，这也是创建`workInProgress`的原因，这里尤其需要注意的是`updateQueue`，在调用`processUpdateQueue`的时候，我们需要调用一个方法

```js
function ensureWorkInProgressQueueIsAClone<State>(
  workInProgress: Fiber,
  queue: UpdateQueue<State>
): UpdateQueue<State> {
  const current = workInProgress.alternate
  if (current !== null) {
    if (queue === current.updateQueue) {
      queue = workInProgress.updateQueue = cloneUpdateQueue(queue)
    }
  }
  return queue
}
```

也就是说`updateQueue`也是一个新的对象，所以在更新过程中改变的`Update`的顺序关系，并不会影响到`current`上的顺序，需要注意的是新创建的`update`调用`enqueueUpdate`会往`current`和`workInProgress`都插入。

说了这么多我到底要说什么呢？答案就是被挂起的 work 其实就是不把`workInProgress`的整棵树进入`commit`阶段的操作，挂起是专指 commit 的，只有`commit`阶段可以被挂起。而被挂起的提交，除了`timeout`的情况，我们都可以认为这次更新被抛弃了。

### onTimeout

`root.timeoutHandler`用来记录子树中需要`timeout`执行的任务，这类任务被挂起的原因一般是因为抛出了`promise`，并且自上次提交经过了`maxDruation`时间的任务，`nextLatestAbsoluteTimeoutMs`就是用来记录子树中优先级最高的需要提交的被挂起的任务的。被挂起代表了任务已经更新完成，但是因为一些原因不需要立马提交，比如：

有错误出现，并且有低优先级的更新，那么可以跟低优先级的更新一起被提交
有错误但是没有低优先级的任务，发起一次同步的更新，再次执行被挂起的优先级的任务
`Suspense`组件接收到异常的情况，根据情况挂起一些时间，最长为优先级最高的任务的过期时间，如果超时会执行`flushRoot`强制提交
需要注意的是，被挂起的任务只有`Suspense`的情况是设置了`timeout`的，但是不代表他一定要等到 timeout 才会被提交，以下情况都会提早提交：

有任务的`expirationTime`小于`timeout`的时长
在`timeout`期间同一子树产生了新的更新，连同 Suspense 组件一起更新了
`Promise`状态改变，调度了新的更新
设置了`timeoutHandler`之后，在下一次开始更新之前会清除`handler`，如果新的更新改变了`isExpire`或者`nextLatestAbsoluteTimeoutMs`，那么会导致`timeoutHandler`变化，甚至不需要`timeout`

### retry

`retry`只是简单地发起一次新的调度，所以并不关心新的渲染是否还需要这个`promise`返回的数据。

在`retry`的时候，如果他处于`ConcurrentMode`，那么只需要重新设置节点的`expirationTime`为`retryTime`即可

这里注意，因为同步模式下`Suspense`组件直接渲染`null`，不会像异步模式下一样操作，所以同步模式下他已经没有更新了，所以需要创建新的更新

### error

注意重新发起一次同步请求的条件是比较苛刻的，就是要符合`!root.didError`和`!isExpire`，也就是同步任务是不会进入这个分支的，只会直接提交。
