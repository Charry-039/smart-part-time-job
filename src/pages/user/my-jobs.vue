<template>
  <view class="min-h-screen bg-bg-primary pb-[20px]">
    <!-- 空状态 -->
    <view class="flex flex-col items-center justify-center pt-[100px]" v-if="myJobs.length === 0">
      <text class="text-[60px] mb-[10px]">📝</text>
      <text class="text-base text-text-secondary mb-[20px]">还没有发布过兼职</text>
      <view
        class="px-[30px] py-[10px] bg-gradient-to-br from-primary to-primary-light text-white rounded-full text-sm active:opacity-90"
        @click="goToPublish">
        <text>去发布</text>
      </view>
    </view>

    <!-- 兼职列表 -->
    <view class="px-[10px] pt-[10px]" v-else>
      <view
        class="bg-white rounded-lg p-[15px] mb-[10px] active:bg-[#f9f9f9]"
        v-for="job in myJobs"
        :key="job.id"
        @click="goToDetail(job.id)">
        <view class="flex justify-between items-start mb-[8px]">
          <text class="text-lg font-bold text-text-primary flex-1 mr-[10px]">{{ job.title }}</text>
          <view class="flex flex-col items-end gap-[2px]">
            <text class="text-base text-secondary font-bold">¥{{ job.salary }}</text>
            <text class="text-xs text-text-light">{{ getSalaryTypeText(job.salaryType) }}</text>
          </view>
        </view>

        <view class="flex flex-wrap gap-[6px] mb-[10px]">
          <text class="px-[8px] py-[3px] bg-primary/10 text-primary rounded-[10px] text-xs">
            {{ getCategoryName(job.category) }}
          </text>
          <text class="px-[8px] py-[3px] bg-success/10 text-success rounded-[10px] text-xs">
            📍 {{ job.location }}
          </text>
        </view>

        <view class="flex items-center justify-between pt-[8px] border-t border-[#f0f0f0]">
          <text class="text-xs text-text-light">{{ formatTime(job.createTime) }}</text>
          <view class="flex gap-[12px]">
            <text class="text-xs text-text-secondary">👁 {{ job.views }}浏览</text>
            <text class="text-xs text-text-secondary">👤 {{ job.applicants }}人报名</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="flex gap-[8px] mt-[10px]">
          <view
            class="flex-1 py-[8px] text-center bg-bg-primary text-primary text-sm rounded-md active:bg-primary/10"
            @click.stop="editJob(job.id)">
            <text>编辑</text>
          </view>
          <view
            class="flex-1 py-[8px] text-center bg-bg-primary text-secondary text-sm rounded-md active:bg-secondary/10"
            @click.stop="deleteJobConfirm(job.id)">
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserInfo, getUserPublishedJobs, deleteJob, type JobInfo } from '@/utils/storage'
import { getCategoryName } from '@/utils/mock-data'
import { onShow } from '@dcloudio/uni-app'

const myJobs = ref<JobInfo[]>([])

const getSalaryTypeText = (type: string) => {
  const map: Record<string, string> = { 
    hour: '/时', 
    day: '/天', 
    month: '/月', 
    task: '/单' 
  }
  return map[type] || ''
}

const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天发布'
  if (days === 1) return '昨天发布'
  if (days < 7) return `${days}天前发布`
  return `${date.getMonth() + 1}月${date.getDate()}日发布`
}

const loadMyJobs = () => {
  const user = getUserInfo()
  if (user) {
    myJobs.value = getUserPublishedJobs(user.id)
  }
}

const goToDetail = (jobId: string) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${jobId}` })
}

const goToPublish = () => {
  uni.switchTab({ url: '/pages/publish/index' })
}

const editJob = (jobId: string) => {
  uni.showToast({ title: '编辑功能待开发', icon: 'none' })
  // TODO: 实现编辑功能，需要在 publish/index.vue 添加编辑模式
}

const deleteJobConfirm = (jobId: string) => {
  uni.showModal({
    title: '确认删除',
    content: '删除后将无法恢复，确定要删除这条兼职信息吗？',
    confirmColor: '#FF5C5C',
    success: (res) => {
      if (res.confirm) {
        deleteJob(jobId)
        loadMyJobs()
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}

onMounted(() => {
  loadMyJobs()
})

onShow(() => {
  loadMyJobs()
})
</script>

<style scoped>
</style>
