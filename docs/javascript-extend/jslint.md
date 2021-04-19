---
prev: /javascript-extend/js-memory
next: /javascript-extend/jsnew
---

# jslint

在项目根目录下建立一个 .jshintrc 文件，这个文件就是 JSHint 的配置文件，JSHint 会自动识别这个文件，根据这里面的规则对文件进行检查
JSHint 的配置分为四类：
　　 Enforcing(增强)：如果这些属性设置为 true，JSHint 会对代码进行更严格的检查，比如是否使用严格（strict）模式、变量驼峰式命名、是不是 for-in 循环里必须得有 hasOwnProperty 等等
　　 Relaxing(松弛)：如果这些属性设置为 true，JSHint 会容忍规则中定义的情况出现。比如是否使用分号，是否支持下一代 ES 语法等等。
　　 Environments(环境)：如果这些属性设置为 true，表示代码所处的环境
　　 globals(全局变量)：自定义的一些全局变量

增强
bitwise 禁用位运算符
camelcase 使用驼峰命名(camelCase)或全大写下划线命名(UPPER_CASE)
curly 在条件或循环语句中使用{}来明确代码块
eqeqeq 使用===和!==替代==和!=
es3 强制使用 ECMAScript 3 规范
es5 强制使用 ECMAScript 5 规范
forin 在 for in 循环中使用 Object.prototype.hasOwnProperty()来过滤原型链中的属性
freeze 禁止复写原生对象(如 Array, Date)的原型
immed 匿名函数调用必须(function() {}());而不是(function() {})();
indent 代码缩进宽度
latedef 变量定义前禁止使用
newcap 构造函数名首字母必须大写
noarg 禁止使用 arguments.caller 和 arguments.callee
noempty 禁止出现空的代码块
nonew 禁止使用构造器
plusplus 禁止使用++和–-
quotemark 统一使用单引号或双引号
undef 禁止使用不在全局变量列表中的未定义的变量
unused 禁止定义变量却不使用
strict 强制使用 ES5 的严格模式
trailing 禁止行尾空格
maxparams 函数可以接受的最大参数数量
maxdepth 代码块中可以嵌入{}的最大深度
maxstatement 函数中最大语句数
maxcomplexity 函数的最大圈复杂度
maxlen 一行中最大字符数

松弛
asi 　　　　　允许省略分号
boss 　　　　　 允许在 if，for，while 语句中使用赋值
debug 　　　　　允许 debugger 语句
eqnull 　　　　　允许==null
esnext 　　　　 允许使用 ECMAScript 6
evil 　　　 允许使用 eval
expr 允许应该出现赋值或函数调用的地方使用表达式
funcscope 允许在控制体内定义变量而在外部使用
globalstrict 允许全局严格模式
iterator 　 允许**iterator**
lastsemic 允许单行控制块省略分号
laxbreak 允许不安全的行中断
laxcomma 　　　 允许逗号开头的编码样式
loopfunc 允许循环中定义函数
maxerr 　　　　 JSHint 中断扫描前允许的最大错误数
multistr 　　 允许多行字符串
notypeof 　　　 允许非法的 typeof 操作
proto 允许 proto
smarttabs 　　 允许混合 tab 和 space 排版
shadow 　　 允许变量 shadow
sub 　　　　 允许使用 person[‘name’]
supernew 　　　 允许使用 new function() {…}和 new Object
validthis 　　 允许严格模式下在非构造函数中使用 this
noyield 　　　 允许发生器中没有 yield 语句

环境
browser Web Browser (window, document, etc)
browserify Browserify (node.js code in the browser)
jquery jQuery
node Node.js
qunit QUnit
typed Globals for typed array constructions
worker Web Workers
wsh Windows Scripting Host

全局变量

```json
globals: {
    jQuery: true,
    console: true,
    module: true,
    $: true
}

```
