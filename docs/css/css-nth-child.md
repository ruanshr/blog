---
order: 6
---

# nth-child

:nth-child(an+b) 这个 CSS 伪类首先找到所有当前元素的兄弟元素，然后按照位置先后顺序从1开始排序，选择的结果为CSS伪类:nth-child括号中表达式（an+b）匹配到的元素集合（n=0，1，2，3...）。


**tr:nth-child(2n+1)**

表示HTML表格中的奇数行。

**tr:nth-child(odd)**

表示HTML表格中的奇数行。

**tr:nth-child(2n)**

表示HTML表格中的偶数行。

**tr:nth-child(even)**

表示HTML表格中的偶数行。

**span:nth-child(0n+1)**

表示子元素中第一个且为span的元素，与 :first-child 选择器作用相同。

**span:nth-child(1)**

表示父元素中子元素为第一的并且名字为span的标签被选中

**span:nth-child(-n+3)**

匹配前三个子元素中的span元素。

**span:nth-child(n+2)**

匹配除了第一个的其他子元素中的span元素。