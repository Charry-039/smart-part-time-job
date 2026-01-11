<template>
  <view class="min-h-screen bg-bg-primary px-[10px] py-[10px]">
    <view class="flex flex-col gap-[10px]" v-if="favoriteJobs.length > 0">
      <view class="flex justify-between items-center bg-white px-[14px] py-[14px] rounded-md active:bg-[#f9f9f9]"
        v-for="job in favoriteJobs" :key="job.id" @click="goToDetail(job.id)">
        <view class="flex-1">
          <text class="block text-[15px] font-bold text-text-primary mb-[4px]">{{ job.title }}</text>
          <text class="text-xs text-text-light">📍 {{ job.location }}</text>
        </view>
        <view class="flex flex-col items-end gap-[6px]">
          <text class="text-lg font-bold text-secondary">¥{{ job.salary }}</text>
          <view class="px-[10px] py-[4px] bg-[#f5f5f5] rounded-[10px] text-[11px] text-text-light"
            @click.stop="handleRemove(job.id)">
            <text>移除</text>
          </view>
        </view>
      </view>
    </view>

    <view class="flex flex-col items-center py-[75px]" v-else>
      <text class="text-[50px] mb-md">💔</text>
      <text class="text-[15px] text-text-light mb-[20px]">暂无收藏的兼职</text>
      <view
        class="px-[24px] py-[10px] bg-gradient-to-br from-primary to-primary-light text-white rounded-full text-base"
        @click="goToHome">
        <text>去发现兼职</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFavorites, removeFavorite, getJobById, type JobInfo } from '@/utils/storage'

const favoriteJobs = ref<JobInfo[]>([])

const loadFavorites = () => {
  const favorites = getFavorites()
  favoriteJobs.value = favorites
    .map(f => getJobById(f.jobId))
    .filter((job): job is JobInfo => job !== undefined)
}

const goToDetail = (jobId: string) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${jobId}` })
}

const handleRemove = (jobId: string) => {
  uni.showModal({
    title: '提示',
    content: '确定要移除这个收藏吗?',
    success: (res) => {
      if (res.confirm) {
        removeFavorite(jobId)
        loadFavorites()
        uni.showToast({ title: '已移除', icon: 'none' })
      }
    }
  })
}

const goToHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

onMounted(() => {
  loadFavorites()
})
</script>

<style>
</style>
