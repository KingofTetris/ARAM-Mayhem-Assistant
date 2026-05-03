# ARAM Mayhem Assistant（海克斯大乱斗信息差助手）Android 原生 App 规格说明

## Why

英雄联盟海克斯大乱斗（Hextech ARAM）玩家面临英雄选择、强化符文决策、出装适配、阵容搭配等多重信息差痛点。现有工具多为峡谷模式设计，缺少ARAM专属的平衡修正、强化符文推荐和节奏玩法指导。本App旨在打造一款Android原生APK应用，成为ARAM玩家的一站式智能辅助工具，在30秒内帮助玩家做出最优决策。

## What Changes

- 从零构建ARAM专属知识库与智能推荐引擎
- 实现英雄梯级展示、ARAM平衡修正可视化、强化符文推荐、出装指导、阵容分析五大核心功能
- 支持社区玩法投稿与投票的UGC生态
- 提供版本变更追踪与"版本陷阱"智能提醒
- 基于 `design_pictures/` 下的UI设计图例复刻并增强界面
- 前后端统一使用 Java + JDK 21，后端数据库采用 MySQL

## Impact

- Affected specs: 全新项目，无已有specs影响
- Affected code: 全新项目，涉及 Android 客户端（Java）、Spring Boot 后端 API 服务、MySQL + Redis 数据库、数据采集管线

***

## ADDED Requirements

### Requirement: 首页（Home）

系统应提供首页作为App入口，展示核心导航与快捷入口。

#### Scenario: 首页默认加载

- **WHEN** 用户打开App
- **THEN** 系统展示包含英雄推荐、强化符文热榜、版本公告轮播、快捷功能入口的首页

#### Scenario: 首页搜索入口

- **WHEN** 用户在首页点击搜索
- **THEN** 系统展示全局搜索界面，支持英雄名、强化符文名、玩法关键词搜索

***

### Requirement: 英雄列表与梯级展示（Heroes）

系统应展示ARAM模式下所有英雄的强度梯级、胜率和专属平衡修正数据。

#### Scenario: 英雄列表浏览

- **WHEN** 用户进入英雄列表页
- **THEN** 系统以梯级（S+ / S / A / B / C）分组展示英雄卡片，每张卡片包含英雄头像、名称、胜率、梯级标签

#### Scenario: 英雄列表筛选

- **WHEN** 用户在英雄列表页使用筛选器
- **THEN** 系统支持按定位（法师/射手/坦克/战士/刺客/辅助）、梯级、名称排序筛选

#### Scenario: 英雄列表搜索

- **WHEN** 用户在英雄列表页输入关键词
- **THEN** 系统实时过滤匹配的英雄名称

***

### Requirement: 卡牌详情（Card Detail）

系统应为每个英雄提供完整的详情卡片，包含核心数据与ARAM专属信息。

#### Scenario: 卡片基础信息

- **WHEN** 用户点击英雄卡片进入详情
- **THEN** 系统展示英雄头像、称号、定位标签、当前梯级、胜率、登场率

#### Scenario: ARAM平衡修正展示

- **WHEN** 用户查看英雄详情
- **THEN** 系统以可视化条形图展示该英雄的ARAM专属修正（伤害输出、承伤、治疗、护盾、韧性、技能急速等），buff为绿色、nerf为红色、无修正为灰色

#### Scenario: 技能加点推荐

- **WHEN** 用户查看英雄详情
- **THEN** 系统展示主流技能加点方案及各方案的登场率、胜率对比

#### Scenario: 出装推荐

- **WHEN** 用户查看英雄详情
- **THEN** 系统展示推荐出门装、核心三件套、后期装备池，标注每件装备的登场率和胜率

#### Scenario: 强化符文推荐

- **WHEN** 用户查看英雄详情
- **THEN** 系统按品质（棱彩/金/银）展示该英雄的最优强化符文推荐，包含社区投票得分

***

### Requirement: 强化符文系统（Augments）

系统应提供完整海克斯强化符文数据库与智能推荐功能。

#### Scenario: 强化符文列表

- **WHEN** 用户进入强化符文页
- **THEN** 系统按品质（棱彩/金/银）分组展示所有强化符文，包含图标、名称、效果描述、适用英雄

#### Scenario: 强化符文详情

- **WHEN** 用户点击强化符文卡片
- **THEN** 系统展示强化效果详解、套装归属、最佳搭配英雄、玩家评分

