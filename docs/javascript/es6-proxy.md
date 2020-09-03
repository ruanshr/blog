---
prev: /javascript/es6-format
next: /javascript/es2020
---
 # Proxy
 ## Proxy代理是一个共通的概念，可以起到拦截的作用。
 ES6将Proxy标准化，提供了Proxy构造函数，用来生成Proxy实例。
 例如: 
```js
   var  p = new Proxy(target,handler);。
// 构造函数有两个参数，第一个参数target是拦截的对象，第二个参数是拦截函数对象。
    const handler = { 
            get(target,prop){ 
                if(prop in target){ 
                        return  target[prop]; 
                    } 
                    throw new Error("not exist property") 
            } 
    } 
    const p = new Proxy({name:'张三'},handler); 
    console.log(p.name); //张三 
    console.log(p.status);// Error: not exist property

```

上面例子中为Object对象定义了get的拦截行为。如果对象内有该属性，则返回属性值，否则抛出异常，其中拦截操作是在Proxy实例对象p上面进行的，而非在{name:'张三'}对象上进行的。

## Proxy的handler回调函数提供了13种拦截行为：
```js
getPrototypeOf / setPrototypeOf

isExensible / preventExtensions

ownKeys /getOwnPropertyDescriptor

defineProperty /deleteProperty

get / set / has

apply / construct

getPrototypeOf / setPrototypeOf
```

## handler.getPrototypeOf(target)可以拦截对象的原型对象的行为：
```js
Object.getPropertyOf()

Reflect.getPropertyOf()

.proto

Object.property.isPrototypeOf()

instanceof
```
参数target即想获取它原型对象的对象。返回值是返回改原型对象或者null。

## handler.setPrototypeOf(target,prototype) 可以拦截变更对象的原型对象的行为
```js
Object.setPrototypeOf()

Reflect.setPrototypeOf()
```
参数target是目标对象，参数prototype是给目标对象设置的原型对象或null。返回值如果目标对象的原型对象被成功改变，返回true，否则返回false。



##  isExtensible / preventExtensions

handler.isExtensible(target) 可以拦截判断对象是否可扩展（即是否能追加新属性）的行为：
```js
Object.isExtensible()

Reflect.isExtensible()   
```
参数target是目标对象。返回值如果目标对象可扩展，返回true,否则返回false。

### handler.preventExtensions(target) 可以拦截阻止对象被扩展（即不能为对象增加新的属性，但是既有属性的值仍然可以更改，也可以把属性删除）的行为：
```js
Object.preventExtensions()

Reflect.preventExtensions()   
```
参数target是目标对象。返回值如果想阻止对象被扩展返回true，否则返回false，但是注意只有在Object.isExtensible(target) 为 false 才能返回true，否则会报错。因为Object.isExtensible(target);返回true，表示对象可获赠，此时你拦截preventExtensions并返回true的话会报错，无法阻止一个可扩展对象进行扩展。所以通常应该在handler.preventExtensions里调用Object.preventExtensions来阻止对象的可扩展性，让Obejct.isExtensible(target);返回false。

##  ownKeys / getOwnPropertyDescriptor

### handler.ownKeys(target)可以拦截获取属性名的行为：
```js
Object.getOwnPropertyNames()

Object.getOwnPropertySymbols()

Object.keys()

Reflect.ownKeys()
```
参数target是目标对象，返回一个数字包含对象所有自身的属性，而Object.keys()仅返回对象可遍历的属性。例如拦截前缀为下划线的属性名。

### handler.getOwnPropertyDescriptor(target,prop)可以拦截获取自身属性描述的行为：
```js
Object.getOwnPropertyDescriptor()

Reflect.getOwnPropertyDescriptor()
```
参数target是目标对象，参数prop是自身的属性名。返回该属性的描述或undefined。

##  defineProperty / deleteProperty

### handler.defineProperty(target,property,descriptor)可以拦截定义属性的行为：
```js
Object.defineProperty()

Reflect.defineProperty()
```
参数target是目标对象，参数property是属性名，参数descriptor是属性描述符。返回值如果该属性被定义成功，返回true，否则返回false。

###   handler.deleteProperty(target,property)可以拦截delete属性的行为：
```js
delete proxy[prop]  

delete proxy.prop

Reflect.deleteProperty
```
参数target是目标对象，参数property是要删除的属性名。返回值如果该属性被删除成功，返回true，否则返回false。

##  get / set / has

### handler.get(target, property, receiver)可以拦截读取对象属性值的行为：
```js
proxy[foo] 

proxy.bar

Object.create(proxy)[foo]

Reflect.get()
```
参数target是目标对象，参数property是属性名，参数receiver是一个可选对象，有时我们必须要搜索几个对象，可能是一个在receiver原型链上的对象。返回值就是属性值。

### handler.set(target, property, value, receiver)可以拦截设置对象属性值的行为：
```js
proxy[foo] = bar

proxy.foo = bar

Object.create(proxy)[foo] = bar

Reflect.set()
```
参数target是目标对象，参数property是属性名，参数value是属性值，参数receiver是一个可选对象，有时我们必须要搜索几个对象，可能是一个在receiver原型链上的对象。返回值如果设值成功，返回true，否则返回false。

### handler.has(target, prop)可以拦截检查是否含有该参数的in行为：
```js
foo in proxy

foo in Object.create(proxy)

with(proxy){ (foo); }

Reflect.has()
```
参数target是目标对象，参数prop是属性名。返回值如果含有该属性，返回true，否则返回false。

注意，has方法拦截的是hasProperty操作，而不是hasOwnProperty操作，即has方法不care该属性是对象自身的属性，还是继承来的属性。另外，虽然for…in循环也用到了in运算符，但是Chrome55，Firefox49，Opera39上试下来，for…in里并不触发has拦截。

##  apply / construct

Proxy不止可以拦截对象的操作还能用这两个方法拦截函数。

### handler.apply(target, thisArg, argumentsList)可以拦截函数调用的行为，包括apply调用，call调用：
```js
proxy(...args)

Function.prototype.apply()

Function.prototype.call()

Reflect.apply()
```
参数target是函数对象，参数thisArg是函数对象的this，参数argumentsList是函数参数。返回值可返回任意东西。

### handler.construct(target, argumentsList, newTarget)可以拦截new命令：
```js
new proxy(...args)

Reflect.construct()
```
参数target是目标对象，参数argumentsList是构造函数参数，参数newTarget。返回new后的对象，注意必须是对象，否则例如返回数字会报错。

同一个拦截器函数，可以同时设置多个上面介绍的13种拦截方法

##  Proxy.revocable()

Proxy自身还有个静态方法Proxy.revocable(target, handler)，用于创建并返回一个可取消的Proxy对象。返回的这个可取消的Proxy对象有两个属性：proxy和revoke
属性proxy会调用new Proxy(target, handler)创建一个新的Proxy对象。属性revoke是一个无参函数，用于取消，即让该Proxy对象无效。

参考链接：[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)


