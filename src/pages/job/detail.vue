<template>
  <view class="min-h-screen bg-bg-primary pb-[70px]" v-if="job">
    <!-- 基本信息 -->
    <view class="bg-gradient-to-br from-primary to-primary-light px-[15px] py-[20px] text-white">
      <text class="block text-xl font-bold mb-[10px]">{{ job.title }}</text>
      <view class="flex items-baseline gap-[4px]">
        <text class="text-[24px] font-bold">¥{{ job.salary }}</text>
        <text class="text-sm opacity-90">{{ getSalaryTypeText(job.salaryType) }}</text>
      </view>
    </view>

    <!-- 标签 -->
    <view class="flex flex-wrap gap-[8px] px-[15px] py-md bg-white">
      <text class="px-[10px] py-[4px] bg-primary/10 text-primary rounded-[10px] text-xs">{{
        getCategoryName(job.category) }}</text>
      <text class="px-[10px] py-[4px] bg-success/10 text-success rounded-[10px] text-xs">📍 {{ job.location }}</text>
    </view>

    <!-- 发布信息 -->
    <view class="flex justify-between items-center px-[15px] py-md bg-white mt-[1px]">
      <view class="flex items-center gap-[8px]">
        <view
          class="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-lg font-bold">
          {{ job.publisherName?.charAt(0) || '?' }}</view>
        <view class="flex flex-col">
          <text class="text-base text-text-primary font-medium">{{ job.publisherName }}</text>
          <text class="text-xs text-text-light">{{ formatTime(job.createTime) }}</text>
        </view>
      </view>
      <view class="flex gap-[10px]">
        <text class="text-xs text-text-secondary">👁 {{ job.views }}浏览</text>
        <text class="text-xs text-text-secondary">👤 {{ job.applicants }}人报名</text>
      </view>
    </view>

    <!-- 职位描述 -->
    <view class="bg-white mt-[10px] px-[15px] py-md">
      <text class="block text-[15px] font-bold text-text-primary mb-[8px]">📝 职位描述</text>
      <text class="text-base text-text-secondary leading-relaxed">{{ job.description }}</text>
    </view>

    <!-- 任职要求 -->
    <view class="bg-white mt-[10px] px-[15px] py-md">
      <text class="block text-[15px] font-bold text-text-primary mb-[8px]">✅ 任职要求</text>
      <view class="flex flex-col gap-[6px]">
        <text class="text-base text-text-secondary" v-for="(req, i) in job.requirements" :key="i">• {{ req }}</text>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="bg-white mt-[10px] px-[15px] py-md">
      <text class="block text-[15px] font-bold text-text-primary mb-[8px]">📞 联系方式</text>
      <text class="text-base text-text-secondary">{{ job.contact }}</text>
    </view>

    <!-- 底部按钮 -->
    <view class="fixed bottom-0 left-0 right-0 flex gap-[8px] px-[15px] py-[10px] bg-white safe-area-bottom"
      style="box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);">
      <view
        class="flex flex-col items-center justify-center px-md py-sm rounded-md bg-bg-primary text-text-secondary text-xs min-w-[50px]"
        :class="{ '!text-secondary': isFavorited }" @click="toggleFavorite">
        <text>{{ isFavorited ? '❤️' : '🤍' }}</text>
        <text>{{ isFavorited ? '已收藏' : '收藏' }}</text>
      </view>
      <view
        class="flex flex-col items-center justify-center px-md py-sm rounded-md bg-bg-primary text-text-secondary text-xs min-w-[50px]"
        @click="goToMessage">
        <text>💬</text>
        <text>留言</text>
      </view>
      <view
        class="flex-1 flex items-center justify-center py-sm rounded-md bg-gradient-to-br from-primary to-primary-light text-white text-[15px] font-bold"
        :class="{ '!bg-[#ccc]': hasApplied }" @click="handleApply">
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
  getApplications, addApplication, isLoggedIn, getUserInfo, generateId,
  hasUserApplied
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
        hasApplied.value = hasUserApplied(user.id, jobId)
      }
    }
  }
})
</script>

<style>
</style>
