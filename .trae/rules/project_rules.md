# ARAM Mayhem Assistant 项目开发规则

> 版本：1.1.1
> 生效日期：2026-05-03
> 适用范围：ARAM Mayhem Assistant 全栈项目（Android 客户端 + Spring Boot 后端）
> 维护者：项目开发团队
> 变更记录：v1.1.1 基于三位专家复核评估修复阻塞发布项

---

## 第一章 总则

### 1.1 目的

本规则文档系统梳理项目开发过程中形成的规范、约定和最佳实践，旨在：

- 统一团队开发标准，减少因风格不一致导致的代码冲突和审查成本
- 固化已验证的技术决策，避免重复踩坑
- 建立可执行的质量底线，确保每个交付物达到项目要求
- 为新成员提供快速上手参考，降低项目理解门槛

### 1.2 适用对象

- Android 客户端开发人员
- Spring Boot 后端开发人员
- 全栈开发人员
- 代码审查人员
- 项目管理者

### 1.3 规则优先级

| 级别 | 标记 | 含义 | 违反后果 |
|------|------|------|----------|
| P0 | 🔴 强制 | 必须遵守，违反将导致编译失败或运行时错误 | 代码不允许合并 |
| P1 | 🟠 推荐 | 强烈建议遵守，违反可能引发潜在问题 | 代码审查时必须说明理由 |
| P2 | 🟡 建议 | 推荐遵守，可根据实际情况灵活调整 | 代码审查时建议改进 |

### 1.4 规则冲突处理

当本规则与外部框架官方文档冲突时，以官方文档为准；当本规则与项目 spec.md 冲突时，以 spec.md 为准。任何冲突均需记录至 dev-log.md 并在团队内同步。

---

## 第二章 项目架构规范

### 2.1 Android 多模块架构 [P0 🔴]

**规则 AR-001**：项目必须采用多模块架构，模块划分如下：

```
ARAM_Mayhem_Assistant/
├── app/                    # 主壳工程（Application + MainActivity + NavHost）
├── core-common/            # 纯 Java 类（Constants/Result/Tier/枚举），使用 java-library 插件
├── core-network/           # Retrofit/OkHttp/Gson + 拦截器 + API 接口
├── core-data/              # Room Database + TokenStore + Hilt DataModule
├── core-ui/                # 共享资源 + 自定义 View + Adapter + Widget
├── feature-hero/           # 英雄列表 + 详情
├── feature-augment/        # 强化符文
├── feature-community/      # 玩法社区
├── feature-bulletin/       # 公告
└── feature-profile/        # 个人中心
```

**规则 AR-002**：模块依赖方向必须单向，禁止循环依赖：

```
app → feature-* → core-* → core-common
```

feature 模块之间禁止直接依赖；core 模块之间仅允许单向依赖（如 core-network → core-common）。

**规则 AR-003**：`core-common` 模块必须使用 `java-library` Gradle 插件，不得使用 `android-library`。该模块仅包含纯 Java 类（无 Android SDK 依赖）。

### 2.2 资源放置策略 [P0 🔴]

**规则 AR-004**：共享资源（colors.xml、strings.xml、dimens.xml、themes.xml、drawable）必须放置在 `core-ui` 模块，禁止放置在 `app` 模块。

理由：feature 模块依赖 core-ui 而非 app，共享资源通过依赖链自动合并。Android 资源合并是单向的，模块只能访问依赖链上游的资源。

**规则 AR-005**：`app` 模块保留空的 `<resources />` 标签文件，供未来 app 特有资源使用，不得删除。

**规则 AR-006**：导航图（navigation_graph.xml）必须放置在 `app` 模块，禁止创建独立的 navigation 模块。

理由：app 模块依赖所有 feature 模块，可以解析 Fragment 类引用；独立模块无法做到。

注意：项目中存在已废弃的 `navigation/` 模块目录（已从 settings.gradle 移除），该目录必须删除以避免混淆。

### 2.3 模块必备文件 [P0 🔴]

