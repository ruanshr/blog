# !. 与 ?.的区别

### 在JavaScript中，`!.`和`?.`是两个不同的操作符，具有不同的作用和用法。

`!.`（非空断言操作符）：
`!.`是TypeScript中的非空断言操作符，用于告诉编译器某个值肯定不为null或undefined。它的作用是告诉编译器不进行空值检查，直接将该值视为非空，并允许对其进行属性或方法的访问。这个操作符只在TypeScript中有效，JavaScript中并不存在这个操作符。

示例：
```js
const obj = {
  name: 'John',
  age: 25
};

console.log(obj!.name); // TypeScript中的非空断言操作符，输出: 'John'
```

`?.`（可选链操作符）：
`?.`是JavaScript中的可选链操作符，用于简化对可能为null或undefined的值进行属性或方法访问的情况。它的作用是在访问属性或调用方法之前，先判断该值是否为null或undefined，如果是，则直接返回undefined，而不会引发错误。

示例：
```js
const obj = {
  name: 'John',
  age: 25
};

console.log(obj?.name); // JavaScript中的可选链操作符，输出: 'John'

const nullObj = null;
console.log(nullObj?.name); // 输出: undefined
```

在示例中，使用`?.`操作符可以安全地访问obj对象的name属性，即使obj为null或undefined，也不会引发错误。而对于nullObj对象，由于其值为null，使用`?.`操作符访问name属性时会直接返回undefined。

需要注意的是，`!.`是TypeScript中的非空断言操作符，而`?.`是JavaScript中的可选链操作符。它们的作用和用法不同，分别用于不同的语言环境和目的。在使用时需要根据具体情况选择合适的操作符。