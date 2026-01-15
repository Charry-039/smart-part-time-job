<template>
  <view class="h-screen relative">
    <!-- 地图区域 -->
    <map class="w-full h-full" :latitude="currentLocation.latitude" :longitude="currentLocation.longitude"
      :markers="markers" :scale="14" show-location @markertap="onMarkerTap"></map>

    <!-- 底部兼职列表 -->
    <view
      class="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[50vh] transition-transform safe-area-bottom"
      :class="{ expanded: isPanelExpanded }" style="box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);">
      <view class="px-[15px] py-[10px] text-center" @click="togglePanel">
        <view class="w-[30px] h-[4px] bg-[#ddd] rounded-sm mx-auto mb-[8px]"></view>
        <text class="text-base font-bold text-[#333]">📍 附近兼职({{ jobsWithLocation.length }}个)</text>
      </view>

      <scroll-view class="max-h-[40vh] px-[10px] pb-[10px]" scroll-y>
        <view class="flex justify-between items-center px-md py-md bg-[#f8f9fc] rounded-md mb-[8px]"
          v-for="job in jobsWithLocation" :key="job.id" @click="goToDetail(job.id)"
          :class="{ '!bg-primary/10 !border-2 !border-primary': selectedJobId === job.id }">
          <view class="flex-1">
            <text class="block text-base font-bold text-text-primary mb-[4px]">{{ job.title }}</text>
            <text class="text-xs text-text-light">📍 {{ job.location }}</text>
          </view>
          <view class="text-right">
            <text class="block text-lg font-bold text-secondary">¥{{ job.salary }}</text>
            <text class="text-[11px] text-text-light">{{ getSalaryTypeText(job.salaryType) }}</text>
          </view>
        </view>

        <view class="text-center py-[20px] text-text-light text-sm" v-if="jobsWithLocation.length === 0">
          <text>暂无附近的兼职岗位</text>
        </view>
      </scroll-view>
    </view>

    <!-- 定位按钮 -->
    <view
      class="absolute right-[15px] bottom-[160px] w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center text-xl active:bg-[#f5f5f5]"
      style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);" @click="handleLocate">
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
    iconPath: '/static/logo.png',
    width: 30,
    height: 30,
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
      uni.showToast({ title: '定位失败,使用默认位置', icon: 'none' })
    }
  })
}

onMounted(() => {
  jobs.value = getJobs()
  // 尝试获取当前位置
  handleLocate()
})
</script>

<style>
</style>
