<template>
  <view class="min-h-screen bg-bg-primary pb-[60px]">
    <!-- 自定义导航栏 -->
    <view class="bg-gradient-to-br from-primary to-primary-light px-[15px] pt-[30px] pb-[15px] sticky top-0 z-[100]">
      <view class="text-white text-xl font-bold mb-[10px]">智创兼职</view>
      <view class="flex items-center bg-white/90 rounded-full px-md py-sm" @click="goToSearch">
        <text class="mr-[6px]">🔍</text>
        <text class="text-text-light text-base">搜索兼职岗位...</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <swiper class="h-[140px] mx-[10px] my-[10px] rounded-lg overflow-hidden" indicator-dots autoplay circular>
      <swiper-item v-for="(item, index) in banners" :key="index">
        <view class="h-full flex items-center justify-center rounded-lg" :style="{ background: item.bg }">
          <text class="text-white text-xl font-bold" style="text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);">{{ item.text
            }}</text>
        </view>
      </swiper-item>
    </swiper>

    <!-- 分类入口 -->
    <view class="bg-white mx-[10px] rounded-lg p-md">
      <view class="flex justify-between items-center mb-md">
        <text class="text-lg font-bold text-text-primary">兼职分类</text>
        <text class="text-sm text-primary" @click="goToList('')">全部 ></text>
      </view>
      <view class="grid grid-cols-4 gap-[10px]">
        <view class="flex flex-col items-center p-sm rounded-md bg-[#f8f9fc] active:bg-[#eef1f8]"
          v-for="cat in categories" :key="cat.id" @click="goToList(cat.id)">
          <view class="text-[24px] mb-[4px]">{{ cat.icon }}</view>
          <text class="text-xs text-[#333]">{{ cat.name }}</text>
        </view>
      </view>
    </view>

    <!-- 推荐兼职列表 -->
    <view class="bg-white mx-[10px] mt-[10px] rounded-lg p-md">
      <view class="flex justify-between items-center mb-md">
        <text class="text-lg font-bold text-text-primary">热门兼职</text>
        <text class="text-sm text-primary" @click="goToList('')">更多 ></text>
      </view>
      <view class="flex flex-col gap-[10px]">
        <view class="flex justify-between p-md bg-[#f8f9fc] rounded-md active:bg-[#eef1f8]" v-for="job in hotJobs"
          :key="job.id" @click="goToDetail(job.id)">
          <view class="flex-1 mr-[10px]">
            <text class="block text-[15px] font-bold text-text-primary mb-[6px]">{{ job.title }}</text>
            <view class="flex flex-wrap gap-[5px] mb-[6px]">
              <text class="inline-block text-[11px] px-[6px] py-[2px] bg-primary/10 text-primary rounded-[3px]">{{
                getCategoryName(job.category) }}</text>
              <text class="inline-block text-[11px] px-[6px] py-[2px] bg-success/10 text-success rounded-[3px]">📍 {{
                job.location }}</text>
            </view>
            <text class="text-sm text-text-secondary line-clamp-2">{{ job.description }}</text>
          </view>
          <view class="flex flex-col items-end justify-center min-w-[60px]">
            <text class="text-xl font-bold text-secondary">¥{{ job.salary }}</text>
            <text class="text-[11px] text-text-light">{{ getSalaryTypeText(job.salaryType) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="flex flex-col items-center py-[50px]" v-if="hotJobs.length === 0">
      <text class="text-[40px] mb-[10px]">📭</text>
      <text class="text-text-light text-base">暂无兼职信息</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getJobs, type JobInfo } from '@/utils/storage'
import { initMockData, JOB_CATEGORIES, getCategoryName } from '@/utils/mock-data'

const banners = ref([
  { text: '大学生专属兼职平台', bg: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { text: '每日更新优质岗位', bg: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { text: 'AI智能匹配推荐', bg: 'linear-gradient(135deg, #4facfe, #00f2fe)' }
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

<style>
/* 使用 Tailwind CSS,无需额外样式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
