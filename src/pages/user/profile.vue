<template>
  <view class="min-h-screen bg-bg-primary pb-[60px]">
    <view class="bg-gradient-to-br from-primary to-primary-light px-[20px] py-[30px] mb-[10px]">
      <view class="flex items-center gap-md" v-if="user">
        <view
          class="w-[60px] h-[60px] rounded-full bg-white/30 text-white flex items-center justify-center text-[24px] font-bold">
          {{ user.nickname?.charAt(0) || '?' }}</view>
        <view class="flex flex-col gap-[4px]">
          <text class="text-xl font-bold text-white">{{ user.nickname }}</text>
          <text class="text-sm text-white/85">{{ user.phone }}</text>
        </view>
      </view>
      <view class="flex items-center gap-md" v-else @click="goToLogin">
        <view
          class="w-[60px] h-[60px] rounded-full bg-white/20 text-white flex items-center justify-center text-[24px] font-bold">
          ?</view>
        <view class="flex flex-col gap-[4px]">
          <text class="text-xl font-bold text-white">点击登录</text>
          <text class="text-sm text-white/85">登录后享受更多功能</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="bg-white mx-[10px] rounded-md overflow-hidden">
      <view class="flex items-center px-[15px] py-[16px] border-b border-[#f0f0f0] active:bg-[#f9f9f9]"
        @click="goToFavorites">
        <text class="text-xl mr-[10px]">❤️</text>
        <text class="flex-1 text-[15px] text-[#333]">我的收藏</text>
        <text class="text-base text-[#ccc]">></text>
      </view>
      <view class="flex items-center px-[15px] py-[16px] border-b border-[#f0f0f0] active:bg-[#f9f9f9]"
        @click="goToMyJobs">
        <text class="text-xl mr-[10px]">📝</text>
        <text class="flex-1 text-[15px] text-[#333]">我发布的</text>
        <text class="text-base text-[#ccc]">></text>
      </view>
      <view class="flex items-center px-[15px] py-[16px] border-b border-[#f0f0f0] active:bg-[#f9f9f9]"
        @click="goToApplications">
        <text class="text-xl mr-[10px]">📋</text>
        <text class="flex-1 text-[15px] text-[#333]">我的报名</text>
        <text class="text-base text-[#ccc]">></text>
      </view>
      <view class="flex items-center px-[15px] py-[16px] active:bg-[#f9f9f9]" @click="goToMessages">
        <text class="text-xl mr-[10px]">💬</text>
        <text class="flex-1 text-[15px] text-[#333]">消息通知</text>
        <text class="text-base text-[#ccc]">></text>
      </view>
    </view>

    <view class="bg-white mx-[10px] mt-[10px] rounded-md overflow-hidden">
      <view class="flex items-center px-[15px] py-[16px] active:bg-[#f9f9f9]" @click="showAbout">
        <text class="text-xl mr-[10px]">ℹ️</text>
        <text class="flex-1 text-[15px] text-[#333]">关于我们</text>
        <text class="text-base text-[#ccc]">></text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view
      class="mx-[20px] my-[30px] text-center py-[14px] bg-white rounded-full text-secondary text-[15px] active:bg-[#f9f9f9]"
      v-if="user" @click="handleLogout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserInfo, logout, type UserInfo } from '@/utils/storage'

const user = ref<UserInfo | null>(null)

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/user/login' })
}

const goToFavorites = () => {
  if (!user.value) {
    goToLogin()
    return
  }
  uni.navigateTo({ url: '/pages/user/favorites' })
}

const goToMyJobs = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToApplications = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToMessages = () => {
  uni.navigateTo({ url: '/pages/message/index' })
}

const showAbout = () => {
  uni.showModal({
    title: '关于智创兼职',
    content: '智创兼职是专为大学生打造的兼职服务平台,汇聚优质兼职岗位,助力大学生提升实践能力、补充收入。\n\n版本:1.0.0 Demo',
    showCancel: false
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗?',
    success: (res) => {
      if (res.confirm) {
        logout()
        user.value = null
        uni.showToast({ title: '已退出登录', icon: 'none' })
      }
    }
  })
}

onMounted(() => {
  user.value = getUserInfo()
})

// 页面显示时刷新用户信息
uni.$on('refreshUserInfo', () => {
  user.value = getUserInfo()
})
</script>

<style>
/* 使用 Tailwind CSS */
</style>
