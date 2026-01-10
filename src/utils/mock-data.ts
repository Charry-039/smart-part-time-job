// 模拟数据初始化
import { setJobs, getJobs, type JobInfo } from './storage'

// 兼职分类
export const JOB_CATEGORIES = [
  { id: 'tutor', name: '家教辅导', icon: '📚' },
  { id: 'ecommerce', name: '电商运营', icon: '🛒' },
  { id: 'tech', name: '技术外包', icon: '💻' },
  { id: 'design', name: '设计美工', icon: '🎨' },
  { id: 'content', name: '内容创作', icon: '✍️' },
  { id: 'promotion', name: '推广营销', icon: '📣' },
  { id: 'service', name: '服务类', icon: '🤝' },
  { id: 'other', name: '其他', icon: '📋' }
]

// 模拟兼职数据
const MOCK_JOBS: JobInfo[] = [
  {
    id: 'job001',
    title: '高中数学家教老师',
    category: 'tutor',
    salary: '150',
    salaryType: 'hour',
    location: '朝阳区望京SOHO',
    latitude: 40.0034,
    longitude: 116.4815,
    description: '辅导高二学生数学，周末上课，每次2小时。学生基础较好，主要是拔高训练。',
    requirements: ['数学专业优先', '有家教经验', '耐心负责'],
    contact: '王女士 138****1234',
    publisherId: 'user001',
    publisherName: '家长王女士',
    createTime: '2026-01-09T10:00:00',
    views: 128,
    applicants: 5
  },
  {
    id: 'job002',
    title: '淘宝店铺客服兼职',
    category: 'ecommerce',
    salary: '80',
    salaryType: 'day',
    location: '海淀区中关村',
    latitude: 39.9847,
    longitude: 116.3062,
    description: '负责店铺在线客服，解答客户咨询，处理售后问题。时间灵活，可远程办公。',
    requirements: ['打字速度快', '沟通能力强', '每天至少4小时'],
    contact: '李经理',
    publisherId: 'user002',
    publisherName: '旺旺电商',
    createTime: '2026-01-08T14:30:00',
    views: 256,
    applicants: 12
  },
  {
    id: 'job003',
    title: '小程序前端开发',
    category: 'tech',
    salary: '3000',
    salaryType: 'task',
    location: '线上远程',
    description: '开发一个简单的预约小程序，需要有uniapp或微信小程序开发经验，工期约2周。',
    requirements: ['熟悉Vue/uniapp', '有小程序开发经验', '按时交付'],
    contact: '张工',
    publisherId: 'user003',
    publisherName: '创新科技',
    createTime: '2026-01-10T09:00:00',
    views: 89,
    applicants: 3
  },
  {
    id: 'job004',
    title: 'UI设计师（兼职）',
    category: 'design',
    salary: '200',
    salaryType: 'hour',
    location: '线上远程',
    description: 'APP界面设计，需要设计3-5个核心页面。设计风格现代简约。',
    requirements: ['熟练使用Figma/Sketch', '有移动端设计经验', '提供作品集'],
    contact: '设计总监刘',
    publisherId: 'user004',
    publisherName: '启航APP',
    createTime: '2026-01-07T16:00:00',
    views: 167,
    applicants: 8
  },
  {
    id: 'job005',
    title: '公众号文章写手',
    category: 'content',
    salary: '100',
    salaryType: 'task',
    location: '线上远程',
    description: '撰写科技类公众号文章，每篇1500-2000字，每周2-3篇。',
    requirements: ['文笔流畅', '对科技资讯有兴趣', '按时交稿'],
    contact: '内容运营小陈',
    publisherId: 'user005',
    publisherName: '科技前沿号',
    createTime: '2026-01-06T11:00:00',
    views: 203,
    applicants: 15
  },
  {
    id: 'job006',
    title: '周末促销员',
    category: 'promotion',
    salary: '180',
    salaryType: 'day',
    location: '西单大悦城',
    latitude: 39.9120,
    longitude: 116.3747,
    description: '周末商场促销活动，负责产品介绍和引导购买，有培训。',
    requirements: ['形象气质佳', '沟通能力强', '周末两天全勤'],
    contact: 'HR赵',
    publisherId: 'user006',
    publisherName: '某知名品牌',
    createTime: '2026-01-05T09:00:00',
    views: 312,
    applicants: 20
  },
  {
    id: 'job007',
    title: '英语口语陪练',
    category: 'tutor',
    salary: '100',
    salaryType: 'hour',
    location: '线上/东直门',
    latitude: 39.9413,
    longitude: 116.4388,
    description: '陪练雅思口语，学生准备出国留学，每周3次，每次1小时。',
    requirements: ['英语流利', '雅思7分以上优先', '有出国经历优先'],
    contact: '学生家长',
    publisherId: 'user007',
    publisherName: '刘先生',
    createTime: '2026-01-09T15:00:00',
    views: 95,
    applicants: 4
  },
  {
    id: 'job008',
    title: '校园外卖配送员',
    category: 'service',
    salary: '5',
    salaryType: 'task',
    location: '北京大学校园',
    latitude: 39.9929,
    longitude: 116.3058,
    description: '午餐时段校园内配送，每单5元，多劳多得，时间灵活。',
    requirements: ['本校学生', '有电动车优先', '午间有空闲时间'],
    contact: '站长',
    publisherId: 'user008',
    publisherName: '校园快送',
    createTime: '2026-01-10T08:00:00',
    views: 445,
    applicants: 28
  }
]

