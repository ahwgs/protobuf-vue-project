<script setup lang="ts">
import { onMounted } from 'vue'

const ws = new WebSocket('ws://127.0.0.1:3000/')

const init = () => {
  // 创建 WebSocket 连接

  // 监听 WebSocket 连接成功事件
  ws.addEventListener('open', () => {
    console.log('WebSocket connected!')
  })

  // 监听 WebSocket 收到服务器发送过来的消息事件
  ws.addEventListener('message', async (event) => {
    console.log('Message from server:', event.data)
  })

  // 监听 WebSocket 出错事件
  ws.addEventListener('error', (event) => {
    console.error('WebSocket error', event)
  })

  // 监听 WebSocket 关闭事件
  ws.addEventListener('close', (event) => {
    console.warn(event)
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div></div>
</template>

<style scoped></style>
