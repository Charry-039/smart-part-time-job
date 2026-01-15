// 模拟数据初始化
import { setJobs, getJobs, getDataVersion, setDataVersion, type JobInfo } from './storage'

// 当前数据版本号（每次更新模拟数据时需要增加这个版本号）
const CURRENT_DATA_VERSION = 2

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
    latitude: 39.9075,
    longitude: 116.3972,
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
    latitude: 39.9075,
    longitude: 116.3972,
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
    latitude: 39.9075,
    longitude: 116.3972,
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
  },
  {
    id: 'job009',
    title: '杭州西湖景区讲解员',
    category: 'service',
    salary: '150',
    salaryType: 'day',
    location: '杭州市西湖风景区',
    latitude: 30.2591,
    longitude: 120.1321,
    description: '周末及节假日在西湖景区为游客提供讲解服务，需熟悉西湖文化历史。',
    requirements: ['普通话标准', '熟悉杭州历史文化', '周末及节假日有空'],
    contact: '景区管理处',
    publisherId: 'user009',
    publisherName: '西湖旅游服务中心',
    createTime: '2026-01-11T10:00:00',
    views: 178,
    applicants: 9
  },
  {
    id: 'job010',
    title: 'Python数据分析项目',
    category: 'tech',
    salary: '2500',
    salaryType: 'task',
    location: '线上远程（宁波）',
    latitude: 29.8683,
    longitude: 121.5440,
    description: '处理销售数据并生成可视化报表，需要使用pandas、matplotlib等库，工期1周。',
    requirements: ['熟练Python', '掌握数据分析库', '有实际项目经验'],
    contact: '项目经理陈',
    publisherId: 'user010',
    publisherName: '宁波数据科技',
    createTime: '2026-01-12T09:30:00',
    views: 142,
    applicants: 6
  },
  {
    id: 'job011',
    title: '温州鞋类电商美工',
    category: 'design',
    salary: '120',
    salaryType: 'hour',
    location: '温州市鹿城区',
    latitude: 28.0006,
    longitude: 120.6724,
    description: '为鞋类电商店铺设计主图、详情页等，需要熟悉淘宝、拼多多等平台设计规范。',
    requirements: ['熟练PS/AI', '了解电商设计', '能快速出图'],
    contact: '店铺负责人周',
    publisherId: 'user011',
    publisherName: '温州鞋业',
    createTime: '2026-01-13T14:00:00',
    views: 98,
    applicants: 7
  },
  {
    id: 'job012',
    title: '大学英语四六级辅导',
    category: 'tutor',
    salary: '80',
    salaryType: 'hour',
    location: '嘉兴学院附近',
    latitude: 30.7463,
    longitude: 120.7506,
    description: '辅导大学生英语四六级考试，包括听力、阅读、写作等模块，每周2-3次。',
    requirements: ['英语六级550分以上', '有辅导经验优先', '耐心细致'],
    contact: '学生本人',
    publisherId: 'user012',
    publisherName: '嘉兴大学生',
    createTime: '2026-01-12T16:30:00',
    views: 156,
    applicants: 11
  },
  {
    id: 'job013',
    title: '短视频剪辑制作',
    category: 'content',
    salary: '150',
    salaryType: 'task',
    location: '线上远程（杭州）',
    latitude: 30.2741,
    longitude: 120.1551,
    description: '为企业号剪辑短视频，每条1-3分钟，需要添加字幕、特效和背景音乐。',
    requirements: ['熟练剪映/PR', '有创意思维', '按时交付'],
    contact: '新媒体运营',
    publisherId: 'user013',
    publisherName: '杭州传媒公司',
    createTime: '2026-01-14T11:00:00',
    views: 223,
    applicants: 14
  },
  {
    id: 'job014',
    title: '绍兴黄酒品牌推广',
    category: 'promotion',
    salary: '200',
    salaryType: 'day',
    location: '绍兴市柯桥区',
    latitude: 30.0326,
    longitude: 120.5820,
    description: '周末在商超进行黄酒品牌推广活动，包括产品介绍、试饮引导等。',
    requirements: ['形象气质好', '善于沟通', '了解绍兴黄酒文化加分'],
    contact: 'HR李',
    publisherId: 'user014',
    publisherName: '古越龙山',
    createTime: '2026-01-10T10:30:00',
    views: 187,
    applicants: 13
  },
  {
    id: 'job015',
    title: 'Java后端开发外包',
    category: 'tech',
    salary: '4500',
    salaryType: 'task',
    location: '线上远程（金华）',
    latitude: 29.0789,
    longitude: 119.6478,
    description: '开发一个企业管理系统后端接口，使用Spring Boot，工期3周。',
    requirements: ['熟练Spring Boot', '有微服务开发经验', '能独立完成开发'],
    contact: '技术总监',
    publisherId: 'user015',
    publisherName: '金华软件公司',
    createTime: '2026-01-09T09:00:00',
    views: 134,
    applicants: 5
  },
  {
    id: 'job016',
    title: '台州奶茶店周末兼职',
    category: 'service',
    salary: '100',
    salaryType: 'day',
    location: '台州市椒江区万达广场',
    latitude: 28.6569,
    longitude: 121.4205,
    description: '周末奶茶店兼职，负责点单、制作饮品、收银等，有培训。',
    requirements: ['学生优先', '周末双休全勤', '有责任心'],
    contact: '店长小王',
    publisherId: 'user016',
    publisherName: '喜茶台州店',
    createTime: '2026-01-13T15:00:00',
    views: 289,
    applicants: 22
  },
  {
    id: 'job017',
    title: '小红书文案撰写',
    category: 'content',
    salary: '80',
    salaryType: 'task',
    location: '线上远程（湖州）',
    latitude: 30.8703,
    longitude: 120.0933,
    description: '撰写美妆护肤类小红书文案，每篇500-800字，需要配图建议。',
    requirements: ['文笔好', '了解小红书风格', '对美妆感兴趣'],
    contact: '运营主管',
    publisherId: 'user017',
    publisherName: '湖州美妆工作室',
    createTime: '2026-01-14T13:30:00',
    views: 167,
    applicants: 18
  },
  {
    id: 'job018',
    title: '宁波跨境电商运营助理',
    category: 'ecommerce',
    salary: '3500',
    salaryType: 'month',
    location: '宁波市江北区',
    latitude: 29.8869,
    longitude: 121.5554,
    description: '协助跨境电商运营，包括产品上架、订单处理、客户沟通等，可兼职可全职。',
    requirements: ['英语CET-4以上', '熟悉亚马逊等平台', '每周至少20小时'],
    contact: '运营经理',
    publisherId: 'user018',
    publisherName: '宁波跨境贸易公司',
    createTime: '2026-01-11T14:00:00',
    views: 245,
    applicants: 16
  },
  {
    id: 'job019',
    title: 'CAD机械图纸绘制',
    category: 'design',
    salary: '1800',
    salaryType: 'task',
    location: '线上远程（温州）',
    latitude: 28.0145,
    longitude: 120.6998,
    description: '绘制机械零件图纸，需要根据实物或草图绘制标准CAD图纸。',
    requirements: ['熟练AutoCAD', '机械专业背景', '严谨细致'],
    contact: '工程师张',
    publisherId: 'user019',
    publisherName: '温州机械厂',
    createTime: '2026-01-12T10:00:00',
    views: 92,
    applicants: 4
  },
  {
    id: 'job020',
    title: '杭州钢琴陪练老师',
    category: 'tutor',
    salary: '120',
    salaryType: 'hour',
    location: '杭州市滨江区',
    latitude: 30.2098,
    longitude: 120.2117,
    description: '陪练小学生钢琴，每周3次，每次1小时，需要有耐心和教学经验。',
    requirements: ['钢琴十级或音乐专业', '有陪练经验', '有耐心爱心'],
    contact: '家长陈女士',
    publisherId: 'user020',
    publisherName: '滨江家长',
    createTime: '2026-01-15T09:00:00',
    views: 113,
    applicants: 8
  }
]

// 初始化模拟数据
export function initMockData(): void {
  const existingJobs = getJobs()
  const currentVersion = getDataVersion()
  
  // 如果没有数据或者数据版本过旧，则重新加载数据
  if (existingJobs.length === 0 || currentVersion < CURRENT_DATA_VERSION) {
    setJobs(MOCK_JOBS)
    setDataVersion(CURRENT_DATA_VERSION)
    console.log(`Mock data initialized/updated to version ${CURRENT_DATA_VERSION}`)
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
