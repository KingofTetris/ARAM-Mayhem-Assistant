# ARAM Mayhem Assistant 开发操作步骤记录

> 本文档记录项目从初始化到当前阶段的所有关键操作步骤、决策过程、问题及解决方案。
> 最后更新：2026-05-03
>
> **当前进度**：M3 阶段全部完成，M4 阶段待启动
>
> **开发暂停说明**：2026-05-03 M3 阶段全部完成后暂停开发，待启动 M4 英雄模块开发

---

## 当前阶段工作总结（截至 2026-05-03）

### 总体进度

| 里程碑 | 状态 | 完成度 | 备注 |
|--------|------|--------|------|
| M1 项目初始化 | ✅ 完成 | 100% | 脚手架+环境配置+Git仓库+文档修复 |
| M2 基础架构 | ✅ 完成 | 100% | MySQL建模+API框架+JWT认证 |
| M3 Android UI 框架 | ✅ 完成 | 100% | 核心模块+通用组件+图标+测试 |
| M4 英雄模块 | ⏳ 待开始 | 0% | 依赖M3完成 |
| M5 强化符文模块 | ⏳ 待开始 | 0% | 依赖M4 |
| M6 社区模块 | ⏳ 待开始 | 0% | 依赖M4+M5 |
| M7 版本与公告 | ⏳ 待开始 | 0% | 依赖M4 |
| M8 个人中心 | ⏳ 待开始 | 0% | 依赖M5+M6 |
| M9 数据管线 | ⏳ 待开始 | 0% | 依赖M2 |
| M10 测试与打包 | ⏳ 待开始 | 0% | 依赖所有模块 |
| M11 本地部署验证 | ⏳ 待开始 | 0% | 依赖M10 |

### 本阶段已完成的核心任务

1. **GitHub 仓库文档修复**：修正了项目工作区、Android 客户端、后端服务三个仓库的 README 文件和仓库描述
2. **Android 图标资源系统设计**：参照原始设计稿完成 55 个 Vector Drawable 图标的设计与修复
3. **通用 Android 组件开发**：完成 8 个核心 UI 组件（TierBadgeView、HeroCardAdapter、AugmentCardAdapter、SearchToolbar、PaginationScrollListener、StatefulLayout、QualityChip、BalanceBar）
4. **core-data 模块开发**：TokenStore 安全存储 + Room Database + Entity/DAO + Hilt DataModule
5. **core-network 模块开发**：Retrofit + OkHttp 拦截器（AuthInterceptor + TokenRefreshInterceptor）+ 4 个 API 接口
6. **单元测试**：core-common 模块 3 个测试类 17 个测试用例全部通过
7. **开发日志与进度跟踪**：建立完整的进度跟踪体系和问题记录

### 本阶段遇到的问题总数

| 问题类别 | 数量 | 严重程度分布 |
|----------|------|-------------|
| Android Vector Drawable 颜色格式 | 1 | 🔴 致命 |
| 图标设计缺陷（路径复制/语义不匹配） | 4 | 🔴×2 🟠×2 |
| 模块依赖与资源配置 | 4 | 🔴×3 🟠×1 |
| 构建工具配置 | 2 | 🔴×2 |
| GitHub 仓库文档 | 1 | 🟡 中等 |
| 工具使用限制 | 1 | 🟡 中等 |
| **合计** | **13** | **🔴×8 🟠×2 🟡×3** |

### 待办事项（按优先级）

1. **[高] M4 后端**：DataInitializer 种子数据 + HeroController + HeroService
2. **[高] M4 安卓端**：HeroListFragment / HeroDetailFragment 完整实现
3. **[中] M4 后端**：HeroService Redis 缓存策略
4. **[低] M1 遗留**：Checkstyle + SpotBugs 代码规范配置

## 阶段一：项目初始化（M1）

### 1.1 项目脚手架搭建

**开始时间**：2026-05-03 09:00:00

**实施内容**：

1. 创建 Android 项目目录结构 `D:\androidProjects\ARAM_Mayhem_Assistant`
2. 创建 11 个 Gradle 模块：app, core-common, core-network, core-data, core-ui, feature-hero, feature-augment, feature-community, feature-profile, feature-bulletin, navigation
3. 创建 Spring Boot 后端项目 `D:\ideaProjects\aram-server`
4. 编写 `settings.gradle`（11 模块 include）、根 `build.gradle`（统一依赖版本 ext{}）
5. 编写各模块独立 `build.gradle`（app=application, core-common=java-library, 其余=android-library）
6. 编写 `gradle-wrapper.properties`（Gradle 8.7）、`gradle.properties`、`gradlew.bat`

**使用工具**：Write 工具逐文件创建、RunCommand 创建目录结构

**关键决策**：
- **决策1**：采用多模块架构而非单模块，理由：feature 模块可独立编译、降低增量构建时间
- **决策2**：core-common 使用 `java-library` 插件而非 `android-library`，理由：纯 Java 类（Constants/Result/Tier）无需 Android SDK
- **决策3**：Gradle 使用 Groovy DSL 而非 Kotlin DSL，理由：与 tasks.md 规格一致，Groovy 生态更成熟

**遇到的问题及解决**：
| 问题 | 解决方案 |
|------|----------|
| Gradle wrapper JAR 文件缺失 | 从本地缓存 `C:\Users\12040\.gradle\wrapper\dists\gradle-8.7-bin` 中找到已安装的 Gradle 8.7，执行 `gradle wrapper` 命令生成 |
| sandbox 无法删除 navigation 模块目录 | 从 settings.gradle 和 app/build.gradle 中移除引用即可，Gradle 不会编译未 include 的模块 |

---

### 1.2 开发环境与工具链配置

**开始时间**：2026-05-03 12:00:00

**实施内容**：

1. 配置 Android Gradle 多模块依赖关系（app → core×4 + feature×5 + navigation）
2. 编写后端 `pom.xml`：Spring Boot 3.3.5 + MyBatis Plus 3.5.9 + Spring Security + jjwt 0.12.6 + SpringDoc 2.6.0
3. 编写 `application.yml`：MySQL(127.0.0.1:3306/aram_mayhem) + Redis(127.0.0.1:6379) + JWT 密钥 + MyBatis Plus 配置
4. 编写 `application-local.yml`：DEBUG 日志级别
5. Android 配置 ViewBinding（app + 5 个 feature 模块 `buildFeatures { viewBinding true }`）
6. Android 配置 Hilt（app + core-network + core-data + 5 个 feature 模块添加 Hilt 插件和依赖）
7. 创建 `network_security_config.xml`（允许 192.168.1.100 和 localhost 明文 HTTP）
8. 在 `AndroidManifest.xml` 中引用 `android:networkSecurityConfig`
9. 创建 `Constants.java` 定义 `BASE_URL = "http://192.168.1.100:8080/"`

**使用工具**：Write 工具、RunCommand 验证 Maven

**关键决策**：
- **决策4**：JWT 密钥使用 Base64 编码存储在 yml 中，而非环境变量，理由：本地部署场景无需云环境变量
- **决策5**：MySQL 绑定 127.0.0.1 而非 0.0.0.0，理由：本地开发安全，外部通过防火墙规则控制
- **决策6**：Access Token 15 分钟 + Refresh Token 7 天，理由：移动端使用频率高，短 Access Token 保障安全，长 Refresh Token 减少重新登录

