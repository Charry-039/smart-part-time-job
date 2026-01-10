<template>
  <view class="favorites-page">
    <view class="job-list" v-if="favoriteJobs.length > 0">
      <view class="job-card" v-for="job in favoriteJobs" :key="job.id" @click="goToDetail(job.id)">
        <view class="job-info">
          <text class="job-title">{{ job.title }}</text>
          <text class="job-location">📍 {{ job.location }}</text>
        </view>
        <view class="job-right">
          <text class="job-salary">¥{{ job.salary }}</text>
          <view class="remove-btn" @click.stop="handleRemove(job.id)">
            <text>移除</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-icon">💔</text>
      <text class="empty-text">暂无收藏的兼职</text>
      <view class="empty-btn" @click="goToHome">
        <text>去发现兼职</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFavorites, removeFavorite, getJobById, type JobInfo } from '@/utils/storage'

const favoriteJobs = ref<JobInfo[]>([])

const loadFavorites = () => {
  const favorites = getFavorites()
  favoriteJobs.value = favorites
    .map(f => getJobById(f.jobId))
    .filter((job): job is JobInfo => job !== undefined)
}

const goToDetail = (jobId: string) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${jobId}` })
}

const handleRemove = (jobId: string) => {
  uni.showModal({
    title: '提示',
    content: '确定要移除这个收藏吗？',
    success: (res) => {
      if (res.confirm) {
        removeFavorite(jobId)
        loadFavorites()
        uni.showToast({ title: '已移除', icon: 'none' })
      }
    }
  })
}

const goToHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

onMounted(() => {
  loadFavorites()
})
</script>

<style lang="scss">
.favorites-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.job-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 28rpx;
  border-radius: 16rpx;

  &:active {
    background: #f9f9f9;
  }
}

.job-info {
  flex: 1;
}

.job-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 8rpx;
}

.job-location {
  font-size: 24rpx;
  color: #999;
}

.job-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12rpx;
}

.job-salary {
  font-size: 32rpx;
  font-weight: bold;
  color: #FF6B6B;
}

.remove-btn {
  padding: 8rpx 20rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #999;
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
  margin-bottom: 40rpx;
}

.empty-btn {
  padding: 20rpx 48rpx;
  background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
}
</style>
