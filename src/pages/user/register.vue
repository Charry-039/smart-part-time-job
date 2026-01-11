<template>
  <view class="min-h-screen bg-bg-primary">
    <view class="bg-gradient-to-br from-primary to-primary-light px-[20px] py-[30px] text-white">
      <text class="block text-[22px] font-bold mb-[6px]">创建账号</text>
      <text class="text-sm opacity-90">加入智创兼职,找到理想兼职</text>
    </view>

    <view class="bg-white mx-[15px] -mt-[10px] rounded-xl px-[20px] py-[20px]"
      style="box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
      <view class="mb-[16px]">
        <text class="block text-sm text-[#333] mb-[6px]">手机号</text>
        <input class="w-full px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border" placeholder="请输入手机号"
          v-model="phone" type="number" />
      </view>
      <view class="mb-[16px]">
        <text class="block text-sm text-[#333] mb-[6px]">学号(选填)</text>
        <input class="w-full px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border" placeholder="请输入学号"
          v-model="studentId" type="text" />
      </view>
      <view class="mb-[16px]">
        <text class="block text-sm text-[#333] mb-[6px]">昵称</text>
        <input class="w-full px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border" placeholder="请输入昵称"
          v-model="nickname" type="text" />
      </view>
      <view class="mb-[16px]">
        <text class="block text-sm text-[#333] mb-[6px]">密码</text>
        <input class="w-full px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border"
          placeholder="请输入密码(6-16位)" v-model="password" type="password" />
      </view>
      <view class="mb-[16px]">
        <text class="block text-sm text-[#333] mb-[6px]">确认密码</text>
        <input class="w-full px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border" placeholder="请再次输入密码"
          v-model="confirmPassword" type="password" />
      </view>

      <view
        class="bg-gradient-to-br from-primary to-primary-light text-white text-center py-[14px] rounded-full text-lg font-bold mt-[20px] active:opacity-90"
        @click="handleRegister">
        <text>注 册</text>
      </view>

      <view class="text-center mt-[16px]">
        <text class="text-primary text-sm" @click="goToLogin">已有账号?去登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { setUserInfo, generateId } from '@/utils/storage'

const phone = ref('')
const studentId = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  if (!phone.value.trim() || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!nickname.value.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  if (password.value.length < 6 || password.value.length > 16) {
    uni.showToast({ title: '密码需6-16位', icon: 'none' })
    return
  }
  if (password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }

  // 模拟注册成功
  const user = {
    id: generateId(),
    phone: phone.value,
    studentId: studentId.value || undefined,
    nickname: nickname.value,
    avatar: 'https://img.charry.life/api/images/avatars%2Fimage_%E9%80%82%E5%90%88%E4%BD%93%E5%88%B6%E5%86%85%E9%9A%90%E8%94%BD%E7%89%88%E5%9B%9B%E5%B0%8F%E5%8F%AA%E5%A4%B4%E5%83%8F%E5%88%B7%E5%88%B0%E5%9B%BE..._0.png',
    bio: ''
  }

  setUserInfo(user)
  uni.showToast({ title: '注册成功', icon: 'success' })

  setTimeout(() => {
    uni.switchTab({ url: '/pages/user/profile' })
  }, 1500)
}

const goToLogin = () => {
  uni.navigateBack()
}
</script>

<style>
/* 使用 Tailwind CSS */
</style>
