# 原型继承

1、原型链继承

```js
Child.prototype = new Parent()

```

2、原型式继承 （Object.create实现）

```js

function create(obj) {
    function Func() {}
    Func.prototype = obj
    return new Func()
}
Child.prototype = create(Parent.prototype)

Child.prototype.constructor = Child

```

3、寄生组合继承 (extend实现原理)

```js
// 继承属性
function Child(){
    Parent.call(this)
}
function create(obj) {
    function Func(){}
    Func.prototype = obj
    return new Func()
}
// 继承方法
Child.prototype = create(Parent.prototype)

Child.prototype.constructor = Child

```