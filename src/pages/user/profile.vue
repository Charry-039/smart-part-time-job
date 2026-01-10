<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info" v-if="user">
        <view class="avatar">{{ user.nickname?.charAt(0) || '?' }}</view>
        <view class="info-text">
          <text class="nickname">{{ user.nickname }}</text>
          <text class="phone">{{ user.phone }}</text>
        </view>
      </view>
      <view class="user-info" v-else @click="goToLogin">
        <view class="avatar guest">?</view>
        <view class="info-text">
          <text class="nickname">点击登录</text>
          <text class="phone">登录后享受更多功能</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goToFavorites">
        <text class="menu-icon">❤️</text>
        <text class="menu-text">我的收藏</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToMyJobs">
        <text class="menu-icon">📝</text>
        <text class="menu-text">我发布的</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToApplications">
        <text class="menu-icon">📋</text>
        <text class="menu-text">我的报名</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToMessages">
        <text class="menu-icon">💬</text>
        <text class="menu-text">消息通知</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="showAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" v-if="user" @click="handleLogout">
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
    content: '智创兼职是专为大学生打造的兼职服务平台，汇聚优质兼职岗位，助力大学生提升实践能力、补充收入。\n\n版本：1.0.0 Demo',
    showCancel: false
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
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

<style lang="scss">
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

.user-card {
  background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
  padding: 60rpx 40rpx;
  margin-bottom: 20rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  font-weight: bold;

  &.guest {
    background: rgba(255, 255, 255, 0.2);
  }
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.phone {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
}

.menu-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f9f9f9;
  }
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.menu-arrow {
  font-size: 28rpx;
  color: #ccc;
}

.logout-btn {
  margin: 60rpx 40rpx;
  text-align: center;
  padding: 28rpx 0;
  background: #fff;
  border-radius: 48rpx;
  color: #FF6B6B;
  font-size: 30rpx;

  &:active {
    background: #f9f9f9;
  }
}
</style>