**规则 AR-007**：每个 Android Library 模块必须包含 `AndroidManifest.xml`，即使内容为空：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" />
```

缺少此文件将导致 AGP 编译失败。

**规则 AR-008**：新建模块时必须同步更新以下文件：
1. `settings.gradle` — 添加 `include ':模块名'`
2. 根 `build.gradle` — 如需统一版本管理
3. 依赖该模块的上层模块 `build.gradle` — 添加 `implementation project(':模块名')`

---

## 第三章 Android 开发规范

### 3.1 Vector Drawable 规范 [P0 🔴]

**规则 AD-001**：Vector Drawable 颜色格式必须使用 `#AARRGGBB`（8位十六进制），禁止使用 9 位及以上格式。

```
✅ 正确：#FF000000（不透明黑色）、#00000000（全透明）、#80FFFFFF（半透明白色）
❌ 错误：#FF00000000（9位alpha+6位hex）、#FFF000000（9位格式）
```

**规则 AD-002**：透明填充使用 `#00000000`，禁止使用 `#FF00000000`。

**规则 AD-003**：Adaptive Icon 的 `<foreground>` 和 `<background>` 元素必须引用 `@drawable/` 资源，禁止引用 `@color/` 资源。

```xml
✅ 正确：
<foreground android:drawable="@drawable/ic_launcher_foreground" />
<background android:drawable="@drawable/ic_launcher_background" />

❌ 错误：
<foreground android:drawable="@color/launcher_bg" />
```

如需纯色背景，应创建 `<shape>` Drawable：

```xml
<!-- ic_launcher_background.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#0D1B2A" />
</shape>
```

### 3.2 图标设计规范 [P1 🟠]

**规则 AD-004**：不同语义的图标必须具有不同的视觉形态，即使概念相关。

```
❌ 错误示例：ic_sword 和 ic_heroes 使用相同的十字剑路径
✅ 正确示例：ic_heroes = 十字剑（代表英雄战斗），ic_sword = 单剑形（刀刃+护手+剑柄）
```

**规则 AD-005**：图标设计的第一原则是语义可读性，其次才是视觉美感。每个图标应通过"5秒测试"——用户能否在5秒内说出图标的含义。

**规则 AD-006**：复制文件后必须逐一检查所有差异化内容，不能仅修改显而易见的属性（如颜色）。使用模板模式时，将差异化部分用 TODO 标记。

**规则 AD-007**：图标默认颜色规范：
- 功能图标（搜索/返回/关闭等）：使用 `#757575` 灰色描边（Android 底部导航栏会自动应用 tint 着色）
- 游戏特色图标（buff/nerf/crown/fire/lightning）：使用语义化颜色（绿/红/金/橙/蓝）
- 梯级徽章图标：使用描边字体风格（2.5dp 白色描边），在 24dp 小尺寸下比填充路径更清晰

### 3.3 UI 组件开发规范 [P1 🟠]

**规则 AD-008**：RecyclerView Adapter 必须使用 `ListAdapter + DiffUtil`，禁止使用传统 `RecyclerView.Adapter`。

理由：ListAdapter 自动差量更新，列表刷新性能更优。

```java
public class HeroCardAdapter extends ListAdapter<HeroUiModel, HeroCardAdapter.ViewHolder> {
    protected HeroCardAdapter() {
        super(DIFF_CALLBACK);
    }

    private static final DiffUtil.ItemCallback<HeroUiModel> DIFF_CALLBACK =
        new DiffUtil.ItemCallback<HeroUiModel>() {
            @Override
            public boolean areItemsTheSame(@NonNull HeroUiModel oldItem, @NonNull HeroUiModel newItem) {
                return Objects.equals(oldItem.getId(), newItem.getId());
            }

            @Override
            public boolean areContentsTheSame(@NonNull HeroUiModel oldItem, @NonNull HeroUiModel newItem) {
                return oldItem.equals(newItem);
            }
        };
}
```

**规则 AD-009**：多状态布局使用 `FrameLayout` 叠加四种状态（Loading/Empty/Error/Content），而非 ViewStub。

理由：状态切换频繁时 ViewStub 的 inflate 开销反而更大。

**规则 AD-010**：自定义绘制组件（如 BalanceBar）使用 Canvas 自绘，而非多个 View 组合。

理由：自定义绘制更灵活，减少 View 层级，性能更优。

**规则 AD-011**：启用 ViewBinding 的模块必须在 `build.gradle` 中配置：

```groovy
android {
    buildFeatures {
        viewBinding true
    }
}
```

