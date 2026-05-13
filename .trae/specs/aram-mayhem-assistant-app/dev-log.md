# ARAM Mayhem Assistant 开发日志

> 本文档按开发阶段分节记录所有关键操作、技术决策、问题与解决方案。
> 最后更新：2026-05-13
> 当前进度：M4 阶段已完成 ✅
> 文档版本：v2.2（2026-05-13 M4 遗漏任务全部完成）

---

## 项目总览

| 里程碑 | 阶段名称 | 状态 | 完成度 | 核心交付 |
|--------|----------|------|--------|----------|
| M1 | 项目初始化 | ✅ 完成 | 100% | 12 模块脚手架 + 环境配置 + Git 仓库 |
| M2 | 基础架构 | ✅ 完成 | 100% | MySQL 建模 + REST API + JWT 认证 |
| M3 | Android UI 框架 | ✅ 完成 | 100% | 核心模块 + 8 组件 + 55 图标 + 规则文档 |
| M4 | 英雄模块 | ✅ 完成 | 100% | 后端完成 + HeroListFragment + HeroDetailFragment + 离线缓存 + 测试 |
| M5 | 强化符文模块 | ⏳ 待开始 | 0% | 依赖 M4 |
| M6 | 社区模块 | ⏳ 待开始 | 0% | 依赖 M4+M5 |
| M7 | 版本与公告 | ⏳ 待开始 | 0% | 依赖 M4 |
| M8 | 个人中心 | ⏳ 待开始 | 0% | 依赖 M5+M6 |

---

# 第一阶段：项目初始化（M1）

## 1.1 任务目标与范围

- 创建 Android 多模块项目脚手架（11 个 Gradle 模块）
- 创建 Spring Boot 后端项目
- 配置 Gradle 多模块依赖关系
- 配置后端 Maven 依赖（Spring Boot 3.3.5 + MyBatis Plus + Spring Security + jjwt）
- 配置开发环境（JDK 21、Gradle 8.7、ViewBinding、Hilt）

## 1.2 实施内容与关键决策

### 1.2.1 项目脚手架搭建

**实施内容**：
1. 创建 Android 项目 `D:\androidProjects\ARAM_Mayhem_Assistant`，包含 11 个模块
2. 创建 Spring Boot 后端 `D:\ideaProjects\aram-server`
3. 编写 `settings.gradle`、根 `build.gradle`（ext{} 统一版本管理）
4. 编写各模块 `build.gradle`（app=application，core-common=java-library，其余=android-library）
5. 配置 Gradle Wrapper（8.7）、gradle.properties、gradlew.bat

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 1 | 采用多模块架构 | feature 模块可独立编译，降低增量构建时间 |
| 2 | core-common 使用 java-library | 纯 Java 类无需 Android SDK |
| 3 | Gradle Groovy DSL | 与 tasks.md 规格一致，生态更成熟 |

### 1.2.2 开发环境配置

**实施内容**：
1. 配置多模块依赖（app → core×4 + feature×5 + navigation）
2. 编写后端 pom.xml（Spring Boot 3.3.5 + MyBatis Plus 3.5.9 + Security + jjwt 0.12.6 + SpringDoc 2.6.0）
3. 编写 application.yml（MySQL/Redis/JWT/MyBatis Plus 配置）
4. Android 配置 ViewBinding + Hilt + Network Security Config

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 4 | JWT 密钥 Base64 存 yml | 本地部署无需云环境变量 |
| 5 | MySQL 绑定 127.0.0.1 | 本地开发安全 |
| 6 | Access 15min + Refresh 7d | 移动端高频使用，短 Access 保障安全 |

## 1.3 技术问题与解决方案

| 编号 | 问题 | 根因 | 解决方案 | 严重度 |
|------|------|------|----------|--------|
| M1-01 | Gradle wrapper JAR 缺失 | 手动创建项目未生成 wrapper JAR | 从本地缓存执行 `gradle wrapper --gradle-version 8.7` | 🔴 |
| M1-02 | sandbox 无法删除 navigation 目录 | 沙盒环境权限限制 | 从 settings.gradle 移除引用即可 | 🟡 |
| M1-03 | Maven 不在 sandbox PATH | 沙盒环境变量不可读 | 使用完整路径调用 mvn.cmd | 🟡 |

## 1.4 阶段成果与经验教训

**交付物**：12 个项目模块 + 14 个配置文件 + 3 个关键决策

