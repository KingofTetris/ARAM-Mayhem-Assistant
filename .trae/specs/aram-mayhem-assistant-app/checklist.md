# ARAM Mayhem Assistant 检查清单（Java 全栈 + JDK 21 + MySQL）

## 项目初始化（M1）
- [ ] Android Studio 项目成功创建，Java + XML Layout 模板编译通过，JDK 21 配置正确
- [ ] Gradle Groovy DSL 多模块结构正确：app + core/{network,data,ui,common,domain} + feature/{auth,home,hero,augment,community,profile} + navigation
- [ ] Spring Initializr 生成的 Spring Boot 3.x + Maven 后端项目可启动（mvn spring-boot:run），端口 8080
- [ ] Git 仓库初始化，.gitignore 覆盖 *.apk、*.aab、build/、.gradle/、target/、.idea/、*.iml
- [ ] Checkstyle + SpotBugs 配置文件就位，Android 与后端共享同一规则
- [ ] README 包含 JDK 21、Android Studio、MySQL 8.0、Redis 的安装与配置步骤

### 本地开发环境验证（M1 附加）
- [ ] `java --version` → 21.x.x，`JAVA_HOME` 环境变量指向 JDK 21
- [ ] Android Studio Help → About → 版本 >= Hedgehog (2023.1.1)，SDK Manager 中 API 26+ 和 Build-Tools 34+ 已安装
- [ ] IntelliJ IDEA 已安装并可正常启动
- [ ] `mysql --version` → 8.0.x，MySQL 服务已启动（Windows Services 中 MySQL80 状态为"正在运行"）
- [ ] MySQL 库 `aram_mayhem` 已创建：`CREATE DATABASE aram_mayhem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
- [ ] MySQL `bind-address = 127.0.0.1`（仅本地监听，不暴露到外部网络）
- [ ] Redis 启动并可连接：`redis-cli ping` → `PONG`（WSL2 或 Memurai 均可）
- [ ] `mvn --version` → 3.9.x
- [ ] `git --version` → 2.40+
- [ ] `adb version` → 正常输出版本号

### 目标手机设备验证（M1 附加）
- [ ] 手机 Android 版本 >= 8.0（API 26）
- [ ] 开发者选项已启用（"版本号"连续点击 7 次确认）
- [ ] USB 调试已开启
- [ ] `adb devices` → 列出设备序列号 + `device`（非 `unauthorized`）
- [ ] 无线调试已配置（Android 11+ 推荐）：`adb connect <手机IP>` 或配对码配对成功
- [ ] 手机已连接与开发计算机相同的 WiFi 网络

## 基础架构（M2）
- [ ] init.sql 包含全部 9 张表：tb_user / tb_hero / tb_hero_modifier / tb_augment / tb_strategy / tb_strategy_augment / tb_strategy_item / tb_vote / tb_bulletin
- [ ] 表结构在 MySQL 中正确创建，字段类型、COMMENT、DEFAULT 值符合设计
- [ ] 全部索引（idx_hero_tier / idx_hero_name / idx_augment_quality / idx_strategy_hero / idx_strategy_hot / idx_vote_strategy / idx_bulletin_type / idx_bulletin_time）生效
- [ ] MyBatis Plus Entity 类字段与数据库列一一对应，@TableName、@TableId、@TableField 注解正确，Mapper 接口继承 BaseMapper<T>
- [ ] DataInitializer（ApplicationRunner 实现类）启动时成功预置基础英雄和强化符文种子数据
- [ ] Result<T> 统一响应体：`{ "code": 0, "message": "success", "data": {...}, "timestamp": ... }` 格式一致
- [ ] @RestControllerAdvice 全局异常处理器捕获常见异常（MethodArgumentNotValidException → 400、EntityNotFound → 404、通用 Exception → 500）
- [ ] @Valid + Jakarta Validation 注解（@NotBlank/@Email/@Size）生效，非法输入返回 400 + 具体字段错误
- [ ] RedisTemplate 可正常 set/get/del，缓存工具类 CacheUtil 封装常用操作
- [ ] Swagger UI 可访问 http://localhost:8080/swagger-ui.html，列出所有 API 端点
- [ ] 注册接口（POST /api/auth/register）：重复邮箱返回 409，密码 BCrypt 哈希后入库
- [ ] 登录接口（POST /api/auth/login）：正确密码返回 Access Token + Refresh Token，错误密码返回 401
- [ ] JWT Token 包含 userId + email 声明，15min 过期后解析失败返回 401
- [ ] JwtAuthenticationFilter 正确拦截未认证请求 → 返回 401，已认证请求 → SecurityContext 设置 Authentication
- [ ] Refresh Token 续期接口：有效 refreshToken → 返回新 Access Token + Refresh Token，过期 → 返回 401
- [ ] 用户信息接口（GET /api/users/me）需 JWT 认证，返回当前登录用户数据
- [ ] 用户更新接口（PATCH /api/users/me）可修改 displayMode / notificationEnabled

### 本地网络配置验证（M2 附加）
- [ ] Android 项目 `app/src/main/res/xml/network_security_config.xml` 已创建，`<domain-config>` 允许局域网 IP 段（如 `192.168.1.0/24`）的明文 HTTP 流量
- [ ] `AndroidManifest.xml` 中 `android:networkSecurityConfig="@xml/network_security_config"` 已引用上述配置
- [ ] Windows 防火墙入站规则已添加：端口 8080 (TCP)，作用域限制为"本地子网"，非"所有 IP"
- [ ] 开发计算机局域网 IP 固定：已配置静态 IP 或路由器 DHCP 静态绑定
- [ ] `core-common/Constants.java` 中 `BASE_URL` 正确指向开发计算机局域网 IP（非 `localhost` 或 `127.0.0.1`）
- [ ] 手机浏览器可访问 `http://<PC_IP>:8080/actuator/health` → 返回 `{"status":"UP"}` （验证网络层连通）
- [ ] 后端 CORS `WebMvcConfigurer.addCorsMappings` 已配置 `allowedOrigins("*")`（本地阶段）