添加需要 ViewBinding 的组件前，先确认模块已启用此配置。

### 3.4 安全存储规范 [P0 🔴]

**规则 AD-012**：敏感凭证（Access Token、Refresh Token）必须使用 `EncryptedSharedPreferences` 加密存储，禁止使用普通 `SharedPreferences`。

```java
MasterKey masterKey = new MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build();

SharedPreferences prefs = EncryptedSharedPreferences.create(
        context,
        FILE_NAME,
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
);
```

### 3.5 网络层规范 [P1 🟠]

**规则 AD-013**：Token 刷新拦截器（TokenRefreshInterceptor）必须使用独立的 `OkHttpClient` 执行刷新请求，禁止使用带 AuthInterceptor 的同一个 client。

理由：避免循环调用导致死锁。

```java
private Response performRefresh(String refreshToken) throws IOException {
    OkHttpClient client = new OkHttpClient.Builder().build();
    // 使用独立 client，不携带 AuthInterceptor
    Request request = new Request.Builder()
            .url(Constants.BASE_URL + Constants.API_AUTH_REFRESH)
            .post(RequestBody.create(gson.toJson(body), JSON_MEDIA_TYPE))
            .build();
    return client.newCall(request).execute();
}
```

**规则 AD-014**：Token 刷新逻辑必须使用 `synchronized` 同步块防止并发刷新。

**规则 AD-015**：OkHttpClient 超时配置统一为：连接 30s / 读取 30s / 写入 30s。

---

## 第四章 后端开发规范

### 4.1 API 响应格式 [P0 🔴]

**规则 BE-001**：所有 API 必须返回统一响应体 `Result<T>`：

```java
{
    "code": 200,
    "message": "success",
    "data": { ... },
    "timestamp": 1714732800000
}
```

- 成功：code = 200
- 客户端错误：code = 400/401/404/409
- 服务端错误：code = 500

**规则 BE-002**：全局异常处理器必须使用 `@RestControllerAdvice`，统一处理：
- `MethodArgumentNotValidException` → 400 + 具体字段错误
- `BusinessException` → 自定义 code + message
- 未知 `Exception` → 500 + 通用错误信息

### 4.2 数据库规范 [P0 🔴]

**规则 BE-003**：所有表使用 `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`。

理由：utf8mb4 支持完整 Unicode（含 emoji），utf8mb4_unicode_ci 排序规则准确。

**规则 BE-004**：逻辑删除字段统一为 `deleted TINYINT DEFAULT 0`，配合 MyBatis Plus `@TableLogic` 注解。

**规则 BE-005**：TEXT 列禁止设置 DEFAULT 值（MySQL 严格模式不支持）。

```sql
✅ 正确：description TEXT
❌ 错误：description TEXT DEFAULT ''
```

**规则 BE-006**：热点查询字段必须创建索引。索引命名规范：`idx_{表名简写}_{字段名}`。

**规则 BE-007**：MySQL 必须绑定 `127.0.0.1`（仅本地监听），禁止绑定 `0.0.0.0`。

### 4.3 安全规范 [P0 🔴]

**规则 BE-008**：Spring Security 配置必须使用 Lambda DSL，禁止使用已废弃的 `WebSecurityConfigurerAdapter`。

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        );
    return http.build();
}
```

**规则 BE-009**：JWT 认证过滤器必须注入 `UserDetailsService` 加载完整权限，而非仅存储 userId。

理由：后续 RBAC 权限控制需要角色信息。

**规则 BE-010**：密码必须使用 BCrypt 加密存储，禁止明文或简单哈希。

**规则 BE-011**：Token 有效期配置：Access Token 15 分钟 + Refresh Token 7 天。

**规则 BE-014**：Refresh Token 刷新时必须校验 Token 的 `type` claim 为 `"refresh"`，禁止接受 `type` 为 `"access"` 的 Token。

理由：如果不校验 type，Access Token 可被滥用为 Refresh Token，导致安全漏洞。JwtTokenProvider 生成 Token 时必须设置 type claim 区分 access 和 refresh——`generateAccessToken` 必须设置 `claim("type", "access")`，`generateRefreshToken` 必须设置 `claim("type", "refresh")`，实现对称性防御纵深。

校验时序要求：type 校验必须在 `validateToken()` 成功之后执行。完整校验顺序为：(1) 签名校验 + 过期校验 → (2) type claim 校验 → (3) 用户存在性校验。type claim 不存在时视为校验失败。

此校验逻辑应放置在 `AuthService.refreshToken()` 方法中，在验证 Token 签名之后、生成新 Token 之前执行。

```java
// JwtTokenProvider 中新增方法
public String getTokenType(String token) {
    Claims claims = parseClaims(token);
    return claims.get("type", String.class);
}

