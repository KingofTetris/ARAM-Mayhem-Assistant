# ARAM Mayhem Assistant 任务列表（Java 全栈 + JDK 21 + MySQL）

## 阶段一：项目初始化（M1）

- [x] Task 1: 项目脚手架搭建
  - [x] 1.1 使用 Android Studio 创建 Java + XML 项目（package: com.aram.mayhem，JDK 21）
  - [x] 1.2 配置 Gradle（Groovy DSL），统一管理依赖版本
  - [x] 1.3 使用 Spring Initializr 创建 Spring Boot 3.x + Maven 后端项目（Java 21）
  - [x] 1.4 配置 Git 仓库与 .gitignore（含 Android 特有：*.apk、*.aab、build/、.gradle/）
  - [x] 1.5 编写 README 开发环境说明（Android Studio 版本、JDK 21、MySQL 8.0、Redis）
  - [x] 1.6 配置 Checkstyle + SpotBugs（Android 与后端统一 Java 代码规范）

- [x] Task 2: 开发环境与工具链配置
  - [x] 2.1 配置 Gradle 多模块项目结构（app + core + feature + navigation）
  - [x] 2.2 后端配置 Maven pom.xml：Spring Boot 3.x + MyBatis Plus + Spring Security + jjwt
  - [x] 2.3 后端配置 application.yml（MySQL 连接、Redis 连接、JWT 密钥，MySQL 绑定 127.0.0.1:3306）
  - [x] 2.4 Android 配置 ViewBinding + Navigation Component + Hilt
  - [x] 2.5 配置 MySQL 8.0 数据库 + Redis 服务
  - [x] 2.6 本地网络配置：创建 Android `network_security_config.xml`（允许局域网 IP 段明文 HTTP 流量），在 `AndroidManifest.xml` 中引用 `android:networkSecurityConfig="@xml/network_security_config"`；设置 Windows 防火墙入站规则开放 8080 端口；配置路由器 DHCP 静态 IP 绑定（或开发计算机静态 IP）确保 IP 不漂移
  - [x] 2.7 在 `core-common/Constants.java` 中定义 `BASE_URL = "http://<LOCAL_PC_IP>:8080/"` 指向开发计算机局域网 IP，附带注释说明如何根据实际网络环境修改

## 阶段二：基础架构（M2）

- [x] Task 3: MySQL 数据库建模
  - [x] 3.1 编写 init.sql：tb_user、tb_hero、tb_hero_modifier、tb_augment、tb_strategy、tb_strategy_augment、tb_strategy_item、tb_vote、tb_bulletin
  - [x] 3.2 执行 SQL 建表 + 索引创建，验证表结构正确
  - [x] 3.3 编写 Spring Boot 启动时自动执行 DataInitializer 种子数据（预置英雄和强化符文）
  - [x] 3.4 创建 MyBatis Plus Entity 类（@TableName/@TableId/@TableField）+ Mapper 接口（BaseMapper）：User、Hero、HeroModifier、Augment、Strategy、Vote、Bulletin

- [x] Task 4: 后端 RESTful API 框架
  - [x] 4.1 配置 Spring MVC + WebMvcConfigurer（CORS 跨域）
  - [x] 4.2 实现统一响应体 Result<T>（code、message、data、timestamp）+ 全局异常处理器 @RestControllerAdvice
  - [x] 4.3 实现请求参数校验（@Valid + Jakarta Validation 注解）
  - [x] 4.4 配置 Spring Data Redis + RedisTemplate 缓存工具类
  - [x] 4.5 配置 SpringDoc OpenAPI（Swagger UI 访问 /swagger-ui.html）