## Android UI 框架（M3）
- [ ] core-network：Retrofit.Builder baseUrl 可动态设置，GsonConverterFactory 配置，OkHttpClient 含 logging interceptor
- [ ] AuthInterceptor：从 EncryptedSharedPreferences 读取 Token → 注入 Authorization Header，无 Token 时跳过
- [ ] TokenRefreshInterceptor：401 响应 → 并发锁（AtomicBoolean）防止多请求同时刷新 → 刷新成功自动重放原始请求
- [ ] core-data：Room.databaseBuilder 基类，EncryptedSharedPreferences 封装（MasterKeys.AES256_GCM）
- [ ] core-common：Result<T>（Success/Error/Loading）、Tier 枚举（S_PLUS/S/A/B/C）、Quality 枚举（PRISMATIC/GOLD/SILVER）、Constants（BASE_URL）
- [ ] core-ui：colors.xml（primary/secondary/accent + 功能色）、styles.xml（AppTheme）、dimens.xml（间距/圆角）
- [ ] navigation_graph.xml 包含所有 Fragment 路由 + BottomNavigationView 5 个 Tab 的 action
- [ ] HeroCardAdapter：CardView 12dp 圆角，Glide 加载头像，TierBadgeView 显示梯级颜色，胜率百分比渲染
- [ ] AugmentCardAdapter：GradientDrawable 按品质动态设置边框（栈形渐变 棱彩/纯色 金/银）
- [ ] TierBadgeView：onDraw Canvas 绘制圆角矩形 + 文字，S+ 金色/S 银色/A 铜色/B 灰色/C 灰色
- [ ] SearchToolbar：TextInputLayout + TextInputEditText，TextWatcher 300ms debounce via Handler.postDelayed
- [ ] PaginationScrollListener：findLastVisibleItemPosition >= totalItemCount - threshold → loadMore()
- [ ] StatefulLayout：FrameLayout 内含 4 个 RelativeLayout（loading/empty/error/content），showState(State) 切换可见性
- [ ] QualityChip：AppCompatButton + ShapeAppearance 圆角 16dp，棱彩=紫金背景、金=金色背景、银=灰色背景
- [ ] BalanceBar：Canvas drawRoundRect，0~value 按 пропорция fill，绿/红/灰三色 + drawText 数值

