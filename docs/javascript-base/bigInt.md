---
order: 4
---

# ES6 新特性之 BigInt

`BigInt` 是一种内置对象，它提供了一种方法来表示大于 `$2^{53}$ - 1 `的整数。这原本是 `Javascript` 中可以用 `Number` 表示的最大数字。`BigInt` 可以表示任意大的**整数**。
在一个整数字面量后面加 n 的方式定义一个 `BigInt` ，如：10n，或者调用函数 `BigInt()`

```js
const myInt = 9007199254740991n

const myHuge = BigInt(9007199254740991)
// ↪ 9007199254740991n

const myHugeString = BigInt('9007199254740991')
// ↪ 9007199254740991n

const myHugeHex = BigInt('0x1fffffffffffff')
// ↪ 9007199254740991n

const myHugeBin = BigInt('0b11111111111111111111111111111111111111111111111111111')
// ↪ 9007199254740991n
```

它在某些方面类似于 `Number` ，但是也有几个关键的不同点：不能用于 Math 对象中的方法；不能和任何 `Number` 实例混合运算，两者必须转换成同一种类型。在两种类型来回转换时要小心，因为 BigInt 变量在转换成 `Number` 变量时可能会丢失精度

### 类型信息

```js
typeof 1n === 'bigint'
// ↪ true
typeof BigInt('1') === 'bigint'
// ↪ true
```

### 运算

以下操作符可以和 `BigInt` 一起使用： `+`、`*`、`-`、`**`、`%` 。除 `>>>` （无符号右移）之外的 位操作 也可以支持。因为 BigInt 都是有符号的， `>>>` （无符号右移）不能用于 `BigInt`。`BigInt `不支持单目 (`+`) 运算符

```js
const maxSafeInt = BigInt(Number.MAX_SAFE_INTEGER)
// ↪ 9007199254740991n

const maxPlusOne = maxSafeInt + 1n
// ↪ 9007199254740992n

const theFuture = maxSafeInt + 2n
// ↪ 9007199254740993n, this works now!

const multi = maxSafeInt * 2n
// ↪ 18014398509481982n

const subtr = multi - 10n
// ↪ 18014398509481972n

const mod = multi % 10n
// ↪ 2n

const bigN = 2n ** 54n
// ↪ 18014398509481984n

bigN * -1n
// ↪ –18014398509481984n
```

“/” 操作符对于整数的运算也没问题。可是因为这些变量是 `BigInt` 而不是 `BigDecimal` ，该操作符结果会向零取整

```js
const expected = 4n / 2n
// ↪ 2n

const rounded = 5n / 2n
// ↪ 2n, not 2.5
```

### 比较

`BigInt` 和 `Number` 不是严格相等的，但是宽松相等的。

```js
0n === 0
// ↪ false

0n == 0
// ↪ true
```

`Number` 和 `BigInt` 可以进行比较。

```js
1n < 2
// ↪ true

2n > 1
// ↪ true

2 > 2
// ↪ false

2n > 2
// ↪ false

2n >= 2
// ↪ true
```

两者也可以混在一个数组内并排序。

```js
const mixed = [4n, 6, -12n, 10, 4, 0, 0n]
// ↪  [4n, 6, -12n, 10, 4, 0, 0n]

mixed.sort()
// ↪ [-12n, 0, 0n, 10, 4n, 4, 6]
```

### BigInt.prototype.toString

与`Number.prototype.toString` 一致：返回数字的字符串，可接受参数 `redix`，表示进制 取值范围 `2 ~ 36` 之间的整数

```js
BigInt(7).toString(2)
// ↪ '111'

15n.toString(2)
// ↪ '1111'
```
