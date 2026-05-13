# Git 提交问题清单与规范

> 版本：1.0.0
> 编制日期：2026-05-14
> 适用范围：ARAM Mayhem Assistant 全栈项目

---

## 第一部分：Git 提交失败问题清单

### 问题记录

| 编号 | 日期 | 仓库 | 失败类型 | 具体原因 | 错误信息 | 解决方案 | 预防措施 |
|------|------|------|----------|---------|---------|---------|----------|
| G-01 | 2026-05-14 | 任务仓库 | 网络连接失败 | GitHub 网络不可达 | `Connection reset by peer` | 检查网络连接，等待恢复后重试 | 配置可靠的 VPN 或代理 |
| G-02 | 2026-05-14 | Android 仓库 | 网络连接失败 | GitHub 网络不可达 | `Connection reset by peer` | 检查网络连接，等待恢复后重试 | 配置可靠的 VPN 或代理 |
| G-03 | 2026-05-14 | 后端仓库 | 网络连接失败 | GitHub 网络不可达 | `Connection reset by peer` | 检查网络连接，等待恢复后重试 | 配置可靠的 VPN 或代理 |
| G-04 | 2026-05-14 | 任务仓库 | 远程追踪未建立 | 本地分支与远程无追踪关系 | `fatal: ambiguous argument 'origin/main': unknown revision` | 执行 `git push -u origin main` 建立追踪 | 首次推送前先检查追踪状态 |

---

### 问题详细分析

#### 问题 G-01~G-03：网络连接失败

**问题现象**：
```
git: Connection reset by peer
fatal: Could not read from remote repository
```

**根本原因**：
1. 本地网络环境不稳定
2. GitHub 服务器连接被中间网络设备重置
3. 未配置代理或代理失效

**解决方案**：
1. 检查本地网络连接是否正常
2. 配置 VPN 或代理：
   ```bash
   git config --global http.proxy http://127.0.0.1:7890
   git config --global https.proxy http://127.0.0.1:7890
   ```
3. 等待网络恢复后重试
4. 使用 `git push --retry` 或多次重试

**预防措施**：
- 始终在网络稳定时进行推送操作
- 大型推送前先检查网络状态
- 配置 Git 代理或使用企业 VPN

---

#### 问题 G-04：远程追踪未建立

**问题现象**：
```
git: fatal: ambiguous argument 'origin/main': unknown revision or path not in the working tree.
```

**根本原因**：
1. 仓库首次推送时未建立本地分支与远程分支的追踪关系
2. `git fetch` 未成功获取远程分支信息

**解决方案**：
```bash
git fetch origin
git push -u origin main
```

**预防措施**：
- 首次推送使用 `-u` 参数建立追踪
- 定期执行 `git remote update` 更新远程引用

---

## 第二部分：Git 提交注释规范

### 规范制定背景

当前提交注释存在以下问题：
1. 内容过于简单，如 `[M5] docs: M5 Task 11 完成`
2. 缺少具体修改范围和内容描述
3. 无法通过注释快速判断变更影响范围
4. 中英文混用不够规范

### 提交注释格式规范

#### 格式要求

```
[模块] 类型: 简要描述

详细说明（可选）：
- 变更内容1
- 变更内容2
- ...
```

#### 模块标识

| 模块标识 | 说明 |
|----------|------|
| `[M1]`~`[M6]` | 里程碑阶段标识 |
| `[core-common]` | 公共模块 |
| `[core-network]` | 网络模块 |
| `[core-data]` | 数据模块 |
| `[core-ui]` | UI 模块 |
| `[feature-hero]` | 英雄模块 |
| `[feature-augment]` | 符文模块 |
| `[feature-community]` | 社区模块 |
| `[feature-bulletin]` | 公告模块 |
| `[backend]` | 后端服务 |
| `[docs]` | 文档更新 |

#### 提交类型

| 类型标识 | 说明 | 使用场景 |
|----------|------|----------|
| `feat` | 新功能 | 新增功能模块、API、组件 |
| `fix` | Bug 修复 | 修复缺陷、错误 |
| `refactor` | 重构 | 代码结构优化、不改变功能 |
| `perf` | 性能优化 | 提升性能、减少资源消耗 |
| `test` | 测试相关 | 新增测试、修复测试 |
| `docs` | 文档更新 | README、变更日志、API 文档 |
| `chore` | 构建/配置 | 依赖更新、构建脚本修改 |
| `style` | 代码格式 | 格式化、不影响功能 |
| `ci` | CI/CD | 流水线配置修改 |

#### 详细说明填写要求

提交注释的详细说明部分**必须包含**以下信息：

1. **涉及的具体文件或模块**
2. **具体的修改内容**
3. **解决的问题或实现的功能**
4. **相关的需求编号或任务编号**

### 规范示例