#### Scenario: 套装进度追踪

- **WHEN** 用户在游戏中已选择特定套装的强化
- **THEN** 系统可视化当前套装收集进度，提示还缺几件可激活效果

#### Scenario: 智能强化推荐

- **WHEN** 用户输入当前英雄和已选强化
- **THEN** 系统基于英雄适配度和套装进度推荐最优强化选择

***

### Requirement: 玩法社区（Strategy Community）

系统应支持玩家发布、浏览和投票ARAM玩法方案。

#### Scenario: 玩法浏览

- **WHEN** 用户进入推荐/玩法页
- **THEN** 系统展示社区投稿的玩法方案，按热度/时间排序，包含英雄、强化组合、出装路线

#### Scenario: 玩法发布

- **WHEN** 用户点击发布玩法
- **THEN** 系统展示玩法编辑表单，支持选择英雄、搭配强化符文、编写出装路线和文字说明

#### Scenario: 玩法发布成功

- **WHEN** 用户提交玩法
- **THEN** 系统校验内容后发布，展示发布成功反馈页面

#### Scenario: 玩法投票

- **WHEN** 用户浏览玩法详情
- **THEN** 系统支持点赞/点踩投票，影响玩法排序权重

***

### Requirement: 公告与版本信息（Bulletin & Version）

系统应提供版本更新公告与"版本陷阱"预警。

#### Scenario: 公告列表

- **WHEN** 用户进入公告页或首页公告区
- **THEN** 系统展示按时间排序的版本更新公告、英雄/强化调整通知

#### Scenario: 版本陷阱提醒

- **WHEN** 英雄或强化在新版本中被大幅削弱
- **THEN** 系统在该英雄/强化的相关页面展示醒目的"版本陷阱"警告标识

#### Scenario: 强度等级说明

- **WHEN** 用户查看强度等级说明页
- **THEN** 系统解释梯级划分标准（God Tier/S+ \~ C Tier）、数据来源、更新频率

***

### Requirement: 个人中心（Player Interface）

系统应提供用户个人设置与偏好管理。

#### Scenario: 个人资料

- **WHEN** 用户进入个人中心
- **THEN** 系统展示头像、昵称、投稿数、获赞数等个人数据

#### Scenario: 偏好设置

- **WHEN** 用户修改偏好
- **THEN** 系统支持设置默认显示模式（新手极简/进阶完整）、内容语言、通知开关

***

## 技术架构选型

### 前端：Android 原生（Java + JDK 21）

| 类别     | 选型                                               | 说明                                   |
| ------ | ------------------------------------------------ | ------------------------------------ |
| 语言     | Java 21                                          | 与后端统一，JDK 21 LTS                     |
| 最低 API | API 26 (Android 8.0)                             | 覆盖率 > 95%                            |
| UI 框架  | XML Layout + ViewBinding                         | Java 原生最成熟的 UI 方案                    |
| 架构模式   | MVVM + Repository                                | ViewModel + LiveData + Repository 分层 |
| 依赖注入   | Hilt (Dagger)                                    | 支持 Java 注解式 DI                       |
| 导航     | Jetpack Navigation Component                     | XML 导航图 + BottomNavigationView       |
| 网络层    | Retrofit2 + OkHttp4 + Gson                       | Java 行业标准组合                          |
| 本地存储   | Room                                             | Android 官方 ORM，支持 Java 注解            |
| KV 存储  | SharedPreferences / DataStore                    | Token 与偏好设置                          |
| 图片加载   | Glide                                            | Java 生态最成熟的图片库                       |
| 异步     | RxJava3 或 LiveData + Executor                    | ViewModel 协作用途，Schedulers 管理线程       |
| 安全     | EncryptedSharedPreferences + Keystore + ProGuard | JWT 安全存储、代码混淆                        |

### Android 项目模块结构

