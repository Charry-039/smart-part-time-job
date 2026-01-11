<template>
  <view class="min-h-screen bg-bg-primary" :style="{ paddingBottom: contentBottomSpace }">
    <view class="bg-white mx-[10px] mt-[10px] rounded-lg p-[15px]">
      <view class="mb-[14px]">
        <text class="block text-base font-bold text-[#333] mb-[6px]">
          <text class="text-secondary mr-[2px]">*</text>兼职标题
        </text>
        <input class="w-full px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border" placeholder="请输入兼职标题"
          v-model="form.title" />
      </view>

      <view class="mb-[14px]">
        <text class="block text-base font-bold text-[#333] mb-[6px]">
          <text class="text-secondary mr-[2px]">*</text>兼职分类
        </text>
        <picker :range="categories" range-key="name" @change="onCategoryChange">
          <view class="flex justify-between items-center px-[10px] py-[10px] bg-bg-primary rounded-md text-base">
            <text :class="{ 'text-[#999]': !form.category }">
              {{ selectedCategoryName || '请选择分类' }}
            </text>
            <text class="text-[#ccc]">></text>
          </view>
        </picker>
      </view>

      <view class="mb-[14px]">
        <text class="block text-base font-bold text-[#333] mb-[6px]">
          <text class="text-secondary mr-[2px]">*</text>薪资待遇
        </text>
        <view class="flex gap-[8px]">
          <input class="flex-1 px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border" placeholder="金额"
            v-model="form.salary" type="number" />
          <picker class="w-[90px]" :range="salaryTypes" range-key="label" @change="onSalaryTypeChange">
            <view class="px-[10px] py-[10px] bg-primary text-white rounded-md text-center text-sm">
              <text>{{ selectedSalaryTypeLabel }}</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="mb-[14px]">
        <text class="block text-base font-bold text-[#333] mb-[6px]">
          <text class="text-secondary mr-[2px]">*</text>工作地点
        </text>
        <input class="w-full px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border" placeholder="请输入工作地点"
          v-model="form.location" />
      </view>

      <view class="mb-[14px]">
        <text class="block text-base font-bold text-[#333] mb-[6px]">
          <text class="text-secondary mr-[2px]">*</text>职位描述
        </text>
        <textarea class="w-full h-[100px] px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border"
          placeholder="请详细描述工作内容..." v-model="form.description" :maxlength="500" />
      </view>

      <view class="mb-[14px]">
        <text class="block text-base font-bold text-[#333] mb-[6px]">任职要求</text>
        <textarea class="w-full h-[60px] px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border"
          placeholder="请输入任职要求,每行一条" v-model="requirementsText" :maxlength="200" />
      </view>

      <view class="mb-[14px]">
        <text class="block text-base font-bold text-[#333] mb-[6px]">
          <text class="text-secondary mr-[2px]">*</text>联系方式
        </text>
        <input class="w-full px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border" placeholder="请输入联系方式"
          v-model="form.contact" />
      </view>
    </view>

    <view class="fixed left-0 right-0 px-[12px] py-[10px] bg-white z-[1200] safe-area-bottom"
      :style="actionBarStyle" style="box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);">
      <button
        class="w-full bg-gradient-to-br from-primary to-primary-light text-white text-center py-[14px] rounded-full text-lg font-bold active:opacity-90 active:translate-y-[1px]"
        style="box-shadow: 0 4px 12px rgba(91, 127, 255, 0.3); transition: all 0.3s ease;" @click="handlePublish">
        发布兼职
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { addJob, isLoggedIn, getUserInfo, generateId } from '@/utils/storage'
import { JOB_CATEGORIES } from '@/utils/mock-data'

const TABBAR_HEIGHT = 56
const ACTION_BAR_GAP = 12
const ACTION_BAR_HEIGHT = 78

//兼职分类
const categories = ref(JOB_CATEGORIES)
//薪资类型
const salaryTypes = ref([
  { value: 'hour', label: '元/小时' },
  { value: 'day', label: '元/天' },
  { value: 'month', label: '元/月' },
  { value: 'task', label: '元/单' }
])

const form = ref({
  title: '',
  category: '',
  salary: '',
  salaryType: 'hour',
  location: '',
  description: '',
  contact: ''
})

const requirementsText = ref('')

const selectedCategoryName = computed(() => {
  const cat = categories.value.find(c => c.id === form.value.category)
  return cat ? cat.name : ''
})

const selectedSalaryTypeLabel = computed(() => {
  const type = salaryTypes.value.find(t => t.value === form.value.salaryType)
  return type ? type.label : '元/小时'
})

const contentBottomSpace = computed(() => `${TABBAR_HEIGHT + ACTION_BAR_HEIGHT + 24}px`)
const actionBarStyle = computed(() => `bottom: calc(env(safe-area-inset-bottom) + ${TABBAR_HEIGHT + ACTION_BAR_GAP}px)`)

const onCategoryChange = (e: any) => {
  form.value.category = categories.value[e.detail.value].id
}

const onSalaryTypeChange = (e: any) => {
  form.value.salaryType = salaryTypes.value[e.detail.value].value
}

const handlePublish = () => {
  // 验证登录
  if (!isLoggedIn()) {
    uni.showModal({
      title: '提示',
      content: '请先登录后再发布',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/user/login' })
        }
      }
    })
    return
  }

  // 表单验证
  if (!form.value.title.trim()) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }
  if (!form.value.category) {
    uni.showToast({ title: '请选择分类', icon: 'none' })
    return
  }
  if (!form.value.salary) {
    uni.showToast({ title: '请输入薪资', icon: 'none' })
    return
  }
  if (!form.value.location.trim()) {
    uni.showToast({ title: '请输入工作地点', icon: 'none' })
    return
  }
  if (!form.value.description.trim()) {
    uni.showToast({ title: '请输入职位描述', icon: 'none' })
    return
  }
  if (!form.value.contact.trim()) {
    uni.showToast({ title: '请输入联系方式', icon: 'none' })
    return
  }

  const user = getUserInfo()
  const requirements = requirementsText.value.split('\n').filter(r => r.trim())

  addJob({
    id: generateId(),
    title: form.value.title,
    category: form.value.category,
    salary: form.value.salary,
    salaryType: form.value.salaryType as any,
    location: form.value.location,
    description: form.value.description,
    requirements: requirements,
    contact: form.value.contact,
    publisherId: user?.id || '',
    publisherName: user?.nickname || '匿名用户',
    createTime: new Date().toISOString(),
    views: 0,
    applicants: 0
  })

  uni.showToast({ title: '发布成功', icon: 'success' })

  setTimeout(() => {
    // 重置表单
    form.value = {
      title: '',
      category: '',
      salary: '',
      salaryType: 'hour',
      location: '',
      description: '',
      contact: ''
    }
    requirementsText.value = ''
    // 跳转到首页
    uni.switchTab({ url: '/pages/index/index' })
  }, 1500)
}
</script>

<style>
uni-input {
  display: block;
  width: 100%;
}
</style>