// AuthService.refreshToken() 中的校验逻辑
String tokenType = jwtTokenProvider.getTokenType(refreshToken);
if (!"refresh".equals(tokenType)) {
    throw new BusinessException(401, "Invalid token type: expected 'refresh' but got '" + tokenType + "'");
}
```

### 4.4 缓存规范 [P1 🟠]

**规则 BE-012**：Redis Value 使用 Jackson JSON 序列化，禁止使用 JDK 默认序列化。

理由：可读性好、跨语言兼容、体积更小。

**规则 BE-013**：CORS 配置本地开发阶段允许 `*` Origin，生产环境必须收紧为具体的 Origin 列表（如 `https://aram.example.com`），禁止使用通配符模式。

注意：当 `allowCredentials=true` 时，必须使用 `allowedOriginPatterns("*")` 而非 `allowedOrigins("*")`，因为 Spring 不允许 `allowedOrigins("*")` 与 `allowCredentials=true` 同时使用。

```java
config.setAllowedOriginPatterns(List.of("*"));
config.setAllowCredentials(true);
```

---

## 第五章 构建与配置规范

### 5.1 Gradle 配置 [P0 🔴]

**规则 BC-001**：Gradle 使用 Groovy DSL，禁止混用 Kotlin DSL。

**规则 BC-002**：依赖版本统一在根 `build.gradle` 的 `ext {}` 块中管理，子模块通过 `$变量名` 引用，禁止硬编码版本号。

```groovy
ext {
    hiltVersion = '2.51.1'
    retrofitVersion = '2.11.0'
    okHttpVersion = '4.12.0'
    roomVersion = '2.6.1'
    recyclerViewVersion = '1.3.2'
    glideVersion = '4.16.0'
    navigationVersion = '2.7.7'
    gsonVersion = '2.11.0'
}
```

注意：项目为纯 Java 项目，不使用 Kotlin，因此不包含 `kotlinVersion`。实际 ext 块包含更多版本变量（如 compileSdkVersion、lifecycleVersion 等），以上仅列出核心依赖。

**规则 BC-003**：使用新依赖前，必须先确认根 `build.gradle` 已定义对应版本号。

### 5.2 测试配置 [P0 🔴]

**规则 BC-004**：`java-library` 模块使用 JUnit 5 时必须显式配置 `useJUnitPlatform()`：

```groovy
test {
    useJUnitPlatform()
}
```

**规则 BC-005**：Gradle Wrapper 必须通过 `gradle wrapper --gradle-version X.Y` 命令生成，禁止手动创建 wrapper JAR 文件（二进制文件无法通过文本工具创建）。

**规则 BC-006**：Room Database MVP 阶段使用 `fallbackToDestructiveMigration()`，正式发布前必须实现正确的 Migration 策略。

---

## 第六章 协作流程规范

### 6.1 文档规范 [P1 🟠]

**规则 CO-001**：项目初始化时必须同步编写完整的 README 文档，禁止后期补全。README 必须包含以下章节：

1. 项目概述
2. 安装指南
3. 使用说明
4. 功能特性
5. 贡献指南
6. 许可证信息

**规则 CO-002**：多仓库项目的文档结构必须保持统一，采用相同的章节顺序和格式。

**规则 CO-003**：README 使用中文编写（项目团队以中文为主，目标用户为中文玩家社区）。

**规则 CO-004**：GitHub 仓库描述必须清晰传达项目核心价值和用途，禁止留空或使用乱码。

### 6.2 开发日志规范 [P1 🟠]

**规则 CO-005**：每个开发阶段完成后必须更新 `dev-log.md`，记录内容包含：
- 实施内容（具体操作步骤）
- 关键决策（编号 + 摘要 + 理由）
- 遇到的问题及解决方案
- 编译验证结果

