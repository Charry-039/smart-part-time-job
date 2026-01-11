<template>
  <view class="min-h-screen" style="background: linear-gradient(180deg, #5B7FFF 0%, #8CA4FF 50%, #f5f7fa 50%);">
    <view class="pt-[60px] pb-[40px] text-center">
      <text class="block text-[28px] font-bold text-white mb-[8px]">智创兼职</text>
      <text class="text-base text-white/90">大学生专属兼职平台</text>
    </view>

    <view class="bg-white mx-[20px] rounded-xl px-[24px] py-[24px]" style="box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <view class="mb-[18px]">
        <text class="block text-base text-[#333] mb-[8px]">手机号/学号</text>
        <input class="w-full px-md py-md bg-bg-primary rounded-md text-base box-border" placeholder="请输入手机号或学号"
          v-model="account" type="text" />
      </view>
      <view class="mb-[18px]">
        <text class="block text-base text-[#333] mb-[8px]">密码</text>
        <input class="w-full px-md py-md bg-bg-primary rounded-md text-base box-border" placeholder="请输入密码"
          v-model="password" type="password" />
      </view>

      <view class="mt-[24px]">
        <button
          class="w-full bg-gradient-to-br from-primary to-primary-light text-white text-center py-[14px] rounded-full text-lg font-bold border-none active:opacity-90"
          @click="handleLogin">登录</button>
      </view>

      <view class="text-center mt-[18px]">
        <text class="text-primary text-sm" @click="goToRegister">没有账号?立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { setUserInfo, generateId } from '@/utils/storage'

const account = ref('')
const password = ref('')

const handleLogin = () => {
  if (!account.value.trim()) {
    uni.showToast({ title: '请输入账号', icon: 'none' })
    return
  }
  if (!password.value.trim()) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }

  console.log('模拟登录')

  // 模拟登录
  const user = {
    id: generateId(),
    phone: account.value,
    nickname: `用户${account.value.slice(-4)}`,
    avatar: 'https://img.charry.life/api/images/avatars%2Fimage_%E9%80%82%E5%90%88%E4%BD%93%E5%88%B6%E5%86%85%E9%9A%90%E8%94%BD%E7%89%88%E5%9B%9B%E5%B0%8F%E5%8F%AA%E5%A4%B4%E5%83%8F%E5%88%B7%E5%88%B0%E5%9B%BE..._0.png',
    bio: ''
  }

  setUserInfo(user)
  uni.showToast({ title: '登录成功', icon: 'success' })

  console.log('跳转到个人中心')

  setTimeout(() => {
    uni.switchTab({ url: '/pages/user/profile' })
  }, 1500)
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/user/register' })
}
</script>

<style>
</style>