## 英雄模块（M4）
- [ ] HeroController：GET /api/heroes?role=MAGE&tier=S&search=bran&page=1&size=20 组合参数正确过滤
- [ ] HeroService：MyBatis Plus LambdaQueryWrapper 动态构建查询（role IN、tier =、name LIKE %?%），Page<T> + IPage 分页
- [ ] Redis 缓存英雄列表：key = "hero:list:{hash(params)}"，TTL 10min
- [ ] HeroApi Retrofit 接口方法签名与后端 API 匹配（@GET、@Query 注解）
- [ ] HeroDao Room 操作：@Insert(onConflict=REPLACE) / @Query("SELECT * FROM heroes WHERE tier=:tier") / @Query("SELECT * FROM heroes WHERE name LIKE '%' || :keyword || '%'") / @Query("DELETE FROM heroes")
- [ ] Android HeroRepository：loadHeroes() → networkBoundResource（先 LiveData<Room> → fetchFromNetwork → saveToRoom → emit new Room LiveData）
- [ ] HeroListFragment RecyclerView + StickyHeaderItemDecoration（Tier 分组标题固定吸顶）
- [ ] ChipGroup 筛选联动：选中 Mage Chip → 过滤 role=MAGE → 同时梯级 Chip 可选 → 列表即时刷新
- [ ] 搜索 debounce 300ms：输入 "brand" → 300ms 后调 api → 展示结果；快速删除文字 → 取消前次请求
- [ ] 离线模式：ConnectivityManager.isActiveNetworkMetered → false → 仅 Room 查询 + Snackbar "当前处于离线模式"
- [ ] HeroController GET /api/heroes/{id}：JOIN hero_modifier 返回修正列表 + JOIN 子查询返回 skillOrders/builds/recommendedAugments
- [ ] HeroDetailFragment CollapsingToolbarLayout：hero_name 标题，ImageView parallax 效果
- [ ] 平衡修正区：LinearLayout 动态 addView(new BalanceBar(context, modifier))，循环渲染 7 项修正
- [ ] SkillOrder 区 HorizontalScrollView：LinearLayout 动态 inflate skill_order_card.xml × N 方案
- [ ] Build 区：GridLayoutManager spanCount=3 出门装 RecyclerView + LinearLayoutManager horizontal 核心装 + StaggeredGridLayoutManager 后期装
- [ ] 关联强化推荐区：NestedScrollView 内 RecyclerView（每组棱彩/金/银 SectionHeader）

## 强化符文模块（M5）
- [ ] AugmentController GET /api/augments?quality=PRISMATIC&synergySet=STACKOSAURUS：动态构建查询条件
- [ ] AugmentListFragment TabLayout：棱彩 Tab（选中紫金 indicator）、金 Tab（金色）、银 Tab（银色）自定义 TabView
- [ ] ChipGroup 套装筛选：九大套装名称（叠叠乐/赌徒/钱雨/救护车/全自动/自爆/雪球日/鞭炮/大法师），选中 Chip 背景高亮
- [ ] AugmentDetailDialog：View argment_detail_dialog，setText 效果详解 + 套装归属文字 + RecyclerView 最佳英雄头像
- [ ] SynergyProgress API：增 IDs → 查出所有 augment → 按 synergySet 分组 → 计算每组的 count/total + 激活阈值
- [ ] SynergyProgressSection：ProgressBar（setMax total, setProgress count）+ TextView "X/Y 件 → {激活效果}"
- [ ] Recommend API：POST body { "heroId":1, "selectedAugmentIds":[2,5] } → Service 计算（hero 适配权重 × 0.6 + synergy 补全权重 × 0.4）→ 按 score DESC 返回 Top 10
- [ ] AugmentRecommendFragment：英雄 Spinner（ArrayAdapter Filterable 搜索）+ RecyclerView + item click → 更新 selected Augments → 实时刷新底部 SynergyProgressSection