- [x] Task 5: Spring Security + JWT 认证
  - [x] 5.1 实现 UserDetailsService + BCryptPasswordEncoder
  - [x] 5.2 实现注册接口（POST /api/auth/register）：邮箱唯一性校验 + 密码 BCrypt 加密
  - [x] 5.3 实现登录接口（POST /api/auth/login）：验证凭证 → 生成 Access Token（15min）+ Refresh Token（7d）
  - [x] 5.4 实现 JwtTokenProvider 工具类（jjwt 生成/解析/验证 Token）
  - [x] 5.5 实现 JwtAuthenticationFilter（OncePerRequestFilter 拦截请求校验 Token）
  - [x] 5.6 配置 SecurityFilterChain：放开 /api/auth/**，其余接口需认证
  - [x] 5.7 实现 Refresh Token 续期接口（POST /api/auth/refresh）

## 阶段三：Android UI 框架（M3）

- [x] Task 6: Android 核心模块搭建
  - [x] 6.1 创建 core-network 模块：Retrofit2 + OkHttp4 + Gson 配置，读 `core-common` 的 `Constants.BASE_URL` 作为动态 Base URL（本地环境指向 `http://<LOCAL_PC_IP>:8080/`）；OkHttpClient.Builder 添加 `HttpLoggingInterceptor`（仅 debug build 启用 BODY 级别日志），配置连接超时 30s / 读超时 30s
  - [x] 6.2 实现 AuthInterceptor（Interceptor 实现类，自动注入 Authorization: Bearer <token>）
  - [x] 6.3 实现 TokenRefreshInterceptor（401 自动刷新 Token + 重放请求）
  - [x] 6.4 创建 core-data 模块：Room Database 基类 + EncryptedSharedPreferences Token 存储
  - [x] 6.5 创建 core-common 模块：Result<T>、Tier 枚举、Constants
  - [x] 6.6 创建 core-ui 模块：styles.xml、colors.xml、dimens.xml 主题资源
  - [x] 6.7 创建 navigation 模块：navigation_graph.xml + BottomNavigationView 路由

- [x] Task 7: 通用 Android 组件开发
  - [x] 7.1 开发 HeroCardAdapter + ItemHeroCardBinding（RecyclerView 头像 + 名称 + TierBadge + 胜率，12dp 圆角 CardView）
  - [x] 7.2 开发 AugmentCardAdapter：品质色边框（棱彩=GradientDrawable 金紫渐变、金=金黄、银=银灰）
  - [x] 7.3 开发 TierBadgeView 自定义 View（S+/S/A/B/C 五色标签）
  - [x] 7.4 开发 SearchToolbar 搜索栏组件（TextInputLayout + TextWatcher 防抖 300ms）
  - [x] 7.5 开发 PaginationScrollListener（RecyclerView.OnScrollListener 上滑加载更多）
  - [x] 7.6 开发 StatefulLayout 通用状态切换（Loading/Empty/Error/Content 四种状态）
  - [x] 7.7 开发 QualityChip 品质 Chip 组件（棱彩=紫金、金=金色、银=银色）
  - [x] 7.8 开发 BalanceBar 平衡修正条形图自定义 View（Canvas 自绘：绿/红/灰三色 + 数值文字）

## 阶段四：英雄模块（M4）

- [x] Task 8: 英雄列表页
  - [x] 8.1 实现 HeroController（GET /api/heroes?role=&tier=&search=&page=&size=）→ 返回分页数据
  - [x] 8.2 实现 HeroService + HeroMapper（MyBatis Plus LambdaQueryWrapper 动态查询 + Redis 缓存：列表 10min）
  - [x] 8.3 Android 创建 HeroApi Retrofit 接口 + HeroDao Room 操作
  - [x] 8.4 实现 HeroRepository（Android）：先返回 Room 缓存 → 网络请求 → 更新 Room → LiveData 推送
  - [x] 8.5 开发 HeroListFragment：RecyclerView 按 Tier 分组（StickyHeader 实现）
  - [x] 8.6 开发 HeroFilterFragment/Sheet：ChipGroup 定位筛选 + 梯级筛选联动
  - [x] 8.7 开发 HeroSearchView：debounce 300ms + 搜索结果即时展示
  - [x] 8.8 离线模式检测：ConnectivityManager 监听网络状态 → 无网络时展示 Room 缓存 + Snackbar 提示

- [x] Task 9: 英雄卡片详情页
  - [x] 9.1 实现 HeroController（GET /api/heroes/{id}）→ 含 modifiers + skillOrders + builds + recommendedAugments
  - [x] 9.2 开发 HeroDetailFragment 头部：CollapsingToolbarLayout + ImageView（Glide 加载头像）+ 梯级 + 定位 Chip + 胜率/登场率
  - [x] 9.3 开发 BalanceModifierSection：BalanceBar 自定义 View 循环渲染各项修正数据
  - [x] 9.4 开发 SkillOrderSection：HorizontalScrollView + 方案卡片（LinearLayout 动态 inflate）
  - [x] 9.5 开发 BuildSection：GridLayout 出门装 + 核心三件套 LinearLayout + 后期装备 FlexibleGrid
  - [x] 9.6 开发 RecommendedAugmentsSection：按品质分组 RecyclerView

## 阶段五：强化符文模块（M5）

- [x] Task 10: 强化符文列表页
  - [x] 10.1 实现 AugmentController（GET /api/augments?quality=&synergySet=）
  - [x] 10.2 实现 AugmentService + AugmentMapper（MyBatis Plus + Redis 缓存 30min）
  - [x] 10.3 Android 创建 AugmentApi + AugmentDao + AugmentRepository
  - [x] 10.4 开发 AugmentListFragment：TabLayout 品质切换（棱彩/金/银 三 Tab）
  - [x] 10.5 开发 SynergySetFilterChips：水平 ChipGroup 九大套装筛选
  - [x] 10.6 开发 AugmentDetailDialog/BottomSheet：效果详解 + 套装归属 + 最佳英雄 RecyclerView

- [x] Task 11: 套装追踪与智能推荐
  - [x] 11.1 实现 AugmentController（GET /api/augments/synergy-progress?augmentIds=1,2,3）
  - [x] 11.2 开发 SynergyProgressSection：按套装分组 ProgressBar + 激活效果说明
  - [x] 11.3 实现 AugmentController（POST /api/augments/recommend）：body { heroId, selectedAugmentIds[] } → 评分排序列表
  - [x] 11.4 开发 AugmentRecommendFragment：Spinner 英雄下拉搜索 + RecyclerView 推荐列表 + 点击选中更新进度

## 阶段六：社区模块（M6）

- [x] Task 12: 玩法浏览页
  - [x] 12.1 实现 StrategyController（GET /api/strategies?sort=hot|latest&page=&size=）→ 含作者昵称、英雄头像、强化图标
  - [x] 12.2 实现 StrategyService：hot 按 (upvotes - downvotes) DESC，latest 按 created_at DESC
  - [x] 12.3 Android 创建 CommunityApi + StrategyRepository
  - [x] 12.4 开发 CommunityFeedFragment：RecyclerView + PaginationScrollListener 无限滚动
  - [x] 12.5 开发 StrategyCardViewHolder：英雄头像 + 昵称 + 时间 + 强化组合图标行 + 出装缩略 + 点赞数字
  - [x] 12.6 开发 StrategyDetailFragment：全文描述 + 强化列表 RecyclerView + 出装列表 RecyclerView + VoteButton

- [x] Task 13: 玩法发布与投票
  - [x] 13.1 实现 StrategyController（POST /api/strategies）→ @Valid 校验（heroId 必填、description 最少 10 字），保存后返回玩法详情
  - [x] 13.2 开发 PublishStrategyFragment：AutoCompleteTextView 英雄搜索 + 强化多选 Chip + 出装多选 Chip + EditText 文字
  - [x] 13.3 开发 ReleaseSuccessFragment：AnimationDrawable 动画 + 玩法预览卡片 + ShareIntent 分享
  - [x] 13.4 实现 VoteController（POST /api/strategies/{id}/vote）：body { voteType: "UP"/"DOWN" } → upsert 投票，更新玩法计数字段
  - [x] 13.5 开发 VoteButton 组件（ImageButton 上/下箭头）：点击变色 + 计数即时更新 + 重复点击取消

## 阶段七：版本与公告（M7）

- [x] Task 14: 公告系统与版本陷阱
  - [x] 14.1 实现 BulletinController（GET /api/bulletins?type=&page=&size=）→ 返回公告列表 + 首页最新 3 条
  - [x] 14.2 开发 BulletinCarouselView：首页 ViewPager2 + 自动轮播（Handler 5s 定时）+ PageIndicator
  - [x] 14.3 开发 BulletinListFragment：RecyclerView 按时间分组（Today/ThisWeek/Older SectionHeader）
  - [x] 14.4 实现 AdminController（管理后台接口：PUT /api/admin/heroes/{id}/trap-mark、PUT /api/admin/augments/{id}/trap-mark）→ 管理员角色校验
  - [x] 14.5 开发 VersionTrapBanner 组件（RelativeLayout 红色背景 + TextView + Warning Icon）→ 在 HeroDetailFragment 和 AugmentDetailDialog 顶部动态插入
  - [x] 14.6 开发 StrongLevelExplainFragment：ScrollView 展示梯级标准说明 + 数据来源 + 更新频率文字

## 阶段八：个人中心（M8）

- [x] Task 15: 个人中心
  - [x] 15.1 实现 UserController（GET /api/users/me/profile）→ 返回昵称、头像、投稿数、获赞总数
  - [x] 15.2 实现 UserController（PATCH /api/users/me）→ 更新 displayMode / notificationEnabled
  - [x] 15.3 Android 创建 ProfileApi + ProfileRepository
  - [x] 15.4 开发 ProfileFragment：CircleImageView 头像 + 昵称 + 统计 CardView（投稿数/获赞数）+ ListView 功能入口
  - [x] 15.5 开发 SettingsFragment：SwitchCompat 极简模式/通知开关 → DataStore 存储 + VM 更新
  - [x] 15.6 开发 MyStrategiesFragment：RecyclerView 我的投稿 + ItemTouchHelper 滑动删除 + AlertDialog 确认
  - [x] 15.7 退出登录：清除 EncryptedSharedPreferences Token + 重启 MainActivity + 登录对话框

## 阶段九：数据管线（M9）

- [ ] Task 16: 数据采集与同步
  - [ ] 16.1 实现 RiotDataDragonClient（RestTemplate / WebClient 调用 Data Dragon API，解析英雄 JSON）
  - [ ] 16.2 实现 AramDataCollector（RestTemplate 拉取 U.GG / ARAMMayhem 页面数据，Jsoup 解析 HTML）
  - [ ] 16.3 实现 DataAggregatorService：多源数据清洗（去重、缺值填充 0、胜率范围校验 0-100%）
  - [ ] 16.4 实现 MultiSourceValidator：交叉验证（两源胜率 diff > 5% → 标记低置信度 confidence_level=LOW）
  - [ ] 16.5 实现 DataSyncScheduler（@Scheduled cron = "0 0 */6 * * ?" 每 6 小时执行全量同步）
  - [ ] 16.6 实现 CacheWarmupService：同步完成后调用 Redis（预热 Top 50 英雄详情 + 强化符文列表）