```
ARAMMayhemAssistant/
├── app/                          # 主壳工程（Application + MainActivity + NavHost）
├── core/
│   ├── core-network/             # Retrofit/OkHttp 配置 + JWT 拦截器
│   ├── core-data/                # Room 数据库基类 + SharedPreferences 工具
│   ├── core-ui/                  # 通用自定义 View + 主题 styles/themes
│   ├── core-common/              # 常量、Result 封装、枚举（Tier/Quality）
│   └── core-domain/              # 跨 Feature 共享的 Domain 模型
├── feature/
│   ├── feature-auth/             # 登录/注册（LoginActivity + RegisterActivity）
│   ├── feature-home/             # 首页（HomeFragment + ViewModel）
│   ├── feature-hero/             # 英雄列表 + 详情（HeroListFragment + HeroDetailFragment）
│   ├── feature-augment/          # 强化符文（AugmentListFragment + AugmentDetailFragment）
│   ├── feature-community/        # 玩法社区（CommunityFeedFragment + PublishStrategyFragment）
│   └── feature-profile/          # 个人中心（ProfileFragment + SettingsFragment）
└── navigation/                   # 跨模块导航图 + 路由常量
```

### 后端：Spring Boot 3.x + Java 21

| 类别     | 选型                                       | 说明                                          |
| ------ | ---------------------------------------- | ------------------------------------------- |
| 语言     | Java 21                                  | JDK 21 LTS，虚拟线程可用                           |
| 框架     | Spring Boot 3.x                          | 企业级后端框架                                     |
| Web 层  | Spring MVC (RESTful)                     | 统一响应格式 `{ code, message, data, timestamp }` |
| ORM    | MyBatis Plus 3.5+                        | Lambda 链式查询、自动分页、代码生成器                      |
| 数据库    | MySQL 8.0                                | 主数据库                                        |
| 缓存     | Spring Data Redis + Redis                | 热点数据缓存、榜单                                   |
| 安全     | Spring Security + JWT (jjwt)             | 无状态认证                                       |
| 定时任务   | @Scheduled + Spring TaskScheduler        | 数据同步调度                                      |
| API 文档 | SpringDoc OpenAPI (Swagger)              | 前后端联调文档                                     |
| 构建工具   | Maven                                    | Java 标准构建工具                                 |
| 参数校验   | Jakarta Validation + Hibernate Validator | @Valid 自动校验                                 |

### 数据源

- Riot Games Data Dragon API（英雄基础数据、头像、技能图标）
- 社区维护的 ARAM 胜率数据集（U.GG / MetaBot / ARAMMayhem）
- 自建数据库（用户、玩法、投票数据）

### 部署（仅限本地开发环境）

本项目的目标部署模式为**纯本地开发与个人使用**，不上架任何应用商店，不采购专用服务器。

| 组件             | 部署位置               | 说明                                                 |
| -------------- | ------------------ | -------------------------------------------------- |
| Android APK    | 开发者个人移动设备          | 通过 ADB 安装或 USB 文件传输直接安装，不发布到 Google Play / 国内应用商店  |
| Spring Boot 后端 | 开发者本地计算机（开发机）      | 直接 `java -jar` 或 `mvn spring-boot:run` 启动，不部署到云服务器 |
| MySQL 8.0      | 开发者本地计算机           | 本地安装的 MySQL 实例，无需云数据库                              |
| Redis          | 开发者本地计算机           | 本地安装的 Redis 实例，用于缓存                                |
| 静态资源（英雄头像、图标等） | 本地存储 / Riot CDN 直连 | 本地缓存或直接引用 Riot Data Dragon 官方 URL                  |

#### 网络架构（本地局域网模式）