## 社区模块（M6）
- [ ] StrategyController GET /api/strategies?sort=hot&page=1&size=20：Page<Strategy> → DTO 含 author.nickname + hero.name + hero.imageUrl + augment icons
- [ ] CommunityFeedFragment SwipeRefreshLayout + RecyclerView + 滚动到底自动加载下一页（ProgressBar footer）
- [ ] StrategyCardViewHolder：布局含昵称 TextView + 时间（DateUtils.getRelativeTimeSpanString）+ 强化图标 FlowLayout + 出装缩略 + 点赞数
- [ ] StrategyDetailFragment：ScrollView 含描述全文 + 强化 RecyclerView（icon+name）+ 装备 RecyclerView（icon+name）+ VoteButton
- [ ] PublishStrategyFragment：AutoCompleteTextView（ArrayAdapter<String> heroes，2字符触发）+ ChipGroup 强化选择 + ChipGroup 出装选择 + EditText 文字（TextWatcher 实时字数统计）
- [ ] 提交校验：heroId empty → Toast "请选择英雄"；description.length() < 10 → EditText.setError "至少10个字"
- [ ] ReleaseSuccessFragment：AnimationDrawable start + 卡片预览 + ShareCompat.IntentBuilder "分享我的ARAM玩法"
- [ ] 未登录拦截：Fragment.onCreate → authRepository.isLoggedIn() == false → NavController.navigate(R.id.login)
- [ ] VoteController POST：同一 user+strategy upsert（ON DUPLICATE KEY UPDATE vote_type），同时事务更新 strategy.upvotes/downvotes
- [ ] VoteButton：upvote ImageButton onClick → API call → 成功：setColorFilter Green + count + 1；重复点击 → 取消投票 → setColorFilter null + count - 1

## 版本与公告（M7）
- [ ] BulletinController GET /api/bulletins?type=version&page=1&size=10：type 非空过滤 + createdAt DESC 排序
- [ ] BulletinCarouselView：ViewPager2 Adapter(FragmentStateAdapter) 3页 + Handler.postDelayed 5s auto scroll + TabLayoutMediator PageIndicator
- [ ] BulletinListFragment：列表按 createdAt 分组（今天>本周>更早 SectionHeaderItemDecoration），条目 CardView onClick → 公告详情 WebView/ScrollView
- [ ] AdminController @PreAuthorize("hasRole('ADMIN')") 保护，PUT trap-mark 修改 is_version_trap = 1，同时记录 version_trap_since 字段
- [ ] VersionTrapBanner：visibility=VISIBLE if hero.isVersionTrap，RelativeLayout 红底白字 + "⚠ 该英雄在{v}版本被大幅削弱，慎用！"
- [ ] StrongLevelExplainFragment：内容区域 ScrollView → 梯级定义（S+ 胜率>55%...）+ 数据源链接（ClickableSpan）+ 更新频率

## 个人中心（M8）
- [ ] UserController GET /api/users/me/profile：JOIN COUNT strategies + SUM upvotes → DTO { nickname, avatarUrl, strategiesCount, totalUpvotes }
- [ ] ProfileFragment：CircleImageView（Glide, 80dp）+ 昵称 + 统计卡片（CardView Elevation 4dp, GridLayout 2列）+ RecyclerView 功能列表（偏好设置/我的投稿/公告/强度说明/关于/退出登录）
- [ ] SettingsFragment：SwitchCompat × 2（极简模式/通知开关），SharedPreferences 持久化
- [ ] MyStrategiesFragment：ItemTouchHelper.SimpleCallback(0, LEFT) → onSwiped → AlertDialog "确认删除？" → YES → API DELETE + adapter.removeItem + Room delete
- [ ] 退出登录：prefs.edit().remove("access_token").remove("refresh_token").apply() + Room clearAllTables + Intent(LoginActivity) + finishAffinity()

## 数据管线（M9）
- [ ] RiotDataDragonClient：RestTemplate GET "https://ddragon.leagueoflegends.com/cdn/{version}/data/zh_CN/champion.json" → Jackson ObjectMapper 解析 → List<HeroDTO>
- [ ] AramDataCollector：RestTemplate GET U.GG/ARAMMayhem pages → Jsoup.parse → select tier-list rows → extract name/tier/win%/pick%/modifiers
- [ ] DataAggregatorService：Stream distinct by name → winRate null → BigDecimal.ZERO → winRate < 0 || > 100 → filter out (log warning)
- [ ] MultiSourceValidator：两个源 winRate diff abs > 5% → hero.setConfidenceLevel("LOW")；≤ 5% → "HIGH"
- [ ] DataSyncScheduler：@Scheduled(cron = "0 0 */6 * * *") → log start/end/duration → try-catch 失败发送告警日志
- [ ] CacheWarmupService：syncSuccessEvent → 查出 hero ORDER BY pick_rate DESC LIMIT 50 → forEach Redis SETEX "hero:detail:{id}" 1800 value