**遇到的问题及解决**：
| 问题 | 解决方案 |
|------|----------|
| Maven 不在 sandbox PATH 中 | 使用完整路径 `D:\dev\apache-maven-3.9.15-bin\apache-maven-3.9.15\bin\mvn.cmd` 执行 |
| sandbox PowerShell 无法读取用户/系统环境变量 | 承认限制，不依赖环境变量，直接使用已知安装路径 |

---

## 阶段二：基础架构（M2）

### 2.1 MySQL 数据库建模（Task 3）

**开始时间**：2026-05-03 18:00:00

**实施内容**：

1. 通过 MCP MySQL 工具执行 DDL，创建 `aram_mayhem` 数据库（utf8mb4_unicode_ci）
2. 创建 9 张表：tb_user, tb_hero, tb_hero_modifier, tb_augment, tb_strategy, tb_strategy_augment, tb_strategy_item, tb_vote, tb_bulletin
3. 创建 10 个索引：idx_hero_tier, idx_hero_role, idx_hero_name_zh, idx_augment_quality, idx_augment_synergy, idx_strategy_hero, idx_strategy_user, idx_strategy_hot(表达式索引), idx_bulletin_type, idx_bulletin_pinned
4. 创建 9 个 Entity 类（@TableName + @TableId + @TableField + 逻辑删除 deleted）
5. 创建 9 个 Mapper 接口（extends BaseMapper<T>）

**使用工具**：MCP MySQL execute_sql、backend-android-collaboration-expert 智能体

**关键决策**：
- **决策7**：所有表使用 `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`，理由：utf8mb4 支持完整 Unicode（含 emoji），utf8mb4_unicode_ci 排序规则准确
- **决策8**：tb_strategy_hot 使用表达式索引 `(upvotes - downvotes)`，理由：MySQL 8.0+ 支持函数索引，避免查询时计算
- **决策9**：逻辑删除字段 `deleted TINYINT DEFAULT 0`，理由：MyBatis Plus @TableLogic 自动处理，数据可恢复

**遇到的问题及解决**：
| 问题 | 解决方案 |
|------|----------|
| TEXT 列不能设置 DEFAULT 值（MySQL 严格模式） | 移除 tb_augment.description 和 tb_bulletin.content 的 DEFAULT '' |

---

### 2.2 后端 RESTful API 框架（Task 4）

**开始时间**：2026-05-03 18:00:00

**实施内容**：

1. 创建 `Result<T>` 统一响应体（code + message + data + timestamp）
2. 创建 `GlobalExceptionHandler`（@RestControllerAdvice 处理 Validation/Business/Unknown 异常）
3. 创建 `BusinessException` 自定义异常
4. 创建 `CorsConfig`（CorsFilter 允许所有 Origin + 标准方法 + 凭证）
5. 创建 `RedisConfig`（RedisTemplate + Jackson2JsonRedisSerializer + Java8 时间模块）
6. SpringDoc OpenAPI 已通过 pom.xml 依赖自动配置

**使用工具**：backend-android-collaboration-expert 智能体

**关键决策**：
- **决策10**：CORS 允许 `*` Origin，理由：本地局域网部署，无跨域安全风险
- **决策11**：Redis Value 使用 Jackson JSON 序列化而非 JDK 序列化，理由：可读性好、跨语言兼容、体积更小

---

### 2.3 Spring Security + JWT 认证（Task 5）

**开始时间**：2026-05-03 18:00:00

**实施内容**：

