# 全局变量

### 在 FiberScheduler 中的全局变量

```js
// Used to ensure computeUniqueAsyncExpiration is monotonically increasing.
let lastUniqueAsyncExpiration: number = 0

// Represents the expiration time that incoming updates should use. (If this
// is NoWork, use the default strategy: async updates in async mode, sync
// updates in sync mode.)
let expirationContext: ExpirationTime = NoWork

let isWorking: boolean = false

// The next work in progress fiber that we're currently working on.
let nextUnitOfWork: Fiber | null = null
let nextRoot: FiberRoot | null = null
// The time at which we're currently rendering work.
let nextRenderExpirationTime: ExpirationTime = NoWork
let nextLatestAbsoluteTimeoutMs: number = -1
let nextRenderDidError: boolean = false

// The next fiber with an effect that we're currently committing.
let nextEffect: Fiber | null = null

let isCommitting: boolean = false

let legacyErrorBoundariesThatAlreadyFailed: Set<mixed> | null = null

// Used for performance tracking.
let interruptedBy: Fiber | null = null
```

### lastUniqueAsyncExpiration

在 createBatch 中有调用，但是没发现 createBatch 在哪里被调用，所以，目前没发现什么作用。

```js
function computeUniqueAsyncExpiration(): ExpirationTime {
  const currentTime = requestCurrentTime()
  let result = computeAsyncExpiration(currentTime)
  if (result <= lastUniqueAsyncExpiration) {
    result = lastUniqueAsyncExpiration + 1
  }
  lastUniqueAsyncExpiration = result
  return lastUniqueAsyncExpiration
}
```

### expirationContext

保存创建 `expirationTime`的上下文，在 `syncUpdates`和 `deferredUpdates`中分别被设置为 `Sync`和 `AsyncExpirationTime`，在有这个上下文的时候任何更新计算出来的过期时间都等于 `expirationContext`。

比如调用 `ReactDOM.flushSync`的时候，他接受的回调中的 `setState`

### isWorking

`commitRoot`和 `renderRoot`开始都会设置为 `true`，然后在他们各自阶段结束的时候都重置为 `false`

用来标志是否当前有更新正在进行，不区分阶段

### isCommitting

`commitRoot`开头设置为 `true`，结束之后设置为 `false`

用来标志是否处于 `commit`阶段

### nextUnitOfWork

用于记录 `render`阶段 `Fiber`树遍历过程中下一个需要执行的节点。

在 `resetStack`中分别被重置

他只会指向 `workInProgress`

### nextRoot & nextRenderExpirationTime

用于记录下一个将要渲染的 root 节点和下一个要渲染的任务的

在 `renderRoot`开始的时候赋值，需要符合如下条件才会重新赋值

```js
if (expirationTime !== nextRenderExpirationTime || root !== nextRoot || nextUnitOfWork === null) {
  resetStack()
  nextRoot = root
  nextRenderExpirationTime = expirationTime
  nextUnitOfWork = createWorkInProgress(nextRoot.current, null, nextRenderExpirationTime)
}
```

解释一下就是说，只有这一次调用 `renderRoot`的时候，有

新的 `root`要渲染
相同的 `root`但是任务有不同优先级的任务要渲染
或者在老的任务上没有下一个节点需要渲染了

### nextLatestAbsoluteTimeoutMs

用来记录 `Suspense`组件何时重新尝试渲染，涉及复杂的公式，这里就不详细说了。

可以看 `renderRoot`

### nextRenderDidError

用于记录当前 render 流程是否有错误产生

resetStack 重置为 false

在 throwException 中如果发现了不能直接处理的错误（除了 `Promise`之外），那么就调用 `renderDidError`设置为 `true`

### nextEffect

用于 `commit`阶段记录 `firstEffect -> lastEffect`链遍历过程中的每一个 `Fiber`

### interruptedBy

给开发工具用的，用来展示被哪个节点打断了异步任务

