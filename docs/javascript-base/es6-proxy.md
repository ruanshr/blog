---
order: 2
---

# Proxy 函数

### Proxy 代理是一个共通的概念，可以起到拦截的作用。

ES6 将 Proxy 标准化，提供了 Proxy 构造函数，用来生成 Proxy 实例。
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

上面例子中为 `Object` 对象定义了 `get` 的拦截行为。如果对象内有该属性，则返回属性值，否则抛出异常，其中拦截操作是在 `Proxy` 实例对象 p 上面进行的，而非在{name:'张三'}对象上进行的。

### Proxy 的 `handler` 回调函数提供了 13 种拦截行为：

```js
;`getPrototypeOf` /
  `setPrototypeOf``isExensible` /
  `preventExtensions``ownKeys` /
  `getOwnPropertyDescriptor``defineProperty` /
  `deleteProperty``get` /
  `set` /
  `has``apply` /
  `construct``getPrototypeOf` /
  `setPrototypeOf`
```

### `handler.getPrototypeOf(target)`可以拦截对象的原型对象的行为：

```js
Object.getPropertyOf()

Reflect.getPropertyOf()

.proto

Object.property.isPrototypeOf()

instanceof
```

参数 `target` 即想获取它原型对象的对象。返回值是返回改原型对象或者 null。

### `handler.setPrototypeOf(target,prototype)` 可以拦截变更对象的原型对象的行为

```js
Object.setPrototypeOf()

Reflect.setPrototypeOf()
```

参数 `target` 是目标对象，参数 `prototype` 是给目标对象设置的原型对象或 null。返回值如果目标对象的原型对象被成功改变，返回 true，否则返回 `false`。

### isExtensible / preventExtensions

`handler.isExtensible(target)` 可以拦截判断对象是否可扩展（即是否能追加新属性）的行为：

```js
Object.isExtensible()

Reflect.isExtensible()
```

参数 `target` 是目标对象。返回值如果目标对象可扩展，返回 `true`,否则返回 `false。`

**`handler.preventExtensions(target)` 可以拦截阻止对象被扩展（即不能为对象增加新的属性，但是既有属性的值仍然可以更改，也可以把属性删除）的行为：**

```js
Object.preventExtensions()

Reflect.preventExtensions()
```

参数 `target` 是目标对象。返回值如果想阻止对象被扩展返回 `true`，否则返回 `false`，但是注意只有在 `Object.isExtensible(target)` 为 `false` 才能返回 `true`，否则会报错。因为 `Object.isExtensible(target)`;返回 `true`，表示对象可获赠，此时你拦截 `preventExtensions` 并返回 `true` 的话会报错，无法阻止一个可扩展对象进行扩展。所以通常应该在 `handler.preventExtensions` 里调用 `Object.preventExtensions` 来阻止对象的可扩展性，让 `Obejct.isExtensible(target);`返回 `false`。

### `ownKeys` / `getOwnPropertyDescriptor`

**`handler.ownKeys(target)`可以拦截获取属性名的行为：**

```js
Object.getOwnPropertyNames()

Object.getOwnPropertySymbols()

Object.keys()

Reflect.ownKeys()
```

参数 `target` 是目标对象，返回一个数字包含对象所有自身的属性，而 Object.keys()仅返回对象可遍历的属性。例如拦截前缀为下划线的属性名。

**`handler.getOwnPropertyDescriptor(target,prop)`可以拦截获取自身属性描述的行为：**

```js
Object.getOwnPropertyDescriptor()

Reflect.getOwnPropertyDescriptor()
```

参数 `target` 是目标对象，参数 `prop` 是自身的属性名。返回该属性的描述或 `undefined`。

### defineProperty / deleteProperty

**handler.defineProperty(target,property,descriptor)可以拦截定义属性的行为：**

```js
Object.defineProperty()

Reflect.defineProperty()
```

参数 `target` 是目标对象，参数 `property` 是属性名，参数 `descriptor` 是属性描述符。返回值如果该属性被定义成功，返回 `true`，否则返回 `false`。

**handler.deleteProperty(target,property)可以拦截 delete 属性的行为：**

```js
delete proxy[prop]

delete proxy.prop

Reflect.deleteProperty
```

参数 `target` 是目标对象，参数 `property` 是要删除的属性名。返回值如果该属性被删除成功，返回 `true`，否则返回 `false`。

### `get` / `set` / `has`

**`handler.get(target, property, receiver)`可以拦截读取对象属性值的行为：**

```js
proxy[foo]

proxy.bar

Object.create(proxy)[foo]

Reflect.get()
```

参数 target 是目标对象，参数 property 是属性名，参数 receiver 是一个可选对象，有时我们必须要搜索几个对象，可能是一个在 receiver 原型链上的对象。返回值就是属性值。

**`handler.set(target, property, value, receiver)`可以拦截设置对象属性值的行为：**

```js
proxy[foo] = bar

proxy.foo = bar

Object.create(proxy)[foo] = bar

Reflect.set()
```

参数 `target` 是目标对象，参数 `property` 是属性名，参数 `value` 是属性值，参数 `receiver` 是一个可选对象，有时我们必须要搜索几个对象，可能是一个在 `receiver` 原型链上的对象。返回值如果设值成功，返回 `true`，否则返回 `false`。

**handler.has(target, prop)可以拦截检查是否含有该参数的 in 行为：**

```js
foo in proxy

foo in Object.create(proxy)

with (proxy) {
  foo
}

Reflect.has()
```

参数 `target` 是目标对象，参数 `prop` 是属性名。返回值如果含有该属性，返回 true，否则返回 false。

`注意，has` 方法拦截的是 `hasProperty` 操作，而不是 `hasOwnProperty` 操作，即 has 方法不 care 该属性是对象自身的属性，还是继承来的属性。另外，虽然 `for…in` 循环也用到了 in 运算符，但是 Chrome55，Firefox49，Opera39 上试下来，`for…in` 里并不触发 has 拦截。

### `apply` / `construct`

`Proxy` 不止可以拦截对象的操作还能用这两个方法拦截函数。

**`handler.apply(target, thisArg, argumentsList)`可以拦截函数调用的行为，包括 `apply` 调用，`call` 调用：**

```js
proxy(...args)

Function.prototype.apply()

Function.prototype.call()

Reflect.apply()
```

参数 target 是函数对象，参数 thisArg 是函数对象的 this，参数 argumentsList 是函数参数。返回值可返回任意东西。

**`handler.construct(target, argumentsList, newTarget)`可以拦截 new 命令：**

```js
new proxy(...args)

Reflect.construct()
```

参数 `target` 是目标对象，参数 `argumentsList` 是构造函数参数，参数 `newTarget`。返回 `new` 后的对象，注意必须是对象，否则例如返回数字会报错。

同一个拦截器函数，可以同时设置多个上面介绍的 13 种拦截方法

### Proxy.revocable()

`Proxy` 自身还有个静态方法 `Proxy.revocable(target, handler)`，用于创建并返回一个可取消的 `Proxy` 对象。返回的这个可取消的 `Proxy` 对象有两个属性：`proxy` 和 `revoke`
属性 `proxy` 会调用` new Proxy(target, handler)`创建一个新的 `Proxy` 对象。属性 `revoke` 是一个无参函数，用于取消，即让该 `Proxy` 对象无效。

参考链接：[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)