## 阶段十：测试与打包（M10）

- [ ] Task 17: 测试
  - [ ] 17.1 Android Repository 单元测试（JUnit5 + Mockito：模拟 Api/ Dao，验证缓存玩法）
  - [ ] 17.2 Android ViewModel 单元测试（LiveData TestObserver 验证状态变化）
  - [ ] 17.3 Android UI 测试（Espresso：验证 HeroListFragment 渲染 + 筛选点击 + 详情跳转）
  - [ ] 17.4 后端 Service 层单元测试（JUnit5 + Mockito：Mock Repository 验证业务逻辑）
  - [ ] 17.5 后端 Controller 集成测试（@SpringBootTest + MockMvc：全链路 CRUD + 认证流程）
  - [ ] 17.6 端到端测试（Espresso：启动 App → 浏览英雄 → 查看详情 → 登录 → 发布玩法 → 点赞）

- [ ] Task 18: 打包、混淆与本地 APK 产出
  - [ ] 18.1 配置 ProGuard rules.pro：keep Retrofit interface、Room @Entity、Gson @SerializedName 类
  - [ ] 18.2 集成 LeakCanary（debugImplementation 仅 debug 生效）
  - [ ] 18.3 APK 包体积优化：Lint 检查 + shrinkResources true + WebP 图片格式
  - [ ] 18.4 生成 Release keystore + 配置 signingConfigs（storeFile/storePassword/keyAlias/keyPassword）
  - [ ] 18.5 构建 Debug APK（`./gradlew assembleDebug`）→ 通过 `adb install -r <apk_path>` 安装到个人手机
  - [ ] 18.6 构建 Release APK（`./gradlew assembleRelease`）→ `adb install -r` 真机验证无 crash
  - [ ] 18.7 后端编译打包：`mvn clean package -DskipTests` → 产出 `target/aram-server-1.0.0.jar`
  - [ ] 18.8 后端本地启动脚本：编写 `start-server.bat`（Windows）批处理文件，一键执行 `java -jar aram-server-1.0.0.jar --spring.profiles.active=local`

