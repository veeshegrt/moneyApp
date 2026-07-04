# 🔍 代码质量检查 - 完整指南

## 📋 概述

本项目提供两套代码质量检查工具：

1. **Code Quality Skill** (`/code-quality`) - 快速检查
2. **Code Quality Agent** - 深度分析

## 🚀 快速开始

### 方法 1：使用 Skill
```
/code-quality
```
或者
```
"检查代码质量"
```

### 方法 2：使用 Agent
```
"使用 code-quality agent 全面检查代码"
```

## 🎯 使用场景

### 场景 1：日常开发
**触发**: 编写新功能后
```
"检查我刚写的代码有没有安全问题"
```
**检查内容**：
- ✅ SQL 注入风险
- ✅ XSS 漏洞
- ✅ 错误处理
- ⏱️ 耗时：约 30 秒

### 场景 2：代码审查
**触发**: PR 提交前
```
"全面检查代码质量和安全风险"
```
**检查内容**：
- ✅ 所有安全检查
- ✅ 代码规范
- ✅ 注释质量
- ✅ 复杂度分析
- ⏱️ 耗时：约 2 分钟

### 场景 3：安全审计
**触发**: 版本发布前
```
"生成安全风险报告"
```
**检查内容**：
- ✅ 深度安全扫描
- ✅ 依赖漏洞检查
- ✅ 敏感信息泄露
- ✅ Electron 安全配置
- ⏱️ 耗时：约 5 分钟

### 场景 4：质量改进
**触发**: 重构代码时
```
"分析代码质量并提供改进建议"
```
**检查内容**：
- ✅ 注释覆盖率
- ✅ 代码重复
- ✅ 函数复杂度
- ✅ 可维护性
- ⏱️ 耗时：约 3 分钟

## 📊 检查项目详解

### 🔒 安全风险检查

#### 1. SQL 注入检测
```typescript
// ❌ 危险：直接拼接
const query = `SELECT * FROM users WHERE id = ${id}`

// ✅ 安全：参数化查询
const query = 'SELECT * FROM users WHERE id = ?'
db.prepare(query).get(id)
```

**检查命令**：
```
"检查是否有 SQL 注入风险"
```

#### 2. XSS 风险检测
```vue
<!-- ❌ 危险：直接渲染 -->
<div v-html="userInput"></div>

<!-- ✅ 安全：文本插值 -->
<div>{{ userInput }}</div>
```

**检查命令**：
```
"检查 Vue 组件的 XSS 风险"
```

#### 3. 敏感信息泄露
```typescript
// ❌ 危险：硬编码
const API_KEY = 'sk-1234567890'

// ✅ 安全：环境变量
const API_KEY = process.env.API_KEY
```

**检查命令**：
```
"检查是否有硬编码的密码或密钥"
```

#### 4. 依赖安全
```bash
# 检查已知漏洞
npm audit

# 检查过时依赖
npm outdated
```

**检查命令**：
```
"检查依赖是否有安全漏洞"
```

### 📝 代码质量检查

#### 1. 注释质量
```typescript
// ❌ 问题：缺少注释
function calc(a, b, c) {
  return a * b + c
}

// ✅ 改进：清晰的注释
/**
 * 计算订单总金额
 * @param price 单价
 * @param quantity 数量
 * @param shipping 运费
 * @returns 总金额
 */
function calculateTotal(price: number, quantity: number, shipping: number): number {
  return price * quantity + shipping
}
```

**检查命令**：
```
"检查代码注释质量"
"统计注释覆盖率"
```

#### 2. 代码规范
```typescript
// ❌ 问题：命名不清晰
const d = new Date()
const u = users.filter(u => u.a > 18)

// ✅ 改进：有意义的命名
const currentDate = new Date()
const adultUsers = users.filter(user => user.age > 18)
```

**检查命令**：
```
"检查代码命名规范"
```

#### 3. 复杂度分析
```typescript
// ❌ 问题：高复杂度
function process(data: any) {
  if (data.type === 'A') {
    if (data.status === 1) {
      if (data.amount > 100) {
        // 多层嵌套
      }
    }
  }
}

// ✅ 改进：降低复杂度
function process(data: Data) {
  if (!isValidType(data)) return
  if (!isValidStatus(data)) return
  if (!isValidAmount(data)) return

  // 主逻辑
}
```

**检查命令**：
```
"分析函数复杂度"
"找出高复杂度的函数"
```

