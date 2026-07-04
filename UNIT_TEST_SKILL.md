# 单元测试技能 - 完整指南

## 📋 技能概述

这是一个为 Claude Code 设计的单元测试技能，能够：
- ✅ 自动运行项目的单元测试
- ✅ 生成详细的测试报告（文本 + JSON）
- ✅ 生成代码覆盖率报告
- ✅ 提供失败测试的详细信息
- ✅ 支持 Vue 3 + Vite 项目

## 🎯 快速开始

### 1. 安装依赖（已完成）

```bash
npm install
```

### 2. 运行测试

```bash
# 运行所有测试
npm test

# 监听模式（开发时使用）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 打开测试 UI
npm run test:ui
```

### 3. 生成详细报告

```bash
npx tsx scripts/generate-test-report.ts
```

## 📁 项目结构

```
moneyApp/
├── src/
│   ├── __tests__/                    # 测试文件目录
│   │   ├── types.test.ts            # 类型定义测试
│   │   └── router.test.ts           # 路由测试
│   └── test-setup.ts                # 测试环境配置
├── vitest.config.ts                  # Vitest 配置
├── scripts/
│   └── generate-test-report.ts      # 报告生成脚本
├── test-results/                     # 测试报告输出目录
│   ├── test-report.json             # JSON 报告
│   └── test-report.txt              # 文本报告
├── coverage/                         # 覆盖率报告目录
│   └── index.html                   # HTML 覆盖率报告
├── .claude/skills/
│   ├── unit-test.md                 # 技能定义文件
│   └── unit-test-demo.md            # 演示文档
├── TESTING.md                        # 测试文档
└── UNIT_TEST_SKILL.md               # 本文档
```

## 🛠️ 测试配置

### Vitest 配置 (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage'
    },
    include: ['src/**/*.{test,spec}.{js,ts}'],
    globals: true,
    setupFiles: ['./src/test-setup.ts']
  }
})
```

### 测试环境 (`src/test-setup.ts`)

自动配置：
- ✅ 浏览器 API 模拟（window, document, localStorage）
- ✅ Vue 相关 API 模拟
- ✅ Electron IPC 模拟
- ✅ ResizeObserver / IntersectionObserver 模拟

## 📝 编写测试

### 1. 工具函数测试

```typescript
import { describe, it, expect } from 'vitest'
import { formatAmount } from '../utils/format'

describe('formatAmount', () => {
  it('应该正确格式化金额', () => {
    expect(formatAmount(1234.56)).toBe('1,234.56')
  })

  it('应该处理负数', () => {
    expect(formatAmount(-100)).toBe('-100.00')
  })
})
```

### 2. Vue 组件测试

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '../components/MyComponent.vue'

describe('MyComponent', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(MyComponent, {
      props: { title: '测试' }
    })
    expect(wrapper.text()).toContain('测试')
  })

  it('应该触发事件', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### 3. Mock 使用

```typescript
import { vi, describe, it, expect } from 'vitest'

// Mock 模块
vi.mock('../utils/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' })
}))

// Mock 函数
const mockFn = vi.fn()
mockFn.mockReturnValue('test')

// Mock localStorage
vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('test')
```

## 📊 测试报告

### 控制台输出

```
╔════════════════════════════════════════════════════════════════╗
║                     单元测试报告                              ║
╚════════════════════════════════════════════════════════════════╝

📅 生成时间: 2024/1/1 10:00:00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 测试结果摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ 通过: 10
  ❌ 失败: 0
  ⏭️  跳过: 0
  📊 总计: 10

  通过率: 100.0%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 测试详情
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ src/__tests__/types.test.ts
     状态: 通过
     耗时: 50ms
```

### JSON 报告 (`test-results/test-report.json`)

```json
{
  "timestamp": "2024-01-01T10:00:00.000Z",
  "summary": {
    "total": 10,
    "passed": 10,
    "failed": 0,
    "skipped": 0,
    "passRate": "100.00%"
  },
  "tests": [
    {
      "name": "src/__tests__/types.test.ts",
      "status": "passed",
      "duration": 50,
      "failureMessages": []
    }
  ],
  "coverage": {
    "lines": { "pct": 85.7, "covered": 120, "total": 140 },
    "statements": { "pct": 85.7, "covered": 120, "total": 140 },
    "functions": { "pct": 90.0, "covered": 18, "total": 20 },
    "branches": { "pct": 75.0, "covered": 30, "total": 40 }
  }
}
```

### HTML 覆盖率报告

运行 `npm run test:coverage` 后，打开 `coverage/index.html` 查看可视化的覆盖率报告。

## 🎨 Claude Code 中使用

### 方法1：直接调用技能

在 Claude Code 中输入：
```
/test
```

或者：
```
/skill unit-test
```

### 方法2：自然语言请求

```
"帮我运行单元测试"
"检查测试覆盖率"
"生成测试报告"
```

### 方法3：命令行调用

```bash
# 运行测试
npm test

# 生成报告
npx tsx scripts/generate-test-report.ts
```

## 📚 最佳实践

### 1. 测试命名规范

```typescript
describe('功能模块', () => {
  describe('具体功能', () => {
    it('应该在正常情况下...', () => {})
    it('应该在异常情况下...', () => {})
  })
})
```

### 2. 测试隔离

```typescript
describe('测试套件', () => {
  beforeEach(() => {
    // 每个测试前重置状态
    vi.clearAllMocks()
  })

  afterEach(() => {
    // 每个测试后清理
    cleanup()
  })

  it('测试1', () => {})
  it('测试2', () => {})
})
```

### 3. 异步测试

```typescript
it('应该处理异步操作', async () => {
  const result = await asyncFunction()
  expect(result).toBe('expected')
})

it('应该处理 Promise 拒绝', async () => {
  await expect(asyncFunction()).rejects.toThrow('error')
})
```

### 4. 覆盖率目标

```typescript
// vitest.config.ts
test: {
  coverage: {
    thresholds: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  }
}
```

## 🔧 故障排除

### 问题1：测试运行失败
**症状**：运行 `npm test` 时报错

**解决方案**：
```bash
# 1. 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 2. 检查 Node.js 版本
node --version  # 需要 >= 18

# 3. 查看详细错误
npm test -- --reporter=verbose
```

### 问题2：找不到测试文件
**症状**：No test files found

**解决方案**：
1. 检查文件命名：必须以 `.test.ts` 或 `.spec.ts` 结尾
2. 检查文件位置：必须在 `src/` 目录下
3. 检查配置：`vitest.config.ts` 中的 `include` 是否正确

### 问题3：Vue 组件测试报错
**症状**：ReferenceError: document is not defined

**解决方案**：
```bash
# 确保安装了 jsdom
npm install -D jsdom

# 检查 vitest.config.ts 中的 environment 配置
test: {
  environment: 'jsdom'  // 确保设置了 jsdom
}
```

### 问题4：覆盖率报告不生成
**症状**：`coverage/` 目录为空

**解决方案**：
```bash
# 1. 安装覆盖率依赖
npm install -D @vitest/coverage-v8

# 2. 运行覆盖率命令
npm run test:coverage

# 3. 检查配置
# vitest.config.ts 中必须有 coverage 配置
```

## 📖 相关文档

- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [项目测试文档](TESTING.md)

## 🎉 开始使用

现在你已经准备好使用单元测试技能了！

1. ✅ 依赖已安装
2. ✅ 配置文件已创建
3. ✅ 示例测试已编写
4. ✅ 测试环境已配置

运行第一个测试：
```bash
npm test
```

查看测试报告：
```bash
npx tsx scripts/generate-test-report.ts
```

祝你测试愉快！🚀