**规则 CO-006**：问题记录必须包含四要素：问题现象、分析过程、解决方案、最终结果。每个问题需标注严重程度（🔴致命/🟠严重/🟡中等）。

**规则 CO-007**：关键决策必须编号（决策1、决策2...），并在决策索引表中维护完整列表。

### 6.3 版本控制规范 [P1 🟠]

**规则 CO-008**：Git 提交信息格式：

```
[模块] 类型: 简要描述

详细说明（可选）
```

类型：feat（新功能）/ fix（修复）/ refactor（重构）/ docs（文档）/ test（测试）/ chore（构建/配置）

示例：
```
[core-ui] feat: 新增 TierBadgeView 自定义 View
[core-network] fix: 修复 TokenRefreshInterceptor 并发刷新死锁
[app] refactor: 将共享资源迁移至 core-ui 模块
```

**规则 CO-009**：禁止提交敏感信息（密钥、密码、Token）到 Git 仓库。`.gitignore` 必须覆盖：
- `*.apk`、`*.aab`、`build/`、`.gradle/`（Android）
- `target/`、`.idea/`、`*.iml`（后端）
- 含有密钥的配置文件

---

## 第七章 问题处理机制

### 7.1 问题分类与响应 [P1 🟠]

**规则 PH-001**：问题按严重程度分类处理：

| 严重程度 | 定义 | 响应时限 | 处理要求 |
|----------|------|----------|----------|
| 🔴 致命 | 编译失败或运行时崩溃 | 立即修复 | 阻塞当前开发，修复后方可继续 |
| 🟠 严重 | 功能异常或性能显著下降 | 当日修复 | 记录至 dev-log，优先级高于新功能 |
| 🟡 中等 | 体验不佳或代码质量问题 | 本迭代修复 | 记录至 dev-log，排入迭代计划 |

### 7.2 问题记录模板 [P1 🟠]

**规则 PH-002**：所有问题必须按以下模板记录至 dev-log.md：

```markdown
### 问题X：[问题标题]

**问题现象**：[具体描述问题表现，包含错误信息]

**分析过程**：
1. [第一步分析]
2. [第二步分析]
3. [根因定位]

**解决方案**：[具体修复步骤]

**最终结果**：[修复后的验证结果]

**经验教训**：
- ⚠️ [核心教训]
- ✅ [预防建议]
```

### 7.3 常见问题预防清单 [P1 🟠]

**规则 PH-003**：以下为项目已验证的高频问题，开发时必须主动检查：

| 检查项 | 规则编号 | 检查时机 |
|--------|----------|----------|
| Vector Drawable 颜色格式是否为 8 位 hex | AD-001 | 创建/修改图标后 |
| Adaptive Icon 是否引用 @drawable/ | AD-003 | 创建启动图标后 |
| 新模块是否有 AndroidManifest.xml | AR-007 | 创建新模块后 |
| 共享资源是否放在 core-ui | AR-004 | 创建新资源文件后 |
| java-library 模块是否配置 useJUnitPlatform() | BC-004 | 编写测试前 |
| 依赖版本是否在根 build.gradle 统一管理 | BC-002 | 添加新依赖前 |
| Token 是否使用 EncryptedSharedPreferences | AD-012 | 涉及凭证存储时 |
| 导航图是否在 app 模块 | AR-006 | 修改导航配置时 |
| Refresh Token 刷新是否校验 type claim | BE-014 | 实现 Token 刷新逻辑时 |

---

## 第八章 代码风格规范

### 8.1 Java 代码风格 [P1 🟠]

**规则 CS-001**：类和接口命名使用 UpperCamelCase，方法名使用 lowerCamelCase，常量使用 UPPER_SNAKE_CASE。

**规则 CS-002**：Android ViewBinding 变量命名：布局文件 `fragment_hero_list.xml` → binding 类 `FragmentHeroListBinding` → 变量名 `binding`。

**规则 CS-003**：Hilt 依赖注入使用 `@Inject` 构造器注入，禁止字段注入（`@Inject` 标注字段）。

```java
✅ 正确：构造器注入
@Singleton
public class TokenStore {
    private final SharedPreferences prefs;

    @Inject
    public TokenStore(Context context) {
        // ...
    }
}

❌ 错误：字段注入
@Singleton
public class TokenStore {
    @Inject SharedPreferences prefs; // 禁止
}
```

