---
prev: /react-analysis/commit-phase/commit-before-mutation-lifecycles
next: /react-analysis/commit-phase/commit-all-lifecycles
---

# commitAllHostEffects

这边就是对作用于`HostComponent`上的所有`side effect`进行`commit`

### commitResetTextContent

就是把节点的文字内容设置为空字符串

```js
function commitResetTextContent(current: Fiber) {
  if (!supportsMutation) {
    return
  }
  resetTextContent(current.stateNode)
}

export function resetTextContent(domElement: Instance): void {
  setTextContent(domElement, '')
}

let setTextContent = function (node: Element, text: string): void {
  if (text) {
    let firstChild = node.firstChild

    if (firstChild && firstChild === node.lastChild && firstChild.nodeType === TEXT_NODE) {
      firstChild.nodeValue = text
      return
    }
  }
  node.textContent = text
}
```

### commitDetachRef

把`ref`置空，因为这个组件后续需要设置`ref`，所以之前`ref`上的值需要先清空

```js
function commitDetachRef(current: Fiber) {
  const currentRef = current.ref
  if (currentRef !== null) {
    if (typeof currentRef === 'function') {
      currentRef(null)
    } else {
      currentRef.current = null
    }
  }
}
;placement & update & deletion
commitPlacement
commitWork
commitDeletion
function commitAllHostEffects() {
  while (nextEffect !== null) {
    recordEffect()

    const effectTag = nextEffect.effectTag

    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect)
    }

    if (effectTag & Ref) {
      const current = nextEffect.alternate
      if (current !== null) {
        commitDetachRef(current)
      }
    }

    let primaryEffectTag = effectTag & (Placement | Update | Deletion)
    switch (primaryEffectTag) {
      case Placement: {
        commitPlacement(nextEffect)
        nextEffect.effectTag &= ~Placement
        break
      }
      case PlacementAndUpdate: {
        // Placement
        commitPlacement(nextEffect)
        nextEffect.effectTag &= ~Placement

        // Update
        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
      }
      case Update: {
        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
      }
      case Deletion: {
        commitDeletion(nextEffect)
        break
      }
    }
    nextEffect = nextEffect.nextEffect
  }
}
```
### placement & update & deletion

- [commitPlacement](./host-effects/commit-placement.md)
- [commitWork](./host-effects/commit-work.md)
- [commitDeletion](./host-effects/commit-deletion.md)
```js
function commitAllHostEffects() {
  while (nextEffect !== null) {
    recordEffect()

    const effectTag = nextEffect.effectTag

    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect)
    }

    if (effectTag & Ref) {
      const current = nextEffect.alternate
      if (current !== null) {
        commitDetachRef(current)
      }
    }

    let primaryEffectTag = effectTag & (Placement | Update | Deletion)
    switch (primaryEffectTag) {
      case Placement: {
        commitPlacement(nextEffect)
        nextEffect.effectTag &= ~Placement
        break
      }
      case PlacementAndUpdate: {
        // Placement
        commitPlacement(nextEffect)
        nextEffect.effectTag &= ~Placement

        // Update
        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
      }
      case Update: {
        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
      }
      case Deletion: {
        commitDeletion(nextEffect)
        break
      }
    }
    nextEffect = nextEffect.nextEffect
  }
}
```