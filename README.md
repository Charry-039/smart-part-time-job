## 项目概述
基于 uniapp + Vue 3 + TypeScript 的"智创兼职"服务平台，纯前端开发。

## 项目结构
```
src/
├── pages/
│   ├── index/index.vue      # 首页（兼职列表、分类入口）
│   ├── job/
│   │   ├── list.vue         # 兼职列表（筛选、搜索）
│   │   └── detail.vue       # 兼职详情（收藏、报名）
│   ├── user/
│   │   ├── login.vue        # 登录页面
│   │   ├── register.vue     # 注册页面
│   │   ├── profile.vue      # 个人中心
│   │   └── favorites.vue    # 我的收藏
│   ├── ai/match.vue         # AI 智能推荐
│   ├── publish/index.vue    # 发布兼职
│   ├── map/index.vue        # 兼职地图
│   └── message/index.vue    # 消息留言
├── utils/
│   ├── storage.ts           # localStorage 封装
│   └── mock-data.ts         # 模拟数据
├── styles/common.scss       # 全局样式
└── pages.json               # 路由配置
```

## 模块功能
| 模块 | 功能 | 状态 |
| --- | --- | --- |
| 首页 | 搜索栏、轮播图、分类入口、热门推荐 | ✅ |
| 兼职资讯 | 列表展示、分类筛选、薪资排序、详情查看 | ✅ |
| 用户模块 | 登录、注册、个人中心、收藏管理 | ✅ |
| AI 推荐 | 技能输入、模拟推荐结果、场景配图 | ✅ |
| 地图模块 | 地图展示、位置标注、兼职列表浮层 | ❌ |
| 发布模块 | 发布表单、分类选择、薪资设置 | ✅ |
| 沟通模块 | 留言交互、报名确认 | ✅ |
| 我发布的 | 我发布的兼职 | ✅ |
| 我的报名 | 我的报名记录 | ✅ |
| 已发布兼职管理 | 兼职列表、编辑、删除 | ✅ |
| 头像上传功能 | 头像上传 |❌ |

## 如何运行
### 进入项目目录  
`cd /part-time-job`
### 安装依赖（如未安装）
`pnpm install`
### 启动 H5 开发服务器
`pnpm dev:h5`