<template>
  <view class="ai-page">
    <!-- 头部介绍 -->
    <view class="ai-header">
      <text class="ai-icon">🤖</text>
      <text class="ai-title">AI智能推荐</text>
      <text class="ai-desc">告诉我你的技能和期望，为你匹配最合适的兼职</text>
    </view>

    <!-- 输入表单 -->
    <view class="form-section">
      <view class="form-item">
        <text class="label">🎯 你的技能特长</text>
        <textarea class="textarea" placeholder="例如：编程、英语、设计、写作、沟通能力强..." v-model="skills" :maxlength="200" />
      </view>
      <view class="form-item">
        <text class="label">⏰ 可用时间</text>
        <textarea class="textarea" placeholder="例如：周末全天、工作日晚上、每周10小时" v-model="availableTime" :maxlength="100" />
      </view>
      <view class="form-item">
        <text class="label">💰 期望薪资</text>
        <textarea class="textarea" placeholder="例如：100元/小时、500元/天" v-model="expectedSalary" :maxlength="100" />
      </view>

      <view class="submit-btn" @click="handleSubmit" :class="{ loading: isLoading }">
        <text v-if="!isLoading">✨ 获取AI推荐</text>
        <text v-else>🔄 分析中...</text>
      </view>
    </view>

    <!-- AI推荐结果 -->
    <view class="result-section" v-if="showResult">
      <view class="result-header">
        <text class="result-title">🎉 AI推荐结果</text>
      </view>
      <view class="result-content">
        <text class="result-text">{{ aiResult }}</text>
      </view>
      <view class="result-actions">
        <view class="action-btn" @click="goToList">
          <text>查看推荐岗位</text>
        </view>
        <view class="action-btn secondary" @click="handleReset">
          <text>重新推荐</text>
        </view>
      </view>
    </view>

    <!-- AI生成图片展示（模拟） -->
    <view class="image-section" v-if="showResult">
      <text class="section-title">🎨 AI场景配图</text>
      <view class="image-grid">
        <view class="image-item" v-for="(img, i) in sceneImages" :key="i">
          <view class="image-placeholder" :style="{ background: img.bg }">
            <text class="image-icon">{{ img.icon }}</text>
          </view>
          <text class="image-label">{{ img.label }}</text>
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

<style lang="scss">
.ai-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

.ai-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 60rpx 40rpx;
  text-align: center;
  color: #fff;
}

.ai-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.ai-title {
  font-size: 40rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 16rpx;
}

.ai-desc {
  font-size: 26rpx;
  opacity: 0.9;
}

.form-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
}

.form-item {
  margin-bottom: 28rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.input {
  width: 100%;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.textarea {
  width: 100%;
  height: 160rpx;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  text-align: center;
  padding: 28rpx 0;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 20rpx;

  &:active {
    opacity: 0.9;
  }

  &.loading {
    opacity: 0.7;
  }
}

.result-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
}

.result-header {
  margin-bottom: 20rpx;
}

.result-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.result-content {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.result-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

.result-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;

  &.secondary {
    background: #f5f7fa;
    color: #666;
  }
}

.image-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 24rpx;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.image-item {
  text-align: center;
}

.image-placeholder {
  height: 160rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.image-icon {
  font-size: 60rpx;
}

.image-label {
  font-size: 24rpx;
  color: #666;
}
</style>