#### 4. 重复代码
```typescript
// ❌ 问题：重复代码
function formatIncome(amount: number) {
  return `¥${amount.toFixed(2)}`
}
function formatExpense(amount: number) {
  return `¥${amount.toFixed(2)}`
}

// ✅ 改进：提取公共函数
function formatAmount(amount: number): string {
  return `¥${amount.toFixed(2)}`
}
```

**检查命令**：
```
"检测代码重复"
"找出重复的代码块"
```

### 🛡️ Electron 安全检查

#### 1. 主进程配置
```typescript
// ❌ 危险配置
new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
})

// ✅ 安全配置
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js')
  }
})
```

**检查命令**：
```
"检查 Electron 安全配置"
```

#### 2. IPC 通信安全
```typescript
// ❌ 危险：暴露所有 IPC
ipcRenderer.send('data', userData)

// ✅ 安全：使用白名单
const allowedChannels = ['get-data', 'save-data']
if (allowedChannels.includes(channel)) {
  ipcRenderer.send(channel, data)
}
```

**检查命令**：
```
"检查 IPC 通信安全"
```

## 📋 检查报告示例

### 快速检查报告
```
$ "快速检查代码质量"

╔══════════════════════════════════════════════════════════════╗
║                   代码质量快速检查                          ║
╚══════════════════════════════════════════════════════════════╝

🔒 安全风险: ❌ 2 个严重问题
├── SQL 注入: 2 处
├── XSS 风险: 1 处
└── 敏感信息: 0 处

📝 代码质量: ⭐⭐⭐⭐ (4/5)
├── 注释: 15.2%
├── 规范: ✅ 良好
└── 复杂度: ✅ 正常

💡 建议: 优先修复 SQL 注入问题
```

### 详细检查报告
```
$ "全面检查代码质量和安全风险"

╔══════════════════════════════════════════════════════════════╗
║                   代码质量详细报告                          ║
╚══════════════════════════════════════════════════════════════╝

📅 检查时间: 2026/7/4 16:40:00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 安全风险检查
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 SQL 注入风险: 2 处
├── ❌ electron/main.ts:45
│   问题: 直接拼接 SQL 语句
│   代码: `SELECT * FROM transactions WHERE id = ${id}`
│   修复: 使用 db.prepare('SELECT * FROM transactions WHERE id = ?').get(id)
│
└── ❌ electron/main.ts:78
    问题: 动态表名拼接
    代码: `SELECT * FROM ${tableName}`
    修复: 使用白名单验证表名

🟠 XSS 风险: 1 处
└── ⚠️ src/pages/Home.vue:123
    问题: 使用 v-html 指令
    代码: <div v-html="userInput"></div>
    修复: 使用文本插值 {{ userInput }}

✅ 敏感信息: 未发现

✅ 依赖安全: 无已知漏洞

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 代码质量分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 注释质量: ⭐⭐⭐ (3/5)
├── 整体注释率: 15.2%
├── 函数注释率: 45.8%
├── 复杂逻辑注释率: 62.3%
└── 建议: 增加复杂算法的注释

🎯 代码规范: ⭐⭐⭐⭐ (4/5)
├── ✅ 命名规范良好
├── ✅ 格式一致性高
├── ⚠️ 部分文件缺少类型注解
└── 建议: 补充 TypeScript 类型

🧩 复杂度分析: ⭐⭐⭐⭐ (4/5)
├── 平均圈复杂度: 3.2
├── 最高复杂度: 12 (electron/main.ts:150)
├── 高复杂度函数: 3 个
└── 建议: 重构复杂函数

🔄 重复代码: ⭐⭐⭐⭐⭐ (5/5)
├── 代码重复率: 2.1%
├── 重复块: 2 处
└── 建议: 提取公共函数

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 改进建议（按优先级）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 严重（必须修复）
1. [SQL 注入] electron/main.ts:45
   问题: 直接拼接用户输入到 SQL 语句
   影响: 攻击者可执行任意 SQL 命令
   修复: 使用参数化查询
   示例:
   // 修改前
   const query = `SELECT * FROM transactions WHERE id = ${id}`
   // 修改后
   const query = 'SELECT * FROM transactions WHERE id = ?'
   db.prepare(query).get(id)

2. [SQL 注入] electron/main.ts:78
   问题: 动态表名拼接
   影响: 攻击者可访问任意表
   修复: 使用白名单验证表名
   示例:
   const allowedTables = ['transactions', 'categories']
   if (!allowedTables.includes(tableName)) {
     throw new Error('Invalid table name')
   }

🟠 高风险（应该修复）
3. [XSS] src/pages/Home.vue:123
   问题: 使用 v-html 渲染用户输入
   影响: 攻击者可注入恶意脚本
   修复: 使用文本插值或净化库
   示例:
   // 修改前
   <div v-html="userInput"></div>
   // 修改后
   <div>{{ userInput }}</div>
   // 或者使用 DOMPurify
   <div v-html="sanitize(userInput)"></div>

4. [错误处理] src/pages/Home.vue:89
   问题: API 调用缺少错误处理
   影响: 用户看到未处理的错误
   修复: 添加 try-catch 和用户提示
   示例:
   try {
     await api.saveTransaction(data)
     message.success('保存成功')
   } catch (error) {
     message.error('保存失败，请重试')
     console.error('Save transaction failed:', error)
   }

🟡 中风险（建议修复）
5. [注释] src/utils/format.ts:15
   问题: 复杂算法缺少注释
   影响: 代码难以理解和维护
   修复: 添加函数文档和逻辑说明

6. [类型] src/main.ts:12
   问题: 使用 any 类型
   影响: 失去 TypeScript 类型保护
   修复: 定义具体类型

🟢 低风险（可选修复）
7. [代码重复] src/pages/Home.vue 和 Records.vue
   问题: 日期格式化逻辑重复
   修复: 提取到 utils/date.ts

8. [资源管理] electron/main.ts:120
   问题: 数据库连接未正确关闭
   修复: 使用 finally 块确保资源释放
```