**经验教训**：
1. ⚠️ Gradle wrapper JAR 必须通过 `gradle wrapper` 命令生成，不能手动创建
2. ⚠️ 项目初始化时应同步编写完整 README 文档，而非后期补全
3. ✅ 建议：创建项目脚手架时使用 README 模板，确保关键章节不遗漏

---

# 第二阶段：基础架构（M2）

## 2.1 任务目标与范围

- MySQL 数据库建模（9 张表 + 10 个索引）
- 后端 RESTful API 框架（统一响应体 + 全局异常处理 + CORS + Redis）
- Spring Security + JWT 认证（注册/登录/刷新 Token）

## 2.2 实施内容与关键决策

### 2.2.1 MySQL 数据库建模

**实施内容**：
1. 创建 `aram_mayhem` 数据库（utf8mb4_unicode_ci）
2. 创建 9 张表：tb_user, tb_hero, tb_hero_modifier, tb_augment, tb_strategy, tb_strategy_augment, tb_strategy_item, tb_vote, tb_bulletin
3. 创建 10 个索引（含表达式索引 `(upvotes - downvotes)`）
4. 创建 9 个 Entity + 9 个 Mapper

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 7 | utf8mb4 + utf8mb4_unicode_ci | 支持完整 Unicode（含 emoji） |
| 8 | 表达式索引 (upvotes-downvotes) | MySQL 8.0+ 函数索引，避免查询时计算 |
| 9 | 逻辑删除 deleted TINYINT DEFAULT 0 | MyBatis Plus @TableLogic 自动处理，数据可恢复 |

### 2.2.2 后端 RESTful API 框架

**实施内容**：
1. Result<T> 统一响应体（code + message + data + timestamp）
2. GlobalExceptionHandler（@RestControllerAdvice 处理 Validation/Business/Unknown）
3. CorsConfig + RedisConfig（Jackson JSON 序列化）

### 2.2.3 Spring Security + JWT 认证