```
-- 用户表
CREATE TABLE tb_user (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
    nickname    VARCHAR(50),
    avatar_url  VARCHAR(500),
    display_mode VARCHAR(20) DEFAULT 'FULL' COMMENT 'SIMPLE/FULL',
    notification_enabled TINYINT(1) DEFAULT 1,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 英雄表
CREATE TABLE tb_hero (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    title       VARCHAR(100),
    image_url   VARCHAR(500),
    tier        VARCHAR(10) COMMENT 'S_PLUS/S/A/B/C',
    roles       VARCHAR(200) COMMENT 'JSON数组：角色标签',
    win_rate    DECIMAL(5,2),
    pick_rate   DECIMAL(5,2),
    ban_rate    DECIMAL(5,2),
    kda_avg     DECIMAL(5,2),
    is_version_trap TINYINT(1) DEFAULT 0,
    data_version VARCHAR(20) COMMENT '数据来源版本号',
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ARAM平衡修正表
CREATE TABLE tb_hero_modifier (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    hero_id     BIGINT NOT NULL,
    modifier_type VARCHAR(30) COMMENT 'DAMAGE_DEALT/DAMAGE_TAKEN/HEALING/SHIELDING/TENACITY/ABILITY_HASTE/ENERGY_REGEN',
    value       DECIMAL(5,3) DEFAULT 1.000 COMMENT '倍率，1.0=无修正',
    direction   VARCHAR(10) COMMENT 'BUFF/NERF/NEUTRAL'
);

-- 强化符文表
CREATE TABLE tb_augment (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    image_url   VARCHAR(500),
    quality     VARCHAR(20) COMMENT 'PRISMATIC/GOLD/SILVER',
    description TEXT,
    effect_detail TEXT,
    synergy_set VARCHAR(50) COMMENT '套装归属',
    is_version_trap TINYINT(1) DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 玩法表
CREATE TABLE tb_strategy (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_id   BIGINT NOT NULL,
    hero_id     BIGINT NOT NULL,
    description TEXT,
    tags        VARCHAR(500) COMMENT 'JSON数组',
    upvotes     INT DEFAULT 0,
    downvotes   INT DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 玩法-强化关联表
CREATE TABLE tb_strategy_augment (
    strategy_id BIGINT NOT NULL,
    augment_id  BIGINT NOT NULL,
    PRIMARY KEY (strategy_id, augment_id)
);

-- 玩法-装备关联表
CREATE TABLE tb_strategy_item (
    strategy_id BIGINT NOT NULL,
    item_id     VARCHAR(50) NOT NULL COMMENT 'Riot Item ID',
    item_name   VARCHAR(100),
    item_image  VARCHAR(500),
    PRIMARY KEY (strategy_id, item_id)
);

-- 投票表
CREATE TABLE tb_vote (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    strategy_id BIGINT NOT NULL,
    vote_type   VARCHAR(10) COMMENT 'UP/DOWN',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_strategy (user_id, strategy_id)
);

-- 公告表
CREATE TABLE tb_bulletin (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    content     TEXT,
    type        VARCHAR(20) COMMENT 'UPDATE/NERF/BUFF/EVENT',
    version     VARCHAR(20),
    cover_url   VARCHAR(500),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 网络配置要求

1. **WiFi 局域网**：Android 设备与开发计算机必须连接至同一 WiFi 路由器，处于相同子网（如 192.168.1.0/24）
2. **IP 地址固定**：
   - 建议在路由器中为开发计算机设置 DHCP 静态 IP 绑定，或在开发计算机上配置静态 IP
   - Android 客户端 `BASE_URL` 设置为开发计算机的局域网 IP（如 `http://192.168.1.100:8080`）
3. **Windows 防火墙**：开放入站端口 8080（TCP），确保仅限局域网访问
4. **Android 明文流量**：由于本地服务器不配置 HTTPS，Android 需启用明文 HTTP 流量：
   - `AndroidManifest.xml` 添加 `android:usesCleartextTraffic="true"`，或
   - 创建 `network_security_config.xml` 允许特定局域网 IP 段的明文流量
5. **CORS 配置**：后端 Spring Boot 的 CORS 允许来源设置为 `*`（本地开发阶段），生产可收紧为具体 IP

#### 本地环境安全考量

| 安全层  | 措施                                               | 说明                                       |
| ---- | ------------------------------------------------ | ---------------------------------------- |
| 网络安全 | 仅局域网暴露端口 8080                                    | Windows 防火墙限制来源 IP 为局域网网段，公网无法访问         |
| 认证安全 | Spring Security + JWT（jjwt）+ BCrypt              | Token 15min 过期 + Refresh Token 7d 续期机制保留 |
| 数据安全 | MySQL 仅绑定 localhost (127.0.0.1)                  | 关闭外部访问，Redis 同样仅本地监听                     |
| 传输安全 | 本地 HTTP 明文                                       | 局域网内无需 HTTPS；若日后扩需，可自签证书或使用 mkcert       |
| 应用安全 | EncryptedSharedPreferences + Keystore + ProGuard | JWT 安全存储、代码混淆完整保留                        |
| 备份安全 | 定期手动导出 MySQL 数据                                  | 推荐使用 mysqldump 定期备份到本地安全位置               |

***

## 本地开发环境要求

### 开发计算机软件清单