## 阶段十一：本地部署验证（新增）

- [ ] Task 19: 本地端到端部署验证
  - [ ] 19.1 环境就绪检查清单验证：JDK 21 / MySQL 8.0 / Redis / Maven / ADB 全部可用，MySQL 库 `aram_mayhem` 存在
  - [ ] 19.2 启动后端服务 → 验证 `http://localhost:8080/actuator/health` 返回 `{"status":"UP"}` → 验证 `http://localhost:8080/swagger-ui.html` 可访问
  - [ ] 19.3 防火墙验证：确认 Windows 防火墙 8080 端口入站规则已生效，允许局域网流量
  - [ ] 19.4 手机侧网络连通性：手机浏览器访问 `http://<PC_IP>:8080/actuator/health` → 返回 `{"status":"UP"}`
  - [ ] 19.5 安装 APK 到手机 → 冷启动 App → 首页数据从本地后端加载成功（非空白、非错误）
  - [ ] 19.6 完整用户流程验证：注册 → 登录 → 浏览英雄列表/详情 → 查看强化符文 → 发布玩法 → 投票 → 个人中心
  - [ ] 19.7 离线模式验证：开启飞行模式 → 英雄列表使用 Room 缓存展示 → Snackbar 显示离线提示
  - [ ] 19.8 Wi-Fi 切换恢复验证：关闭 Wi-Fi → App 显示离线 → 重新连接 Wi-Fi → App 自动恢复数据刷新
  - [ ] 19.9 数据持久化验证：注册账号 → 发布一条玩法 → 停止后端 → 重启后端 → 登录同一账号 → 玩法仍存在
  - [ ] 19.10 本地数据库备份脚本：编写 `backup-mysql.bat`，执行 `mysqldump -u root -p aram_mayhem > backup/aram_backup_%date%.sql`

