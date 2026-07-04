# 代码质量检查技能

## 技能描述
对项目代码进行全面的质量检查，包括安全风险检测、代码规范分析、注释质量评估等，生成详细的检查报告。

## 使用场景
- 用户想要检查代码是否存在安全风险
- 用户想要分析代码质量
- 用户想要检查是否有 SQL 注入、XSS 等安全问题
- 用户想要评估代码注释质量
- 用户在代码审查前想要自动检查
- 用户想要识别潜在的代码问题

## 检查范围

### 1. 安全风险检查
- **SQL 注入** - 检测不安全的数据库查询
- **XSS 攻击** - 识别跨站脚本攻击风险
- **敏感信息泄露** - 发现硬编码的密码、密钥
- **依赖安全** - 检查已知漏洞的依赖

### 2. 代码质量检查
- **注释质量** - 注释覆盖率、规范性
- **代码规范** - 命名、格式、结构
- **复杂度分析** - 圈复杂度、认知复杂度
- **重复代码** - 检测代码重复

### 3. 最佳实践检查
- **错误处理** - 异常处理是否完善
- **资源管理** - 内存泄漏、资源释放
- **类型安全** - TypeScript 类型使用
- **可维护性** - 代码可读性、可扩展性

## 执行步骤

### 1. 准备阶段
```bash
# 检查项目结构
find src electron -name "*.ts" -o -name "*.vue" | head -20

# 检查依赖
npm audit
npm outdated
```

### 2. 安全扫描

#### SQL 注入检测
```bash
# 搜索潜在的 SQL 注入模式
grep -rn "\`.*\${.*}\`" src electron
grep -rn "query.*+" src electron
grep -rn "\.prepare.*\+" src electron
```

#### XSS 风险检测
```bash
# 搜索 v-html 使用
grep -rn "v-html" src

# 搜索 innerHTML
grep -rn "innerHTML" src

# 搜索 dangerouslySetInnerHTML (React)
grep -rn "dangerouslySetInnerHTML" src
```

#### 敏感信息检测
```bash
# 搜索硬编码密码
grep -rn "password.*=.*['\"]" src electron
grep -rn "secret.*=.*['\"]" src electron
grep -rn "api_key.*=.*['\"]" src electron
grep -rn "token.*=.*['\"]" src electron
```

### 3. 代码质量分析

#### 注释质量检查
```bash
# 统计注释行数
grep -rn "//.*\|/\*.*\*/" src --include="*.ts" --include="*.vue" | wc -l

# 统计代码行数
find src -name "*.ts" -o -name "*.vue" | xargs wc -l

# 检查函数注释
grep -rn "function.*{" src --include="*.ts" | wc -l
grep -rn "/\*\*" src --include="*.ts" | wc -l
```

#### 复杂度分析
```bash
# 识别复杂函数（包含多个条件判断）
grep -rn "if.*{" src --include="*.ts" | wc -l
grep -rn "switch.*{" src --include="*.ts" | wc -l
grep -rn "for.*{" src --include="*.ts" | wc -l
grep -rn "while.*{" src --include="*.ts" | wc -l
```

#### 重复代码检测
```bash
# 检查相似的代码块
# （需要使用专业工具如 jscpd）
npx jscpd src --min-lines 5 --min-tokens 50
```

### 4. Vue 组件检查

#### 模板安全
```bash
# 检查 v-html 使用
grep -rn "v-html" src/components src/pages

# 检查动态组件
grep -rn "is=" src/components src/pages

# 检查事件处理
grep -rn "@click.*=" src/components src/pages
```

#### 脚本安全
```bash
# 检查 eval 使用
grep -rn "eval(" src

# 检查 Function 构造函数
grep -rn "new Function(" src

# 检查 setTimeout/setInterval 字符串
grep -rn "setTimeout.*['\"]" src
grep -rn "setInterval.*['\"]" src
```

### 5. Electron 安全检查

#### 主进程安全
```bash
# 检查 nodeIntegration
grep -rn "nodeIntegration" electron

# 检查 contextIsolation
grep -rn "contextIsolation" electron

# 检查 webSecurity
grep -rn "webSecurity" electron

# 检查 remote 模块
grep -rn "remote" electron
```

#### 预加载脚本安全
```bash
# 检查暴露的 API
grep -rn "contextBridge.exposeInMainWorld" electron

# 检查 IPC 通道
grep -rn "ipcRenderer" electron
grep -rn "ipcMain" electron
```

## 输出格式