| 软件                      | 最低版本                                 | 用途                   | 安装验证命令                           |
| ----------------------- | ------------------------------------ | -------------------- | -------------------------------- |
| Java JDK                | 21 LTS（Oracle / OpenJDK / Azul Zulu） | 前后端 Java 编译与运行       | `java --version` → 21.x.x        |
| Android Studio          | Hedgehog (2023.1.1) 或更新              | Android APK 开发 IDE   | 启动 Android Studio → Help → About |
| Android SDK             | API 26+ (Android 8.0)                | 编译目标 API             | SDK Manager → SDK Platforms 标签页  |
| Android SDK Build-Tools | 34.0.0+                              | APK 构建               | SDK Manager → SDK Tools 标签页      |
| IntelliJ IDEA           | 2023.2+ (Community/Ultimate)         | Spring Boot 后端开发 IDE | Help → About                     |
| MySQL                   | 8.0.x                                | 主数据库                 | `mysql --version`                |
| Redis                   | 7.x（Windows 通过 WSL2 或 Memurai）       | 缓存服务                 | `redis-cli ping` → PONG          |
| Maven                   | 3.9.x                                | 后端构建工具               | `mvn --version`                  |
| Git                     | 2.40+                                | 版本控制                 | `git --version`                  |
| ADB                     | Android SDK 自带                       | 手机调试与 APK 安装         | `adb version`                    |

#### Windows 平台特殊说明

- **Redis for Windows**：官方不支持 Windows，推荐以下两种方案：
  1. 使用 WSL2 安装 Ubuntu → `sudo apt install redis-server` → 通过 `localhost:6379` 访问
  2. 使用第三方 Windows 移植版 Memurai（免费开发版）或 TPoradowski 的 Redis for Windows
- **MySQL 8.0 for Windows**：使用 MySQL Installer for Windows（MSI 安装包），选择 "Server only" 安装模式

### 目标移动设备要求

| 配置项     | 要求                     | 设置路径                      |
| ------- | ---------------------- | ------------------------- |
| 操作系统    | Android 8.0（API 26）及以上 | 设置 → 关于手机 → Android 版本    |
| 开发者选项   | 已启用                    | 设置 → 关于手机 → 连续点击"版本号"7次   |
| USB 调试  | 已启用                    | 设置 → 开发者选项 → USB 调试（开启）   |
| 无线调试    | 已启用（推荐，避免反复插拔）         | 设置 → 开发者选项 → 无线调试（开启）     |
| 安装未知应用  | 允许通过 USB/文件管理器安装       | 设置 → 安全 → 未知来源（或"安装未知应用"） |
| WiFi 连接 | 与开发计算机同一局域网            | 设置 → WLAN → 连接目标 WiFi     |

#### 无线调试配对（Android 11+，免 USB 线）

```bash
# 1. 手机：开发者选项 → 无线调试 → 使用配对码配对设备
# 2. PC 终端执行：
adb pair <手机IP>:<配对端口> <配对码>
# 3. 连接成功后：
adb connect <手机IP>:<连接端口>
# 4. 验证：
adb devices
# 期望输出：<设备IP>:<端口>    device
```

***

## 本地部署实施流程

### 第一步：环境就绪验证

1. 确认开发计算机上 JDK 21、MySQL 8.0、Redis、Maven、Android Studio、ADB 全部安装并可用
2. 确认 MySQL 建库成功：`CREATE DATABASE aram_mayhem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
3. 确认 Redis 启动并可连接：`redis-cli ping` → `PONG`
4. 确认 ADB 可识别手机：`adb devices` → 显示设备序列号

### 第二步：启动后端服务

```bash
cd backend/
mvn clean package -DskipTests
java -jar target/aram-server-1.0.0.jar
# 或开发模式：
mvn spring-boot:run
```

验证：浏览器访问 `http://localhost:8080/swagger-ui.html`，确认 API 文档页正常加载。

### 第三步：配置 Android 客户端网络地址

在 Android 项目的 `core-common` 模块中，修改 `Constants.java`：

```java
public static final String BASE_URL = "http://192.168.1.100:8080/"; // 替换为开发计算机局域网 IP
```

### 第四步：编译安装 APK 到设备