# Task Dependencies
- Task 3~5 依赖 Task 1~2（基础架构依赖项目初始化）
- Task 6~7 依赖 Task 1~2（Android UI 框架依赖项目初始化）
- Task 8~9 依赖 Task 3,6~7（英雄模块依赖数据库 + Android UI）
- Task 10~11 依赖 Task 3,6~7（强化模块依赖数据库 + Android UI）
- Task 12~13 依赖 Task 3~5,6~7（社区模块依赖数据库 + 认证 + Android UI）
- Task 14 依赖 Task 3,6~7（公告模块依赖数据库 + Android UI）
- Task 15 依赖 Task 5,6~7（个人中心依赖认证 + Android UI）
- Task 16 依赖 Task 3,4（数据管线依赖数据库 + 基础 API）
- Task 17~18 依赖所有前置任务
- Task 19 依赖 Task 17~18（本地部署验证依赖测试与打包全部完成）

# 并行化建议
- Task 3,4,5（后端 Java）可与 Task 6,7（Android Java）完全并行
- Task 8~9（英雄模块）与 Task 10~11（强化符文模块）可部分并行
- Task 14（公告）与 Task 15（个人中心）可并行
- Task 16（数据管线）可与前端模块并行开发
- **本地部署并行路径**：Task 2.6（本地网络配置）完成之后，即可在开发过程中持续在真机上验证各模块功能（非等全部完成后才测试），实现"开发一个模块、手机验证一个模块"的迭代节奏
