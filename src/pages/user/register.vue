<template>
  <view class="register-page">
    <view class="register-header">
      <text class="title">创建账号</text>
      <text class="sub-text">加入智创兼职，找到理想兼职</text>
    </view>

    <view class="register-form">
      <view class="form-item">
        <text class="label">手机号</text>
        <input class="input" placeholder="请输入手机号" v-model="phone" type="number" />
      </view>
      <view class="form-item">
        <text class="label">学号（选填）</text>
        <input class="input" placeholder="请输入学号" v-model="studentId" type="text" />
      </view>
      <view class="form-item">
        <text class="label">昵称</text>
        <input class="input" placeholder="请输入昵称" v-model="nickname" type="text" />
      </view>
      <view class="form-item">
        <text class="label">密码</text>
        <input class="input" placeholder="请输入密码（6-16位）" v-model="password" type="password" />
      </view>
      <view class="form-item">
        <text class="label">确认密码</text>
        <input class="input" placeholder="请再次输入密码" v-model="confirmPassword" type="password" />
      </view>

      <view class="register-btn" @click="handleRegister">
        <text>注 册</text>
      </view>

      <view class="register-footer">
        <text class="link" @click="goToLogin">已有账号？去登录</text>
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

<style lang="scss">
.register-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.register-header {
  background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
  padding: 60rpx 40rpx;
  color: #fff;
}

.title {
  display: block;
  font-size: 44rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.sub-text {
  font-size: 26rpx;
  opacity: 0.9;
}

.register-form {
  background: #fff;
  margin: -20rpx 30rpx 0;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.form-item {
  margin-bottom: 32rpx;
}

.label {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.input {
  width: 100%;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.register-btn {
  background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
  color: #fff;
  text-align: center;
  padding: 28rpx 0;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 40rpx;

  &:active {
    opacity: 0.9;
  }
}

.register-footer {
  text-align: center;
  margin-top: 32rpx;
}

.link {
  color: #5B7FFF;
  font-size: 26rpx;
}
</style>
