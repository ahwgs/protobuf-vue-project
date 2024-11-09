<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { io } from 'socket.io-client'
import { NButton, NInfiniteScroll, NInput } from 'naive-ui'

const socket = io('http://127.0.0.1:3000')

const inputText = ref('')

const connectState = ref(false)

const messageList = ref<
  {
    userRole: 'client' | 'server'
    time: number
    content: string
  }[]
>([])

const init = () => {
  socket.on('connect', () => {
    console.log('connect')
    connectState.value = true
    messageList.value.push({
      userRole: 'server',
      time: new Date().getTime(),
      content: '服务器上线了',
    })
  })

  socket.on('disconnect', () => {
    console.log('disconnect')
    connectState.value = false
    messageList.value.push({
      userRole: 'server',
      time: new Date().getTime(),
      content: '服务器下线了',
    })
  })

  socket.on('message', (data) => {
    console.log('收到服务端信息', data)
    messageList.value.push({
      userRole: 'server',
      time: new Date().getTime(),
      content: data,
    })
  })
}

const handleSend = () => {
  socket.emit('message', inputText.value)
  console.log('客户端发送', inputText.value)
  messageList.value.push({
    userRole: 'client',
    time: new Date().getTime(),
    content: inputText.value,
  })
  inputText.value = ''
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="list">
    <n-infinite-scroll style="height: 500px" :distance="10">
      <div
        v-for="item in messageList"
        :key="item.time"
        class="message"
        :class="{ reverse: item.userRole === 'client' }"
      >
        <div class="avatar">{{ item.userRole }}</div>
        <span> {{ item.content }} </span>
      </div>
    </n-infinite-scroll>

    <div>connectState:{{ connectState }}</div>
    <div v-if="connectState">
      <n-input v-model:value="inputText" type="textarea" placeholder="输入" />
      <n-button type="primary" @click="handleSend"> 发送 </n-button>
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
}

.message:last-child {
  margin-bottom: 0;
}

.reverse {
  flex-direction: row-reverse;
}

.text {
  text-align: center;
}

.reverse .avatar {
  margin-left: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  background-color: #6a386e;
  border-radius: 50%;
  margin-right: 10px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.list {
  width: 1000px;
}
</style>
