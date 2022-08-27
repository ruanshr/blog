---
prev: /javascript/string
next: /javascript/symbol
---

#  调试技巧

### 1、copy as fetch 复制为fetch
在network标签页中，选中一个请求，右击，选中copy -> copy as fetch

### 2、复制变量

（1）右键点击这个变量，选择store as global variable，如果之前没有进行过这样的操作，那么想要拷贝的变量就会被复制temp1这个全局变量
（2）在控制台输入copy(temp1),这时候这个变量就被复制到剪切板

### 3、临时修改Javascript代码

Chrome中可以临时修改JS文件中的内容，保持（Ctrl + s )就可以立即生效，结合console等功能就可以立即重新调试了，丹注意这个修改是临时的，刷新页面修改就没有了

### 4、在页面操作时触发断点

在source面板，右击event listener breakpoint菜单，选择不同的类型的dom事件，可以在页面上发送对应的事件时，触发断点。

### 5、调用栈（call  stack ）

条件断点

### 6、查看变量

call stack列表的下方是scope variable列表，在这里可以查看此时局部变量和全局变量的值

### 7、在控制台设置断点

条件断点，
已有端点位置的邮件菜单中选择“add breakpoint...” 或者空白位置右击出现菜单选择“Add Condition breakpoint”， 可以设置触发断点的条件，就是写一个表达式，表达式为true时才触发断点，可以用条件断点替代在代码中的console.log

### 8、调用栈（call stack）

在断点停下来时，右侧调试区的call stack会显示当前断点所处的方法调用栈

### 9、在控制台设置断点，

在代码上设置断点，对于每个已添加的断点都有两种状态，禁用和激活。刚添加的端倪都是激活状态，禁用状态就是保留断点但是保留断点但临时取消了断点功能。

逐步执行，每点击一次，js语句往后执行依据 F11

逐过程执行，和逐语句执行不同，逐过程执行按钮常在一个方法调用多个js文件时，涉及到的js过程比较长，则会使用到这个按钮。

### 10、DOM节点发生变化时中断代码运行

在调试dom节点时，可以在chrome的elememnt界面，右击点击某个元素，选择break on选项，可以在子节点变化时中断，在元素属性变化时中断或者在节点被移除时中断代码运行。

### 11、在控制台设置断点

快捷键 F8 跳转到下一个断点，F10： step over，单步执行，不进入函数，F11： step into 单步执行，进入函数，shift + F11: step out跳出函数

### 12、console 功能

console.trace() 会显示函数调用的完整的堆栈轨迹信息

console.table() 很多时候，你可能会有一堆对象需要查看，可以用console.log把每个对象斗输出来，可以用console.table语句直接把所有的对象斗直接输出成一个表格

console.time 和 console.timeEnd 当想知道某些代码的执行时间的时候，这个工具会非常有用，特别是当你定位很耗时的循环的时候。

#### 13、debugger

在代码中添加debugger，在chrome运行的时候，会自动停在那里，可以用条件语句把他包裹起来，这样就可以在需要的时候才执行

### 14、 console功能

可以用%s设置字符串，%i设置数字，%c设置自定义样式

