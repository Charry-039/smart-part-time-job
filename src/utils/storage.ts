// localStorage 封装工具

// 用户信息接口
export interface UserInfo {
  id: string
  phone: string
  studentId?: string
  nickname: string
  avatar: string
  bio?: string
  skills?: string[]
}

// 兼职信息接口
export interface JobInfo {
  id: string
  title: string
  category: string
  salary: string
  salaryType: 'hour' | 'day' | 'month' | 'task'
  location: string
  latitude?: number
  longitude?: number
  description: string
  requirements: string[]
  contact: string
  publisherId: string
  publisherName: string
  createTime: string
  views: number
  applicants: number
  images?: string[]
}

// 收藏记录
export interface FavoriteItem {
  jobId: string
  addTime: string
}

// 报名记录
export interface ApplicationItem {
  jobId: string
  userId: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  applyTime: string
  message?: string
}

// 留言记录
export interface MessageItem {
  id: string
  jobId: string
  fromUserId: string
  fromUserName: string
  toUserId: string
  content: string
  createTime: string
}

// 存储键名
const STORAGE_KEYS = {
  USER_INFO: 'zhiChuang_userInfo',
  JOBS: 'zhiChuang_jobs',
  FAVORITES: 'zhiChuang_favorites',
  APPLICATIONS: 'zhiChuang_applications',
  MESSAGES: 'zhiChuang_messages',
  IS_LOGGED_IN: 'zhiChuang_isLoggedIn'
}

// 通用存储方法
export function setStorage<T>(key: string, value: T): void {
  try {
    uni.setStorageSync(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage set error:', e)
  }
}

export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const value = uni.getStorageSync(key)
    return value ? JSON.parse(value) : defaultValue
  } catch (e) {
    console.error('Storage get error:', e)
    return defaultValue
  }
}

export function removeStorage(key: string): void {
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    console.error('Storage remove error:', e)
  }
}

// 用户相关操作
export function setUserInfo(user: UserInfo): void {
  console.log('设置用户信息:', user)
  setStorage(STORAGE_KEYS.USER_INFO, user)
  setStorage(STORAGE_KEYS.IS_LOGGED_IN, true)
}

export function getUserInfo(): UserInfo | null {
  return getStorage<UserInfo | null>(STORAGE_KEYS.USER_INFO, null)
}

export function isLoggedIn(): boolean {
  return getStorage(STORAGE_KEYS.IS_LOGGED_IN, false)
}

export function logout(): void {
  removeStorage(STORAGE_KEYS.USER_INFO)
  setStorage(STORAGE_KEYS.IS_LOGGED_IN, false)
}

// 兼职相关操作
export function getJobs(): JobInfo[] {
  return getStorage<JobInfo[]>(STORAGE_KEYS.JOBS, [])
}

export function setJobs(jobs: JobInfo[]): void {
  setStorage(STORAGE_KEYS.JOBS, jobs)
}

export function addJob(job: JobInfo): void {
  const jobs = getJobs()
  jobs.unshift(job)
  setJobs(jobs)
}

export function getJobById(id: string): JobInfo | undefined {
  const jobs = getJobs()
  return jobs.find(job => job.id === id)
}

export function updateJob(id: string, updates: Partial<JobInfo>): void {
  const jobs = getJobs()
  const index = jobs.findIndex(job => job.id === id)
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updates }
    setJobs(jobs)
  }
}

export function deleteJob(id: string): void {
  const jobs = getJobs().filter(job => job.id !== id)
  setJobs(jobs)
}

// 收藏相关操作
export function getFavorites(): FavoriteItem[] {
  return getStorage<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, [])
}

export function addFavorite(jobId: string): void {
  const favorites = getFavorites()
  if (!favorites.find(f => f.jobId === jobId)) {
    favorites.unshift({ jobId, addTime: new Date().toISOString() })
    setStorage(STORAGE_KEYS.FAVORITES, favorites)
  }
}

export function removeFavorite(jobId: string): void {
  const favorites = getFavorites().filter(f => f.jobId !== jobId)
  setStorage(STORAGE_KEYS.FAVORITES, favorites)
}

export function isFavorite(jobId: string): boolean {
  return getFavorites().some(f => f.jobId === jobId)
}

// 报名相关操作
export function getApplications(): ApplicationItem[] {
  return getStorage<ApplicationItem[]>(STORAGE_KEYS.APPLICATIONS, [])
}

export function addApplication(app: ApplicationItem): void {
  const applications = getApplications()
  applications.unshift(app)
  setStorage(STORAGE_KEYS.APPLICATIONS, applications)
}

export function updateApplication(jobId: string, userId: string, status: ApplicationItem['status']): void {
  const applications = getApplications()
  const index = applications.findIndex(a => a.jobId === jobId && a.userId === userId)
  if (index !== -1) {
    applications[index].status = status
    setStorage(STORAGE_KEYS.APPLICATIONS, applications)
  }
}

// 留言相关操作
export function getMessages(): MessageItem[] {
  return getStorage<MessageItem[]>(STORAGE_KEYS.MESSAGES, [])
}

export function addMessage(msg: MessageItem): void {
  const messages = getMessages()
  messages.push(msg)
  setStorage(STORAGE_KEYS.MESSAGES, messages)
}

export function getMessagesByJob(jobId: string): MessageItem[] {
  return getMessages().filter(m => m.jobId === jobId)
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// 获取用户发布的兼职列表
export function getUserPublishedJobs(userId: string): JobInfo[] {
  const allJobs = getJobs()
  return allJobs.filter(job => job.publisherId === userId)
}

// 获取用户报名的兼职列表
export function getUserApplications(userId: string): ApplicationItem[] {
  const applications = getApplications()
  return applications.filter(app => app.userId === userId)
}

// 检查用户是否已报名某个兼职
export function hasUserApplied(userId: string, jobId: string): boolean {
  const applications = getApplications()
  return applications.some(app => app.userId === userId && app.jobId === jobId)
}
