# CommitWork

### commitUpdate

```js
export function commitUpdate(
  domElement: Instance,
  updatePayload: Array<mixed>,
  type: string,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: Object
): void {
  updateFiberProps(domElement, newProps)
  updateProperties(domElement, updatePayload, type, oldProps, newProps)
}
```

根据之前在`diffProperties`计算出来的`updatePayloads`数组进行` DOM` 更新

### commitTextUpdate

```js
export function commitTextUpdate(
  textInstance: TextInstance,
  oldText: string,
  newText: string
): void {
  textInstance.nodeValue = newText
}
function commitWork(current: Fiber | null, finishedWork: Fiber): void {
  if (!supportsMutation) {
    commitContainer(finishedWork)
    return
  }

  switch (finishedWork.tag) {
    case ClassComponent: {
      return
    }
    case HostComponent: {
      const instance: Instance = finishedWork.stateNode
      if (instance != null) {
        // Commit the work prepared earlier.
        const newProps = finishedWork.memoizedProps
        // For hydration we reuse the update path but we treat the oldProps
        // as the newProps. The updatePayload will contain the real change in
        // this case.
        const oldProps = current !== null ? current.memoizedProps : newProps
        const type = finishedWork.type
        // TODO: Type the updateQueue to be specific to host components.
        const updatePayload: null | UpdatePayload = (finishedWork.updateQueue: any)
        finishedWork.updateQueue = null
        if (updatePayload !== null) {
          commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork)
        }
      }
      return
    }
    case HostText: {
      invariant(
        finishedWork.stateNode !== null,
        'This should have a text node initialized. This error is likely ' +
          'caused by a bug in React. Please file an issue.'
      )
      const textInstance: TextInstance = finishedWork.stateNode
      const newText: string = finishedWork.memoizedProps
      // For hydration we reuse the update path but we treat the oldProps
      // as the newProps. The updatePayload will contain the real change in
      // this case.
      const oldText: string = current !== null ? current.memoizedProps : newText
      commitTextUpdate(textInstance, oldText, newText)
      return
    }
    case HostRoot: {
      return
    }
    case Profiler: {
      return
    }
    case SuspenseComponent: {
      return
    }
    case IncompleteClassComponent: {
      return
    }
    default: {
      invariant(
        false,
        'This unit of work tag should not have side-effects. This error is ' +
          'likely caused by a bug in React. Please file an issue.'
      )
    }
  }
}
```
