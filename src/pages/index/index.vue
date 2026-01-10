<template>
  <view class="home-page">
    <!-- 自定义导航栏 -->
    <view class="nav-header">
      <view class="nav-title">智创兼职</view>
      <view class="nav-search" @click="goToSearch">
        <text class="search-icon">🔍</text>
        <text class="search-text">搜索兼职岗位...</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <swiper class="banner" indicator-dots autoplay circular>
      <swiper-item v-for="(item, index) in banners" :key="index">
        <view class="banner-item" :style="{ background: item.bg }">
          <text class="banner-text">{{ item.text }}</text>
        </view>
      </swiper-item>
    </swiper>

    <!-- 分类入口 -->
    <view class="category-section">
      <view class="section-header">
        <text class="section-title">兼职分类</text>
        <text class="section-more" @click="goToList('')">全部 ></text>
      </view>
      <view class="category-grid">
        <view class="category-item" v-for="cat in categories" :key="cat.id" @click="goToList(cat.id)">
          <view class="cat-icon">{{ cat.icon }}</view>
          <text class="cat-name">{{ cat.name }}</text>
        </view>
      </view>
    </view>

    <!-- 推荐兼职列表 -->
    <view class="job-section">
      <view class="section-header">
        <text class="section-title">🔥 热门兼职</text>
        <text class="section-more" @click="goToList('')">更多 ></text>
      </view>
      <view class="job-list">
        <view class="job-card" v-for="job in hotJobs" :key="job.id" @click="goToDetail(job.id)">
          <view class="job-info">
            <text class="job-title">{{ job.title }}</text>
            <view class="job-tags">
              <text class="tag">{{ getCategoryName(job.category) }}</text>
              <text class="tag location">📍 {{ job.location }}</text>
            </view>
            <text class="job-desc">{{ job.description }}</text>
          </view>
          <view class="job-salary">
            <text class="salary-num">¥{{ job.salary }}</text>
            <text class="salary-type">{{ getSalaryTypeText(job.salaryType) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="hotJobs.length === 0">
      <text class="empty-icon">📭</text>
      <text class="empty-text">暂无兼职信息</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getJobs, type JobInfo } from '@/utils/storage'
import { initMockData, JOB_CATEGORIES, getCategoryName } from '@/utils/mock-data'

const banners = ref([
  { text: '🎓 大学生专属兼职平台', bg: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { text: '💰 每日更新优质岗位', bg: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { text: '🤖 AI智能匹配推荐', bg: 'linear-gradient(135deg, #4facfe, #00f2fe)' }
])

const categories = ref(JOB_CATEGORIES)
const hotJobs = ref<JobInfo[]>([])

const getSalaryTypeText = (type: string) => {
  const map: Record<string, string> = {
    hour: '/时',
    day: '/天',
    month: '/月',
    task: '/单'
  }
  return map[type] || ''
}

const goToSearch = () => {
  uni.navigateTo({ url: '/pages/job/list' })
}

const goToList = (categoryId: string) => {
  uni.navigateTo({ url: `/pages/job/list?category=${categoryId}` })
}

const goToDetail = (jobId: string) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${jobId}` })
}

onMounted(() => {
  // 初始化模拟数据
  initMockData()
  // 加载兼职列表
  hotJobs.value = getJobs().slice(0, 6)
})
</script>

<style lang="scss">
.home-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

.nav-header {
  background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
  padding: 60rpx 30rpx 30rpx;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.nav-search {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 40rpx;
  padding: 16rpx 24rpx;

  .search-icon {
    margin-right: 12rpx;
  }

  .search-text {
    color: #999;
    font-size: 28rpx;
  }
}

.banner {
  height: 280rpx;
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.banner-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
}

.banner-text {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.category-section,
.job-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1a1a2e;
}

.section-more {
  font-size: 26rpx;
  color: #5B7FFF;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
  border-radius: 16rpx;
  background: #f8f9fc;

  &:active {
    background: #eef1f8;
  }
}

.cat-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.cat-name {
  font-size: 24rpx;
  color: #333;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.job-card {
  display: flex;
  justify-content: space-between;
  padding: 24rpx;
  background: #f8f9fc;
  border-radius: 16rpx;

  &:active {
    background: #eef1f8;
  }
}

.job-info {
  flex: 1;
  margin-right: 20rpx;
}

.job-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1a1a2e;
  display: block;
  margin-bottom: 12rpx;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 12rpx;
}

.tag {
  display: inline-block;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  background: rgba(91, 127, 255, 0.1);
  color: #5B7FFF;
  border-radius: 6rpx;

  &.location {
    background: rgba(82, 196, 26, 0.1);
    color: #52C41A;
  }
}

.job-desc {
  font-size: 26rpx;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.job-salary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  min-width: 120rpx;
}

.salary-num {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF6B6B;
}

.salary-type {
  font-size: 22rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
}
</style>
