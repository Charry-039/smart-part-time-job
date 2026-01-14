<template>
  <view class="min-h-screen bg-bg-primary pb-[60px]">
    <view class="bg-gradient-to-br from-primary to-primary-light px-[20px] py-[30px] mb-[10px]">
      <view class="flex items-center gap-md" v-if="user">
        <view
          class="w-[60px] h-[60px] rounded-full bg-white/30 text-white flex items-center justify-center text-[24px] font-bold overflow-hidden active:opacity-80"
          @click="uploadAvatar">
          <image v-if="user.avatar" :src="user.avatar" class="w-full h-full" mode="aspectFill" />
          <text v-else>{{ user.nickname?.charAt(0) || '?' }}</text>
        </view>
        <view class="flex flex-col gap-[4px]">
          <text class="text-xl font-bold text-white">{{ user.nickname }}</text>
          <text class="text-sm text-white/85">{{ user.phone }}</text>
        </view>
      </view>
      <view class="flex items-center gap-md" v-else @click="goToLogin">
        <view
          class="w-[60px] h-[60px] rounded-full bg-white/20 text-white flex items-center justify-center text-[24px] font-bold overflow-hidden">
          <text>?</text>
        </view>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { getUserInfo, setUserInfo, logout, type UserInfo } from '@/utils/storage'
import { onShow } from '@dcloudio/uni-app'

const user = ref<UserInfo | null>(null)

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/user/login' })
}

const uploadAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      
      // H5 环境下使用 FileReader 转换为 base64
      // #ifdef H5
      const xhr = new XMLHttpRequest()
      xhr.open('GET', tempFilePath, true)
      xhr.responseType = 'blob'
      xhr.onload = () => {
        if (xhr.status === 200) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const base64 = e.target?.result as string
            if (user.value && base64) {
              const updatedUser = { ...user.value, avatar: base64 }
              setUserInfo(updatedUser)
              user.value = updatedUser
              uni.$emit('refreshUserInfo')
              uni.showToast({ title: '头像上传成功', icon: 'success' })
            }
          }
          reader.readAsDataURL(xhr.response)
        }
      }
      xhr.send()
      // #endif
      
      // 小程序环境下使用 getFileSystemManager
      // #ifndef H5
      try {
        uni.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: (fileRes: any) => {
            const base64 = 'data:image/jpeg;base64,' + fileRes.data
            if (user.value) {
              const updatedUser = { ...user.value, avatar: base64 }
              setUserInfo(updatedUser)
              user.value = updatedUser
              uni.$emit('refreshUserInfo')
              uni.showToast({ title: '头像上传成功', icon: 'success' })
            }
          },
          fail: () => {
            uni.showToast({ title: '上传失败', icon: 'none' })
          }
        })
      } catch (e) {
        uni.showToast({ title: '上传失败', icon: 'none' })
      }
      // #endif
    },
    fail: () => {
      uni.showToast({ title: '取消选择', icon: 'none' })
    }
  })
}

const goToFavorites = () => {
  if (!user.value) {
    goToLogin()
    return
  }
  uni.navigateTo({ url: '/pages/user/favorites' })
}

const goToMyJobs = () => {
  if (!user.value) {
    goToLogin()
    return
  }
  uni.navigateTo({ url: '/pages/user/my-jobs' })
}

const goToApplications = () => {
  if (!user.value) {
    goToLogin()
    return
  }
  uni.navigateTo({ url: '/pages/user/applications' })
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

// 刷新用户信息的方法
const refreshUserInfo = () => {
  user.value = getUserInfo()
  console.log('用户信息已刷新')
}

onMounted(() => {
  user.value = getUserInfo()
  // 监听全局刷新用户信息事件
  uni.$on('refreshUserInfo', refreshUserInfo)
})

onShow(() => {
  //刷新用户信息
  refreshUserInfo()
})

onUnmounted(() => {
  // 移除事件监听，防止内存泄漏
  uni.$off('refreshUserInfo', refreshUserInfo)
})
</script>

<style>
</style>