// 初始化模拟数据
export function initMockData(): void {
  const existingJobs = getJobs()
  if (existingJobs.length === 0) {
    setJobs(MOCK_JOBS)
    console.log('Mock data initialized')
  }
}

// AI推荐模拟回复
export function getAIRecommendation(skills: string, time: string, salary: string): string {
  const recommendations = [
    `根据您的技能"${skills}"和薪资期望"${salary}"，我为您推荐以下兼职方向：\n\n1. **技术类外包** - 您的技能非常适合接一些小型项目，建议关注小程序开发、网站建设类兼职。\n\n2. **在线辅导** - 如果您有相关专业背景，线上辅导时间灵活，薪资也比较可观。\n\n3. **内容创作** - 结合您的空闲时间"${time}"，写作类兼职可以更灵活安排。\n\n建议优先查看技术外包和家教辅导板块的最新岗位！`,
    `基于您提供的信息，我的建议如下：\n\n💡 **核心推荐**：根据"${skills}"技能，最匹配的是设计美工和技术外包类兼职，薪资水平通常在${salary}范围内。\n\n⏰ **时间匹配**：您可用时间为"${time}"，建议选择可远程、灵活办公的岗位。\n\n📈 **职业发展**：这类兼职不仅能获得收入，还能积累项目经验，对未来求职有帮助。\n\n立即浏览推荐岗位 →`,
    `Hi！我是智创兼职AI助手 🤖\n\n分析您的情况：\n- 技能特长：${skills}\n- 可用时间：${time}\n- 期望薪资：${salary}\n\n为您匹配到 **8** 个相关岗位！\n\n🔥 热门推荐：\n• 小程序前端开发 - ¥3000/项目\n• UI设计师 - ¥200/小时\n• 高中数学家教 - ¥150/小时\n\n这些岗位都符合您的要求，快去看看吧！`
  ]
  return recommendations[Math.floor(Math.random() * recommendations.length)]
}

// 获取分类名称
export function getCategoryName(categoryId: string): string {
  const category = JOB_CATEGORIES.find(c => c.id === categoryId)
  return category ? category.name : '其他'
}

// 获取薪资显示文本
export function getSalaryText(salary: string, salaryType: string): string {
  const typeMap: Record<string, string> = {
    hour: '元/小时',
    day: '元/天',
    month: '元/月',
    task: '元/单'
  }
  return `${salary}${typeMap[salaryType] || '元'}`
}
