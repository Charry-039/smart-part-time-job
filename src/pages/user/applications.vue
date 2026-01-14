<template>
  <view class="min-h-screen bg-bg-primary pb-[20px]">
    <!-- 空状态 -->
    <view class="flex flex-col items-center justify-center pt-[100px]" v-if="applications.length === 0">
      <text class="text-[60px] mb-[10px]">📋</text>
      <text class="text-base text-text-secondary mb-[20px]">还没有报名过兼职</text>
      <view
        class="px-[30px] py-[10px] bg-gradient-to-br from-primary to-primary-light text-white rounded-full text-sm active:opacity-90"
        @click="goToJobList">
        <text>去找兼职</text>
      </view>
    </view>

    <!-- 报名列表 -->
    <view class="px-[10px] pt-[10px]" v-else>
      <view
        class="bg-white rounded-lg p-[15px] mb-[10px] active:bg-[#f9f9f9]"
        v-for="item in applications"
        :key="`${item.jobId}-${item.applyTime}`"
        @click="goToDetail(item.jobId)">
        <!-- 兼职信息 -->
        <view class="flex justify-between items-start mb-[8px]" v-if="item.job">
          <text class="text-lg font-bold text-text-primary flex-1 mr-[10px]">{{ item.job.title }}</text>
          <view class="flex flex-col items-end gap-[2px]">
            <text class="text-base text-secondary font-bold">¥{{ item.job.salary }}</text>
            <text class="text-xs text-text-light">{{ getSalaryTypeText(item.job.salaryType) }}</text>
          </view>
        </view>

        <!-- 分类和地点 -->
        <view class="flex flex-wrap gap-[6px] mb-[10px]" v-if="item.job">
          <text class="px-[8px] py-[3px] bg-primary/10 text-primary rounded-[10px] text-xs">
            {{ getCategoryName(item.job.category) }}
          </text>
          <text class="px-[8px] py-[3px] bg-success/10 text-success rounded-[10px] text-xs">
            📍 {{ item.job.location }}
          </text>
        </view>

        <!-- 报名状态 -->
        <view class="flex items-center justify-between pt-[8px] border-t border-[#f0f0f0]">
          <text class="text-xs text-text-light">{{ formatTime(item.applyTime) }}</text>
          <view class="px-[10px] py-[3px] rounded-[10px] text-xs" :class="getStatusClass(item.status)">
            <text>{{ getStatusText(item.status) }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="flex gap-[8px] mt-[10px]" v-if="item.job">
          <view
            class="flex-1 py-[8px] text-center bg-bg-primary text-primary text-sm rounded-md active:bg-primary/10"
            @click.stop="contactPublisher(item.job)">
            <text>联系发布者</text>
          </view>
          <view
            v-if="item.status === 'pending'"
            class="flex-1 py-[8px] text-center bg-bg-primary text-text-secondary text-sm rounded-md active:bg-[#f0f0f0]"
            @click.stop="cancelApplication(item.jobId)">
            <text>取消报名</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  getUserInfo, 
  getUserApplications, 
  getJobById,
  updateApplication,
  type ApplicationItem, 
  type JobInfo 
} from '@/utils/storage'
import { getCategoryName } from '@/utils/mock-data'
import { onShow } from '@dcloudio/uni-app'

interface ApplicationWithJob extends ApplicationItem {
  job?: JobInfo
}

const applications = ref<ApplicationWithJob[]>([])

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
  
  if (days === 0) return '今天报名'
  if (days === 1) return '昨天报名'
  if (days < 7) return `${days}天前报名`
  return `${date.getMonth() + 1}月${date.getDate()}日报名`
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    accepted: '已接受',
    rejected: '已拒绝',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-warning/10 text-warning',
    accepted: 'bg-success/10 text-success',
    rejected: 'bg-secondary/10 text-secondary',
    cancelled: 'bg-[#f0f0f0] text-text-light'
  }
  return map[status] || 'bg-[#f0f0f0] text-text-secondary'
}

const loadApplications = () => {
  const user = getUserInfo()
  if (user) {
    const userApps = getUserApplications(user.id)
    // 关联兼职信息
    applications.value = userApps.map(app => {
      const job = getJobById(app.jobId)
      return { ...app, job }
    }).sort((a, b) => {
      // 按报名时间倒序排列
      return new Date(b.applyTime).getTime() - new Date(a.applyTime).getTime()
    })
  }
}

const goToDetail = (jobId: string) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${jobId}` })
}

const goToJobList = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const contactPublisher = (job: JobInfo) => {
  uni.showModal({
    title: '联系方式',
    content: `发布者: ${job.publisherName}\n联系方式: ${job.contact}`,
    confirmText: '知道了',
    showCancel: false
  })
}

const cancelApplication = (jobId: string) => {
  const user = getUserInfo()
  if (!user) return

  uni.showModal({
    title: '确认取消',
    content: '确定要取消报名吗？',
    confirmColor: '#FF5C5C',
    success: (res) => {
      if (res.confirm) {
        updateApplication(jobId, user.id, 'cancelled')
        loadApplications()
        uni.showToast({ title: '已取消报名', icon: 'success' })
      }
    }
  })
}

onMounted(() => {
  loadApplications()
})

onShow(() => {
  loadApplications()
})
</script>

<style scoped>
</style>