## 测试与打包（M10）
- [ ] Android HeroRepositoryTest：Mock HeroApi + HeroDao → verify 先调用 dao.getAll → fetchFromNetwork → dao.insertAll → LiveData 更新
- [ ] Android HeroListViewModelTest：observeForever → setSearchQuery("brand") → assert loading → assert success list size > 0
- [ ] Espresso HeroListTest：onView(withId(R.id.recycler)).check(matches(isDisplayed())) → onView(withText("法师")).perform(click()) → filtered list visible
- [ ] 后端 HeroServiceTest：Mock HeroMapper → verify LambdaQueryWrapper + Page<T> → assert IPage content size = expected
- [ ] 后端 AuthControllerIT：@SpringBootTest(webEnvironment=RANDOM_PORT) + TestRestTemplate → register → login → verify JWT → access protected endpoint 200
- [ ] Espresso EndToEnd：MainActivity → BottomNav heroes tab → click HeroCard → HeroDetail scroll → back → BottomNav community → login flow → publish → success screen → back
- [ ] ProGuard rules.pro：-keep class com.aram.**.api.** { *; } / -keep @androidx.room.Entity class * / -keep @com.google.gson.annotations.SerializedName class *
- [ ] LeakCanary：debug 构建运行 5min → LeakCanary notification 无泄漏报告
- [ ] Release APK size < 15MB（shrinkResources + proguard + webp + remove unused alt resources）
- [ ] APK 签名：jarsigner -verify release.apk → "jar verified"
- [ ] Debug APK：`adb install -r app-debug.apk` → 手机安装成功，无 INSTALL_FAILED 错误
- [ ] Release APK：`adb install -r app-release.apk` → 手机安装成功
- [ ] 后端 JAR：`java -jar aram-server-1.0.0.jar` → Tomcat started on 8080 → curl localhost:8080/actuator/health → {"status":"UP"}
- [ ] 后端启动脚本 `start-server.bat` 可一键启动服务，窗口关闭后优雅退出
- [ ] 数据库备份脚本 `backup-mysql.bat` 可成功导出 `.sql` 文件

## 本地部署验证（M11 新增）
- [ ] 手机端 `ping <PC_IP>` → 0% 丢包（验证同网段网络连通）
- [ ] 手机浏览器 `http://<PC_IP>:8080/actuator/health` → `{"status":"UP"}`
- [ ] App 冷启动 → 首页 2 秒内加载完毕，数据来自本地后端
- [ ] App 内网络异常处理：保持 PC 连 Wi-Fi 但停止后端 → App 显示错误状态提示（非 crash）
- [ ] 用户注册 → 验证数据库中 `tb_user` 表新增记录，密码为 BCrypt 密文
- [ ] 用户登录 → EncryptedSharedPreferences 存储 JWT → 重启 App 仍保持登录态
- [ ] 英雄列表页：按梯级分组 StickyHeader 正确吸顶，筛选切换即时响应
- [ ] 英雄详情页：ARAM 修正条形图颜色正确（buff=绿/nerf=红/neutral=灰），技能加点、出装、强化推荐区域均正常
- [ ] 强化符文页：TabLayout 三品质切换正常，套装 Chip 筛选联动正确
- [ ] 玩法社区：浏览玩法列表 → 发布新玩法（含英雄/强化/装备选择）→ 发布成功后可在列表中看到
- [ ] 点赞/点踩：点击后计数器即时更新，重复点击取消投票
- [ ] 公告轮播：ViewPager2 5 秒自动切换，PageIndicator 同步联动
- [ ] 版本陷阱标记：标记为陷阱的英雄在详情页顶部展示红色警告横幅
- [ ] 个人中心：头像/昵称/统计数据正确展示，偏好设置可持久化
- [ ] 退出登录：清除 Token + Room 数据 → 跳转登录页
- [ ] 飞行模式 → 英雄列表从 Room 缓存加载 → Snackbar 显示"当前处于离线模式"
- [ ] 关闭飞行模式 → 重新连接 Wi-Fi → App 自动刷新数据（非手动重试）
- [ ] 停止后端 → 重启后端 → 数据完整（用户/玩法/投票均保留）
- [ ] 后端连续运行 24 小时 → 不 OOM、不崩溃、日志无异常
- [ ] `adb shell dumpsys meminfo com.aram.mayhem` → App 前台内存 < 200MB