**规则 CS-004**：禁止添加注释，除非用户明确要求。代码应通过命名和结构自解释。

### 8.2 XML 资源命名 [P1 🟠]

**规则 CS-005**：资源文件命名规范：

| 资源类型 | 命名规则 | 示例 |
|----------|----------|------|
| 图标 | `ic_{语义}` | `ic_search.xml`、`ic_tier_s.xml` |
| 背景 | `bg_{语义}` | `bg_tier_badge.xml`、`bg_card.xml` |
| 布局-Activity | `activity_{名称}` | `activity_main.xml` |
| 布局-Fragment | `fragment_{名称}` | `fragment_hero_list.xml` |
| 布局-Item | `item_{名称}` | `item_hero_card.xml` |
| 布局-Widget | `widget_{名称}` | `widget_search_toolbar.xml` |

**规则 CS-006**：颜色资源命名规范：

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 品牌色 | `{语义}` | `primary`、`accent` |
| 功能色 | `{功能}_{语义}` | `tier_s_plus`、`quality_prismatic` |
| 通用色 | `{用途}` | `background`、`surface`、`text_primary` |

---

## 第九章 技术决策管理

### 9.1 决策记录规范 [P1 🟠]

**规则 TD-001**：所有影响架构或技术选型的决策必须记录至 dev-log.md，格式为：

```
- **决策N**：[决策摘要]，理由：[选择理由]
```

**规则 TD-002**：技术决策必须包含"理由"部分，说明为什么选择此方案而非其他方案。

**规则 TD-003**：决策编号必须连续递增，不得跳号或重复。

### 9.2 已确认的关键决策索引 [P2 🟡]

以下为 M1~M3 阶段已确认的关键决策，后续开发应遵循：

| 编号 | 决策摘要 | 核心理由 |
|------|----------|----------|
| 决策1 | 多模块架构 | feature 模块可独立编译、降低增量构建时间 |
| 决策2 | core-common 使用 java-library | 纯 Java 类无需 Android SDK |
| 决策3 | Gradle Groovy DSL | 与 tasks.md 规格一致，Groovy 生态更成熟 |
| 决策6 | Access 15min + Refresh 7d | 移动端使用频率高，短 Access 保障安全 |
| 决策7 | utf8mb4 + utf8mb4_unicode_ci | 支持完整 Unicode 含 emoji |
| 决策17 | 共享资源放 core-ui | feature 依赖 core-ui，资源通过依赖链自动合并 |
| 决策18 | 导航图放 app 模块 | app 依赖所有 feature，可解析 Fragment 类引用 |
| 决策23 | 梯级徽章描边字体风格 | 24dp 小尺寸下描边比填充更清晰 |
| 决策26 | Adapter 使用 ListAdapter+DiffUtil | 自动差量更新，列表刷新性能更优 |
| 决策29 | TokenStore EncryptedSharedPreferences | Token 是敏感凭证，需加密存储 |
| 决策31 | TokenRefreshInterceptor 独立 OkHttpClient | 避免循环调用导致死锁 |
| 决策38 | JWT Token Type 校验 | 防止 Access Token 被滥用为 Refresh Token |

---

## 第十章 工具使用规范

### 10.1 SearchReplace 工具 [P1 🟠]

**规则 TU-001**：SearchReplace 工具仅替换每文件第一个匹配项。批量替换前必须先用 Grep 统计每个文件的匹配数量分布。

**规则 TU-002**：多匹配项文件（同一模式出现 2 次及以上）应优先使用 Write 工具重写整个文件，而非多次 SearchReplace。

**规则 TU-003**：批量修改后必须再次 Grep 验证无遗漏。

### 10.2 项目初始化工具 [P1 🟠]

**规则 TU-004**：创建 Android 项目时，必须通过 `gradle wrapper` 命令生成 wrapper 文件，禁止手动创建 gradle-wrapper.jar。

**规则 TU-005**：创建新模块时，必须同时创建以下文件：
1. `build.gradle`
2. `src/main/AndroidManifest.xml`（即使是空内容）
3. 更新 `settings.gradle`
4. 更新依赖该模块的上层模块 `build.gradle`

