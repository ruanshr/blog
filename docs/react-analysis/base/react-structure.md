---
prev: /react-analysis/base/react-children
next: /react-analysis/update/react-dom-render
---

# React 中的数据结构

### FiberRoot

```js
type BaseFiberRootProperties = {
  // root节点，render方法接收的第二个参数
  containerInfo: any,
  // 只有在持久更新中会用到，也就是不支持增量更新的平台，react-dom不会用到
  pendingChildren: any,
  // 当前应用对应的Fiber对象，是Root Fiber
  current: Fiber,

  // 一下的优先级是用来区分
  // 1) 没有提交(committed)的任务
  // 2) 没有提交的挂起任务
  // 3) 没有提交的可能被挂起的任务
  // 我们选择不追踪每个单独的阻塞登记，为了兼顾性能
  // The earliest and latest priority levels that are suspended from committing.
  // 最老和新的在提交的时候被挂起的任务
  earliestSuspendedTime: ExpirationTime,
  latestSuspendedTime: ExpirationTime,
  // The earliest and latest priority levels that are not known to be suspended.
  // 最老和最新的不确定是否会挂起的优先级（所有任务进来一开始都是这个状态）
  earliestPendingTime: ExpirationTime,
  latestPendingTime: ExpirationTime,
  // The latest priority level that was pinged by a resolved promise and can
  // be retried.
  // 最新的通过一个promise被reslove并且可以重新尝试的优先级
  latestPingedTime: ExpirationTime,

  // 如果有错误被抛出并且没有更多的更新存在，我们尝试在处理错误前同步重新从头渲染
  // 在`renderRoot`出现无法处理的错误时会被设置为`true`
  didError: boolean,

  // 正在等待提交的任务的`expirationTime`
  pendingCommitExpirationTime: ExpirationTime,
  // 已经完成的任务的FiberRoot对象，如果你只有一个Root，那他永远只可能是这个Root对应的Fiber，或者是null
  // 在commit阶段只会处理这个值对应的任务
  finishedWork: Fiber | null,
  // 在任务被挂起的时候通过setTimeout设置的返回内容，用来下一次如果有新的任务挂起时清理还没触发的timeout
  timeoutHandle: TimeoutHandle | NoTimeout,
  // 顶层context对象，只有主动调用`renderSubtreeIntoContainer`时才会有用
  context: Object | null,
  pendingContext: Object | null,
  // 用来确定第一次渲染的时候是否需要融合
  +hydrate: boolean,
  // 当前root上剩余的过期时间
  // TODO: 提到renderer里面区处理
  nextExpirationTimeToWorkOn: ExpirationTime,
  // 当前更新对应的过期时间
  expirationTime: ExpirationTime,
  // List of top-level batches. This list indicates whether a commit should be
  // deferred. Also contains completion callbacks.
  // TODO: Lift this into the renderer
  // 顶层批次（批处理任务？）这个变量指明一个commit是否应该被推迟
  // 同时包括完成之后的回调
  // 貌似用在测试的时候？
  firstBatch: Batch | null,
  // root之间关联的链表结构
  nextScheduledRoot: FiberRoot | null
|}
```

### Fiber

```js
// Fiber对应一个组件需要被处理或者已经处理了，一个组件可以有一个或者多个Fiber
type Fiber = {|
  // 标记不同的组件类型
  tag: WorkTag,

  // ReactElement里面的key
  key: null | string,

  // ReactElement.type，也就是我们调用`createElement`的第一个参数
  elementType: any,

  // The resolved function/class/ associated with this fiber.
  // 异步组件resolved之后返回的内容，一般是`function`或者`class`
  type: any,

  // The local state associated with this fiber.
  // 跟当前Fiber相关本地状态（比如浏览器环境就是DOM节点）
  stateNode: any,

  // 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
  return: Fiber | null,

  // 单链表树结构
  // 指向自己的第一个子节点
  child: Fiber | null,
  // 指向自己的兄弟结构
  // 兄弟节点的return指向同一个父节点
  sibling: Fiber | null,
  index: number,

  // ref属性
  ref: null | (((handle: mixed) => void) & { _stringRef: ?string }) | RefObject,

  // 新的变动带来的新的props
  pendingProps: any,
  // 上一次渲染完成之后的props
  memoizedProps: any,

  // 该Fiber对应的组件产生的Update会存放在这个队列里面
  updateQueue: UpdateQueue<any> | null,

  // 上一次渲染的时候的state
  memoizedState: any,

  // 一个列表，存放这个Fiber依赖的context
  firstContextDependency: ContextDependency<mixed> | null,

  // 用来描述当前Fiber和他子树的`Bitfield`
  // 共存的模式表示这个子树是否默认是异步渲染的
  // Fiber被创建的时候他会继承父Fiber
  // 其他的标识也可以在创建的时候被设置
  // 但是在创建之后不应该再被修改，特别是他的子Fiber创建之前
  mode: TypeOfMode,

  // Effect
  // 用来记录Side Effect
  effectTag: SideEffectTag,

  // 单链表用来快速查找下一个side effect
  nextEffect: Fiber | null,

  // 子树中第一个side effect
  firstEffect: Fiber | null,
  // 子树中最后一个side effect
  lastEffect: Fiber | null,

  // 代表任务在未来的哪个时间点应该被完成
  // 不包括他的子树产生的任务
  expirationTime: ExpirationTime,

  // 快速确定子树中是否有不在等待的变化
  childExpirationTime: ExpirationTime,

  // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
  // 我们称他为`current <==> workInProgress`
  // 在渲染完成之后他们会交换位置
  alternate: Fiber | null,

  // 下面是调试相关的，收集每个Fiber和子树渲染时间的

  actualDuration?: number,

  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime?: number,

  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration?: number,

  // Sum of base times for all descedents of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration?: number,

  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
  // __DEV__ only
  _debugID?: number,
  _debugSource?: Source | null,
  _debugOwner?: Fiber | null,
  _debugIsCurrentlyTiming?: boolean
|}
```

