<template>
  <view class="job-list-page">
    <!-- 搜索和筛选 -->
    <view class="search-bar">
      <input class="search-input" placeholder="搜索兼职岗位" v-model="searchText" @confirm="handleSearch" />
      <view class="filter-btn" @click="showFilter = !showFilter">
        <text>筛选</text>
      </view>
    </view>

    <!-- 筛选面板 -->
    <view class="filter-panel" v-if="showFilter">
      <view class="filter-section">
        <text class="filter-title">分类</text>
        <view class="filter-options">
          <view class="filter-option" :class="{ active: selectedCategory === '' }" @click="selectedCategory = ''">全部
          </view>
          <view class="filter-option" v-for="cat in categories" :key="cat.id"
            :class="{ active: selectedCategory === cat.id }" @click="selectedCategory = cat.id">{{ cat.name }}</view>
        </view>
      </view>
      <view class="filter-section">
        <text class="filter-title">薪资排序</text>
        <view class="filter-options">
          <view class="filter-option" :class="{ active: sortBy === 'default' }" @click="sortBy = 'default'">默认</view>
          <view class="filter-option" :class="{ active: sortBy === 'salary-desc' }" @click="sortBy = 'salary-desc'">薪资最高
          </view>
          <view class="filter-option" :class="{ active: sortBy === 'time' }" @click="sortBy = 'time'">最新发布</view>
        </view>
      </view>
    </view>

    <!-- 兼职列表 -->
    <view class="list-container">
      <view class="job-card" v-for="job in filteredJobs" :key="job.id" @click="goToDetail(job.id)">
        <view class="job-header">
          <text class="job-title">{{ job.title }}</text>
          <view class="job-salary">
            <text class="salary-num">¥{{ job.salary }}</text>
            <text class="salary-type">{{ getSalaryTypeText(job.salaryType) }}</text>
          </view>
        </view>
        <view class="job-meta">
          <text class="meta-item">📍 {{ job.location }}</text>
          <text class="meta-item">👁 {{ job.views }}浏览</text>
          <text class="meta-item">👤 {{ job.applicants }}人报名</text>
        </view>
        <view class="job-tags">
          <text class="tag">{{ getCategoryName(job.category) }}</text>
          <text class="tag" v-for="(req, i) in job.requirements.slice(0, 2)" :key="i">{{ req }}</text>
        </view>
      </view>

      <view class="empty-state" v-if="filteredJobs.length === 0">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无符合条件的兼职</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getJobs, type JobInfo } from '@/utils/storage'
import { JOB_CATEGORIES, getCategoryName } from '@/utils/mock-data'

const searchText = ref('')
const showFilter = ref(false)
const selectedCategory = ref('')
const sortBy = ref('default')
const jobs = ref<JobInfo[]>([])
const categories = ref(JOB_CATEGORIES)

const getSalaryTypeText = (type: string) => {
  const map: Record<string, string> = { hour: '/时', day: '/天', month: '/月', task: '/单' }
  return map[type] || ''
}

const filteredJobs = computed(() => {
  let result = [...jobs.value]

  // 搜索过滤
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase()
    result = result.filter(job =>
      job.title.toLowerCase().includes(keyword) ||
      job.description.toLowerCase().includes(keyword)
    )
  }

  // 分类过滤
  if (selectedCategory.value) {
    result = result.filter(job => job.category === selectedCategory.value)
  }

  // 排序
  if (sortBy.value === 'salary-desc') {
    result.sort((a, b) => parseInt(b.salary) - parseInt(a.salary))
  } else if (sortBy.value === 'time') {
    result.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
  }

  return result
})

const handleSearch = () => {
  // 触发搜索（已通过 computed 实时过滤）
}

const goToDetail = (jobId: string) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${jobId}` })
}

onMounted(() => {
  // 获取 URL 参数中的分类
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  if (currentPage?.options?.category) {
    selectedCategory.value = currentPage.options.category
  }

  jobs.value = getJobs()
})
</script>

<style lang="scss">
.job-list-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.search-bar {
  display: flex;
  padding: 20rpx;
  background: #fff;
  gap: 16rpx;
}

.search-input {
  flex: 1;
  background: #f5f7fa;
  border-radius: 40rpx;
  padding: 16rpx 24rpx;
  font-size: 28rpx;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24rpx;
  background: #5B7FFF;
  color: #fff;
  border-radius: 40rpx;
  font-size: 26rpx;
}

.filter-panel {
  background: #fff;
  padding: 20rpx;
  border-top: 1rpx solid #eee;
}

.filter-section {
  margin-bottom: 20rpx;
}

.filter-title {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.filter-option {
  padding: 10rpx 24rpx;
  background: #f5f7fa;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;

  &.active {
    background: #5B7FFF;
    color: #fff;
  }
}

.list-container {
  padding: 20rpx;
}

.job-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;

  &:active {
    opacity: 0.9;
  }
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.job-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1a1a2e;
  flex: 1;
  margin-right: 20rpx;
}

.job-salary {
  text-align: right;
}

.salary-num {
  font-size: 32rpx;
  font-weight: bold;
  color: #FF6B6B;
}

.salary-type {
  font-size: 22rpx;
  color: #999;
}

.job-meta {
  display: flex;
  gap: 20rpx;
  margin-bottom: 16rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #999;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.tag {
  display: inline-block;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  background: rgba(91, 127, 255, 0.1);
  color: #5B7FFF;
  border-radius: 6rpx;
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