---

## 第十一章 验证与质量保障

### 11.1 编译验证 [P0 🔴]

**规则 QA-001**：每个阶段/模块开发完成后必须执行编译验证：

- Android：`gradlew assembleDebug` → BUILD SUCCESSFUL
- 后端：`mvn clean compile -DskipTests` → BUILD SUCCESS

**规则 QA-002**：修改图标资源后必须执行全量编译验证（`gradlew assembleDebug`），而非仅检查单个文件。

### 11.2 测试验证 [P1 🟠]

**规则 QA-003**：单元测试必须覆盖核心业务逻辑和边界条件。

**规则 QA-004**：测试用例必须 100% 通过，不允许跳过失败的测试。

**规则 QA-005**：修改核心模块后必须重新运行相关测试，确保无回归。

### 11.3 交付物验证 [P1 🟠]

**规则 QA-006**：阶段交付前必须检查以下清单：

- [ ] 编译通过（无 error、无 warning）
- [ ] 单元测试全部通过
- [ ] dev-log.md 已更新（实施内容 + 决策 + 问题）
- [ ] 新增文件数量与预期一致
- [ ] 无遗留 TODO 或临时调试代码

---

## 附录 A：技术参数参考

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
| Hilt | 2.51.1 |
| Retrofit | 2.11.0 |
| OkHttp | 4.12.0 |
| Room | 2.6.1 |
| Glide | 4.16.0 |
| Navigation | 2.7.7 |
| Gson | 2.11.0 |
| MySQL | 9.7.0 |
| Redis | 3.0.504 (MSOpenTech Windows) |
| Maven | 3.9.15 |
| 数据库字符集 | utf8mb4 / utf8mb4_unicode_ci |
| 后端端口 | 8080 |
| Access Token 有效期 | 15 分钟 |
| Refresh Token 有效期 | 7 天 |

---

## 附录 B：规则与问题关联矩阵

| 规则编号 | 关联问题（dev-log） | 预防的问题类别 |
|----------|---------------------|----------------|
| AD-001 | 问题一 | Vector Drawable 颜色格式错误 |
| AD-002 | 问题一 | 透明填充格式错误 |
| AD-003 | 问题十三 | Adaptive Icon 资源类型错误 |
| AD-004 | 问题三 | 图标语义重复 |
| AD-005 | 问题四 | 图标语义不匹配 |
| AD-006 | 问题二 | 复制文件遗漏差异化内容 |
| AD-008 | — | Adapter 性能问题 |
| AD-012 | — | Token 明文存储安全风险 |
| AD-013 | — | Token 刷新死锁 |
| AR-004 | 问题六 | 共享资源无法访问 |
| AR-006 | 问题七 | 导航图无法解析 Fragment |
| AR-007 | 问题八 | 模块缺少 Manifest 编译失败 |
| BC-004 | 问题十 | JUnit 5 测试无法执行 |
| BC-005 | 问题九 | Gradle Wrapper 缺失 |
| CO-001 | 问题十一 | README 文档不完整 |
| TU-001 | 问题十二 | 批量替换遗漏 |
| BE-014 | — | JWT Token Type 校验缺失 |

---

## 版本控制信息

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| 1.0.0 | 2026-05-03 | 初始版本，基于 M1~M3 阶段开发实践总结 | 项目开发团队 |
| 1.1.0 | 2026-05-03 | 基于三位专家审核修复第一优先级问题：新增 BE-014 JWT Token Type 校验规范；修复 AD-008 DiffUtil Long 比较示例；AR-006 补充 navigation 遗留目录说明；移除不存在的 kotlinVersion；更新 gsonVersion 为 2.11.0；修复 BE-013 CORS 示例代码 | 项目开发团队 |
| 1.1.1 | 2026-05-03 | 基于三位专家复核评估修复阻塞发布项：BE-014 从4.4缓存规范移至4.3安全规范[P0]；BE-014 补充 getTokenType 方法实现和 AccessToken type claim 要求；BE-014 补充校验时序和 null 处理说明；决策索引新增决策38；PH-003 预防清单新增 BE-014 检查项 | 项目开发团队 |

---

> 本规则文档为活文档，随项目开发持续更新。任何规则变更需经团队评审后记录至版本控制信息中。