跟调度有关的全局变量
`ReactFiberScheduler.js 1797-1826`

```js
// Linked-list of roots
let firstScheduledRoot: FiberRoot | null = null
let lastScheduledRoot: FiberRoot | null = null

let callbackExpirationTime: ExpirationTime = NoWork
let callbackID: *
let isRendering: boolean = false
let nextFlushedRoot: FiberRoot | null = null
let nextFlushedExpirationTime: ExpirationTime = NoWork
let lowestPriorityPendingInteractiveExpirationTime: ExpirationTime = NoWork
let deadlineDidExpire: boolean = false
let hasUnhandledError: boolean = false
let unhandledError: mixed | null = null
let deadline: Deadline | null = null

let isBatchingUpdates: boolean = false
let isUnbatchingUpdates: boolean = false
let isBatchingInteractiveUpdates: boolean = false

let completedBatches: Array<Batch> | null = null

let originalStartTimeMs: number = now()
let currentRendererTime: ExpirationTime = msToExpirationTime(originalStartTimeMs)
let currentSchedulerTime: ExpirationTime = currentRendererTime

// Use these to prevent an infinite loop of nested updates
const NESTED_UPDATE_LIMIT = 50
let nestedUpdateCount: number = 0
let lastCommittedRootDuringThisBatch: FiberRoot | null = null
```

### firstScheduledRoot & lastScheduledRoot

用于存放有任务的所有 `root`的单列表结构

在 `findHighestPriorityRoot`用来检索优先级最高的 `root`
在 `addRootToSchedule`中会修改
在 `findHighestPriorityRoot`中会判断 `root`的 `expirationTime`，并不会直接删除 `root`

### callbackExpirationTime & callbackID

记录请求 `ReactScheduler`的时候用的过期时间，如果在一次调度期间有新的调度请求进来了，而且优先级更高，那么需要取消上一次请求，如果更低则无需再次请求调度。

`callbackID`是 `ReactScheduler`返回的用于取消调度的 `ID`

### isRendering

`performWorkOnRoot`开始设置为 `true`，结束的时候设置为 `false`，表示进入渲染阶段，这是包含 `render`和 `commit`阶段的。

### nextFlushedRoot & nextFlushedExpirationTime

用来标志下一个需要渲染的 root 和对应的 expirtaionTime，注意：

- 通过 `findHighestPriorityRoot`找到最高优先级的
- 通过 `flushRoot`会直接设置指定的，不进行筛选

### lowestPriorityPendingInteractiveExpirationTime

类似 `expirationContext`，用来存储 `interactiveUpdates`产生的最小的 `expirationTime`，在下一次外部指定的 `interactiveUpdates`情况下会强制输出上一次的 `interactiveUpdates`，因为 `interactiveUpdates`主要是用户输入之类的操作，如果不及时输出会给用户造成断层感

可以通过调用 `ReactDOM.unstable_interactiveUpdates`来实现以上目的

# deadline & deadlineDidExpire

`deadline`是 `ReactScheduler`中返回的时间片调度信息对象

用于记录是否时间片调度是否过期，在 `shouldYield`根据 `deadline`是否过期来设置

### hasUnhandledError & unhandledError

`Profiler`调试相关

### isBatchingUpdates & isUnbatchingUpdates & isBatchingInteractiveUpdates

`batchedUpdates`、`unBatchedUpdates`，`deferredUpdates`、`interactiveUpdates`等这些方法用来存储更新产生的上下文的变量

### originalStartTimeMs

固定值，`js`加载完一开始计算的结果

### currentRendererTime & currentSchedulerTime

计算从页面加载到现在为止的毫秒数，后者会在 `isRendering === true`的时候用作固定值返回，不然每次 `requestCurrentTime`都会重新计算新的时间。

### nestedUpdateCount & lastCommittedRootDuringThisBatch

用来记录是否有嵌套得再生命周期方法中产生更新导致应用无限循环更新得计数器，用于提醒用户书写的不正确的代码。