### effectTags

```js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type SideEffectTag = number

// Don't change these two values. They're used by React Dev Tools.
export const NoEffect = /*              */ 0b00000000000
export const PerformedWork = /*         */ 0b00000000001

// You can change the rest (and add more).
export const Placement = /*             */ 0b00000000010
export const Update = /*                */ 0b00000000100
export const PlacementAndUpdate = /*    */ 0b00000000110
export const Deletion = /*              */ 0b00000001000
export const ContentReset = /*          */ 0b00000010000
export const Callback = /*              */ 0b00000100000
export const DidCapture = /*            */ 0b00001000000
export const Ref = /*                   */ 0b00010000000
export const Snapshot = /*              */ 0b00100000000

// Update & Callback & Ref & Snapshot
export const LifecycleEffectMask = /*   */ 0b00110100100

// Union of all host effects
export const HostEffectMask = /*        */ 0b00111111111

export const Incomplete = /*            */ 0b01000000000
export const ShouldCapture = /*         */ 0b10000000000
```

### ReactWorkTag

```js
export const FunctionComponent = 0
export const ClassComponent = 1
export const IndeterminateComponent = 2 // Before we know whether it is function or class
export const HostRoot = 3 // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4 // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5
export const HostText = 6
export const Fragment = 7
export const Mode = 8
export const ContextConsumer = 9
export const ContextProvider = 10
export const ForwardRef = 11
export const Profiler = 12
export const SuspenseComponent = 13
export const MemoComponent = 14
export const SimpleMemoComponent = 15
export const LazyComponent = 16
export const IncompleteClassComponent = 17
```

### sideEffects

```js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type SideEffectTag = number

// Don't change these two values. They're used by React Dev Tools.
export const NoEffect = /*              */ 0b00000000000
export const PerformedWork = /*         */ 0b00000000001

// You can change the rest (and add more).
export const Placement = /*             */ 0b00000000010
export const Update = /*                */ 0b00000000100
export const PlacementAndUpdate = /*    */ 0b00000000110
export const Deletion = /*              */ 0b00000001000
export const ContentReset = /*          */ 0b00000010000
export const Callback = /*              */ 0b00000100000
export const DidCapture = /*            */ 0b00001000000
export const Ref = /*                   */ 0b00010000000
export const Snapshot = /*              */ 0b00100000000

// Update & Callback & Ref & Snapshot
export const LifecycleEffectMask = /*   */ 0b00110100100

// Union of all host effects
export const HostEffectMask = /*        */ 0b00111111111

export const Incomplete = /*            */ 0b01000000000
export const ShouldCapture = /*         */ 0b10000000000
```

### Update & UpdateQueue

```js
export type Update<State> = {
  // 更新的过期时间
  expirationTime: ExpirationTime,

  // export const UpdateState = 0;
  // export const ReplaceState = 1;
  // export const ForceUpdate = 2;
  // export const CaptureUpdate = 3;
  // 指定更新的类型，值为以上几种
  tag: 0 | 1 | 2 | 3,
  // 更新内容，比如`setState`接收的第一个参数
  payload: any,
  // 对应的回调，`setState`，`render`都有
  callback: (() => mixed) | null,

  // 指向下一个更新
  next: Update<State> | null,
  // 指向下一个`side effect`
  nextEffect: Update<State> | null
}

export type UpdateQueue<State> = {
  // 每次操作完更新之后的`state`
  baseState: State,

  // 队列中的第一个`Update`
  firstUpdate: Update<State> | null,
  // 队列中的最后一个`Update`
  lastUpdate: Update<State> | null,

  // 第一个捕获类型的`Update`
  firstCapturedUpdate: Update<State> | null,
  // 最后一个捕获类型的`Update`
  lastCapturedUpdate: Update<State> | null,

  // 第一个`side effect`
  firstEffect: Update<State> | null,
  // 最后一个`side effect`
  lastEffect: Update<State> | null,

  // 第一个和最后一个捕获产生的`side effect`
  firstCapturedEffect: Update<State> | null,
  lastCapturedEffect: Update<State> | null
}
```