```bash
cd android/
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

或通过 Android Studio：Run → Run 'app' → 选择目标设备。

### 第五步：连通性验证

在手机上启动 App，执行以下操作验证连通性：

1. 打开 App → 首页正常加载数据（非空白/非错误页）
2. 进入英雄列表页 → 列表数据正常展示
3. 注册/登录 → 返回 JWT Token → 个人中心正常加载
4. `adb logcat -s "OkHttp"` 查看网络请求日志，确认 HTTP 200

***

## 本地调试指南

### Android 端调试

| 调试方式      | 工具/命令                                                | 用途              |
| --------- | ---------------------------------------------------- | --------------- |
| Logcat 日志 | `adb logcat -s "ARAM:*"` 或 Android Studio Logcat 面板  | 查看 App 运行时日志    |
| 网络请求调试    | OkHttp `HttpLoggingInterceptor` 设为 `BODY`            | 打印完整 HTTP 请求/响应 |
| 断点调试      | Android Studio → Attach Debugger to Android Process  | 逐行调试 Java 代码    |
| 布局检查      | Android Studio → Layout Inspector                    | 实时查看 View 层级与属性 |
| 数据库调试     | Android Studio → App Inspection → Database Inspector | 查看 Room 本地数据库内容 |
| 网络状态模拟    | `adb shell cmd connectivity airplane-mode` 或开发者选项模拟  | 测试离线模式          |

### 后端调试

| 调试方式        | 工具/命令                                                                   | 用途                |
| ----------- | ----------------------------------------------------------------------- | ----------------- |
| IDE 远程调试    | IntelliJ → Run → Debug 'Application'，设置断点                               | 逐行调试后端 Java 代码    |
| API 手动测试    | Postman / IntelliJ HTTP Client（.http 文件）                                | 手动发送请求验证 API      |
| Swagger UI  | `http://localhost:8080/swagger-ui.html`                                 | 可视化 API 文档 + 在线测试 |
| SQL 监控      | MyBatis Plus 配置 `log-impl: org.apache.ibatis.logging.stdout.StdOutImpl` | 打印实际执行的 SQL       |
| Actuator 端点 | `http://localhost:8080/actuator/health`                                 | 验证服务健康状态          |
| Redis 监控    | `redis-cli monitor`                                                     | 实时查看 Redis 命令执行   |

### 移动设备—服务器连通性调试

```bash
# 1. 从手机 ping 开发计算机（Android Terminal 或 Termux）
ping 192.168.1.100

# 2. 检查开发计算机端口监听状态
netstat -an | findstr :8080

# 3. 查看开发计算机 Windows 防火墙规则
netsh advfirewall firewall show rule name=all | findstr 8080

# 4. 从手机浏览器测试 API（验证网络层连通）
# 手机浏览器打开：http://192.168.1.100:8080/actuator/health

# 5. 抓包分析（高级）
# 开发计算机启动 Wireshark / Fiddler，过滤 tcp.port == 8080
```

***

## 本地部署成功标准

### 连通性验证指标

| 验证项    | 预期结果                                        | 验证方法                                 |
| ------ | ------------------------------------------- | ------------------------------------ |
| 网络连通   | 手机可 ping 通开发计算机 IP                          | 手机 Termux `ping -c 4 <PC_IP>`，丢包率 0% |
| 端口可达   | 手机可访问 `http://<PC_IP>:8080/actuator/health` | 手机浏览器访问 → 返回 `{"status":"UP"}`       |
| API 可用 | App 内 Retrofit 请求返回 HTTP 200                | `adb logcat` 中 OkHttp 日志显示 200       |
| 数据持久化  | 注册用户后重启后端，数据仍存在                             | 注册 → 停后端 → 重启后端 → 用该账号登录成功           |
| 缓存工作   | Redis 中存在缓存键                                | `redis-cli KEYS "hero:*"` 返回非空列表     |

### 功能完整性验证

| 功能   | 验收标准                    | 测试方式                     |
| ---- | ----------------------- | ------------------------ |
| 首页加载 | 打开 App 后 2 秒内展示首页内容     | 冷启动 App，人工计时             |
| 英雄列表 | 所有英雄按梯级分组展示，筛选/搜索正常     | 浏览列表 → 切换筛选 → 搜索关键词      |
| 英雄详情 | 详情页包含平衡修正条、技能加点、出装、强化推荐 | 点击任一英雄卡片 → 滚动查看所有区域      |
| 强化符文 | 按品质三 Tab 切换，套装筛选联动      | 切换棱彩/金/银 Tab → 选择套装 Chip |
| 用户认证 | 注册 → 登录 → 个人中心加载        | 完成完整注册登录流程               |
| 玩法发布 | 选择英雄 + 强化 + 装备 → 发布成功   | 填写表单 → 提交 → 成功页展示        |
| 玩法投票 | 点赞/点踩计数即时更新             | 点赞 → 数字 +1 → 再点 → 恢复     |
| 离线模式 | 断网后展示缓存数据 + 离线提示        | 飞行模式 → 重新打开英雄列表          |

