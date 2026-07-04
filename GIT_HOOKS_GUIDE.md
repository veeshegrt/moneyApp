# 🔐 Git Hooks 使用指南

## 📋 概述

本项目配置了 Git pre-commit hook，在代码提交前自动运行质量检查和单元测试。**只有所有检查通过，代码才能提交。**

## 🚀 快速开始

### 正常提交流程

```bash
# 1. 修改代码
# 2. 暂存文件
git add .

# 3. 提交（会自动运行检查）
git commit -m "feat: 添加新功能"

# 如果检查通过，提交成功 ✅
# 如果检查失败，提交被阻止 ❌
```

### 查看检查结果

```bash
# 提交时会显示详细检查过程
git commit -m "test"

# 输出示例：
# ╔══════════════════════════════════════════════════════════════╗
# ║                   Git Pre-Commit Hook                       ║
# ╚══════════════════════════════════════════════════════════════╝
#
# 🧪 步骤 1/3: 运行单元测试
# ✅ 单元测试通过！
#
# 📝 步骤 2/3: TypeScript 类型检查
# ✅ TypeScript 类型检查通过！
#
# 🔍 步骤 3/3: 代码质量检查
# ✅ 所有检查通过！
```

## 📊 检查项目详解

### 1️⃣ 单元测试（必须通过）

**检查内容**：
- 运行所有测试用例
- 验证测试覆盖率
- 检查测试结果

**失败原因**：
- 测试用例失败
- 测试覆盖率不足
- 测试代码有语法错误

**修复方法**：
```bash
# 查看失败的测试
npm test

# 修复后重新提交
git add .
git commit -m "fix: 修复测试"
```

### 2️⃣ TypeScript 类型检查（必须通过）

**检查内容**：
- TypeScript 类型错误
- 类型注解缺失
- 类型不匹配

**失败原因**：
- 使用了 `any` 类型
- 类型定义错误
- 缺少类型注解

**修复方法**：
```bash
# 查看类型错误
npx vue-tsc --noEmit

# 修复类型问题
# 例如：将 (window as any).api 改为正确的类型定义

# 重新提交
git add .
git commit -m "fix: 修复类型错误"
```

### 3️⃣ 代码质量检查

#### 🔴 严重问题（阻止提交）

**敏感信息泄露**：
```bash
# ❌ 错误：硬编码密码
const password = "123456"

# ✅ 正确：使用环境变量
const password = process.env.PASSWORD
```

**XSS 风险**：
```vue
<!-- ❌ 错误：使用 v-html -->
<div v-html="userInput"></div>

<!-- ✅ 正确：使用文本插值 -->
<div>{{ userInput }}</div>
```

**SQL 注入风险**：
```typescript
// ❌ 错误：直接拼接
const query = `SELECT * FROM users WHERE id = ${id}`

// ✅ 正确：参数化查询
const query = 'SELECT * FROM users WHERE id = ?'
db.prepare(query).get(id)
```

#### 🟡 警告问题（不阻止提交，但建议修复）

**console.log 使用**：
```typescript
// ⚠️ 警告：生产代码不应该有 console.log
console.log('debug info')

// ✅ 建议：使用 console.warn 或 console.error
console.warn('Warning message')
console.error('Error message')
```

**TODO/FIXME/HACK**：
```typescript
// ⚠️ 警告：有待处理的 TODO
// TODO: 实现这个功能
// FIXME: 修复这个问题

// ✅ 建议：提交前处理这些待办事项
```

**any 类型使用**：
```typescript
// ⚠️ 警告：使用了 any 类型
const data: any = fetchData()

// ✅ 建议：使用具体类型
interface DataType {
  id: number
  name: string
}
const data: DataType = fetchData()
```

## 🔧 配置说明

### Hook 配置位置

```
.husky/
├── pre-commit          # 主要的检查脚本
└── _/husky.sh          # Husky 初始化脚本
```

### package.json 配置

```json
{
  "scripts": {
    "test": "vitest run",
    "lint": "vue-tsc --noEmit",
    "check": "npm test && npm run lint",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,vue}": [
      "vue-tsc --noEmit",
      "vitest related --run"
    ]
  }
}
```

## 🎯 使用场景

### 场景 1：正常提交

```bash
# 修改代码
vim src/pages/Home.vue

# 暂存
git add src/pages/Home.vue

# 提交
git commit -m "feat: 添加新功能"

# 输出：
# ✅ 单元测试通过
# ✅ TypeScript 检查通过
# ✅ 代码质量检查通过
# ✅ 提交成功
```

### 场景 2：测试失败

```bash
# 提交
git commit -m "feat: 添加新功能"

# 输出：
# ❌ 单元测试失败！
#    请修复失败的测试后再提交。
#
# ❌ 提交被阻止

# 修复测试
npm test
# 修复失败的测试...

# 重新提交
git add .
git commit -m "feat: 添加新功能"
```

