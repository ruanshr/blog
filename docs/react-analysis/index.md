---
prev: false
next: /react-analysis/base/react-api
---

# React 源码解析


阅读源码的关键是你要去猜一开始开发者为什么会这么去设计，而一个开源框架和单纯的一个前端项目的代码差距是很大，设计的角度也是非常不同的，你不能用开发项目的思维去考虑一个开源框架的设计初衷。更不用说因为自己眼界的问题，一些之前自己基本没用过代码写法，在源码中看到的时候着实有点一脸懵逼。比如再看到**React Fiber**中关于**TypeOfMode**的设计的时候

```js

export const NoContext = 0b000;
export const AsyncMode = 0b001;
export const StrictMode = 0b010;
export const ProfileMode = 0b100;

```

一开始根本没有反应过来去考虑这么设计是为了简化类型比较，以及类型复合的方向。如果在以前自己项目开发的时候有接触过一些复合权限系统的设计，那么可能第一眼就能反应过来。

再比如作为前端开发者，我对于数据结构并没有特别深入学习，所以再看到firstEffect.nextEffect到lastEffect这种单向链表的数据结构设计的时候，一开始也老是把自己搞混，搞不清楚这里面的含义到底是什么。

在开篇说这些，就是想说一下自己经历这段时间学习 React 的源码得到的一些新的。**阅读源码并不只是让你深入的理解一个框架的运作原理，更能让你在一些实现方案上学习到一些更优的方法**

**在编程世界，我们如果不精进就是退步，不是么？**

回到主题，我总结了一下要理解 React 原理最核心的部分：

- 更新机制

- 什么是Fiber以及作用

- React 实现路更新任务的调度，如何实现的

这三项是我认为理解 React 的过程中最困难的部分。

React 的调度过程：

![React 的调度过程](../images/react-analysis/scheduler-fiber-scheduler.png)

以及渲染更新的过程:

![React 渲染更新的过程](../images/react-analysis/scheduler-render-root.png)