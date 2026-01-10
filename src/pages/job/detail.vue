<template>
  <view class="job-detail-page" v-if="job">
    <!-- 基本信息 -->
    <view class="job-header">
      <text class="job-title">{{ job.title }}</text>
      <view class="salary-info">
        <text class="salary-num">¥{{ job.salary }}</text>
        <text class="salary-type">{{ getSalaryTypeText(job.salaryType) }}</text>
      </view>
    </view>

    <!-- 标签 -->
    <view class="tags-section">
      <text class="tag">{{ getCategoryName(job.category) }}</text>
      <text class="tag location">📍 {{ job.location }}</text>
    </view>

    <!-- 发布信息 -->
    <view class="publisher-section">
      <view class="publisher-info">
        <view class="avatar">{{ job.publisherName?.charAt(0) || '?' }}</view>
        <view class="publisher-text">
          <text class="publisher-name">{{ job.publisherName }}</text>
          <text class="publish-time">{{ formatTime(job.createTime) }}</text>
        </view>
      </view>
      <view class="stats">
        <text class="stat-item">👁 {{ job.views }}浏览</text>
        <text class="stat-item">👤 {{ job.applicants }}人报名</text>
      </view>
    </view>

    <!-- 职位描述 -->
    <view class="section">
      <text class="section-title">📝 职位描述</text>
      <text class="section-content">{{ job.description }}</text>
    </view>

    <!-- 任职要求 -->
    <view class="section">
      <text class="section-title">✅ 任职要求</text>
      <view class="requirements">
        <text class="req-item" v-for="(req, i) in job.requirements" :key="i">• {{ req }}</text>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="section">
      <text class="section-title">📞 联系方式</text>
      <text class="section-content">{{ job.contact }}</text>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <view class="action-btn favor-btn" :class="{ active: isFavorited }" @click="toggleFavorite">
        <text>{{ isFavorited ? '❤️' : '🤍' }}</text>
        <text>{{ isFavorited ? '已收藏' : '收藏' }}</text>
      </view>
      <view class="action-btn message-btn" @click="goToMessage">
        <text>💬</text>
        <text>留言</text>
      </view>
      <view class="action-btn apply-btn" :class="{ applied: hasApplied }" @click="handleApply">
        <text>{{ hasApplied ? '已报名' : '立即报名' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getJobById, updateJob, type JobInfo,
  isFavorite, addFavorite, removeFavorite,
  getApplications, addApplication, isLoggedIn, getUserInfo, generateId
} from '@/utils/storage'
import { getCategoryName } from '@/utils/mock-data'

const job = ref<JobInfo | null>(null)
const isFavorited = ref(false)
const hasApplied = ref(false)

const getSalaryTypeText = (type: string) => {
  const map: Record<string, string> = { hour: '/时', day: '/天', month: '/月', task: '/单' }
  return map[type] || ''
}

const formatTime = (time: string) => {
  const date = new Date(time)
  return `${date.getMonth() + 1}月${date.getDate()}日发布`
}

const toggleFavorite = () => {
  if (!job.value) return

  if (isFavorited.value) {
    removeFavorite(job.value.id)
    isFavorited.value = false
    uni.showToast({ title: '已取消收藏', icon: 'none' })
  } else {
    addFavorite(job.value.id)
    isFavorited.value = true
    uni.showToast({ title: '收藏成功', icon: 'success' })
  }
}

const handleApply = () => {
  if (!job.value) return

  if (!isLoggedIn()) {
    uni.showModal({
      title: '提示',
      content: '请先登录后再报名',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/user/login' })
        }
      }
    })
    return
  }

  if (hasApplied.value) {
    uni.showToast({ title: '您已报名过了', icon: 'none' })
    return
  }

  const user = getUserInfo()
  addApplication({
    jobId: job.value.id,
    userId: user?.id || '',
    status: 'pending',
    applyTime: new Date().toISOString()
  })

  // 更新报名人数
  updateJob(job.value.id, { applicants: job.value.applicants + 1 })
  job.value.applicants++
  hasApplied.value = true

  uni.showToast({ title: '报名成功', icon: 'success' })
}

const goToMessage = () => {
  if (!job.value) return
  uni.navigateTo({ url: `/pages/message/index?jobId=${job.value.id}` })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const jobId = currentPage?.options?.id

  if (jobId) {
    const jobData = getJobById(jobId)
    if (jobData) {
      job.value = jobData
      isFavorited.value = isFavorite(jobId)

      // 更新浏览量
      updateJob(jobId, { views: jobData.views + 1 })
      job.value.views++

      // 检查是否已报名
      const user = getUserInfo()
      if (user) {
        const apps = getApplications()
        hasApplied.value = apps.some(a => a.jobId === jobId && a.userId === user.id)
      }
    }
  }
})
</script>

<style lang="scss">
.job-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 140rpx;
}

.job-header {
  background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
  padding: 40rpx 30rpx;
  color: #fff;
}

.job-title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.salary-info {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.salary-num {
  font-size: 48rpx;
  font-weight: bold;
}

.salary-type {
  font-size: 26rpx;
  opacity: 0.9;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 24rpx 30rpx;
  background: #fff;
}

.tag {
  padding: 8rpx 20rpx;
  background: rgba(91, 127, 255, 0.1);
  color: #5B7FFF;
  border-radius: 20rpx;
  font-size: 24rpx;

  &.location {
    background: rgba(82, 196, 26, 0.1);
    color: #52C41A;
  }
}

.publisher-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  background: #fff;
  margin-top: 2rpx;
}

.publisher-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
}

.publisher-text {
  display: flex;
  flex-direction: column;
}

.publisher-name {
  font-size: 28rpx;
  color: #1a1a2e;
  font-weight: 500;
}

.publish-time {
  font-size: 24rpx;
  color: #999;
}

.stats {
  display: flex;
  gap: 20rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #666;
}

.section {
  background: #fff;
  margin-top: 20rpx;
  padding: 24rpx 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1a1a2e;
  display: block;
  margin-bottom: 16rpx;
}

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.requirements {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.req-item {
  font-size: 28rpx;
  color: #666;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 16rpx;
  padding: 20rpx 30rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16rpx 24rpx;
  border-radius: 16rpx;
  font-size: 24rpx;

  &.favor-btn,
  &.message-btn {
    background: #f5f7fa;
    color: #666;
    min-width: 100rpx;

    &.active {
      color: #FF6B6B;
    }
  }

  &.apply-btn {
    flex: 1;
    flex-direction: row;
    background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
    color: #fff;
    font-size: 30rpx;
    font-weight: bold;

    &.applied {
      background: #ccc;
    }
  }
}
</style>