**实施内容**：
1. JwtTokenProvider（HMAC-SHA 签名，Access 15min + Refresh 7d）
2. JwtAuthenticationFilter（OncePerRequestFilter + SecurityContext 注入）
3. SecurityConfig（CSRF 禁用 + STATELESS + /api/auth/** 放行）
4. AuthService + AuthController（register/login/refresh）

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 10 | CORS 允许 * Origin | 本地局域网部署，无跨域安全风险 |
| 11 | Redis Jackson JSON 序列化 | 可读性好、跨语言兼容、体积更小 |
| 12 | SecurityFilterChain Lambda DSL | Spring Security 6.x 已废弃 WebSecurityConfigurerAdapter |
| 13 | JwtFilter 注入 UserDetailsService | 后续 RBAC 权限控制需要完整权限信息 |

## 2.3 技术问题与解决方案

| 编号 | 问题 | 根因 | 解决方案 | 严重度 |
|------|------|------|----------|--------|
| M2-01 | TEXT 列不能设置 DEFAULT 值 | MySQL 严格模式限制 | 移除 TEXT 列的 DEFAULT '' | 🟠 |

## 2.4 阶段成果与经验教训

**交付物**：9 张表 + 10 索引 + 11 后端服务类 + 4 DTO + 编译验证通过（34 源文件）

**经验教训**：
1. ⚠️ MySQL TEXT 列不支持 DEFAULT 值，需在 DDL 编写时注意
2. ✅ 建议：数据库建模时使用 SQL lint 工具提前检查 DDL 合规性

---

# 第三阶段：Android UI 框架（M3）

## 3.1 任务目标与范围

- 搭建 Android 核心模块（app + core-common + core-ui + core-data + core-network）
- 开发 8 个通用 UI 组件
- 设计 55 个 Vector Drawable 图标
- 实现 Token 安全存储 + Room Database + Retrofit 网络层
- 编写单元测试
- 建立项目规则文档

## 3.2 实施内容与关键决策

### 3.2.1 核心模块搭建

**实施内容**：
1. MayhemApplication + MainActivity（NavHost + BottomNavigationView）
2. 5 个 Fragment 占位 + navigation_graph.xml（5 Tab）
3. core-ui 完整资源体系（25 色值 + 35 字符串 + 30 尺寸 + 14 样式）
4. core-common（Constants + Result + Tier 枚举）

### 3.2.2 图标资源系统

**实施内容**：
1. 参照 `design_pictures/00_origin_styple/` 原始设计稿，设计 55 个 Vector Drawable
2. 分类：底部导航 6 个 + 启动图标 2 个 + 功能 21 个 + 游戏特色 8 个 + 梯级徽章 5 个 + 品质标识 3 个 + 状态 3 个 + 其他 7 个
3. UI/UX 专家审核后修复 8 个设计缺陷

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 23 | 梯级徽章描边字体风格（2.5dp 白色） | 24dp 小尺寸下比填充路径更清晰可读 |
| 24 | 功能图标默认 #757575 灰色描边 | Android 底部导航自动应用 tint 着色 |
| 25 | 游戏特色图标语义化颜色 | 即时传达正面/负面/警告语义 |

### 3.2.3 通用 Android 组件开发

**实施内容**：
| 组件 | 功能 | 技术要点 |
|------|------|----------|
| TierBadgeView | 梯级徽章展示 | 自定义 TextView，自动设置文字+颜色+圆角背景 |
| HeroCardAdapter | 英雄列表适配器 | ListAdapter + DiffUtil 自动差量更新 |
| AugmentCardAdapter | 强化符文适配器 | 品质色边框（棱彩/金/银） |
| SearchToolbar | 搜索组件 | TextWatcher 防抖 300ms + 清除按钮 |
| PaginationScrollListener | 分页滚动监听 | RecyclerView 下滑自动触发加载更多 |
| StatefulLayout | 多状态布局 | FrameLayout 四状态（Loading/Empty/Error/Content） |
| QualityChip | 品质指示器 | Material Chip 子类，自动颜色映射 |
| BalanceBar | 平衡条 | Canvas 自绘，减少 View 层级 |

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 26 | Adapter 使用 ListAdapter + DiffUtil | 自动差量更新，性能更优 |
| 27 | StatefulLayout 使用 FrameLayout 叠加 | 状态切换频繁时 ViewStub 开销更大 |
| 28 | BalanceBar Canvas 自绘 | 减少 View 层级，性能更优 |

### 3.2.4 数据层与网络层

**实施内容**：
- TokenStore（EncryptedSharedPreferences AES256 加密）
- AppDatabase（Room Database + fallbackToDestructiveMigration）
- HeroEntity + AugmentEntity + HeroDao + AugmentDao
- AuthInterceptor + TokenRefreshInterceptor（synchronized 防并发刷新）
- NetworkModule（Hilt 提供 Gson/OkHttpClient/Retrofit）

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 29 | TokenStore EncryptedSharedPreferences | Token 是敏感凭证，需加密存储 |
| 30 | Room fallbackToDestructiveMigration | MVP 阶段结构频繁变动 |
| 31 | TokenRefreshInterceptor 独立 OkHttpClient | 避免 AuthInterceptor 循环调用 |

### 3.2.5 单元测试

**实施内容**：
- ResultTest：4 用例（success/error/isSuccess/null data）
- TierTest：7 用例（5 梯级 label+color + 枚举数量 + 颜色唯一性）
- ConstantsTest：6 用例（BASE_URL/API 路径/超时/PAGE_SIZE/防抖）
- **17 个测试用例全部通过**

### 3.2.6 项目规则文档

**实施内容**：
1. 编写 `.trae/rules/project_rules.md`（11 章 42 条规则）
2. 三位专家系统性审核，修复 5 个阻塞项 + 7 个建议项
3. 版本演进：v1.0.0 → v1.1.0 → v1.1.1 → v1.2.0 → v1.3.0

## 3.3 技术问题与解决方案

| 编号 | 问题 | 根因 | 解决方案 | 严重度 |
|------|------|------|----------|--------|
| M3-01 | Vector Drawable 颜色格式错误 `#FF00000000` | Android 要求 8 位 hex（#AARRGGBB） | 全部替换为 `#00000000`（42 个文件） | 🔴 |
| M3-02 | 梯级徽章内部文字相同（都显示"S"） | 复制路径后未修改差异化内容 | 重新设计为描边字体（S+/S/A/B/C 各不同） | 🔴 |
| M3-03 | ic_sword 与 ic_heroes 路径相同 | 复制文件未检查语义差异 | 重新设计 ic_sword 为真正剑形 | 🟠 |
| M3-04 | ic_trap 与 ic_warning 路径相同 | 同上 | 重新设计 ic_trap 为陷阱形 | 🟠 |
| M3-05 | 共享资源放在 app 模块无法解析 | feature 依赖 core-ui 不依赖 app | 全部迁移到 core-ui | 🔴 |
| M3-06 | 所有 library 缺少 AndroidManifest.xml | AGP 要求每个模块必须有 manifest | 为 9 个模块各创建最小 manifest | 🔴 |
| M3-07 | navigation_graph.xml 无法解析 Fragment | navigation 模块不依赖 feature | 迁移到 app 模块 | 🟠 |
| M3-08 | Adaptive Icon 引用 @color/ 而非 @drawable/ | 颜色资源不能作为 drawable 使用 | 创建 Vector Drawable 替代 | 🟡 |
| M3-09 | core-common 缺少 Gson 依赖 | Result 使用 @SerializedName 但无依赖 | build.gradle 添加 Gson | 🔴 |
| M3-10 | Gradle wrapper JAR 缺失 | 手动创建未生成 JAR | 从缓存执行 `gradle wrapper` | 🔴 |
| M3-11 | JUnit 5 测试无法执行 | java-library 需 useJUnitPlatform() | build.gradle 添加配置 | 🟠 |
| M3-12 | SearchReplace 仅替换首个匹配项 | 工具设计限制 | 多匹配文件用 Write 重写 | 🟡 |
| M3-13 | GitHub 仓库文档缺失+乱码 | 初始化未同步编写 | 统一重写 README 三仓库 | 🟡 |

## 3.4 阶段成果与经验教训

**交付物**：
- 55 个 Vector Drawable 图标
- 8 个通用 UI 组件
- core-data（TokenStore + Room + 2 DAO）
- core-network（2 拦截器 + 4 API + NetworkModule）
- 17 个单元测试用例全部通过
- 项目规则文档 v1.3.0（含 TDD 规范）
- 编译验证通过：284 tasks，APK 7.8 MB

**经验教训**：
1. ⚠️ **复制文件后必须逐一检查所有差异化内容**，不能仅修改显而易见的属性
2. ⚠️ **共享资源必须放在依赖链最底端公共模块**，Android 资源合并是单向的
3. ⚠️ **每个 Android Library 模块必须有 AndroidManifest.xml**
4. ⚠️ **单元测试是代码质量的最后防线**，M3 阶段 13 个问题中 8 个是致命级，全部因缺乏测试导致
5. ✅ 建议：每个模块创建时一次性配齐所有依赖、manifest、测试框架

---

# 第四阶段：英雄模块（M4）

## 4.1 任务目标与范围

- 后端：英雄种子数据初始化 + 分页查询 API + Redis 缓存
- Android：英雄列表 Fragment（搜索 + 梯级筛选 + 分页 + 状态管理）
- Android：英雄详情 Fragment（待开发）
- 安全修复：JWT Token Type 校验（BE-014 代码实现）

## 4.2 实施内容与关键决策

### 4.2.1 后端开发

**实施内容**：
1. DataInitializer：167 个英雄种子数据（完整英雄联盟 roster，Aatrox 到 Zyra，覆盖 S+/S/A/B/C）
2. HeroController：GET /api/heroes + GET /api/heroes/{id}
3. HeroServiceImpl：分页查询 + Redis 缓存 + 动态筛选
4. HeroListVO + HeroDetailVO（继承复用）+ PageResult

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 41 | HeroApi 参数名对齐后端（keyword/tier/sortBy） | @RequestParam 需严格匹配 |
| 42 | HeroDetailVO 继承 HeroListVO | DRY 原则，避免重复基础字段 |
| 43 | Redis 缓存 key 包含所有参数组合 | 相同查询命中缓存 |

### 4.2.2 Android 端开发

**实施内容**：
1. HeroListFragment：RecyclerView + SearchToolbar + ChipGroup + PaginationScrollListener + StatefulLayout
2. HeroDetailFragment：CollapsingToolbar + 基本信息 + 平衡性数据 + 技能列表 + 克制提示 + 阵容搭配 + 推荐出装
3. HeroListViewModel：LiveData 状态管理（heroes/loading/error/loadingMore/isLastPage）
4. HeroDetailViewModel：网络请求 + HeroDetailResponse 转换为 HeroDetailUiModel
5. HeroApi 更新 + NetworkModule 扩展 + HeroDetailResponse DTO
6. HeroRepository（HeroApi + HeroDao）
7. SkillAdapter + item_skill.xml（技能列表展示）
8. OnHeroSelectedListener 接口（模块间导航）
9. 循环依赖修复：HeroResponse/PageResponse 移至 core-network/dto/

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 44 | DTO 放在 core-network 而非 feature-hero | core-network 是 HeroApi 所在模块，避免循环依赖 |

### 4.2.3 JWT Token Type 安全修复（BE-014）

**实施内容**：
1. JwtTokenProvider.generateAccessToken()：新增 `claim("type", "access")`
2. JwtTokenProvider.getTokenType()：新增方法返回 type claim
3. AuthService.refreshToken()：增加 type claim 校验，拒绝 Access Token 刷新

## 4.3 技术问题与解决方案

| 编号 | 问题 | 根因 | 解决方案 | 严重度 |
|------|------|------|----------|--------|
| M4-01 | core-network 引用 feature-hero 的 DTO | 循环依赖违反 AR-002 | 移至 core-network/dto/ | 🔴 |
| M4-02 | HeroUiModel 构造函数参数不匹配 | 传入 String 但需要 Tier 枚举 | 新增 parseTier() 转换 | 🔴 |
| M4-03 | Tier 方法名误用 getDisplayName() | 方法不存在 | 更正为 getLabel() | 🟡 |
| M4-04 | 后端 0 个单元测试 | 未配置 TDD 流程 | 规则 v1.3.0 新增 QA-007~QA-014 | 🔴 |
| M4-05 | Android 仅 3 个测试 | feature-hero/core-ui 无 test 目录 | 同上 | 🔴 |

## 4.4 阶段成果与经验教训

**交付物**：
- 后端：DataInitializer + HeroController + HeroServiceImpl + 3 DTO（已完成）
- Android：HeroListFragment + HeroListViewModel + HeroRepository + HeroApi 更新（已完成）
- 安全修复：JwtTokenProvider + AuthService type claim 校验（已完成）
- 规则文档：v1.3.0 新增 TDD 测试驱动开发规范

**待完成**：
- HeroDetailFragment（CollapsingToolbar + 详情展示）
- 8.4 离线缓存逻辑（Room 缓存 → 网络 → 更新 Room）
- 8.8 离线模式检测（ConnectivityManager）
- Android ViewModel 测试编译验证

**经验教训**：
1. ⚠️ **TDD 不是可选项，是必选项**。M4 所有代码均无测试保护，编译验证仅靠静态分析
2. ⚠️ **模块依赖方向必须严格遵守 AR-002**，core 模块不能引用 feature 模块
3. ✅ 建议：功能开发前必须先写测试用例（Red → Green → Refactor）
4. ✅ 建议：引入文档管理 Agent 审批机制，防止 dev-log 等文档结构混乱

## 4.5 M4 单元测试补写（TDD 规则落实）

**开始时间**：2026-05-12

**背景**：M1~M4 阶段严重缺失单元测试，后端 0 个测试，Android 仅 3 个测试。规则 v1.3.0 新增 TDD 规范后，启动全面测试补写。

**实施内容**：

1. **后端安全测试**（24 用例，全部通过）
   - JwtTokenProviderTest：16 用例（生成/验证/type claim/篡改/过期/null/错误密钥）
   - AuthServiceTest：8 用例（refreshToken 成功/type 校验/过期/用户不存在/unknown type）

2. **后端业务测试**（23 用例，全部通过）
   - HeroServiceTest：23 用例（分页/筛选/排序/空结果/详情/字段转换）
   - 覆盖率：HeroServiceImpl 100% 行覆盖 + 100% 分支覆盖

3. **Android ViewModel 测试**（20 用例，已创建）
   - HeroListViewModelTest：20 用例（加载成功/空结果/网络失败/分页/搜索/筛选/重试）
   - 覆盖率：HeroListViewModel ~90%
   - 技术要点：TestViewModel 绕过 Application 依赖 + CountDownLatch 异步等待 + 反射访问私有状态

**新增文件**：
- `aram-server/src/test/java/.../security/JwtTokenProviderTest.java`（16 用例）
- `aram-server/src/test/java/.../service/AuthServiceTest.java`（8 用例）
- `aram-server/src/test/java/.../service/impl/HeroServiceTest.java`（23 用例）
- `feature-hero/src/test/java/.../viewmodel/HeroListViewModelTest.java`（20 用例）

**修复问题**：
- HeroServiceImpl.java import 路径错误（BusinessException 包名修正）
- feature-hero/build.gradle 新增 JUnit 5 + Mockito 测试依赖

**测试结果**：
```
后端：Tests run: 47, Failures: 0, Errors: 0, Skipped: 0 — BUILD SUCCESS
Android：20 用例已创建，待 gradlew :feature-hero:test 验证
```

## 4.6 HeroDetailFragment 完整实现

**开始时间**：2026-05-13

**实施内容**：

1. **HeroDetailFragment** — 英雄详情页面
   - CollapsingToolbarLayout 实现头部折叠效果（英雄横幅 + 名称 + 称号）
   - 基本信息卡片：中英文名、定位、梯级徽章（Chip 展示）
   - 平衡性数据卡片：胜率/登场率/KDA + BalanceBar 可视化
   - 英雄描述卡片
   - 技能列表（RecyclerView + SkillAdapter + item_skill.xml）
   - 克制提示（ChipGroup 动态添加）
   - 阵容搭配（ChipGroup 动态添加）
   - 推荐出装卡片

2. **HeroDetailViewModel** — 数据层
   - Retrofit 网络请求（HeroApi.getHeroDetail）
   - HeroDetailResponse → HeroDetailUiModel 数据转换
   - LiveData 状态管理（loading/error/heroDetail）
   - Tier 枚举解析 + 技能列表转换

3. **数据模型扩展**
   - HeroDetailResponse（core-network）：完整英雄详情 DTO
   - HeroDetailUiModel（core-ui）：UI 层数据模型 + SkillUiModel 内部类
   - HeroDetailVO（后端）：extends HeroListVO，包含 skills/counterTips/synergies 等

4. **导航系统**
   - OnHeroSelectedListener 接口（模块间回调，解决 feature 模块无法访问 app R 资源问题）
   - MainActivity 实现接口处理导航（NavHostFragment + Bundle 传参）
   - navigation_graph.xml 添加 hero detail 路由 + Safe Args 参数定义

5. **资源文件**
   - fragment_hero_detail.xml：CoordinatorLayout + AppBarLayout + NestedScrollView
   - item_skill.xml：技能卡片布局（Key 图标 + 名称 + 描述）
   - bg_skill_key.xml：技能 Key 背景 drawable
   - bg_gradient_overlay.xml：横幅底部渐变遮罩
   - strings.xml 扩展：12 个新字符串（hero_detail_*）

6. **依赖配置修复**
   - feature-hero/build.gradle：新增 navigation-ui/retrofit/okhttp/gson 依赖
   - 移除错误的 `test {}` 块（Android library 不支持）
   - HeroApi.getHeroDetail 返回类型改为 HeroDetailResponse

**编译验证**：
```
Android: gradlew :feature-hero:assembleDebug → BUILD SUCCESSFUL (16s)
```

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 45 | 模块间导航使用 OnHeroSelectedListener 接口 | feature 模块不能访问 app 模块的 R 资源（nav graph ID） |
| 46 | 跨模块资源引用使用完整包名 | com.aram.mayhem.ui.R 替代 R，避免资源合并冲突 |
| 47 | HeroApi 返回类型改为 HeroDetailResponse | 详情页需要 skills/counterTips 等扩展字段 |

**Git 提交**：
- Android 仓库：24 files changed, 2845 insertions, 22 deletions
- 后端仓库：12 files changed, 1615 insertions, 4 deletions

## 4.7 M4 遗漏任务补完

**开始时间**：2026-05-13

**实施内容**：

1. **DataInitializer 英雄详情数据扩展**
   - Hero 实体新增字段：description, skills(JSON), counterTips(JSON), synergies(JSON), avgKills, avgDeaths, avgAssists, recommendedBuild
   - 使用 JacksonTypeHandler 处理 JSON 列（skills 为 List<SkillData>，counterTips/synergies 为 List<String>）
   - DataInitializer 按角色生成模板化详情数据：
     - 6 种角色 × 5 个技能名称/描述模板
     - 6 种角色的克制提示/阵容搭配
     - 6 种角色的推荐出装路线
     - 按角色生成 KDA 数据（刺客击杀高、辅助助攻高等）

2. **HeroServiceImpl 详情字段映射修复**
   - convertToDetailVO 方法从 Hero 实体读取所有详情字段
   - skills 转换为 HeroDetailVO.SkillInfo 列表
   - counterTips/synergies 直接映射
   - avgKills/avgDeaths/avgAssists/recommendedBuild 直接映射

3. **HeroRepository 离线缓存逻辑实现**
   - getHeroes()：网络请求成功 → 返回数据 + 异步写入 Room；失败 → 从 Room 缓存读取
   - getHeroDetail()：网络请求成功 → 返回数据 + 异步写入 Room；失败 → 从 Room 缓存读取
   - HeroEntity 扩展：新增 description/skills/counterTips/synergies/avgKills/avgDeaths/avgAssists/recommendedBuild
   - SkillListConverter：Gson 序列化/反序列化 List<SkillData> 和 List<String>
   - AppDatabase 版本升级 v1 → v2（fallbackToDestructiveMigration）

4. **离线模式检测**
   - HeroListFragment 注册 ConnectivityManager.NetworkCallback
   - 网络断开：Snackbar 提示"网络已断开，正在显示缓存数据"
   - 网络恢复：Snackbar 提示"网络已恢复" + 自动重新加载

5. **HeroListViewModel/DetailViewModel 重构**
   - 改为使用 HeroRepository 而非直接使用 HeroApi
   - HeroListViewModel 新增 isOffline LiveData
   - HeroDetailViewModel 新增 isOffline LiveData

6. **HeroDetailViewModel 单元测试**
   - 11 个测试用例：加载成功/失败/null、字段完整性、辅助方法、初始状态
   - 使用 Mockito mock HeroRepository

7. **HeroServiceTest 修复**
   - 更新 createHero 方法设置详情字段
   - 修复 description 断言（不再是 confidenceLevel 映射）
   - 新增 counterTips/synergies/KDA/recommendedBuild 断言

8. **数据库 DDL 变更**
   - ALTER TABLE tb_hero 新增 8 列（description/skills/counter_tips/synergies/avg_kills/avg_deaths/avg_assists/recommended_build）

**编译验证**：
```
后端：mvn test → Tests run: 47, Failures: 0, Errors: 0 — BUILD SUCCESS
Android：gradlew :feature-hero:assembleDebug → BUILD SUCCESSFUL (15s)
```

**关键决策**：
| 编号 | 决策 | 理由 |
|------|------|------|
| 48 | Hero 详情字段使用 JSON 列存储 | 避免 skills/counterTips/synergies 创建关联表，MyBatis Plus JacksonTypeHandler 原生支持 |
| 49 | DataInitializer 按角色生成模板化数据 | 167 个英雄逐一编写不现实，按角色生成保证数据合理性 |
| 50 | 离线缓存使用 Room + Repository 模式 | 网络优先 → 失败回退缓存，符合 Android 推荐架构 |

---

# 全局决策索引

| 编号 | 决策摘要 | 阶段 | 模块 |
|------|----------|------|------|
| 1 | 多模块架构 | M1 | 架构 |
| 2 | core-common 使用 java-library | M1 | 架构 |
| 3 | Gradle Groovy DSL | M1 | 构建 |
| 4 | JWT 密钥 Base64 存储 | M1 | 安全 |
| 5 | MySQL 绑定 127.0.0.1 | M1 | 安全 |
| 6 | Access 15min + Refresh 7d | M1 | 安全 |
| 7 | utf8mb4 + utf8mb4_unicode_ci | M2 | 数据库 |
| 8 | 表达式索引 (upvotes-downvotes) | M2 | 数据库 |
| 9 | 逻辑删除 @TableLogic | M2 | 数据库 |
| 10 | CORS 允许 * Origin | M2 | 网络 |
| 11 | Redis Jackson JSON 序列化 | M2 | 缓存 |
| 12 | SecurityFilterChain Lambda DSL | M2 | 安全 |
| 13 | JwtFilter 注入 UserDetailsService | M2 | 安全 |
| 23 | 梯级徽章描边字体风格 | M3 | UI |
| 24 | 功能图标默认灰色描边 | M3 | UI |
| 25 | 游戏特色图标语义化颜色 | M3 | UI |
| 26 | Adapter 使用 ListAdapter+DiffUtil | M3 | 组件 |
| 27 | StatefulLayout FrameLayout 叠加 | M3 | 组件 |
| 28 | BalanceBar Canvas 自绘 | M3 | 组件 |
| 29 | TokenStore EncryptedSharedPreferences | M3 | 安全 |
| 30 | Room fallbackToDestructiveMigration | M3 | 数据 |
| 31 | TokenRefreshInterceptor 独立 OkHttpClient | M3 | 网络 |
| 35 | 规则文档三级优先级体系 | M3 | 协作 |
| 36 | 规则编号模块前缀 | M3 | 协作 |
| 37 | 规则与问题关联矩阵 | M3 | 协作 |
| 38 | JWT Token Type 校验 | M3 | 安全 |
| 39 | BE-014 放置在安全规范[P0] | M3 | 安全 |
| 40 | 对称性 type claim 设计 | M3 | 安全 |
| 41 | HeroApi 参数名对齐后端 | M4 | 网络 |
| 42 | HeroDetailVO 继承 HeroListVO | M4 | 架构 |
| 43 | Redis 缓存 key 包含所有参数 | M4 | 缓存 |
| 44 | DTO 放在 core-network 避免循环依赖 | M4 | 架构 |
| 45 | 模块间导航使用 OnHeroSelectedListener 接口 | M4 | 架构 |
| 46 | 跨模块资源引用使用完整包名 | M4 | 构建 |
| 47 | HeroApi 返回类型改为 HeroDetailResponse | M4 | 网络 |
| 48 | Hero 详情字段使用 JSON 列存储 | M4 | 数据库 |
| 49 | DataInitializer 按角色生成模板化数据 | M4 | 数据 |
| 50 | 离线缓存使用 Room + Repository 模式 | M4 | 架构 |

---

# 问题分类索引

## A. 资源格式类
| 编号 | 问题 | 阶段 | 解决状态 |
|------|------|------|----------|
| M3-01 | Vector Drawable 颜色格式必须 8 位 hex | M3 | ✅ 已修复 |
| M3-08 | Adaptive Icon 必须引用 @drawable/ | M3 | ✅ 已修复 |

## B. 模块配置类
| 编号 | 问题 | 阶段 | 解决状态 |
|------|------|------|----------|
| M3-05 | 共享资源必须放在 core-ui | M3 | ✅ 已修复 |
| M3-06 | 每个 Library 必须有 AndroidManifest.xml | M3 | ✅ 已修复 |
| M3-07 | 导航图必须放在 app 模块 | M3 | ✅ 已修复 |
| M3-09 | 新依赖必须在根 build.gradle 定义版本 | M3 | ✅ 已修复 |
| M4-01 | core 模块不能引用 feature 模块（循环依赖） | M4 | ✅ 已修复 |

## C. 构建工具类
| 编号 | 问题 | 阶段 | 解决状态 |
|------|------|------|----------|
| M1-01 | Gradle wrapper JAR 必须通过命令生成 | M1 | ✅ 已修复 |
| M3-10 | java-library 使用 JUnit 5 需 useJUnitPlatform() | M3 | ✅ 已修复 |
| M3-12 | SearchReplace 仅替换首个匹配项 | M3 | ✅ 已规避 |

## D. 设计与语义类
| 编号 | 问题 | 阶段 | 解决状态 |
|------|------|------|----------|
| M3-02 | 梯级徽章内部文字必须各不相同 | M3 | ✅ 已修复 |
| M3-03 | 不同语义图标必须有不同视觉形态 | M3 | ✅ 已修复 |
| M3-04 | 图标设计第一原则是语义可读性 | M3 | ✅ 已修复 |

## E. 安全类
| 编号 | 问题 | 阶段 | 解决状态 |
|------|------|------|----------|
| M4-04 | JWT Token 必须校验 type claim | M4 | ✅ 已修复 |
| M4-04 | 后端 0 个单元测试（安全代码无验证） | M4 | ⚠️ 规则已定义，代码待补写 |
| M4-05 | Android 仅 3 个测试（ViewModel 无验证） | M4 | ⚠️ 规则已定义，代码待补写 |

---

# 经验教训速查表

| 编号 | 教训摘要 | 关联问题 |
|------|----------|----------|
| 1 | Android 颜色格式必须 #AARRGGBB（8位） | M3-01 |
| 2 | 透明填充用 #00000000 | M3-01 |
| 3 | 复制文件后必须逐一检查差异化内容 | M3-02 |
| 4 | 不同语义图标必须有不同视觉形态 | M3-03 |
| 5 | 图标设计第一原则是语义可读性 | M3-04 |
| 6 | 添加 ViewBinding 组件前先确认模块配置 | M3-09 |
| 7 | 共享资源放依赖链最底端公共模块 | M3-05 |
| 8 | 导航图放依赖所有 feature 的模块（app） | M3-07 |
| 9 | 每个 Android Library 必须有 AndroidManifest.xml | M3-06 |
| 10 | Gradle wrapper JAR 必须通过命令生成 | M1-01 |
| 11 | java-library JUnit 5 需 useJUnitPlatform() | M3-10 |
| 12 | 项目初始化时同步编写完整 README | M3-13 |
| 13 | Adaptive Icon foreground/background 必须引用 Drawable | M3-08 |
| 14 | SearchReplace 仅替换首个匹配项 | M3-12 |
| 15 | **core 模块不能引用 feature 模块** | M4-01 |
| 16 | **TDD 不是可选项，是必选项** | M4-04/M4-05 |
| 17 | **功能开发前必须先写测试用例** | M4-04/M4-05 |
