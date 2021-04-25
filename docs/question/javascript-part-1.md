---
prev: /question/alibaba-pm6
next: /question/p6-questions
---

# Javascript 面试题
### 选择题
1、下列哪个属性可以让js脚本在文档完全呈现之后再执行（ C ）

A. async  B. delay   C. defer  D. readState

2、在js函数内部，可以通过哪个对象访问函数的参数（ B）

A. object  B. arguments   C. options  D. parameters

3、Js中，下列哪种数据类型属于基础类型（C）

A. object  B. function  C. string  D. array 

4、Js中，下列哪种方式可以在函数内部 实现对函数自身的调用（A）

A. arguments.caller  B. arguments.callee  C. this.caller  D. this.callee

5、navigator哪个属性可以查看完整的浏览器名称（A）

A. appName  B. appCodeName  C. appVersion  D. userAgent

6、以下那条语句会报错（A）

A. var obj = ();  B. var obj = [];  C. var obj = {};  D. var obj = /t/;

7、以下那个单词不属于javascript保留字（B）

A. with  B. parent  C. class  D. void


8、html代码如下：
&lt;html&gt;&lt;body&gt;&lt;div&gt;&lt;span&gt;hello&lt;/span&gt;&lt;span&gt;helloAgain&lt;/span&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;
，哪段代码可以选中单词“hello”（D）
```js
A. $('span').eq(1).text()  B. $('div span')[0].text()

C. $('div span')[0].innerHTML()  D. $('div span')[0].innerHTML
```

9、HTML代码如下&lt;div&gt;&lt;div id="id[1]"&gt;abc&lt;/div&gt;&lt;/div&gt;,用jquery选择器获取该元素的正确方法为（C）
```js
A. $('#id[1]')  B. $('#id\[1\]')  C. $('#id\\[id\\]')  D. $('#id')
```
10、声明一个对象，给他加上name属性和show方法显示其name值，以下代码中正确的是（D）

A. var obj = [name: '张三', show: function(){ alert(name);};];

B. var obj = {name: '张三', show:"alert(this.name)"}

C. var obj = {name: '张三', show: function(){ alert(name);}};

C. var obj = {name: '张三', show: function(){ alert(this.name);}};


11、下面哪个表达式的值是‘object’？（C）

A. typeof 'abc'  B. typeof true  C. typeof null  D. typeof 23

12、 关于fn.call(obj, paramList) 函数的说法，错误的是? （D）

A. 使用call函數可以是fn中的this指针指向obj

B. fn必须是一个函数

C. obj必须是一个对象

D. paramList必须是一个数组

13、下列对“==” 和“===”运算符的说法错误的是（D）

A. “==”运算符只比较值，不比较类型

B. “===”运算符既比较值又比较类型

C. “==”运算符比“===”运算符的执行速度要快，因为它不检查类型

D. “===”运算符比“==”运算符的执行速度要快

14、function a(xx){ this.x = xx; return this; } var x = a(5); var y = a(6); 这段代码运行后，下列说法正确的是（D）

A. x.x 的值是 5, y.x的值是6

B. x.x 的值是 6, y.x的值是6

C. x === y 的返回值是true

D. x.x 的值是 undefined, y.x的值是6

15、有一个id为“myDiv”的元素，下面的哪个代码可以实现，如果元素存在就显示，如果不存在也不会报错？（B）
```js
A. $('*.myDiv').show();   B. $('#myDiv').show();

C. $('*.#myDiv').show();  D. $('$myDiv').show();
```
16、使用外部JS程序文件的正确格式是（B）
```js
A. <script href="xxx.js">  B. <script src="xxx.js">

C. <script name="xxx.js">  D. <script file="xxx.js">
```
17、下面四个变量声明语句中,哪一个变量的命名是正确的（B）

A. var while		B. var my_house		C. var my dog		D. var 2cats

18、下列JS的语句中,哪一个是合法的（D）
```js
A. document.write("john said,"Hi!"")

B. document.write("john said,"Hi!"')

C. document.write("john said,"Hi!")

D. document.write("john said,\"Hi!\"")
```
19、下列JS的判断语句中书写正确的是（A）

A. if(i==0) 	B. if(i=0) 	C. if i==0 then	D. if i=0 then

20、下列JavaScript的循环语句书写正确的是（D）

A. if(i<10;i++) 	B. for(i=0;i<10) 		C. for i=1 to 10	D. for(i=0;i<=10;i++)


### 判断题(5)：

1、当你指定了 ( border-bottom-color )和 ( border-bottom-width )时，你必须同时指定 ( border-bottom-style )，否则边框不会被呈现。（Y）

2、clear属性对于 currentStyle 对象而言是只读的。对于其他对象而言是可读写的。(Y)

3、当background-color与background-image 都被设定了时，background-image将覆盖于background-color之上。(Y)

4、&lt;a href=URL target=_blank&gt;…&lt;a/&gt;表示新打开一个窗口的超链接代码。 (Y)

5、在浏览器的文档对象模型（DOM）中，最高层的对象是文档（document）对象。（Y）

6、在JavaScript中，false === 0的结果是false。(Y)

7、在JavaScript中，"100" == 100的结果是true。(Y)


### 逻辑题：
1、一本书的价格降低50%.现在,如果按原价出售,提高了百分之几？

答案：(1/50%  - 1) * 100% = 100%

2、 有1000个苹果，10个箱子，将1000个苹果分装到10个箱子中，需要满足如下条件：
a. 装箱之后就不能拆开；
b. 当有人需要1～1000个苹果之间的任意个苹果，你都只需将其中任意个箱子的组合给他就行，当他拆开就是他所想要的苹果个数。

答案：每用一个箱子装苹果的个数是之前箱子苹果数之和加1
1，2，4，8，16，32，64，128，256，488

n个苹果 m个箱子则 1，2，..., $2^{m-2}$, n - $2^{m-1}$。 其中n 满足$2^{m+1}$ > n > $2^{m}$



3、 统计一篇英文文章的词频(该文章中每个英文单词出现的次数)，并找出出现次数最多一个或多个单词。






4、有9枚硬币，其中一枚是假币，给你一台天枰，在最坏的情况下，你最少需要称多少次才能找出假币。如果是n枚呢？

答案：2次

比log(n)/log(3) 大的最小正整数