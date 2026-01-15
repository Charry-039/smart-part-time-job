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

// 坐标转换：WGS-84转GCJ-02（火星坐标系）
const wgs84togcj02 = (lng: number, lat: number): { longitude: number, latitude: number } => {
  const pi = Math.PI
  const a = 6378245.0 // 长半轴
  const ee = 0.00669342162296594323 // 扁率
  
  if (outOfChina(lng, lat)) {
    return { longitude: lng, latitude: lat }
  }
  
  let dLat = transformLat(lng - 105.0, lat - 35.0)
  let dLng = transformLng(lng - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * pi
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi)
  dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi)
  
  return {
    longitude: lng + dLng,
    latitude: lat + dLat
  }
}

// 判断是否在中国境内
const outOfChina = (lng: number, lat: number): boolean => {
  if (lng < 72.004 || lng > 137.8347) return true
  if (lat < 0.8293 || lat > 55.8271) return true
  return false
}

// 纬度转换
const transformLat = (x: number, y: number): number => {
  const pi = Math.PI
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(y / 12.0 * pi) + 320.0 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0
  return ret
}

// 经度转换
const transformLng = (x: number, y: number): number => {
  const pi = Math.PI
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0
  return ret
}

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
  // 使用HTML5原生定位API
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 将HTML5定位获取的WGS-84坐标转换为GCJ-02（火星坐标系）
        const gcj02Location = wgs84togcj02(position.coords.longitude, position.coords.latitude)
        currentLocation.value = {
          latitude: gcj02Location.latitude,
          longitude: gcj02Location.longitude
        }
        uni.showToast({ title: '定位成功', icon: 'success' })
      },
      (error) => {
        console.error('定位失败:', error)
        let errorMsg = '定位失败,使用默认位置'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = '用户拒绝了定位请求'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = '位置信息不可用'
            break
          case error.TIMEOUT:
            errorMsg = '定位请求超时'
            break
          default:
            errorMsg = '发生未知错误'
        }
        uni.showToast({ title: errorMsg, icon: 'none' })
      },
      {
        enableHighAccuracy: false, // 降低高精度要求以提高定位速度
        timeout: 30000, // 增加超时时间到30秒
        maximumAge: 120000 // 增加缓存时间到2分钟
      }
    )
  } else {
    uni.showToast({ title: '当前浏览器不支持定位功能', icon: 'none' })
  }
}

onMounted(() => {
  jobs.value = getJobs()
  // 尝试获取当前位置
  handleLocate()
})
</script>

<style>
</style>
