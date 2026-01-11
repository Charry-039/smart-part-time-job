<template>
  <view class="login-page">
    <view class="login-header">
      <text class="logo-text">智创兼职</text>
      <text class="sub-text">大学生专属兼职平台</text>
    </view>

    <view class="login-form">
      <view class="form-item">
        <text class="label">手机号/学号</text>
        <input class="input" placeholder="请输入手机号或学号" v-model="account" type="text" />
      </view>
      <view class="form-item">
        <text class="label">密码</text>
        <input class="input" placeholder="请输入密码" v-model="password" type="password" />
      </view>

      <view class="login-btn">
        <button @click="handleLogin">登录</button>
      </view>

      <view class="login-footer">
        <text class="link" @click="goToRegister">没有账号？立即注册</text>
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

<style lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #5B7FFF 0%, #8CA4FF 50%, #f5f7fa 50%);
}

.login-header {
  padding: 120rpx 0 80rpx;
  text-align: center;
}

.logo-text {
  display: block;
  font-size: 56rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 16rpx;
}

.sub-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
}

.login-form {
  background: #fff;
  margin: 0 40rpx;
  border-radius: 24rpx;
  padding: 48rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 36rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.input {
  width: 100%;
  padding: 24rpx;
  background: #f5f7fa;
  border-radius: 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.login-btn {
  margin-top: 48rpx;

  button {
    width: 100%;
    background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
    color: #fff;
    text-align: center;
    padding: 28rpx 0;
    border-radius: 48rpx;
    font-size: 32rpx;
    font-weight: bold;
    border: none;
    outline: none;

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.9;
    }
  }
}

.login-footer {
  text-align: center;
  margin-top: 36rpx;
}

.link {
  color: #5B7FFF;
  font-size: 26rpx;
}
</style>