### 场景 3：类型错误

```bash
# 提交
git commit -m "feat: 添加新功能"

# 输出：
# ❌ TypeScript 类型检查失败！
#    请修复类型错误后再提交。
#
# ❌ 提交被阻止

# 查看类型错误
npx vue-tsc --noEmit

# 修复类型问题
# ...

# 重新提交
git add .
git commit -m "feat: 添加新功能"
```

### 场景 4：安全问题

```bash
# 提交
git commit -m "feat: 添加数据库功能"

# 输出：
# ❌ 发现可能的 SQL 注入风险：
#    electron/main.ts:45: const query = `SELECT * FROM users WHERE id = ${id}`
#
#    请使用参数化查询替代字符串拼接！
#
# ❌ 提交被阻止

# 修复安全问题
# 使用参数化查询...

# 重新提交
git add .
git commit -m "feat: 添加数据库功能（使用参数化查询）"
```

## 🛠️ 高级用法

### 跳过检查（不推荐）

```bash
# 跳过 pre-commit hook（不推荐）
git commit --no-verify -m "hotfix: 紧急修复"

# 仅在以下情况使用：
# - 紧急修复，需要立即提交
# - 测试环境问题，不是代码问题
# - 文档更新，不涉及代码逻辑
```

### 手动运行检查

```bash
# 运行所有检查（不提交）
npm run check

# 只运行测试
npm test

# 只运行类型检查
npm run lint

# 运行代码质量检查（使用 skill）
"检查代码质量"
```

### 查看 Hook 日志

```bash
# 查看 husky 配置
cat .husky/pre-commit

# 测试 hook（不提交）
.husky/pre-commit
```

## 📋 检查清单

### 提交前自查

- [ ] 所有测试通过 (`npm test`)
- [ ] 无 TypeScript 错误 (`npx vue-tsc --noEmit`)
- [ ] 无硬编码密码/密钥
- [ ] 无 `v-html` 使用（或已确保安全）
- [ ] 无 SQL 注入风险
- [ ] 无 `console.log`（或已使用 warn/error）
- [ ] 处理了所有 TODO/FIXME
- [ ] 减少 `any` 类型使用

### 代码质量标准

- ✅ 测试通过率：100%
- ✅ TypeScript 类型检查：无错误
- ✅ 安全检查：无严重问题
- ⚠️ 代码质量：建议 80 分以上

## 🆘 故障排除

### 问题 1：Hook 不执行

**症状**：提交时没有运行检查

**解决方案**：
```bash
# 1. 检查 husky 是否安装
npm list husky

# 2. 重新初始化 husky
npx husky init

# 3. 检查 hook 文件权限
chmod +x .husky/pre-commit

# 4. 检查 git 配置
git config core.hooksPath
```

### 问题 2：检查太慢

**症状**：提交需要等待很长时间

**解决方案**：
```bash
# 1. 只检查修改的文件（使用 lint-staged）
git add .
git commit -m "message"
# lint-staged 只检查暂存的文件

# 2. 跳过特定检查（临时）
git commit --no-verify -m "message"

# 3. 优化测试性能
# 在 vitest.config.ts 中配置
```

### 问题 3：误报

**症状**：检查报告了不是问题的问题

**解决方案**：
```bash
# 1. 检查代码是否有问题
# 2. 如果确认不是问题，可以：
#    - 修改检查规则
#    - 添加例外
#    - 使用 --no-verify 跳过（临时）

# 3. 改进 hook 脚本
vim .husky/pre-commit
```

## 📚 相关文档

- 📖 [Husky 文档](https://typicode.github.io/husky/)
- 📝 [Lint-Staged 文档](https://github.com/okonet/lint-staged)
- 🔍 [代码质量检查](.claude/skills/code-quality.md)
- 🧪 [单元测试指南](TESTING.md)

## 🎯 最佳实践

### 1. 频繁提交
```bash
# 小步提交，频繁验证
git commit -m "feat: 添加表单验证"
git commit -m "feat: 添加错误处理"
git commit -m "test: 添加单元测试"
```

### 2. 清晰的提交信息
```bash
# ✅ 好的提交信息
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复金额计算错误"
git commit -m "test: 添加 Home.vue 组件测试"

# ❌ 不好的提交信息
git commit -m "update"
git commit -m "fix bug"
git commit -m "WIP"
```

### 3. 提交前自查
```bash
# 运行检查
npm run check

# 如果通过，提交
git commit -m "feat: 添加新功能"
```

## 🎉 总结

Git pre-commit hook 确保：
- ✅ 所有测试通过
- ✅ 无类型错误
- ✅ 无安全漏洞
- ✅ 代码质量达标

**好处**：
- 🛡️ 防止低质量代码进入仓库
- 🔒 防止安全漏洞
- 📈 提高代码质量
- 🐛 提前发现问题

---

**开始使用**: 修改代码后运行 `git commit`，hook 会自动检查！🚀