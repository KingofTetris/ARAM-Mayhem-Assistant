# ARAM Mayhem Assistant (海克斯大乱斗信息差助手)

> 英雄联盟海克斯大乱斗配套开发，Hextech ARAM模式玩家的信息差助手

## 项目概述

**ARAM Mayhem Assistant** 是一个专门为《英雄联盟》海克斯大乱斗模式设计的全栈移动应用，旨在通过数据和社区内容帮助玩家做出更好的英雄选择、符文搭配和游戏决策。

### 核心价值

- 📊 **数据驱动决策**：提供英雄、强化符文的详细数据和强度评估
- 🎯 **减少信息差**：直观展示英雄强度分级和最佳搭配方案
- 🌐 **社区玩法分享**：玩家可分享和评价出装、玩法策略
- 📱 **移动端原生体验**：Java开发的Android原生应用，快速流畅

## 仓库说明

本仓库是**项目工作区**，包含：

- `design_pictures/` - UI/UX设计稿（原型图、线框图）
- `design_mockups/` - HTML/CSS原型实现
- `presentation/` - 项目演示文稿
- `.trae/specs/` - 技术规格与开发文档
- `project_progress_tracker.xlsx` - 项目进度跟踪表

## 关联项目

- 📱 **Android客户端**：https://github.com/KingofTetris/ARAM-Mayhem-Android
- 🚀 **后端服务**：https://github.com/KingofTetris/ARAM-Mayhem-Server

## 项目架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Android Client (Java 21)               │
│  ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Hero    │  │ Augment │  │ Community│  │   Profile   │  │
│  │ Features │  │ Feature │  │ Feature  │  │   Feature   │  │
│  └────┬─────┘  └────┬────┘  └────┬─────┘  └──────┬──────┘  │
│       │             │            │                │         │
│       └─────────────┼────────────┼────────────────┘         │
│                     │            │                          │
│              ┌──────▼────────────▼──────┐                  │
│              │   Core Modules (Hilt)    │                  │
│              │  ┌─────────────────────┐  │                  │
│              │  │  Network (Retrofit)│  │                  │
│              │  └───────────┬─────────┘  │                  │
│              │  ┌───────────▼─────────┐  │                  │
│              │  │    Data (Room)     │  │                  │
│              │  └───────────┬─────────┘  │                  │
│              │  ┌───────────▼─────────┐  │                  │
│              │  │      UI/View       │  │                  │
│              │  └─────────────────────┘  │                  │
│              └────────────────────────────┘                  │
└────────────────────────────────────┬────────────────────────┘
                                     │
                                     │ HTTPS (JWT)
                                     │
┌────────────────────────────────────▼────────────────────────┐
│                  Spring Boot Backend (Java 21)              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ Auth Module  │  │ Hero Service │  │  Community Service  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬─────────┘ │
│         │                 │                       │           │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────────▼─────────┐ │
│  │  MySQL DB    │  │  Redis Cache │  │  MyBatis Plus ORM  │ │
│  └──────────────┘  └──────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 开发环境

### 全局依赖
- **JDK**: 21 (Oracle OpenJDK 21.0.10)
- **Git**: 2.43.0+

### 本地工具
- **IDE**: Android Studio Hedgehog+ / IntelliJ IDEA 2023.3+
- **数据库**: MySQL 8.0+
- **缓存**: Redis 3.0+ (Windows版可用)
- **构建**: Maven 3.9.15 (后端) / Gradle 8.7 (Android)

## 项目进度

| 阶段 | 状态 | 说明 |
|------|------|------|
| 规格设计 | ✅ 完成 | UI原型、系统设计、技术选型 |
| 后端框架 | ✅ 完成 | Spring Boot、JWT认证、数据库建模 |
| Android框架 | ✅ 完成 | Hilt依赖注入、多模块架构搭建 |
| 核心功能开发 | 🚧 进行中 | 英雄数据、玩法社区、用户系统 |

## 功能特性

### Android 客户端 (待完成)
- [x] 底部导航框架
- [x] 多模块MVVM架构
- [ ] 英雄列表与详情
- [ ] 强化符文浏览
- [ ] 玩法社区（发帖、评论、投票）
- [ ] 用户注册/登录
- [ ] 个人资料
- [ ] 系统公告

### 后端服务 (已完成核心)
- [x] JWT 认证 (Access Token + Refresh Token)
- [x] 用户注册/登录
- [x] 跨域配置
- [x] Redis缓存集成
- [x] 实体类设计
- [ ] 英雄数据API
- [ ] 玩法策略API
- [ ] 评论/投票功能

## 技术栈详情

### 前端技术
- **语言**: Java 21
- **UI**: XML Layout + ViewBinding + Material Design 3
- **架构**: MVVM (ViewModel + LiveData + Repository)
- **DI**: Hilt 2.51.1
- **网络**: Retrofit 2.11.0 + OkHttp 4.12.0 + Gson
- **本地存储**: Room 2.6.1 + EncryptedSharedPreferences
- **图片加载**: Glide 4.16.0
- **路由**: Navigation Component 2.7.7

### 后端技术
- **语言**: Java 21
- **框架**: Spring Boot 3.3.5
- **ORM**: MyBatis Plus 3.5.9
- **安全**: Spring Security + JWT (jjwt 0.12.6)
- **数据库**: MySQL 8.0+ (utf8mb4字符集)
- **缓存**: Redis
- **构建**: Maven 3.9.15
- **文档**: SpringDoc (OpenAPI 3)

## 本地开发

详细部署指南请参考各子仓库的README：

- [Android客户端开发指南](https://github.com/KingofTetris/ARAM-Mayhem-Android)
- [后端服务部署指南](https://github.com/KingofTetris/ARAM-Mayhem-Server)

### 快速启动
```bash
# 1. 启动后端
cd D:\ideaProjects\aram-server
start-server.bat

# 2. 启动Android Studio，打开项目
# D:\androidProjects\ARAM_Mayhem_Assistant
```

## 贡献指南

我们欢迎任何形式的贡献！

### 贡献流程

1. **Fork 仓库** - 选择对应项目仓库（Android/Server）Fork
2. **创建分支** - `git checkout -b feature/你的特性名称`
3. **提交变更** - `git commit -m 'feat: 添加某某功能'` (遵循Conventional Commits)
4. **推送到分支** - `git push origin feature/你的特性名称`
5. **创建 PR** - 到原仓库提交 Pull Request

### 代码规范

- **提交信息**: 遵循 [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat: 新功能`
  - `fix: 修复bug`
  - `docs: 文档变更`
  - `refactor: 重构`
- **格式**: Java代码遵循Google Java Style
- **测试**: 确保所有测试通过

### 分支说明

- `main`: 稳定版本，始终可部署
- `feature/*`: 特性分支，用于新功能开发
- `hotfix/*`: 紧急修复分支

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

```
MIT License

Copyright (c) 2026 KingofTetris

Permission is hereby granted, free of charge...
```

## 致谢

- 拳头游戏 (Riot Games) - 《英雄联盟》和海克斯大乱斗模式
- 所有开源库维护者

---

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 📝 GitHub Issues - 在对应仓库提交 Issue
- 📧 Email - 1204066670@qq.com
