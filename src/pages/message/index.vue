<template>
  <view class="message-page">
    <!-- 消息列表 -->
    <view class="message-list" v-if="messages.length > 0">
      <view class="message-item" v-for="msg in messages" :key="msg.id">
        <view class="msg-header">
          <view class="msg-avatar">{{ msg.fromUserName?.charAt(0) || '?' }}</view>
          <view class="msg-info">
            <text class="msg-name">{{ msg.fromUserName }}</text>
            <text class="msg-time">{{ formatTime(msg.createTime) }}</text>
          </view>
        </view>
        <text class="msg-content">{{ msg.content }}</text>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-icon">💬</text>
      <text class="empty-text">暂无消息</text>
    </view>

    <!-- 发送消息 -->
    <view class="input-bar" v-if="jobId">
      <input class="msg-input" placeholder="输入留言内容..." v-model="newMessage" @confirm="sendMessage" />
      <view class="send-btn" @click="sendMessage">
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

<style lang="scss">
.message-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

.message-list {
  padding: 20rpx;
}

.message-item {
  background: #fff;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
}

.msg-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.msg-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: bold;
}

.msg-info {
  flex: 1;
}

.msg-name {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.msg-time {
  font-size: 22rpx;
  color: #999;
}

.msg-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 150rpx 0;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #999;
}

.input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.msg-input {
  flex: 1;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.send-btn {
  padding: 20rpx 32rpx;
  background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;

  &:active {
    opacity: 0.9;
  }
}
</style>
