---
prev: /javascript-extend/dom-api
next: /javascript-extend/event-loop
---

# Event loop

### 定义

> Event loop: 为了协调事件（event），用户交互（use interaction）,脚本（script），渲染（rendering），网络（networking）等，用户代理（use agent） 必须使用事件循环（event loops）

那么什么是事件？

> 事件：事件就是由于某种外在或者内在的信息状态发送的变化，从而导致出现了对应的反应。比如说用户点击了一个按钮，就是一个事件;html页面完成加载，也是一个事件。一个事件中UI包含读个任务。

Javascript引擎又称为Javascript解释器，是Javascript解释为机器码的工具，分别运行在浏览器和Node中。而根据上下文的不同，Event loop也有不同的实现：其中node使用libuv库来实现Event loop；而在浏览器中，html规范定义了Event loop,具体的实现则交给不同的厂商去完成。

所以，**浏览器的Event loop和Node的Event loop是两个概念**

### 意义

在实际工作中，了解Event loop的意义能帮助你**分析一些异步次序的问题**（当然，随着es7 async和await的流行，这样的机会越来越少了）。除此以外，它还对你**了解浏览器和Node的内部机制**有积极的作用；


### 浏览器上的实现

在JavaScript中，任务被分为Task（又称为MacroTask,宏任务）和MicroTask（微任务）两种。它们分别包含以下内容

> MacroTask: script(整体代码), setTimeout, setInterval, setImmediate（node独有）, I/O, UI rendering
MicroTask: process.nextTick（node独有）, Promises, Object.observe(废弃), MutationObserver

需要注意的一点是：在同一个上下文中，总的执行顺序为**同步代码—>microTask—>macroTask**

浏览器中，一个事件循环里有很多个来自不同任务源的任务队列（task queues），每一个任务队列里的任务是严格按照先进先出的顺序执行的。但是，因为浏览器自己调度的关系，不同任务队列的任务的执行顺序是不确定的

具体来说，浏览器会不断从task队列中按顺序取task执行，每执行完一个task都会检查microtask队列是否为空（执行完一个task的具体标志是函数执行栈为空），如果不为空则会一次性执行完所有microtask。然后再进入下一个循环去task队列中取下一个task执行，以此类推


## 什么时候执行浏览器渲染

在浏览器的事件循环中，"update rendering"阶段是指在主线程空闲时，浏览器执行对渲染的更新操作。

事件循环是浏览器用于处理异步任务的机制。它由多个阶段组成，包括"update rendering"阶段。以下是事件循环的基本流程：

执行同步任务：首先，浏览器会执行当前主线程上的所有同步任务，包括解析和执行JavaScript代码、处理DOM操作等。

执行微任务：在同步任务执行完成后，浏览器会检查微任务队列，并按照FIFO（先进先出）的顺序依次执行微任务。微任务包括Promise的回调函数、MutationObserver的回调函数等。

更新渲染：在执行完所有微任务后，浏览器会检查是否需要执行"update rendering"阶段。在该阶段，浏览器会根据最新的DOM状态和样式信息，进行页面的重新布局（reflow）和重绘（repaint）操作，以确保页面的正确显示。

执行宏任务：在"update rendering"阶段完成后，浏览器会检查宏任务队列，并按照一定的策略选择一个宏任务执行。常见的宏任务包括定时器回调函数、事件回调函数、网络请求等。

回到第二步，继续执行微任务、更新渲染和执行宏任务，直到所有任务都被处理完。

需要注意的是，"update rendering"阶段不是每次事件循环都会执行的。它只会在主线程空闲时执行，且在微任务执行完毕后才会进行。这样可以避免频繁的渲染操作，提高性能和效率。

总结起来，"update rendering"阶段是浏览器事件循环中的一个阶段，在主线程空闲时执行，用于更新页面的布局和样式信息，以保持页面的正确显示。