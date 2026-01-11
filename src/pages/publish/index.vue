<template>
  <view class="publish-page">
    <view class="form-section">
      <view class="form-item">
        <text class="label required">兼职标题</text>
        <input class="input" placeholder="请输入兼职标题" v-model="form.title" />
      </view>

      <view class="form-item">
        <text class="label required">兼职分类</text>
        <picker :range="categories" range-key="name" @change="onCategoryChange">
          <view class="picker">
            <text :class="{ placeholder: !form.category }">
              {{ selectedCategoryName || '请选择分类' }}
            </text>
            <text class="arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label required">薪资待遇</text>
        <view class="salary-row">
          <input class="input salary-input" placeholder="金额" v-model="form.salary" type="number" />
          <picker class="salary-type-picker" :range="salaryTypes" range-key="label" @change="onSalaryTypeChange">
            <view class="type-btn">
              <text>{{ selectedSalaryTypeLabel }}</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="form-item">
        <text class="label required">工作地点</text>
        <input class="input" placeholder="请输入工作地点" v-model="form.location" />
      </view>

      <view class="form-item">
        <text class="label required">职位描述</text>
        <textarea class="textarea" placeholder="请详细描述工作内容..." v-model="form.description" :maxlength="500" />
      </view>

      <view class="form-item">
        <text class="label">任职要求</text>
        <textarea class="textarea small" placeholder="请输入任职要求，每行一条" v-model="requirementsText" :maxlength="200" />
      </view>

      <view class="form-item">
        <text class="label required">联系方式</text>
        <input class="input" placeholder="请输入联系方式" v-model="form.contact" />
      </view>
    </view>

    <view class="submit-section">
      <button @click="handlePublish">
        发布兼职
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { addJob, isLoggedIn, getUserInfo, generateId } from '@/utils/storage'
import { JOB_CATEGORIES } from '@/utils/mock-data'

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

<style lang="scss">
.publish-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 100rpx;
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

  &.required::before {
    content: '*';
    color: #FF6B6B;
    margin-right: 4rpx;
  }
}

.input {
  width: 100%;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

uni-input {
  display: block;
  width: 100%;
}

.textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;

  &.small {
    height: 120rpx;
  }
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
  font-size: 28rpx;

  .placeholder {
    color: #999;
  }

  .arrow {
    color: #ccc;
  }
}

.salary-row {
  display: flex;
  gap: 16rpx;
}

.salary-input {
  flex: 1;
}

.salary-type-picker {
  width: 180rpx;
}

.type-btn {
  padding: 20rpx;
  background: #5B7FFF;
  color: #fff;
  border-radius: 12rpx;
  text-align: center;
  font-size: 26rpx;
}

.submit-section {
  position: fixed;
  bottom: 50rpx;
  left: 0;
  right: 0;
  padding: 20rpx 40rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  z-index: 100;

  button {
    background: linear-gradient(135deg, #5B7FFF, #8CA4FF);
    color: #fff;
    text-align: center;
    padding: 28rpx 0;
    border-radius: 48rpx;
    font-size: 32rpx;
    font-weight: bold;
    box-shadow: 0 8rpx 24rpx rgba(91, 127, 255, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;

    &:active {
      opacity: 0.9;
      transform: translateY(2rpx);
      box-shadow: 0 4rpx 12rpx rgba(91, 127, 255, 0.25);
    }
  }
}
</style>
