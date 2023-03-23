# React Fiber 简介 —— React 背后的算法

在这篇文章中，我们将了解 React Fiber —— React 背后的核心算法。React Fiber 是 React 16 中新的协调算法。你很可能听说过 React 15 中的 virtualDOM，这是旧的协调算法（因为它在内部使用堆栈也被称为堆栈协调器）。不同的渲染器，如 DOM、Native 和 Android 视图，都会共享同一个协调器，所以称它为 virtualDOM 可能会导致混淆。

让我们赶紧看看什么是 React Fiber

### 介绍
React Fiber 是针对就协调器重写的完全向后兼容的一个版本。React 的这种新的协调算法被称为 Fiber Reconciler。这个名字来自于 fiber，它经常被用来表示 DOM 树的节点。我们将在后面的章节中详细介绍 fiber。

Fiber 协调器的主要目标是增量渲染，更好更平滑地渲染 UI 动画和手势，以及用户互动的响应性。协调器还允许你将工作分为多个块，并将渲染工作分为多个帧。它还增加了为每个工作单元定义优先级的能力，以及暂停、重复使用和中止工作的能力。

React 的其他一些特性包括从一个渲染函数返回多个元素，支持更好的错误处理（我们可以使用 componentDidCatch 方法来获得更清晰的错误信息），以及 portals。

在计算新的渲染更新时，React 会多次回访主线程。因此，高优先级的工作可以跳过低优先级的工作。React 在内部为每个更新定义了优先级。

在进入技术细节之前，我建议你学习以下术语，这将有助于理解 React Fiber。

### 先决条件

**协调**
正如官方 React 文档 所解释的, reconciliation 是两个 DOM 树 diff 的算法。当用户界面第一次渲染时，React 创建了一个节点树。每个单独的节点都代表 React 元素。它创建了一个虚拟树（被称为 virtualDOM），是渲染的 DOM 树的副本。在来自用户界面的任何更新之后，它递归地比较两棵树的每一个树节点。然后，累积的变化被传递给渲染器。

**调度**
正如官方 React 文档所解释的, 假设我们有一些低优先级的工作（如大型计算函数或最近获取的元素的渲染），和一些高优先级的工作（如动画）。应该有一个选项，将高优先级的工作优先于低优先级的工作。在旧的堆栈协调器实现中，递归遍历和调用整个更新的树的渲染方法都发生在单个流程中，这可能会导致丢帧。

调度可以是基于时间或基于优先级的。更新应该根据 deadline 来安排，高优先级的工作应该被安排在低优先级的工作之上。

**requestIdleCallback（请求闲置回调）**
requestAnimationFrame 安排高优先级的函数在下一个动画帧之前被调用。类似地，requestIdleCallback 安排低优先级或非必要的函数在帧结束时的空闲时间被调用。
```js
requestIdleCallback(lowPriorityWork);
```
这里展示了 requestIdleCallback 的用法。lowPriorityWork 是一个回调函数，将在帧结束时的空闲时间内被调用。
```js
function lowPriorityWork(deadline) {
  while (deadline.timeRemaining() > 0 && workList.length > 0)
    performUnitOfWork();

  if (workList.length > 0) requestIdleCallback(lowPriorityWork);
}
```
当这个回调函数被调用时，它得到参数 deadline 对象。正如你在上面的片段中看到的，timeRemaining 函数返回最近的剩余空闲时间。如果这个时间大于零，我们可以做一些必要的工作。而如果工作没有完成，我们可以在下一帧的最后一行再次安排工作。

所以，现在我们可以继续研究 fiber 对象本身，看看 React Fiber 是如何工作的

### Fiber 的结构

一个 fiber（小写'f'）是一个简单的 JavaScript 对象。它代表 React 元素或 DOM 树的一个节点。它是一个工作单位。相比之下，Fiber 是 React Fiber 的协调器。

这个例子展示了一个简单的 React 组件，在 root div 中进行渲染。
```js
function App() {
  return (
    <div className="wrapper">
      <div className="list">
        <div className="list_item">List item A</div>
        <div className="list_item">List item B</div>
      </div>
      <div className="section">
        <button>Add</button>
        <span>No. of items: 2</span>
      </div>
    </div>
  );
}
```

ReactDOM.render(<App />, document.getElementById("root"));
这是一个简单的组件，为我们从组件状态得到的数据显示一个列表项。(我把 .map 和对数据的迭代替换成两个列表项，只是为了让这个例子看起来更简单）还有一个按钮和 span，它显示了列表项的数量。

如前所述，fiber 代表 React 元素。在第一次渲染时，React 会浏览每个 React 元素并创建一棵 fibers 树。(我们将在后面的章节中看到它是如何创建这个树的）。

它为每个单独的 React 元素创建一个 fiber，就像上面的例子。它将为 div 创建一个 fiber，例如 W，它的类是 wrapper。然后，为具有 list 类的 div 创建 L fiber，以此类推。让我们为两个列表项的 fiber 命名为 LA 和 LB。

在后面的部分，我们将看到它是如何迭代的，以及树的最终结构。虽然我们称之为树，但 React Fiber 创建了一个节点的链表，其中每个节点都是一个 fiber。 并且在父、子和兄弟姐妹之间存在着一种关系。React 使用一个 return 键来指向父节点，任何一个子 fiber 在完成工作后都应该返回该节点。所以，在上面的例子中，LA 的返回是 L，而兄弟姐妹是 LB。

那么，这个 fiber 物体究竟是什么样子的呢？

下面是 React 代码库中对 fiber 类型的定义。我删除了一些额外的 props，并保留了一些注释以理解属性的含义。你可以在 React codebase 中找到详细的结构。