1. 创建 `JwtTokenProvider`（HMAC-SHA 密钥签名，Access 15min + Refresh 7d）
2. 创建 `JwtAuthenticationFilter`（OncePerRequestFilter，Bearer Token 提取 + 验证 + SecurityContext 注入）
3. 创建 `SecurityConfig`（CSRF 禁用 + STATELESS 会话 + /api/auth/** 放行 + 其余需认证）
4. 创建 `CustomUserDetailsService`（UserDetailsService 实现，email 查询 + BCrypt 密码验证）
5. 创建 4 个 DTO：RegisterRequest, LoginRequest, RefreshTokenRequest, AuthResponse
6. 创建 `AuthService`（register/login/refresh 完整业务逻辑）
7. 创建 `AuthController`（POST /api/auth/register, /api/auth/login, /api/auth/refresh）
8. 后端添加 Lombok 依赖到 pom.xml

**使用工具**：backend-android-collaboration-expert 智能体、MCP MySQL

**关键决策**：
- **决策12**：SecurityFilterChain 使用 Lambda DSL 而非 WebSecurityConfigurerAdapter，理由：Spring Security 6.x 已废弃后者
- **决策13**：JwtAuthenticationFilter 注入 UserDetailsService 加载完整权限，而非仅存储 userId，理由：后续 RBAC 权限控制需要角色信息

**遇到的问题及解决**：
| 问题 | 解决方案 |
|------|----------|
| JwtAuthenticationFilter 初始版本仅设置 userId 为 principal | 更新为注入 UserDetailsService，加载完整 UserDetails 含权限列表 |

**编译验证**：`mvn clean compile -DskipTests` → **34 源文件编译通过，BUILD SUCCESS**

---

## 阶段三：Android UI 框架（M3）

### 3.1 Android 核心模块搭建（Task 6）

**开始时间**：2026-05-03 09:00:00

**实施内容**：

1. 创建 `MayhemApplication.java`（@HiltAndroidApp）
2. 创建 `MainActivity.java`（@AndroidEntryPoint + NavHostFragment + BottomNavigationView）
3. 创建 `activity_main.xml`（ConstraintLayout + FragmentContainerView + BottomNavigationView）
4. 创建 `navigation_graph.xml`（5 Tab：英雄/符文/玩法/公告/我的）
5. 创建 `bottom_nav_menu.xml`（5 个 item + 图标引用）
6. 创建 5 个 Fragment 占位：HeroListFragment, AugmentListFragment, CommunityFeedFragment, BulletinListFragment, ProfileFragment
7. 创建 5 个 Fragment 布局文件（ConstraintLayout + TextView 占位）
8. 创建 `core-common` 3 个 Java 类：Constants, Result, Tier
9. 创建 `core-ui` 完整资源体系：colors.xml, strings.xml, dimens.xml, themes.xml
10. 创建 13 个 drawable 资源：5 个底部导航图标 + 2 个启动图标 + 6 个功能性 drawable
11. 创建 `network_security_config.xml` + `proguard-rules.pro`

**使用工具**：Write 工具批量创建、RunCommand 创建目录

**关键决策**：
- **决策14**：Tier 枚举使用 @SerializedName 注解，理由：Gson 反序列化需要映射 S_PLUS → "S_PLUS" 字符串
- **决策15**：5 个 Fragment 布局使用 ConstraintLayout 而非 LinearLayout，理由：ConstraintLayout 性能更优，复杂布局层级更少
- **决策16**：底部导航图标使用 Vector Drawable 而非 PNG，理由：矢量图任意缩放不失真，APK 体积更小

---

### 3.2 资源缺失问题修复

**开始时间**：2026-05-03 18:00:00

**问题诊断**：

| 问题 | 根因 | 严重程度 |
|------|------|----------|
| feature 模块引用 @color/background 等资源无法解析 | 共享资源仅存在于 app 模块 | 🔴 致命 |
| 所有 library 模块缺少 AndroidManifest.xml | AGP 要求每个模块必须有 manifest | 🔴 致命 |
| navigation_graph.xml 在 navigation 模块无法解析 Fragment 类 | navigation 模块不依赖 feature 模块 | 🟠 严重 |
| 启动图标 adaptive-icon 引用 @color/ 而非 @drawable/ | 颜色资源不能直接作为 adaptive-icon 的 drawable | 🟡 中等 |
| core-common 缺少 Gson 依赖 | Result.java 使用 @SerializedName 但 build.gradle 无 Gson | 🔴 致命 |
| gradle-wrapper.jar 缺失 | 手动创建项目时未生成 wrapper JAR | 🔴 致命 |

**修复步骤**：

1. **共享资源迁移**：将 app 模块的 colors.xml(25色值)、strings.xml(35字符串)、dimens.xml(30尺寸)、themes.xml(14样式) 迁移到 core-ui 模块
2. **图标迁移**：5 个底部导航图标 drawable 从 app 迁移到 core-ui
3. **新增 drawable**：ic_launcher_foreground.xml、ic_launcher_background.xml、bg_trap_warning.xml、bg_card.xml、divider_horizontal.xml、bg_tier_s_plus/s/a/b/c.xml
4. **AndroidManifest 补全**：为 9 个 library 模块各创建 AndroidManifest.xml
5. **导航图迁移**：navigation_graph.xml 从 navigation 模块迁移到 app 模块（app 依赖所有 feature 模块，可解析 Fragment 类引用）
6. **启动图标修复**：adaptive-icon 引用改为 `@drawable/ic_launcher_foreground` 和 `@drawable/ic_launcher_background`
7. **app 模块旧资源清理**：移除已迁移的 colors/dimens/themes（保留空 resources 标签），移除 5 个图标 drawable
8. **settings.gradle 更新**：移除 `include ':navigation'`
9. **app/build.gradle 更新**：移除 `implementation project(':navigation')`
10. **core-common/build.gradle 更新**：添加 `implementation "com.google.code.gson:gson:$gsonVersion"`
11. **Gradle wrapper 生成**：从本地缓存执行 `gradle wrapper --gradle-version 8.7`

**使用工具**：Write、DeleteFile、RunCommand、Glob、Grep

**关键决策**：
- **决策17**：共享资源放在 core-ui 而非 app 模块，理由：feature 模块依赖 core-ui 而非 app，资源通过依赖链自动合并
- **决策18**：导航图放在 app 模块而非独立 navigation 模块，理由：app 依赖所有 feature 模块，可以解析 Fragment 类引用；独立模块无法做到
- **决策19**：app 模块的 colors/dimens/themes 保留空 `<resources />` 标签而非删除文件，理由：避免未来 app 特有资源无处放置

**编译验证**：`gradlew assembleDebug` → **BUILD SUCCESSFUL, 284 tasks, app-debug.apk 7.8 MB**

---

### 3.3 图标资源系统设计与修复

**开始时间**：2026-05-03

**实施内容**：

1. 参照 `design_pictures/00_origin_styple/` 原始设计稿的暗金电竞风格，设计全套图标资源
2. 创建 55 个 Vector Drawable 图标，放置于 `core-ui/src/main/res/drawable/` 目录
3. 图标分类：
   - 底部导航栏图标 6 个：ic_home, ic_heroes, ic_augments, ic_community, ic_bulletins, ic_profile
   - 应用启动器图标 2 个：ic_launcher_foreground（剑+符文星+魔法光环）, ic_launcher_background（深蓝渐变）
   - 功能图标 21 个：搜索/返回/关闭/箭头/投票/警告/设置/编辑/分享/筛选/刷新/添加/删除/通知/书签/信息/复制/排序/历史等
   - 游戏特色图标 8 个：剑/符文/盾牌/皇冠/火焰/闪电/增益/削弱
   - 梯级徽章图标 5 个：S+(红)/S(橙)/A(金)/B(绿)/C(蓝)
   - 品质标识图标 3 个：棱彩(紫金)/金色(金)/银色(银)
   - 状态图标 3 个：空状态/错误状态/离线状态
4. 更新 `bottom_nav_menu.xml` 使用新图标
5. 在 `strings.xml` 中添加 `tab_home` 字符串

**UI/UX 专家审核发现的问题及修复**：

| 问题 | 严重程度 | 修复方案 |
|------|----------|----------|
| 梯级徽章 S/A/B/C 内部文字路径完全相同（都显示"S"锯齿形） | 🔴 致命 | 重新设计为描边字体风格，每个等级用白色粗描边绘制对应字母 |
| ic_tier_s_plus 内部为抽象菱形而非"S+" | 🔴 致命 | 重新设计为白色"S"描边 + 右上角"+"号 |
| ic_sword 与 ic_heroes 路径完全相同 | 🟠 严重 | 重新设计ic_sword为真正的剑形（刀刃+护手+剑柄） |
| ic_trap 与 ic_warning 路径完全相同 | 🟠 严重 | 重新设计ic_trap为陷阱形（方框+颚夹+尖齿） |
| ic_vote_down 语义不匹配（对角线不像投票） | 🟡 中等 | 重新设计为拇指向下图标 |
| ic_pick_rate 语义不匹配（笑脸不匹配选取率） | 🟡 中等 | 重新设计为柱状图+排序菱形 |
| ic_empty_state 语义不匹配（星形不像空状态） | 🟡 中等 | 重新设计为空内容框+渐隐文字行 |
| 颜色值 #FF00000000（9位alpha+6位hex）不符合Android规范 | 🔴 致命 | 全部替换为 #00000000（8位格式） |

**关键决策**：
- **决策23**：梯级徽章使用描边字体风格（2.5dp白色描边）而非填充路径，理由：在24dp小尺寸下描边字体比填充路径更清晰可读
- **决策24**：所有功能图标默认使用 #757575 灰色描边，理由：Android 底部导航栏会自动应用 tint 着色，灰色作为中性默认色最合适
- **决策25**：游戏特色图标（buff/nerf/trap/crown/fire/lightning）使用语义化颜色，理由：这些图标需要即时传达正面/负面/警告等语义

**编译验证**：`gradlew assembleDebug` → **BUILD SUCCESSFUL**

---

### 3.4 通用 Android 组件开发（Task 7）

**开始时间**：2026-05-03

**实施内容**：

1. **TierBadgeView**（7.3）：自定义 AppCompatTextView，接收 Tier 枚举自动设置文字+颜色+圆角背景
2. **HeroCardAdapter**（7.1）：ListAdapter + DiffUtil，item_hero_card.xml（MaterialCardView 12dp圆角 + 头像+名称+TierBadge+胜率）
3. **AugmentCardAdapter**（7.2）：ListAdapter + DiffUtil，item_augment_card.xml（品质色边框：棱彩/金/银 + 名称+套装）
4. **SearchToolbar**（7.4）：MaterialCardView 包裹搜索栏，TextWatcher 防抖 300ms + 清除按钮
5. **PaginationScrollListener**（7.5）：RecyclerView.OnScrollListener，LinearLayoutManager 向下滚动自动触发加载更多
6. **StatefulLayout**（7.6）：FrameLayout 四状态切换（Loading/Empty/Error/Content），含重试按钮回调
7. **QualityChip**（7.7）：Material Chip 子类，根据 PRISMATIC/GOLD/SILVER 自动设置背景+描边+文字颜色
8. **BalanceBar**（7.8）：Canvas 自绘 View，中心线向左（红色削弱）/向右（绿色增强）条形图 + 数值文字

**新增文件**：
- `core-ui/src/main/java/com/aram/mayhem/ui/widget/`：TierBadgeView, SearchToolbar, PaginationScrollListener, StatefulLayout, QualityChip, BalanceBar
- `core-ui/src/main/java/com/aram/mayhem/ui/adapter/`：HeroCardAdapter, AugmentCardAdapter
- `core-ui/src/main/java/com/aram/mayhem/ui/model/`：HeroUiModel, AugmentUiModel
- `core-ui/src/main/res/layout/`：item_hero_card.xml, item_augment_card.xml, widget_search_toolbar.xml, widget_stateful_layout.xml
- `core-ui/src/main/res/drawable/`：bg_tier_badge.xml

**配置变更**：
- `core-ui/build.gradle`：启用 `viewBinding true`，添加 `recyclerview` 依赖
- `build.gradle`（根）：添加 `recyclerViewVersion = '1.3.2'`

**关键决策**：
- **决策26**：Adapter 使用 ListAdapter + DiffUtil 而非 RecyclerView.Adapter，理由：自动差量更新，列表刷新性能更优
- **决策27**：StatefulLayout 使用 FrameLayout 叠加四种状态布局而非 ViewStub，理由：状态切换频繁时 ViewStub 的 inflate 开销反而更大
- **决策28**：BalanceBar 使用 Canvas 自绘而非多个 View 组合，理由：自定义绘制更灵活，减少 View 层级，性能更优

**编译验证**：`gradlew assembleDebug` → **BUILD SUCCESSFUL**

---

### 3.5 core-data 模块开发（Task 6.4）

**开始时间**：2026-05-03

**实施内容**：

1. **TokenStore**：基于 EncryptedSharedPreferences 的安全 Token 存储类
   - AES256_GCM MasterKey + AES256_SIV/AES256_GCM 双重加密
   - saveTokens() / getAccessToken() / getRefreshToken() / isTokenExpired() / clear()
2. **AppDatabase**：Room Database 基类，version=1，exportSchema=true
3. **HeroEntity**：@Entity(tableName="heroes")，含 @Index(tier/role/nameZh)
4. **AugmentEntity**：@Entity(tableName="augments")，含 @Index(quality/synergySet)
5. **HeroDao**：@Dao 接口，getAllHeroes / getHeroesByTier / getHeroesByRole / searchHeroes / getHeroById
6. **AugmentDao**：@Dao 接口，getAllAugments / getAugmentsByQuality / getAugmentsBySynergy / searchAugments / getAugmentById
7. **DataModule**：Hilt @Module @InstallIn(SingletonComponent)，提供 AppDatabase/HeroDao/AugmentDao

**关键决策**：
- **决策29**：TokenStore 使用 EncryptedSharedPreferences 而非普通 SharedPreferences，理由：Access Token 和 Refresh Token 是敏感凭证，需加密存储防 root 设备泄露
- **决策30**：Room 使用 fallbackToDestructiveMigration()，理由：MVP 阶段数据库结构频繁变动，开发期允许破坏性迁移

---

### 3.6 core-network 模块开发（Task 6.1-6.3）

**开始时间**：2026-05-03

**实施内容**：

1. **AuthInterceptor**（6.2）：OkHttp Interceptor，自动注入 `Authorization: Bearer <token>` 头
2. **TokenRefreshInterceptor**（6.3）：OkHttp Interceptor，401 响应时自动刷新 Token + 重放原始请求
   - synchronized 同步块防止并发刷新
   - 刷新失败时清除 TokenStore 并返回 401
3. **NetworkModule**（6.1）：Hilt @Module，提供 Gson/OkHttpClient/Retrofit 单例
   - OkHttpClient 配置：AuthInterceptor → TokenRefreshInterceptor → HttpLoggingInterceptor
   - 超时配置：连接30s/读取30s/写入30s
4. **AuthApi**：POST /api/auth/register, /api/auth/login, /api/auth/refresh
5. **HeroApi**：GET /api/heroes, /api/heroes/{id}
6. **AugmentApi**：GET /api/augments, /api/augments/{id}, /api/augments/synergy-progress
7. **CommunityApi**：GET /api/strategies, /api/strategies/{id}, POST /api/strategies, POST /api/strategies/{id}/vote

**关键决策**：
- **决策31**：TokenRefreshInterceptor 使用独立 OkHttpClient 执行刷新请求，理由：避免使用带 AuthInterceptor 的同一个 client 导致循环调用
- **决策32**：API 接口返回类型使用 Result<Object> 而非具体类型，理由：M4 阶段会创建完整 DTO 类，当前先定义接口签名

---

### 3.7 M3 单元测试

**开始时间**：2026-05-03

**实施内容**：

1. **ResultTest**：4 个测试用例（success 返回 200 / error 返回错误 / isSuccess 仅 200 为 true / null data 仍 success）
2. **TierTest**：7 个测试用例（5 个 Tier 的 label+color 验证 / 枚举数量 / 颜色唯一性）
3. **ConstantsTest**：6 个测试用例（BASE_URL 格式 / API 路径格式 / 超时正值 / PAGE_SIZE 正值 / 防抖正值）

**测试验证**：`gradlew :core-common:test` → **BUILD SUCCESSFUL，17 个测试全部通过**

---

### 3.8 GitHub 仓库文档修复

**开始时间**：2026-05-03

**实施内容**：

1. 修复项目工作区仓库（ARAM_Mayhem_Assistant）README.md：补充项目概述、架构说明、模块划分、技术栈、开发环境要求
2. 修复 Android 客户端仓库（ARAM_Mayhem_Assistant）README.md：补充安装指南、使用说明、功能特性、贡献指南、许可证信息
3. 修复后端服务仓库（aram-server）README.md：补充项目概述、API 文档说明、部署指南、开发环境配置
4. 修正三个仓库的 GitHub 仓库描述（Description）：从乱码/空描述修正为清晰的项目核心价值描述

**遇到的问题及解决**：

| 问题 | 解决方案 |
|------|----------|
| 仓库描述存在乱码字符 | 重新编写为中文描述，准确传达项目用途 |
| README 缺少安装指南和贡献指南 | 按行业标准格式补充完整内容 |
| 三个仓库 README 格式不统一 | 统一采用"项目概述→安装→使用→特性→贡献→许可证"结构 |

**关键决策**：
- **决策33**：README 使用中文编写，理由：项目团队以中文为主，目标用户为中文玩家社区
- **决策34**：三个仓库 README 结构统一，理由：降低维护成本，保持文档一致性

---

### 3.10 项目开发规则文档建立

**开始时间**：2026-05-03

**实施内容**：

1. 基于 M1~M3 阶段开发实践，编写全面的项目开发规则文档
2. 文档放置于 `.trae/rules/project_rules.md`，纳入全局规则管理系统
3. 文档包含 11 章内容：总则、项目架构规范、Android 开发规范、后端开发规范、构建与配置规范、协作流程规范、问题处理机制、代码风格规范、技术决策管理、工具使用规范、验证与质量保障
4. 定义 42 条规则（AR-001~AR-008, AD-001~AD-015, BE-001~BE-013, BC-001~BC-006, CO-001~CO-009, PH-001~PH-003, CS-001~CS-006, TD-001~TD-003, TU-001~TU-005, QA-001~QA-006）
5. 每条规则标注优先级（P0 强制 / P1 推荐 / P2 建议）
6. 包含附录 A（技术参数参考）和附录 B（规则与问题关联矩阵）
7. 建立版本控制信息，初始版本 1.0.0

**关键决策**：
- **决策35**：规则文档使用三级优先级体系（P0/P1/P2），理由：区分强制与推荐，避免一刀切导致灵活性不足
- **决策36**：规则编号使用模块前缀（AR/AD/BE/BC/CO/PH/CS/TD/TU/QA），理由：便于快速定位规则所属领域
- **决策37**：规则与问题建立关联矩阵，理由：每条规则可追溯到具体问题，验证规则的必要性

---

### 3.11 规则文档系统性复核与评估

**开始时间**：2026-05-03

**实施内容**：

1. 组织三位专家（Android开发专家、Spring Boot后端专家、质量保障专家）对规则文档 v1.1.0 进行系统性复核
2. 复核维度：需求一致性、行业合规性、潜在风险、质量标准符合性
3. 发现 5 个阻塞发布项和 7 个建议修复项
4. 执行全部 5 个阻塞发布项修复，发布 v1.1.1
5. 同步执行 2 个建议修复项（BE-013 措辞修正、AR-006 语气修正）

**关键修复**：

| 修复项 | 内容 |
|--------|------|
| B-01 | BE-014 从 4.4 缓存规范[P1] 移至 4.3 安全规范[P0]，解决安全规则被隐式降级问题 |
| B-02 | BE-014 补充 getTokenType() 方法完整实现，解决示例代码引用不存在方法的问题 |
| B-03 | BE-014 补充 generateAccessToken 必须设置 type claim 为 "access" 的要求，实现对称性防御纵深 |
| B-04 | 决策索引新增决策38：JWT Token Type 校验 |
| B-05 | PH-003 预防清单新增 BE-014 检查项 |

**关键决策**：
- **决策38**：JWT Token Type 校验防止 Access Token 滥用，理由：不校验 type claim 允许 Access Token 被滥用为 Refresh Token，是真实安全漏洞
- **决策39**：BE-014 放置在安全规范[P0]而非缓存规范[P1]，理由：安全规则的优先级必须与其实际严重程度匹配
- **决策40**：BE-014 要求对称性 type claim 设计（AccessToken 设 "access"、RefreshToken 设 "refresh"），理由：仅依赖 RefreshToken 的 type claim 是隐式防御，对称设计提供显式防御纵深

---

### 3.9 进度跟踪体系建立

**开始时间**：2026-05-03

**实施内容**：

1. 创建 `project_progress_tracker.xlsx`（5 个 Sheet）
2. 使用 openpyxl 生成，包含：总体概览、安卓端进度、后端进度、更新日志、里程碑概览
3. 同步分发到三个位置：Android 项目目录、后端项目目录、规划目录
4. 创建 `create_tracker.py` 脚本支持一键重新生成

**关键决策**：
- **决策20**：安卓端和后端使用独立 Sheet 而非合并，理由：两端进展差异大（安卓 55% vs 后端 100%），独立展示更真实
- **决策21**：每个 Sheet 分 A/B/C 三段（已完成/待完成/阶段计划），理由：结构清晰，便于快速定位当前状态
- **决策22**：使用 Python 脚本生成 xlsx 而非手动维护，理由：可版本控制、可自动化更新

---

## 关键技术参数汇总

| 参数 | 值 |
|------|-----|
| JDK 版本 | 21 (21.0.10) |
| Android Gradle Plugin | 8.5.2 |
| Gradle 版本 | 8.7 |
| compileSdk / targetSdk | 34 |
| minSdk | 26 |
| Spring Boot | 3.3.5 |
| MyBatis Plus | 3.5.9 |
| jjwt | 0.12.6 |
| SpringDoc | 2.6.0 |
| Hilt | 2.51.1 |
| Retrofit | 2.11.0 |
| OkHttp | 4.12.0 |
| Room | 2.6.1 |
| Glide | 4.16.0 |
| Navigation | 2.7.7 |
| MySQL | 9.7.0 |
| Redis | 3.0.504 (MSOpenTech Windows) |
| Maven | 3.9.15 |
| 数据库字符集 | utf8mb4 / utf8mb4_unicode_ci |
| 后端端口 | 8080 |
| MySQL 端口 | 3306 |
| Redis 端口 | 6379 |
| Access Token 有效期 | 15 分钟 |
| Refresh Token 有效期 | 7 天 |

---

## 全部问题汇总与经验教训

> 以下汇总了 M1~M3 阶段遇到的所有问题，按类别整理，供团队后续参考。
> 更新时间：2026-05-03
> 问题总数：13 个（致命 8 个 / 严重 2 个 / 中等 3 个）

### 一、Android Vector Drawable 颜色格式问题

**问题现象**：创建 55 个 Vector Drawable 图标后执行 `gradlew assembleDebug`，编译失败报错 `Color value must be 8 hex digits: #FF00000000`。

**分析过程**：
1. 在设计图标时，为 `fillColor` 属性使用了 `#FF00000000`（9位alpha + 6位hex = 9+6=15位格式）
2. Android 的 Vector Drawable 颜色格式要求为 `#AARRGGBB`（8位hex），不支持 9 位 alpha 前缀
3. `#FF00000000` 的本意是"完全不透明的透明色"（即全透明），正确写法应为 `#00000000`
4. 批量创建时未意识到此格式差异，导致 42 个文件受影响

**解决方案**：
1. 使用 SearchReplace 工具逐文件将 `#FF00000000` 替换为 `#00000000`
2. SearchReplace 仅替换每文件第一个匹配项，多匹配文件需用 Write 工具重写整个文件
3. 最终通过 Write 工具重写了所有受影响文件

**最终结果**：全部 55 个图标编译通过

**经验教训**：
- ⚠️ **Android Vector Drawable 颜色格式必须是 `#AARRGGBB`（8位hex），不能使用 `#FFAARRGGBB`（9+6位格式）**
- ⚠️ **透明填充应使用 `#00000000`，而非 `#FF00000000`**
- ✅ 建议：创建图标模板时先验证颜色格式，再批量复制

---

### 二、梯级徽章图标内部文字路径复制错误

**问题现象**：ic_tier_s_plus/s/a/b/c.xml 五个梯级徽章图标内部文字路径几乎完全相同，都显示为类似"S"的锯齿形状，而非各自对应的等级字母（S+/S/A/B/C）。

**分析过程**：
1. 初始设计时为 ic_tier_s.xml 创建了锯齿形路径，然后复制到其他等级文件
2. 仅修改了盾牌颜色（红/橙/金/绿/蓝），但忘记修改内部文字路径
3. ic_tier_s_plus.xml 使用了抽象菱形图案，也不符合"S+"的视觉表达
4. UI/UX 专家审核后确认：A/B/C 三个文件路径与 S 完全相同

**解决方案**：
1. 采用**描边字体风格**（strokeWidth=2.5dp, strokeColor=white）重新设计每个等级字母
2. S：S 形曲线（两段弧线连接）
3. S+：S 形曲线 + 右上角"+"号（两条交叉线段）
4. A：两条斜线 + 横杠（三角形结构）
5. B：竖线 + 上半弧 + 下半弧
6. C：开口弧线

**最终结果**：5 个梯级徽章图标各自显示正确的等级字母

**经验教训**：
- ⚠️ **复制文件后必须逐一检查所有差异化内容，不能仅修改显而易见的属性（如颜色）**
- ✅ 建议：使用模板模式时，将差异化部分用 TODO 标记，确保不遗漏

---

### 三、图标路径复制导致语义重复

**问题现象**：
- ic_sword.xml 与 ic_heroes.xml 的 pathData 完全相同（都是十字剑形）
- ic_trap.xml 与 ic_warning.xml 的 pathData 完全相同（都是三星+红星）

**分析过程**：
1. ic_heroes.xml 设计为十字剑形（代表英雄战斗），ic_sword.xml 复制了相同路径
2. ic_warning.xml 设计为三星+红星（警告），ic_trap.xml 复制了相同路径
3. 两个图标虽然语义不同（英雄 vs 剑，警告 vs 陷阱），但视觉上完全相同，用户无法区分

**解决方案**：
1. ic_sword.xml 重新设计为真正的剑形：刀刃（梯形）+ 护手（横线）+ 剑柄（竖线）+ 剑首（圆形）
2. ic_trap.xml 重新设计为陷阱形：方框 + 左右颚夹 + 顶部三角尖齿

**最终结果**：每个图标具有独特的视觉表达

**经验教训**：
- ⚠️ **不同语义的图标必须具有不同的视觉形态，即使概念相关（如"英雄"和"剑"）**
- ✅ 建议：创建图标后进行语义审核，确保每个图标在 24dp 尺寸下可被用户识别和区分

---

### 四、图标语义不匹配问题

**问题现象**：
- ic_vote_down：对角线设计，不像"投票反对"
- ic_pick_rate：笑脸设计，不匹配"选取率"概念
- ic_empty_state：星形+圆形，不像"空状态"

**分析过程**：
1. 初始设计时过于追求简洁的几何形状，忽略了图标的语义可读性
2. "投票反对"需要拇指向下的直观表达
3. "选取率"需要柱状图/排序等数据可视化表达
4. "空状态"需要空内容框/渐隐文字等"无内容"的视觉暗示

**解决方案**：
1. ic_vote_down：重新设计为拇指向下图标（手掌+手指+竖条）
2. ic_pick_rate：重新设计为柱状图+排序菱形（数据+排序概念）
3. ic_empty_state：重新设计为空内容框+渐隐文字行

**最终结果**：图标语义与功能名称一致

**经验教训**：
- ⚠️ **图标设计的第一原则是语义可读性，其次才是视觉美感**
- ✅ 建议：设计完成后进行"5秒测试"——用户能否在5秒内说出图标的含义？

---

### 五、core-ui 模块缺少 ViewBinding 和 RecyclerView 依赖

**问题现象**：创建 HeroCardAdapter 和 AugmentCardAdapter 后编译失败，报错找不到 ItemHeroCardBinding 类和 RecyclerView 类。

**分析过程**：
1. core-ui 模块的 build.gradle 未启用 ViewBinding（`buildFeatures { viewBinding true }`）
2. core-ui 模块未添加 RecyclerView 依赖
3. 根 build.gradle 也缺少 recyclerViewVersion 定义

**解决方案**：
1. core-ui/build.gradle 添加 `buildFeatures { viewBinding true }`
2. core-ui/build.gradle 添加 `implementation "androidx.recyclerview:recyclerview:$recyclerViewVersion"`
3. 根 build.gradle 添加 `recyclerViewVersion = '1.3.2'`

**最终结果**：编译通过

**经验教训**：
- ⚠️ **添加需要 ViewBinding 的组件前，先确认模块的 build.gradle 已启用 viewBinding**
- ⚠️ **使用新依赖前，先确认根 build.gradle 已定义对应版本号**
- ✅ 建议：创建新模块时一次性配置好所有可能需要的依赖和特性

---

### 六、多模块共享资源位置问题

**问题现象**：feature 模块引用 `@color/background` 等资源时编译报错"无法解析资源"。

**分析过程**：
1. 共享颜色、字符串、尺寸、主题资源仅存在于 app 模块
2. feature 模块依赖 core-ui 而非 app，无法访问 app 的资源
3. Android 资源合并机制：模块只能访问自身和依赖链上游模块的资源

**解决方案**：
1. 将所有共享资源从 app 模块迁移到 core-ui 模块
2. app 模块保留空 `<resources />` 标签供未来 app 特有资源使用
3. feature 模块通过依赖 core-ui 获取共享资源

**最终结果**：所有模块可正常访问共享资源

**经验教训**：
- ⚠️ **共享资源必须放在依赖链的最底端公共模块（如 core-ui），而非 app 模块**
- ⚠️ **Android 资源合并是单向的：模块只能访问依赖链上游的资源，不能访问下游**
- ✅ 建议：项目初始化时就确定资源放置策略，避免后期大规模迁移

---

### 七、navigation 模块无法解析 Fragment 类

**问题现象**：navigation_graph.xml 放在独立 navigation 模块中，编译报错"无法解析 Fragment 类引用"。

**分析过程**：
1. navigation 模块不依赖任何 feature 模块
2. navigation_graph.xml 中引用了 `HeroListFragment`、`AugmentListFragment` 等 feature 模块中的类
3. Gradle 依赖是单向的：navigation → core，无法反向引用 feature 中的类

**解决方案**：
1. 将 navigation_graph.xml 从 navigation 模块迁移到 app 模块
2. app 模块依赖所有 feature 模块，可以解析 Fragment 类引用
3. 从 settings.gradle 移除 `include ':navigation'`

**最终结果**：导航图编译通过

**经验教训**：
- ⚠️ **导航图必须放在依赖所有 feature 模块的模块中（通常是 app 模块）**
- ⚠️ **不要创建独立的 navigation 模块，除非它能依赖所有 feature 模块**
- ✅ 建议：Android 多模块项目的导航图统一放在 app 模块

---

### 八、library 模块缺少 AndroidManifest.xml

**问题现象**：所有 library 模块编译报错，AGP 要求每个模块必须有 AndroidManifest.xml。

**分析过程**：
1. 手动创建项目时未为 library 模块创建 AndroidManifest.xml
2. Android Gradle Plugin (AGP) 要求每个 Android Library 模块都有 manifest 文件
3. 即使模块不需要声明任何组件，也需要一个最小的 manifest

**解决方案**：为 9 个 library 模块各创建最小 AndroidManifest.xml：
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" />
```

**最终结果**：所有模块编译通过

**经验教训**：
- ⚠️ **每个 Android Library 模块必须有 AndroidManifest.xml，即使内容为空**
- ✅ 建议：创建模块时同时创建 manifest 文件，作为标准流程

---

### 九、Gradle Wrapper JAR 缺失

**问题现象**：执行 `gradlew.bat` 报错"Gradle wrapper JAR not found"。

**分析过程**：
1. 手动创建项目时仅编写了 gradle-wrapper.properties，未生成 gradle-wrapper.jar
2. Gradle wrapper 需要 JAR 文件才能启动 Gradle 运行时
3. JAR 文件是二进制文件，无法通过文本工具创建

**解决方案**：从本地 Gradle 缓存执行 `gradle wrapper --gradle-version 8.7` 生成完整的 wrapper 文件

**最终结果**：wrapper 生成成功，`gradlew.bat` 可正常执行

**经验教训**：
- ⚠️ **Gradle wrapper 的 JAR 文件是二进制文件，必须通过 `gradle wrapper` 命令生成**
- ✅ 建议：项目初始化时先安装 Gradle，再通过命令生成 wrapper

---

### 十、core-common JUnit 5 测试配置

**问题现象**：core-common 模块的 JUnit 5 测试用例无法执行。

**分析过程**：
1. core-common 使用 `java-library` 插件（非 Android 插件）
2. Gradle 默认使用 JUnit 4 平台运行测试
3. JUnit 5 需要 `useJUnitPlatform()` 配置才能被 Gradle 识别

**解决方案**：在 core-common/build.gradle 添加：
```groovy
test {
    useJUnitPlatform()
}
```

**最终结果**：17 个 JUnit 5 测试用例全部通过

**经验教训**：
- ⚠️ **java-library 模块使用 JUnit 5 时必须显式配置 `useJUnitPlatform()`**
- ✅ 建议：创建 java-library 模块时一并配置测试框架

---

### 十一、GitHub 仓库文档内容缺失与乱码

**问题现象**：项目工作区、Android 客户端、后端服务三个 GitHub 仓库的 README 文件存在内容不准确、不完整或格式问题，仓库描述（Description）存在乱码字符。

**分析过程**：
1. 项目初始化时仅创建了最基本的 README 文件，缺少安装指南、使用说明、功能特性、贡献指南等关键内容
2. 仓库描述中包含非预期字符（乱码），可能是编码问题或初始化时输入异常
3. 三个仓库的文档格式不统一，各自结构差异较大
4. 新用户无法通过 README 快速理解项目用途和参与开发

**解决方案**：
1. 为三个仓库分别重写 README.md，统一采用"项目概述→安装→使用→特性→贡献→许可证"结构
2. Android 客户端仓库补充：安装指南（JDK 21 + Android Studio）、模块架构说明、技术栈列表
3. 后端服务仓库补充：API 文档说明（SpringDoc Swagger）、部署指南、数据库配置
4. 项目工作区仓库补充：整体架构图、子项目关系、开发环境要求
5. 修正所有仓库描述为清晰的中文描述

**最终结果**：三个仓库文档完整、格式统一、描述准确

**经验教训**：
- ⚠️ **项目初始化时应同步编写完整的 README 文档，而非后期补全**
- ⚠️ **多仓库项目的文档结构应保持统一，降低维护成本**
- ✅ 建议：创建项目脚手架时使用 README 模板，确保关键章节不遗漏

---

### 十二、SearchReplace 工具单次替换限制

**问题现象**：使用 SearchReplace 工具修复 Vector Drawable 颜色格式问题时，部分文件包含多个 `#FF00000000` 匹配项，但工具仅替换第一个匹配项，导致修复不完整。

**分析过程**：
1. SearchReplace 工具的设计是仅替换第一个匹配项（first match only）
2. 部分 Vector Drawable 文件中 `#FF00000000` 出现多次（如同时用于 fillColor 和 strokeColor）
3. 逐次调用 SearchReplace 效率极低，且容易遗漏
4. 对于多匹配项文件，需要使用 Write 工具重写整个文件

**解决方案**：
1. 先用 Grep 工具搜索所有包含 `#FF00000000` 的文件，统计每个文件的匹配数
2. 单匹配文件使用 SearchReplace 一次性修复
3. 多匹配文件使用 Write 工具重写整个文件内容
4. 修复后再次 Grep 验证无遗漏

**最终结果**：42 个受影响文件全部修复完成，无遗漏

**经验教训**：
- ⚠️ **SearchReplace 工具仅替换第一个匹配项，批量替换需先评估匹配数量**
- ⚠️ **多匹配项场景应优先使用 Write 工具重写文件，而非多次 SearchReplace**
- ✅ 建议：批量修改前先用 Grep 统计匹配分布，根据结果选择最优工具策略

---

### 十三、Adaptive Icon 引用颜色资源而非 Drawable

**问题现象**：启动图标的 `ic_launcher.xml`（adaptive-icon）中 `foreground` 和 `background` 属性引用了 `@color/` 资源，而非 `@drawable/` 资源，导致编译报错。

**分析过程**：
1. Android Adaptive Icon 的 `<foreground>` 和 `<background>` 元素需要引用 Drawable 资源
2. 颜色资源（`@color/xxx`）不是 Drawable，不能直接用于 adaptive-icon
3. 初始设计时误将纯色背景当作 `@color/` 引用，未创建对应的 Drawable 资源
4. Android 资源系统对类型检查严格，`@color/` 与 `@drawable/` 不可互换

**解决方案**：
1. 创建 `ic_launcher_foreground.xml`（Vector Drawable，剑+符文星+魔法光环图案）
2. 创建 `ic_launcher_background.xml`（Vector Drawable，深蓝渐变背景）
3. 将 `ic_launcher.xml` 中的引用改为 `@drawable/ic_launcher_foreground` 和 `@drawable/ic_launcher_background`

**最终结果**：启动图标编译通过，在设备上正确显示

**经验教训**：
- ⚠️ **Adaptive Icon 的 foreground/background 必须引用 Drawable 资源，不能引用 Color 资源**
- ⚠️ **如需纯色背景，应创建一个 `<shape>` Drawable 而非直接引用颜色**
- ✅ 建议：创建 adaptive-icon 时同时创建对应的 foreground 和 background Drawable 文件

---

## 阶段完成度总结

| 里程碑 | 状态 | 完成度 | 备注 |
|--------|------|--------|------|
| M1 项目初始化 | ✅ 完成 | 100% | 脚手架+环境配置+Git仓库+文档修复 |
| M2 基础架构 | ✅ 完成 | 100% | MySQL建模+API框架+JWT认证 |
| M3 Android UI 框架 | ✅ 完成 | 100% | 核心模块+通用组件+图标+测试+文档修复 |
| M4 英雄模块 | ⏳ 待开始 | 0% | 依赖M3完成 |
| M5 强化符文模块 | ⏳ 待开始 | 0% | 依赖M4 |
| M6 社区模块 | ⏳ 待开始 | 0% | 依赖M4+M5 |
| M7 版本与公告 | ⏳ 待开始 | 0% | 依赖M4 |
| M8 个人中心 | ⏳ 待开始 | 0% | 依赖M5+M6 |
| M9 数据管线 | ⏳ 待开始 | 0% | 依赖M2 |
| M10 测试与打包 | ⏳ 待开始 | 0% | 依赖所有模块 |
| M11 本地部署验证 | ⏳ 待开始 | 0% | 依赖M10 |

### M1~M3 阶段交付物总清单

| 类别 | 交付物 | 数量 | 所属阶段 |
|------|--------|------|----------|
| 项目结构 | 11 个 Gradle 模块 + Spring Boot 后端 | 12 | M1 |
| 配置文件 | build.gradle ×12 + pom.xml + application.yml | 14 | M1 |
| 数据库 | 9 张表 + 10 个索引 + 9 个 Entity + 9 个 Mapper | 37 | M2 |
| 后端服务 | Result + GlobalExceptionHandler + SecurityConfig + JWT + AuthService + AuthController + 4 DTO | 11 | M2 |
| 图标资源 | Vector Drawable 图标 | 55 | M3 |
| 自定义 View | TierBadgeView, SearchToolbar, StatefulLayout, QualityChip, BalanceBar | 5 | M3 |
| 工具类 | PaginationScrollListener | 1 | M3 |
| Adapter | HeroCardAdapter, AugmentCardAdapter | 2 | M3 |
| UI Model | HeroUiModel, AugmentUiModel | 2 | M3 |
| 布局文件 | item_hero_card, item_augment_card, widget_search_toolbar, widget_stateful_layout | 4 | M3 |
| 数据层 | TokenStore, AppDatabase, HeroEntity, AugmentEntity, HeroDao, AugmentDao, DataModule | 7 | M3 |
| 网络层 | AuthInterceptor, TokenRefreshInterceptor, NetworkModule, AuthApi, HeroApi, AugmentApi, CommunityApi | 7 | M3 |
| 单元测试 | ResultTest, TierTest, ConstantsTest | 3 个测试类 / 17 个用例 | M3 |
| 文档 | README ×3 + 仓库描述修正 + 进度跟踪 xlsx + 项目规则文档 | 6 | M3 |
| **合计** | | **171** | |

### 关键决策索引

| 编号 | 决策摘要 | 阶段 |
|------|----------|------|
| 决策1 | 多模块架构 | M1 |
| 决策2 | core-common 使用 java-library | M1 |
| 决策3 | Gradle Groovy DSL | M1 |
| 决策4 | JWT 密钥 Base64 存储 | M1 |
| 决策5 | MySQL 绑定 127.0.0.1 | M1 |
| 决策6 | Access 15min + Refresh 7d | M1 |
| 决策7 | utf8mb4 + utf8mb4_unicode_ci | M2 |
| 决策8 | 表达式索引 (upvotes-downvotes) | M2 |
| 决策9 | 逻辑删除 @TableLogic | M2 |
| 决策10 | CORS 允许 * | M2 |
| 决策11 | Redis Jackson JSON 序列化 | M2 |
| 决策12 | SecurityFilterChain Lambda DSL | M2 |
| 决策13 | JwtFilter 注入 UserDetailsService | M2 |
| 决策14 | Tier 枚举 @SerializedName | M3 |
| 决策15 | Fragment 使用 ConstraintLayout | M3 |
| 决策16 | 底部导航使用 Vector Drawable | M3 |
| 决策17 | 共享资源放 core-ui | M3 |
| 决策18 | 导航图放 app 模块 | M3 |
| 决策19 | app 保留空 resources 标签 | M3 |
| 决策20 | 安卓/后端独立进度 Sheet | M3 |
| 决策21 | 进度 Sheet 分 A/B/C 三段 | M3 |
| 决策22 | Python 脚本生成 xlsx | M3 |
| 决策23 | 梯级徽章描边字体风格 | M3 |
| 决策24 | 功能图标默认灰色描边 | M3 |
| 决策25 | 游戏特色图标语义化颜色 | M3 |
| 决策26 | Adapter 使用 ListAdapter+DiffUtil | M3 |
| 决策27 | StatefulLayout FrameLayout 叠加 | M3 |
| 决策28 | BalanceBar Canvas 自绘 | M3 |
| 决策29 | TokenStore EncryptedSharedPreferences | M3 |
| 决策30 | Room fallbackToDestructiveMigration | M3 |
| 决策31 | TokenRefreshInterceptor 独立 OkHttpClient | M3 |
| 决策32 | API 接口返回 Result<Object> | M3 |
| 决策33 | README 使用中文编写 | M3 |
| 决策34 | 三仓库 README 结构统一 | M3 |
| 决策35 | 规则文档三级优先级体系 | M3 |
| 决策36 | 规则编号模块前缀 | M3 |
| 决策37 | 规则与问题关联矩阵 | M3 |
| 决策38 | JWT Token Type 校验 | M3 |
| 决策39 | BE-014 放置在安全规范[P0] | M3 |
| 决策40 | 对称性 type claim 设计 | M3 |

---

## 问题分类索引

> 按问题根因分类，便于快速定位同类问题的解决方案。

### A. Android 资源格式类（3 个）
- 问题一：Vector Drawable 颜色格式 #AARRGGBB 限制
- 问题十三：Adaptive Icon 必须引用 @drawable/ 而非 @color/
- 问题六：多模块共享资源位置（资源合并机制）

### B. 设计复制遗漏类（2 个）
- 问题二：梯级徽章内部文字路径复制错误
- 问题三：图标路径复制导致语义重复

### C. 设计语义类（1 个）
- 问题四：图标语义不匹配（投票/选取率/空状态）

### D. 模块依赖配置类（3 个）
- 问题五：core-ui 缺少 ViewBinding 和 RecyclerView 依赖
- 问题七：navigation 模块无法解析 Fragment 类
- 问题八：library 模块缺少 AndroidManifest.xml

### E. 构建工具类（2 个）
- 问题九：Gradle Wrapper JAR 缺失
- 问题十：core-common JUnit 5 测试配置

### F. 文档与工具类（2 个）
- 问题十一：GitHub 仓库文档内容缺失与乱码
- 问题十二：SearchReplace 工具单次替换限制

---

## 经验教训速查表

| 编号 | 教训摘要 | 关联问题 |
|------|----------|----------|
| 1 | Android 颜色格式必须 #AARRGGBB（8位） | 问题一 |
| 2 | 透明填充用 #00000000 | 问题一 |
| 3 | 复制文件后必须逐一检查差异化内容 | 问题二 |
| 4 | 不同语义图标必须有不同视觉形态 | 问题三 |
| 5 | 图标设计第一原则是语义可读性 | 问题四 |
| 6 | 添加 ViewBinding 组件前先确认模块配置 | 问题五 |
| 7 | 共享资源放依赖链最底端公共模块 | 问题六 |
| 8 | 导航图放依赖所有 feature 的模块（app） | 问题七 |
| 9 | 每个 Android Library 模块必须有 AndroidManifest.xml | 问题八 |
| 10 | Gradle wrapper JAR 必须通过命令生成 | 问题九 |
| 11 | java-library 模块 JUnit 5 需 useJUnitPlatform() | 问题十 |
| 12 | 项目初始化时同步编写完整 README | 问题十一 |
| 13 | 多仓库文档结构保持统一 | 问题十一 |
| 14 | SearchReplace 仅替换首个匹配项 | 问题十二 |
| 15 | Adaptive Icon foreground/background 必须引用 Drawable | 问题十三 |