### 稳定性验证

| 指标     | 阈值               | 验证方法                                              |
| ------ | ---------------- | ------------------------------------------------- |
| 冷启动时间  | < 2 秒            | 杀进程 → 重新打开，Logcat 记录 ActivityManager Displayed 时间 |
| 列表滚动帧率 | 无肉眼可见卡顿          | RecyclerView 快速滑动英雄列表                             |
| 内存占用   | < 200MB（前台运行）    | `adb shell dumpsys meminfo com.aram.mayhem`       |
| 后端持续运行 | 24 小时不崩溃/不内存泄漏   | 启动后端后隔夜 → 次日发送请求仍有响应                              |
| 并发请求   | 10 次并发 API 调用无超时 | Postman Collection Runner 或 JMeter 简单并发           |

***

## 用户界面设计规范

### 色彩体系

基于 design\_pictures 图例提取品牌色：

- 主色调：深蓝/暗色系（游戏电竞风格）
- 强调色：金色/棱彩色（对应强化品质系统）
- 功能色：绿色（胜率优秀 / buff 修正）、红色（版本陷阱 / nerf 修正 / 警告）、灰色（数据不可用 / 无修正）

### 字体层级（sp，适配 Android 可缩放单位）

- 页面标题：20sp 粗体
- 卡片标题：16sp 中粗
- 正文/数据：14sp 常规
- 辅助说明：12sp 浅色

### 组件规范

- 英雄卡片：圆角矩形卡片（12dp），RecyclerView Item，包含头像 + 名称 + 梯级标签 + 胜率
- 梯级标签：S+（金边）、S（银边）、A（铜边）、B/C（灰边）——通过 Shape Drawable 实现
- 强化符文卡片：按品质色（棱彩=金紫渐变、金=金色、银=银色）边框
- 底部导航栏：首页、英雄、强化、社区、我的（5 Tab，BottomNavigationView）

***

## 数据结构设计

### MySQL 核心表

