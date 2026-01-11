<template>
  <view class="min-h-screen bg-bg-primary pb-[60px]">
    <!-- 搜索和筛选 -->
    <view class="flex px-[10px] py-[10px] bg-white gap-[8px]">
      <input class="flex-1 bg-bg-primary rounded-full px-md py-sm text-base" placeholder="搜索兼职岗位" v-model="searchText"
        @confirm="handleSearch" />
      <view class="flex items-center justify-center px-md bg-primary text-white rounded-full text-sm"
        @click="showFilter = !showFilter">
        <text>筛选</text>
      </view>
    </view>

    <!-- 筛选面板 -->
    <view class="bg-white px-[10px] py-[10px] border-t border-[#eee]" v-if="showFilter">
      <view class="mb-[10px]">
        <text class="text-sm text-text-secondary mb-[6px] block">分类</text>
        <view class="flex flex-wrap gap-[8px]">
          <view class="px-md py-[5px] bg-bg-primary rounded-[10px] text-xs text-text-secondary"
            :class="{ '!bg-primary !text-white': selectedCategory === '' }" @click="selectedCategory = ''">全部</view>
          <view class="px-md py-[5px] bg-bg-primary rounded-[10px] text-xs text-text-secondary"
            v-for="cat in categories" :key="cat.id" :class="{ '!bg-primary !text-white': selectedCategory === cat.id }"
            @click="selectedCategory = cat.id">{{ cat.name }}</view>
        </view>
      </view>
      <view class="mb-[10px]">
        <text class="text-sm text-text-secondary mb-[6px] block">薪资排序</text>
        <view class="flex flex-wrap gap-[8px]">
          <view class="px-md py-[5px] bg-bg-primary rounded-[10px] text-xs text-text-secondary"
            :class="{ '!bg-primary !text-white': sortBy === 'default' }" @click="sortBy = 'default'">默认</view>
          <view class="px-md py-[5px] bg-bg-primary rounded-[10px] text-xs text-text-secondary"
            :class="{ '!bg-primary !text-white': sortBy === 'salary-desc' }" @click="sortBy = 'salary-desc'">薪资最高</view>
          <view class="px-md py-[5px] bg-bg-primary rounded-[10px] text-xs text-text-secondary"
            :class="{ '!bg-primary !text-white': sortBy === 'time' }" @click="sortBy = 'time'">最新发布</view>
        </view>
      </view>
    </view>

    <!-- 兼职列表 -->
    <view class="px-[10px] py-[10px]">
      <view class="bg-white rounded-md px-md py-md mb-[10px] active:opacity-90" v-for="job in filteredJobs"
        :key="job.id" @click="goToDetail(job.id)">
        <view class="flex justify-between items-start mb-[8px]">
          <text class="text-[15px] font-bold text-text-primary flex-1 mr-[10px]">{{ job.title }}</text>
          <view class="text-right">
            <text class="block text-lg font-bold text-secondary">¥{{ job.salary }}</text>
            <text class="text-[11px] text-text-light">{{ getSalaryTypeText(job.salaryType) }}</text>
          </view>
        </view>
        <view class="flex gap-[10px] mb-[8px]">
          <text class="text-xs text-text-light">📍 {{ job.location }}</text>
          <text class="text-xs text-text-light">👁 {{ job.views }}浏览</text>
          <text class="text-xs text-text-light">👤 {{ job.applicants }}人报名</text>
        </view>
        <view class="flex flex-wrap gap-[5px]">
          <text class="inline-block text-[11px] px-[6px] py-[2px] bg-primary/10 text-primary rounded-[3px]">{{
            getCategoryName(job.category) }}</text>
          <text class="inline-block text-[11px] px-[6px] py-[2px] bg-primary/10 text-primary rounded-[3px]"
            v-for="(req, i) in job.requirements.slice(0, 2)" :key="i">{{ req }}</text>
        </view>
      </view>

      <view class="flex flex-col items-center py-[50px]" v-if="filteredJobs.length === 0">
        <text class="text-[40px] mb-[10px]">📭</text>
        <text class="text-text-light text-base">暂无符合条件的兼职</text>
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
  // 触发搜索(已通过 computed 实时过滤)
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

<style>
/* 使用 Tailwind CSS */
</style>
