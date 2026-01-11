<template>
  <view class="min-h-screen bg-bg-primary pb-[60px]">
    <!-- 头部介绍 -->
    <view class="bg-gradient-to-br from-[#667eea] to-[#764ba2] px-[20px] py-[30px] text-center text-white">
      <text class="block text-[40px] mb-[10px]">🤖</text>
      <text class="block text-[20px] font-bold mb-[8px]">AI智能推荐</text>
      <text class="text-sm opacity-90">告诉我你的技能和期望,为你匹配最合适的兼职</text>
    </view>

    <!-- 输入表单 -->
    <view class="bg-white mx-[10px] mt-[10px] rounded-lg px-[15px] py-[15px]">
      <view class="mb-[14px]">
        <text class="block text-base font-bold text-[#333] mb-[6px]">🎯 你的技能特长</text>
        <textarea class="w-full h-[80px] px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border"
          placeholder="例如:编程、英语、设计、写作、沟通能力强..." v-model="skills" :maxlength="200" />
      </view>
      <view class="mb-[14px]">
        <text class="block text-base font-bold text-[#333] mb-[6px]">⏰ 可用时间</text>
        <textarea class="w-full h-[80px] px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border"
          placeholder="例如:周末全天、工作日晚上、每周10小时" v-model="availableTime" :maxlength="100" />
      </view>
      <view class="mb-[14px]">
        <text class="block text-base font-bold text-[#333] mb-[6px]">💰 期望薪资</text>
        <textarea class="w-full h-[80px] px-[10px] py-[10px] bg-bg-primary rounded-md text-base box-border"
          placeholder="例如:100元/小时、500元/天" v-model="expectedSalary" :maxlength="100" />
      </view>

      <view
        class="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-center py-[14px] rounded-full text-lg font-bold mt-[10px] active:opacity-90"
        :class="{ 'opacity-70': isLoading }" @click="handleSubmit">
        <text v-if="!isLoading">✨ 获取AI推荐</text>
        <text v-else>🔄 分析中...</text>
      </view>
    </view>

    <!-- AI推荐结果 -->
    <view class="bg-white mx-[10px] mt-[10px] rounded-lg px-[15px] py-[15px]" v-if="showResult">
      <view class="mb-[10px]">
        <text class="text-lg font-bold text-[#333]">🎉 AI推荐结果</text>
      </view>
      <view
        class="bg-gradient-to-br from-[rgba(102,126,234,0.1)] to-[rgba(118,75,162,0.1)] px-md py-md rounded-md mb-md">
        <text class="text-base text-[#333] leading-relaxed whitespace-pre-wrap">{{ aiResult }}</text>
      </view>
      <view class="flex gap-[10px]">
        <view
          class="flex-1 text-center py-[10px] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-full text-base"
          @click="goToList">
          <text>查看推荐岗位</text>
        </view>
        <view class="flex-1 text-center py-[10px] bg-bg-primary text-text-secondary rounded-full text-base"
          @click="handleReset">
          <text>重新推荐</text>
        </view>
      </view>
    </view>

    <!-- AI生成图片展示(模拟) -->
    <view class="bg-white mx-[10px] mt-[10px] rounded-lg px-[15px] py-[15px]" v-if="showResult">
      <text class="block text-[15px] font-bold text-[#333] mb-md">🎨 AI场景配图</text>
      <view class="grid grid-cols-3 gap-[10px]">
        <view class="text-center" v-for="(img, i) in sceneImages" :key="i">
          <view class="h-[80px] rounded-md flex items-center justify-center mb-[6px]" :style="{ background: img.bg }">
            <text class="text-[30px]">{{ img.icon }}</text>
          </view>
          <text class="text-xs text-text-secondary">{{ img.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAIRecommendation } from '@/utils/mock-data'

const skills = ref('')
const availableTime = ref('')
const expectedSalary = ref('')
const isLoading = ref(false)
const showResult = ref(false)
const aiResult = ref('')

const sceneImages = ref([
  { icon: '📚', label: '家教辅导', bg: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { icon: '💻', label: '技术办公', bg: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { icon: '🎨', label: '设计创作', bg: 'linear-gradient(135deg, #f093fb, #f5576c)' }
])

const handleSubmit = () => {
  if (!skills.value.trim()) {
    uni.showToast({ title: '请输入你的技能', icon: 'none' })
    return
  }

  isLoading.value = true
  showResult.value = false

  // 模拟AI分析延迟
  setTimeout(() => {
    aiResult.value = getAIRecommendation(
      skills.value,
      availableTime.value || '不限',
      expectedSalary.value || '不限'
    )
    isLoading.value = false
    showResult.value = true
  }, 2000)
}

const handleReset = () => {
  showResult.value = false
  aiResult.value = ''
}

const goToList = () => {
  uni.navigateTo({ url: '/pages/job/list' })
}
</script>

<style>
</style>