### 控制台输出
```
╔══════════════════════════════════════════════════════════════╗
║                   代码质量检查报告                          ║
╚══════════════════════════════════════════════════════════════╝

📅 检查时间: 2026/7/4 16:40:00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 安全风险检查
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SQL 注入风险: ❌ 发现 2 处
├── electron/main.ts:45 - 直接拼接 SQL
└── electron/main.ts:78 - 动态表名

XSS 风险: ⚠️ 发现 1 处
└── src/pages/Home.vue:123 - 使用 v-html

敏感信息: ✅ 未发现

依赖安全: ✅ 无已知漏洞

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 代码质量分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

注释质量: ⭐⭐⭐ (3/5)
├── 整体注释率: 15.2%
├── 函数注释率: 45.8%
└── 建议: 增加复杂逻辑的注释

代码规范: ⭐⭐⭐⭐ (4/5)
├── 命名规范: ✅ 良好
├── 格式一致: ✅ 良好
└── 类型注解: ⚠️ 部分缺失

复杂度: ⭐⭐⭐⭐ (4/5)
├── 平均复杂度: 3.2
├── 高复杂度函数: 3 个
└── 建议: 重构复杂函数

重复代码: ⭐⭐⭐⭐⭐ (5/5)
├── 重复率: 2.1%
└── 重复块: 2 处

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 改进建议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 严重（必须修复）
1. [SQL 注入] electron/main.ts:45
   使用参数化查询替代字符串拼接

2. [SQL 注入] electron/main.ts:78
   使用白名单验证表名

🟠 高风险（应该修复）
3. [XSS] src/pages/Home.vue:123
   使用文本插值替代 v-html

4. [错误处理] src/pages/Home.vue:89
   添加 API 调用的错误处理

🟡 中风险（建议修复）
5. [注释] src/utils/format.ts:15
   为复杂算法添加注释

6. [类型] src/main.ts:12
   替换 any 类型为具体类型
```

### JSON 报告
```json
{
  "timestamp": "2026-07-04T16:40:00Z",
  "summary": {
    "security": {
      "sqlInjection": 2,
      "xss": 1,
      "sensitiveInfo": 0,
      "dependencyIssues": 0
    },
    "quality": {
      "commentCoverage": 15.2,
      "codeStandard": 4,
      "complexity": 3.2,
      "duplication": 2.1
    }
  },
  "issues": [
    {
      "type": "sql-injection",
      "severity": "critical",
      "file": "electron/main.ts",
      "line": 45,
      "description": "直接拼接 SQL 语句",
      "suggestion": "使用参数化查询"
    }
  ],
  "recommendations": [
    {
      "priority": "high",
      "description": "修复 SQL 注入漏洞",
      "files": ["electron/main.ts:45", "electron/main.ts:78"]
    }
  ]
}
```

## 配置选项

### 检查级别
```bash
# 只检查严重问题
--severity=critical,high

# 检查所有问题
--severity=all
```

### 排除文件
```bash
# 排除测试文件
--exclude="**/*.test.ts,**/*.spec.ts"

# 排除特定目录
--exclude="node_modules,dist,coverage"
```

### 输出格式
```bash
# 控制台输出（默认）
--format=console

# JSON 输出
--format=json

# HTML 报告
--format=html
```

## 使用示例

### 基础检查
```bash
# 检查整个项目
"检查代码质量"

# 检查安全风险
"检查是否有 SQL 注入"

# 检查注释
"检查代码注释质量"
```

### 高级检查
```bash
# 全面检查
"全面检查代码质量和安全风险"

# 检查特定文件
"检查 electron/main.ts 的安全问题"

# 检查特定类型
"检查所有 Vue 组件的 XSS 风险"
```

### 生成报告
```bash
# 生成详细报告
"生成代码质量报告"

# 生成安全报告
"生成安全风险报告"

# 生成 JSON 报告
"生成 JSON 格式的检查报告"
```

## 故障排除

### 问题：检查结果不准确
**解决方案**：
1. 更新检查规则
2. 调整检查级别
3. 提供反馈改进

### 问题：检查速度慢
**解决方案**：
1. 排除不需要检查的文件
2. 使用增量检查
3. 并行执行检查

### 问题：误报太多
**解决方案**：
1. 调整检查级别
2. 添加排除规则
3. 标记已知问题

## 相关资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [TypeScript 安全最佳实践](https://typescript.security/)
- [Vue.js 安全指南](https://vuejs.org/guide/best-practices/security.html)
- [Electron 安全指南](https://www.electronjs.org/docs/latest/tutorial/security)

## 最佳实践

### 1. 定期检查
- 每次提交前运行基础检查
- 每周运行全面检查
- 每月生成质量趋势报告

### 2. 渐进式改进
- 先修复严重问题
- 逐步提高代码质量
- 设置可达成的目标

### 3. 团队协作
- 共享检查结果
- 讨论改进方案
- 建立代码规范

### 4. 自动化集成
- 集成到 CI/CD
- 设置质量门禁
- 自动生成报告

## 注意事项

1. **隐私保护** - 检查过程中不会收集或上传任何代码
2. **性能影响** - 检查可能消耗一定系统资源，建议在空闲时运行
3. **误报处理** - 某些检查可能产生误报，需要人工确认
4. **规则更新** - 定期更新检查规则以覆盖新的安全风险

---

**版本**: 1.0.0
**更新日期**: 2026/7/4