#### ✅ 正确示例

**示例 1：新增功能**
```
[feature-augment] feat: 实现强化符文推荐功能

详细说明：
- 新增 SynergyProgressResponse/AugmentRecommendRequest/AugmentRecommendResponse DTO
- 新增 AugmentApi.getSynergyProgress() 和 getRecommendations() API 端点
- 新增 AugmentRecommendFragment 布局和 Fragment 类
- 新增 AugmentRecommendAdapter 推荐列表适配器
- 解决 Task 11 套装追踪与智能推荐功能缺失问题
相关任务: Task 11
```

**示例 2：Bug 修复**
```
[backend] fix: 修复 AugmentServiceImpl 套装进度计算错误

详细说明：
- 修复 getSynergyProgress() 方法中重复计数问题
- 使用 Set 替代 List 去重同一符文多个套装属性
- 新增单元测试 AugmentServiceTest.testSynergyProgress()
解决 Bug: 套装进度显示异常，部分套装计数翻倍
```

**示例 3：文档更新**
```
[docs] docs: 更新 dev-log.md M5 阶段记录

详细说明：
- 新增 5.2.3 Task 11 套装追踪与智能推荐章节
- 更新 5.4 阶段成果与经验教训
- 新增决策 53：套装进度使用 ProgressBar 展示
相关文档: dev-log.md
```

**示例 4：多模块修改**
```
[M5] feat: 完成强化符文模块 M5 Task 11

详细说明：
- 后端：AugmentController + AugmentServiceImpl 新增 synergy-progress/recommend API
- Android：feature-augment 新增 SynergyProgressSection + AugmentRecommendFragment
- Android：core-network 新增 AugmentRecommendRequest/Response/SynergyProgressResponse DTO
- 文档：更新 dev-log.md 和 project_rules.md
涉及仓库: 后端仓库 + Android 仓库 + 任务仓库
```

#### ❌ 错误示例

| 错误类型 | 示例 | 问题分析 |
|----------|------|----------|
| 内容过于简单 | `[M5] feat: M5 完成` | 无法判断具体修改了什么 |
| 缺少模块标识 | `feat: 新增推荐功能` | 无法定位所属模块 |
| 类型不准确 | `[backend] feat: 修复 Bug` | 修复 Bug 应使用 fix |
| 缺少详细说明 | `[feature-augment] feat: 新增 API` | 未说明新增了什么 API |
| 中英文混用不规范 | `[M5] feat: 瀹屾垚 Task 11` | 中文乱码，应使用 UTF-8 编码 |

---

### 提交前检查清单

每次提交前请确认：

- [ ] 注释包含模块标识
- [ ] 注释包含准确的提交类型
- [ ] 注释包含简要描述
- [ ] 详细说明包含具体修改内容
- [ ] 详细说明包含涉及的文件/模块
- [ ] 详细说明包含解决的问题或实现的功能
- [ ] 中文编码正确（无乱码）
- [ ] 内容简洁但信息完整

---

## 第三部分：Git 工作流程建议

### 推荐工作流程

```
1. 开发前：git pull origin main（确保最新代码）
2. 开发中：定期 git add + git commit（保存阶段性进度）
3. 完成后：git push origin main（推送到远程）
4. 推送失败：检查网络，等待恢复，重试推送
```

### 提交时机建议

| 场景 | 建议 |
|------|------|
| 完成一个功能点 | 立即提交，避免代码丢失 |
| 完成一个任务 | 必须提交，附带详细说明 |
| 修复一个 Bug | 必须提交，说明修复内容 |
| 下班前 | 确保代码已提交或暂存 |
| 网络不稳定 | 先提交到本地，网络恢复后再推送 |

### 避免的操作

| 操作 | 风险 |
|------|------|
| 大面积修改后统一提交 | 难以追溯问题，增加 Review 难度 |
| commit message 写 "update" 或 "fix bug" | 无意义，无法判断变更内容 |
| 提交包含敏感信息 | 信息泄露风险 |
| 强制推送 `git push -f` | 可能覆盖他人代码 |

---

## 附录：常见 Git 错误及解决方案

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `Connection reset by peer` | 网络问题 | 检查网络，配置代理，重试 |
| `Permission denied` | SSH Key 或 Token 失效 | 重新配置认证信息 |
| `src refspec main does not match` | 分支名称错误 | 检查当前分支，确认目标分支 |
| `fatal: ambiguous argument` | 引用不存在 | 先执行 `git fetch` 更新远程引用 |
| `failed to push some refs` | 远程有更新 | 先 `git pull --rebase`，再推送 |
| `LF will be replaced by CRLF` | 换行符转换警告 | 不影响提交，可忽略或配置 `core.autocrlf` |

---

> 本文档为活文档，随项目开发持续更新。
> 最后更新：2026-05-14
