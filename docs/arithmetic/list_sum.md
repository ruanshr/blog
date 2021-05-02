# 给出两个非空链表来表示两个非负的整数，其中，他们各自的位数是按照逆序的方式存储，并且他们每个节点只能存储一位数字。求和

( 2 -> 4 -> 3 ) + ( 5 -> 6 -> 4 )

7 -> 0 -> 8

```js
function ListNode(value) {
  this.val = val
  this.next = null
}
function addTowNumbers(l1, l2) {
  let pCurrent = l1
  let qCurrent = l2
  let dummyHeadr = new ListNode()
  let current = dummyHeadr
  let carry = 0
  while (pCurrent !== null || qCurrent !== null) {
    let pVal = pCurrent !== null ? pCurrent.val : 0
    let qVal = qCurrent !== null ? qCurrent.val : 0
    let sum = carry + pVal + qVal
    carry = parseInt(sum / 10)
    current.next = new ListNode(sum % 10)
    current = current.next
    if (pCurrent !== null) {
      pCurrent = pCurrent.next
    }
    if (qCurrent !== null) {
      qCurrent = qCurrent.next
    }
  }
  if (carry > 0) {
    current.next = new ListNode(carry)
  }
  return dummyHeadr.next
}
```