```sql
-- 用户表
CREATE TABLE tb_user (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
    nickname    VARCHAR(50),
    avatar_url  VARCHAR(500),
    display_mode VARCHAR(20) DEFAULT 'FULL' COMMENT 'SIMPLE/FULL',
    notification_enabled TINYINT(1) DEFAULT 1,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 英雄表
CREATE TABLE tb_hero (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    title       VARCHAR(100),
    image_url   VARCHAR(500),
    tier        VARCHAR(10) COMMENT 'S_PLUS/S/A/B/C',
    roles       VARCHAR(200) COMMENT 'JSON数组：角色标签',
    win_rate    DECIMAL(5,2),
    pick_rate   DECIMAL(5,2),
    ban_rate    DECIMAL(5,2),
    kda_avg     DECIMAL(5,2),
    is_version_trap TINYINT(1) DEFAULT 0,
    data_version VARCHAR(20) COMMENT '数据来源版本号',
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ARAM平衡修正表
CREATE TABLE tb_hero_modifier (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    hero_id     BIGINT NOT NULL,
    modifier_type VARCHAR(30) COMMENT 'DAMAGE_DEALT/DAMAGE_TAKEN/HEALING/SHIELDING/TENACITY/ABILITY_HASTE/ENERGY_REGEN',
    value       DECIMAL(5,3) DEFAULT 1.000 COMMENT '倍率，1.0=无修正',
    direction   VARCHAR(10) COMMENT 'BUFF/NERF/NEUTRAL'
);

-- 强化符文表
CREATE TABLE tb_augment (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    image_url   VARCHAR(500),
    quality     VARCHAR(20) COMMENT 'PRISMATIC/GOLD/SILVER',
    description TEXT,
    effect_detail TEXT,
    synergy_set VARCHAR(50) COMMENT '套装归属',
    is_version_trap TINYINT(1) DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 玩法表
CREATE TABLE tb_strategy (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_id   BIGINT NOT NULL,
    hero_id     BIGINT NOT NULL,
    description TEXT,
    tags        VARCHAR(500) COMMENT 'JSON数组',
    upvotes     INT DEFAULT 0,
    downvotes   INT DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 玩法-强化关联表
CREATE TABLE tb_strategy_augment (
    strategy_id BIGINT NOT NULL,
    augment_id  BIGINT NOT NULL,
    PRIMARY KEY (strategy_id, augment_id)
);

-- 玩法-装备关联表
CREATE TABLE tb_strategy_item (
    strategy_id BIGINT NOT NULL,
    item_id     VARCHAR(50) NOT NULL COMMENT 'Riot Item ID',
    item_name   VARCHAR(100),
    item_image  VARCHAR(500),
    PRIMARY KEY (strategy_id, item_id)
);

-- 投票表
CREATE TABLE tb_vote (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    strategy_id BIGINT NOT NULL,
    vote_type   VARCHAR(10) COMMENT 'UP/DOWN',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_strategy (user_id, strategy_id)
);

-- 公告表
CREATE TABLE tb_bulletin (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    content     TEXT,
    type        VARCHAR(20) COMMENT 'UPDATE/NERF/BUFF/EVENT',
    version     VARCHAR(20),
    cover_url   VARCHAR(500),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 关键索引

```sql
ARAMMayhemAssistant/
├── app/                          # 主壳工程（Application + MainActivity + NavHost）
├── core/
│   ├── core-network/             # Retrofit/OkHttp 配置 + JWT 拦截器
│   ├── core-data/                # Room 数据库基类 + SharedPreferences 工具
│   ├── core-ui/                  # 通用自定义 View + 主题 styles/themes
│   ├── core-common/              # 常量、Result 封装、枚举（Tier/Quality）
│   └── core-domain/              # 跨 Feature 共享的 Domain 模型
├── feature/
│   ├── feature-auth/             # 登录/注册（LoginActivity + RegisterActivity）
│   ├── feature-home/             # 首页（HomeFragment + ViewModel）
│   ├── feature-hero/             # 英雄列表 + 详情（HeroListFragment + HeroDetailFragment）
│   ├── feature-augment/          # 强化符文（AugmentListFragment + AugmentDetailFragment）
│   ├── feature-community/        # 玩法社区（CommunityFeedFragment + PublishStrategyFragment）
│   └── feature-profile/          # 个人中心（ProfileFragment + SettingsFragment）
└── navigation/                   # 跨模块导航图 + 路由常量
```

***

## 开发里程碑

| 阶段                 | 内容                                                                                   | 依赖     |
| ------------------ | ------------------------------------------------------------------------------------ | ------ |
| M1 - 项目初始化         | Android 项目脚手架（Java）、Spring Boot 后端项目、MySQL + Redis 配置、本地开发环境验证                       | 无      |
| M2 - 基础架构          | MySQL 建表 + MyBatis Plus Entity/Mapper、RESTful API 框架、Spring Security + JWT 认证、本地网络配置 | M1     |
| M3 - Android UI 框架 | 主题系统、BottomNavigation 导航、通用 Adapter + ViewHolder 组件                                  | M1     |
| M4 - 英雄模块          | 英雄列表（含筛选/搜索）、详情卡片、ARAM 修正可视化                                                         | M2, M3 |
| M5 - 强化符文模块        | 强化列表、详情、套装追踪、智能推荐                                                                    | M2, M3 |
| M6 - 社区模块          | 玩法浏览、发布表单、发布成功反馈、点赞投票                                                                | M2, M3 |
| M7 - 版本与公告         | 公告轮播/列表、版本陷阱标记、强度说明页                                                                 | M2, M3 |
| M8 - 个人中心          | 用户资料、偏好设置、投稿管理                                                                       | M2, M3 |
| M9 - 数据管线          | Riot API 数据采集、定时同步、Redis 缓存玩法                                                        | M2     |
| M10 - 测试与打包        | 单元/集成/UI 测试、代码混淆、APK 签名与本地产出                                                         | All    |
| M11 - 本地部署验证       | 手机—服务器连通性、端到端功能、离线模式、稳定性验证                                                           | M10    |

***

## 质量保障措施

- 代码规范：Checkstyle + SpotBugs（Android & 后端 Java）、EditorConfig 统一缩进
- 后端测试：JUnit5 + Mockito + Spring Boot Test（单元与集成测试）
- Android 测试：JUnit5 + Mockito（单元）、Espresso（UI 测试）
- 安全：Spring Security + BCrypt + JWT + HTTPS + EncryptedSharedPreferences + ProGuard
- 性能：Android Profiler + LeakCanary（内存泄漏）、Spring Boot Actuator + Micrometer（后端监控）
- 数据质量：多源交叉验证 + 数据新鲜度标识 + 置信度评分

