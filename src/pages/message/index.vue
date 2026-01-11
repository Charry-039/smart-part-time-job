<template>
  <view class="min-h-screen bg-bg-primary pb-[60px]">
    <!-- 消息列表 -->
    <view class="px-[10px] py-[10px]" v-if="messages.length > 0">
      <view class="bg-white px-md py-md rounded-md mb-[8px]" v-for="msg in messages" :key="msg.id">
        <view class="flex items-center gap-[8px] mb-[8px]">
          <view
            class="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-sm font-bold">
            {{ msg.fromUserName?.charAt(0) || '?' }}</view>
          <view class="flex-1">
            <text class="block text-base font-bold text-[#333]">{{ msg.fromUserName }}</text>
            <text class="text-[11px] text-text-light">{{ formatTime(msg.createTime) }}</text>
          </view>
        </view>
        <text class="text-base text-text-secondary leading-relaxed">{{ msg.content }}</text>
      </view>
    </view>

    <view class="flex flex-col items-center py-[75px]" v-else>
      <text class="text-[50px] mb-md">💬</text>
      <text class="text-[15px] text-text-light">暂无消息</text>
    </view>

    <!-- 发送消息 -->
    <view class="fixed bottom-0 left-0 right-0 flex gap-[8px] px-[10px] py-[10px] bg-white safe-area-bottom"
      style="box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);" v-if="jobId">
      <input class="flex-1 px-[10px] py-[10px] bg-bg-primary rounded-full text-base" placeholder="输入留言内容..."
        v-model="newMessage" @confirm="sendMessage" />
      <view
        class="px-[16px] py-[10px] bg-gradient-to-br from-primary to-primary-light text-white rounded-full text-base active:opacity-90"
        @click="sendMessage">
        <text>发送</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getMessagesByJob, addMessage, getMessages,
  isLoggedIn, getUserInfo, generateId, getJobById,
  type MessageItem
} from '@/utils/storage'

const jobId = ref('')
const messages = ref<MessageItem[]>([])
const newMessage = ref('')

const formatTime = (time: string) => {
  const date = new Date(time)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const loadMessages = () => {
  if (jobId.value) {
    messages.value = getMessagesByJob(jobId.value)
  } else {
    // 显示所有消息
    messages.value = getMessages()
  }
}

const sendMessage = () => {
  if (!newMessage.value.trim()) {
    uni.showToast({ title: '请输入留言内容', icon: 'none' })
    return
  }

  if (!isLoggedIn()) {
    uni.showModal({
      title: '提示',
      content: '请先登录后再留言',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/user/login' })
        }
      }
    })
    return
  }

  const user = getUserInfo()
  const job = getJobById(jobId.value)

  addMessage({
    id: generateId(),
    jobId: jobId.value,
    fromUserId: user?.id || '',
    fromUserName: user?.nickname || '匿名用户',
    toUserId: job?.publisherId || '',
    content: newMessage.value,
    createTime: new Date().toISOString()
  })

  newMessage.value = ''
  loadMessages()
  uni.showToast({ title: '留言成功', icon: 'success' })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  jobId.value = currentPage?.options?.jobId || ''
  loadMessages()
})
</script>

<style>
</style>
