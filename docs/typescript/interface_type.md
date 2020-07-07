# Typescript中接口interface和类型别名type的用法区别

在使用typescript开发过程中，发现接口interface和类型别名type用法很像，因此有必要理清楚这2个用法的异同点。

1、 定义对象时，2者用法相似
```js

interface Person<T> {
  age: T,
  sex: string
}

let jackson: Person<number> = {
  age: 20,
  sex: 'man'
}

type Person<T> = {
  age: T,
  sex: string
}

let tom: Person<number> = {
  age: 23,
  sex: 'man'
}

```

2、定义简单类型，type可以，interface 不可以

```js

type Name = string | number;

let name: Name = 9527

```

3、定义函数类型，type 和 interface都可以，只是写法不一样

```js

interface ISetPerson {
  (age: number, sex: string): void
}

type TSetPerson = (age: number, sex: string) => void

```

4、interface 可以被 interface 继承 和 class 实现，但type 不可以，
type 可以用 & 或者 | 来表示


```js

interface Boy{
  age: number,
  girlFriends: Array<string>
}
interface Girl{
  age: number,
  boyFriends: Array<string>
}

type You = Boy | Girl
let you: You = {
  age: 31,
  girlFriends: [] // 必须有 boyFriends, girlFriends 其一
}

type Me = Boy & Girl
let me: me = {
  age: 31,
  girlFriends: [], // 必须有 boyFriends 和 girlFriends 
  boyFriends: []
}

```