## 🔧 高级用法

### 组合检查
```
"检查代码质量，然后生成测试用例"
"分析安全风险，提供修复方案"
```

### 特定范围
```
"只检查 electron 目录的安全问题"
"检查所有 Vue 组件的 XSS 风险"
"分析 src/utils 的代码质量"
```

### 条件检查
```
"如果发现 SQL 注入，提供修复代码"
"如果注释率低于 30%，建议添加注释"
```

## 🆚 Skill vs Agent

| | Skill (`/code-quality`) | Agent |
|---|-------------------------|-------|
| **速度** | ⚡ 快（30秒） | 🐢 慢（2-5分钟） |
| **深度** | 基础检查 | 深度分析 |
| **输出** | 简单报告 | 详细报告+修复代码 |
| **使用** | 日常开发 | 代码审查/安全审计 |

### 选择建议

**用 Skill 当**：
- ✅ 快速检查代码问题
- ✅ 日常开发自查
- ✅ 不需要详细分析

**用 Agent 当**：
- ✅ 代码审查前全面检查
- ✅ 安全审计
- ✅ 需要详细的修复建议
- ✅ 生成正式报告

## 📚 最佳实践

### 1. 定期检查
```bash
# 每次提交前
"快速检查代码质量"

# 每周
"全面检查代码质量和安全"

# 每月
"生成代码质量趋势报告"
```

### 2. 渐进式改进
1. 先修复严重问题（SQL 注入、XSS）
2. 再处理高风险问题（错误处理）
3. 最后优化代码质量（注释、规范）

### 3. 团队协作
- 共享检查结果
- 讨论改进方案
- 建立代码规范

### 4. 自动化集成
```yaml
# CI/CD 集成
- name: Code Quality Check
  run: claude code-quality --format=json > report.json
```

## 🆘 故障排除

### 问题：检查结果不准确
**解决方案**：
- 检查项目配置
- 更新检查规则
- 提供反馈改进

### 问题：检查速度慢
**解决方案**：
- 排除不需要检查的文件
- 使用增量检查
- 并行执行检查

### 问题：误报太多
**解决方案**：
- 调整检查级别
- 添加排除规则
- 标记已知问题

## 📖 相关文档

- 📋 [Agent 定义](.claude/agents/code-quality.md) - 完整功能说明
- 📝 [Skill 定义](.claude/skills/code-quality.md) - 技能说明
- 🔒 [Electron 安全指南](https://www.electronjs.org/docs/latest/tutorial/security)
- 🛡️ [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## 🎯 快速参考

### 常用命令
```
"检查代码质量" - 基础检查
"检查 SQL 注入" - 安全检查
"检查注释质量" - 质量检查
"全面检查代码" - 完整检查
"生成质量报告" - 生成报告
```

### 检查类型
- 🔒 安全风险 - SQL 注入、XSS、敏感信息
- 📝 代码质量 - 注释、规范、复杂度
- 🛡️ 最佳实践 - 错误处理、资源管理
- 📦 依赖安全 - 漏洞、过时依赖

---

**开始使用**: 输入 `/code-quality` 或说 "检查代码质量" 🚀