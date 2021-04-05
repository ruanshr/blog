---
prev: /javascript/script-tab
next: /javascript/sort-info
---

# Set和Map

Vue3.0采用了ES6最新的数据结构，那么Set和Map有什么不同

## Set
定义：类似于数组的数据结构，成员值都是唯一且没有重复的值

声明：const set = new Set(arr)

入参：具有Iterator接口的数据结构

> 属性

+ constructor：构造函数，返回Set
+ size：返回实例成员总数
> 方法

+ add()：添加值，返回实例
+ delete()：删除值，返回布尔值
+ has()：检查值，返回布尔值
+ clear()：清除所有成员
+ keys()：返回以属性值为遍历器的对象
+ values()：返回以属性值为遍历器的对象
+ entries()：返回以属性值和属性值为遍历器的对象
+ forEach()：使用回调函数遍历每个成员

> 应用场景

+ 去重字符串：[...new Set(str)].join("")
+ 去重数组：[...new Set(arr)]或Array.from(new Set(arr))
+ 集合数组
+ 声明：const a = new Set(arr1)、const b = new Set(arr2)
+ 并集：new Set([...a, ...b])
+ 交集：new Set([...a].filter(v => b.has(v)))
+ 差集：new Set([...a].filter(v => !b.has(v)))
+ 映射集合
+ 声明：let set = new Set(arr)
+ 映射：set = new Set([...set].map(v => v * 2))或set = new Set(Array.from(set, v => v * 2))

> 重点难点

+ 遍历顺序：插入顺序
+ 没有键只有值，可认为键和值两值相等
+ 添加多个NaN时，只会存在一个NaN
+ 添加相同的对象时，会认为是不同的对象
+ 添加值时不会发生类型转换(5 !== "5")
+ keys()和values()的行为完全一致，entries()返回的遍历器同时包括键和值且两值相等


## WeakSet
定义：和Set结构类似，成员值只能是对象

声明：const set = new WeakSet(arr)

入参：具有Iterator接口的数据结构

> 属性

+ constructor：构造函数，返回WeakSet

> 方法

+ add()：添加值，返回实例
+ delete()：删除值，返回布尔值
+ has()：检查值，返回布尔值

> 应用场景

+ 储存DOM节点：DOM节点被移除时自动释放此成员，不用担心这些节点从文档移除时会引发内存泄漏
+ 临时存放一组对象或存放跟对象绑定的信息：只要这些对象在外部消失，它在WeakSet结构中的引用就会自动消

>重点难点

+ 成员都是弱引用，垃圾回收机制不考虑WeakSet结构对此成员的引用
+ 成员不适合引用，它会随时消失，因此ES6规定WeakSet结构不可遍历
+ 其他对象不再引用成员时，垃圾回收机制会自动回收此成员所占用的内存，不考虑此成员是否还存在于WeakSet结构中

## Map
定义：类似于对象的数据结构，成员键可以是任何类型的值

声明：const set = new Map(arr)

入参：具有Iterator接口且每个成员都是一个双元素数组的数据结构
```js


const studentMap = new Map([['name','张三'], ['age', '34']])
```

> 属性

+ constructor：构造函数，返回Map
+ size：返回实例成员总数
> 方法

+ get()：返回键值对
+ set()：添加键值对，返回实例
+ delete()：删除键值对，返回布尔值
+ has()：检查键值对，返回布尔值
+ clear()：清除所有成员
+ keys()：返回以键为遍历器的对象
+ values()：返回以值为遍历器的对象
+ entries()：返回以键和值为遍历器的对象
+ forEach()：使用回调函数遍历每个成员

> 重点难点

+ 遍历顺序：插入顺序
+ 对同一个键多次赋值，后面的值将覆盖前面的值
+ 对同一个对象的引用，被视为一个键
+ 对同样值的两个实例，被视为两个键
+ 键跟内存地址绑定，只要内存地址不一样就视为两个键
+ 添加多个以NaN作为键时，只会存在一个以NaN作为键的值
+ Object结构提供字符串—值的对应，Map结构提供值—值的对应

## WeakMap
定义：和Map结构类似，成员键只能是对象

声明：const set = new WeakMap(arr)

入参：具有Iterator接口且每个成员都是一个双元素数组的数据结构

> 属性

+ constructor：构造函数，返回WeakMap

> 方法

+ get()：返回键值对
+ set()：添加键值对，返回实例
+ delete()：删除键值对，返回布尔值
+ has()：检查键值对，返回布尔值

> 应用场景

+ 储存DOM节点：DOM节点被移除时自动释放此成员键，不用担心这些节点从文档移除时会引发内存泄漏
+ 部署私有属性：内部属性是实例的弱引用，删除实例时它们也随之消失，不会造成内存泄漏

> 重点难点

+ 成员键都是弱引用，垃圾回收机制不考虑WeakMap结构对此成员键的引用
+ 成员键不适合引用，它会随时消失，因此ES6规定WeakMap结构不可遍历
+ 其他对象不再引用成员键时，垃圾回收机制会自动回收此成员所占用的内存，不考虑此成员是否还存在于WeakMap结构中
+ 一旦不再需要，成员会自动消失，不用手动删除引用
+ 弱引用的只是键而不是值，值依然是正常引用
+ 即使在外部消除了成员键的引用，内部的成员值依然存在