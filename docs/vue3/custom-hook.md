# Vue3 自定义 hook - useWindowResize

### useWindowResize

这哥一个景点的 hook 例子，窗口尺寸发送改变，与其他功能代码无关，可以抽为单独的 hook

### 使用到 Vue3 的新特性

1、ref 使用它来保存响应说变量 width、height 的值。

2、onMounted 生命周期函数，用来给 window 绑定 resize 事件监听

3、onMounted 生命周期函数，用来给 window 取消绑定 resize 事件监听

```js
import { onMounted, onUnMounted, ref } from 'vue'

export default function useWindowResize() {
  const width = ref(0)
  const height = ref(0)
  function onResize() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', onResize)
  })

  onUnMounted(() => {
    window.removeEventListener('resize', onResize)
  })

  return {
    width,
    height
  }
}
```

### 使用 useWindowResize

```html
<template>
  <div id="app">
    <h1>{{ count }}</h1>
    <button @click="plus">plus</button>
    <h1>屏幕尺寸：</h1>
    <div>宽度：{{ width }}</div>
    <div>高度：{{ height }}</div>
  </div>
</template>

<script lang="ts">
  import { ref, watch } from 'vue'
  import useWindowResize from './hooks/useWindowResize'

  export default {
    name: 'App',
    setup() {
      const count = ref(0)
      function plus() {
        count.value++
      }
      watch(count, () => {
        document.title = 'update: ' + count.value
      })

      const { width, height } = useWindowResize()

      return {
        count,
        plus,
        width,
        height
      }
    }
  }
</script>
```
