<template>
  <view class="map-page">
    <!-- 地图区域 -->
    <map class="job-map" :latitude="currentLocation.latitude" :longitude="currentLocation.longitude" :markers="markers"
      :scale="14" show-location @markertap="onMarkerTap"></map>

    <!-- 底部兼职列表 -->
    <view class="bottom-panel" :class="{ expanded: isPanelExpanded }">
      <view class="panel-header" @click="togglePanel">
        <view class="handle"></view>
        <text class="panel-title">📍 附近兼职（{{ jobsWithLocation.length }}个）</text>
      </view>

      <scroll-view class="panel-content" scroll-y>
        <view class="job-item" v-for="job in jobsWithLocation" :key="job.id" @click="goToDetail(job.id)"
          :class="{ active: selectedJobId === job.id }">
          <view class="job-info">
            <text class="job-title">{{ job.title }}</text>
            <text class="job-location">📍 {{ job.location }}</text>
          </view>
          <view class="job-salary">
            <text class="salary-num">¥{{ job.salary }}</text>
            <text class="salary-type">{{ getSalaryTypeText(job.salaryType) }}</text>
          </view>
        </view>

        <view class="empty-tip" v-if="jobsWithLocation.length === 0">
          <text>暂无附近的兼职岗位</text>
        </view>
      </scroll-view>
    </view>

    <!-- 定位按钮 -->
    <view class="locate-btn" @click="handleLocate">
      <text>📍</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getJobs, type JobInfo } from '@/utils/storage'

const currentLocation = ref({
  latitude: 39.9042,
  longitude: 116.4074
})

const jobs = ref<JobInfo[]>([])
const isPanelExpanded = ref(false)
const selectedJobId = ref('')

// 只显示有位置信息的兼职
const jobsWithLocation = computed(() => {
  return jobs.value.filter(job => job.latitude && job.longitude)
})

// 地图标记点
const markers = computed(() => {
  return jobsWithLocation.value.map((job, index) => ({
    id: index,
    latitude: job.latitude!,
    longitude: job.longitude!,
    title: job.title,
    iconPath: '/static/marker.png',
    width: 30,
    height: 40,
    callout: {
      content: `${job.title}\n¥${job.salary}`,
      display: 'BYCLICK',
      borderRadius: 8,
      padding: 8,
      bgColor: '#fff',
      color: '#333',
      fontSize: 12
    }
  }))
})

const getSalaryTypeText = (type: string) => {
  const map: Record<string, string> = { hour: '/时', day: '/天', month: '/月', task: '/单' }
  return map[type] || ''
}

const togglePanel = () => {
  isPanelExpanded.value = !isPanelExpanded.value
}

const onMarkerTap = (e: any) => {
  const index = e.detail?.markerId ?? e.markerId
  if (index !== undefined && jobsWithLocation.value[index]) {
    selectedJobId.value = jobsWithLocation.value[index].id
    isPanelExpanded.value = true
  }
}

const goToDetail = (jobId: string) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${jobId}` })
}

const handleLocate = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      currentLocation.value = {
        latitude: res.latitude,
        longitude: res.longitude
      }
      uni.showToast({ title: '定位成功', icon: 'success' })
    },
    fail: () => {
      uni.showToast({ title: '定位失败，使用默认位置', icon: 'none' })
    }
  })
}

onMounted(() => {
  jobs.value = getJobs()
  // 尝试获取当前位置
  handleLocate()
})
</script>

<style lang="scss">
.map-page {
  height: 100vh;
  position: relative;
}

.job-map {
  width: 100%;
  height: 100%;
}

.bottom-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  max-height: 50vh;
  transition: transform 0.3s;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.panel-header {
  padding: 20rpx 30rpx;
  text-align: center;
}

.handle {
  width: 60rpx;
  height: 8rpx;
  background: #ddd;
  border-radius: 4rpx;
  margin: 0 auto 16rpx;
}

.panel-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.panel-content {
  max-height: 40vh;
  padding: 0 20rpx 20rpx;
}

.job-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fc;
  border-radius: 16rpx;
  margin-bottom: 16rpx;

  &:active,
  &.active {
    background: rgba(91, 127, 255, 0.1);
    border: 2rpx solid #5B7FFF;
  }
}

.job-info {
  flex: 1;
}

.job-title {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 8rpx;
}

.job-location {
  font-size: 24rpx;
  color: #999;
}

.job-salary {
  text-align: right;
}

.salary-num {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #FF6B6B;
}

.salary-type {
  font-size: 22rpx;
  color: #999;
}

.empty-tip {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 26rpx;
}

.locate-btn {
  position: absolute;
  right: 30rpx;
  bottom: 320rpx;
  width: 80rpx;
  height: 80rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
  font-size: 36rpx;

  &:active {
    background: #f5f5f5;
  }
}
</style>
