# 单元测试使用指南

## 概述

本项目使用 Vitest 作为测试框架，配合 Vue Test Utils 进行 Vue 组件测试。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并监听文件变化（开发模式）
npm run test:watch

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行测试并打开 UI 界面
npm run test:ui
```

### 3. 生成测试报告

```bash
# 使用报告生成器脚本
npx tsx scripts/generate-test-report.ts
```

## 测试目录结构

```
src/
├── __tests__/           # 测试文件目录
│   ├── types.test.ts
│   ├── router.test.ts
│   └── ...
├── components/
│   └── __tests__/       # 组件测试
├── utils/
│   └── __tests__/       # 工具函数测试
├── pages/
│   └── __tests__/       # 页面测试
└── test-setup.ts        # 测试环境配置
```

## 编写测试

### 工具函数测试

```typescript
// src/utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatAmount } from '../format'

describe('formatAmount', () => {
  it('应该正确格式化金额', () => {
    expect(formatAmount(1234.56)).toBe('1,234.56')
  })

  it('应该处理负数', () => {
    expect(formatAmount(-100)).toBe('-100.00')
  })
})
```

### Vue 组件测试

```typescript
// src/components/__tests__/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(Button, {
      props: { text: '点击' }
    })
    expect(wrapper.text()).toContain('点击')
  })

  it('应该触发点击事件', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### Mock 使用

```typescript
// Mock 外部依赖
vi.mock('../utils/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' })
}))

// Mock localStorage
vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('test')
```

## 测试覆盖率

运行覆盖率报告后，会在 `coverage/` 目录生成 HTML 报告：

```bash
npm run test:coverage
# 打开 coverage/index.html 查看详细报告
```

### 覆盖率阈值

在 `vitest.config.ts` 中配置最低覆盖率要求：

```typescript
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

## 测试报告

测试报告会保存在 `test-results/` 目录：

- `test-report.json` - JSON 格式的详细报告
- `test-report.txt` - 文本格式的可读报告
- `coverage/` - 覆盖率 HTML 报告

## 最佳实践

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

- 每个测试用例应该独立运行
- 使用 `beforeEach` 和 `afterEach` 清理状态
- 不要依赖测试执行顺序

### 3. 测试数据

```typescript
// 使用工厂函数创建测试数据
const createTransaction = (overrides = {}) => ({
  id: 1,
  type: 'income',
  amount: 1000,
  category: '工资',
  note: '',
  date: '2024-01-01',
  created_at: '2024-01-01 10:00:00',
  ...overrides
})
```

### 4. 异步测试

```typescript
it('应该处理异步操作', async () => {
  const result = await asyncFunction()
  expect(result).toBe('expected')
})

it('应该处理 Promise 拒绝', async () => {
  await expect(asyncFunction()).rejects.toThrow('error')
})
```

## 常见问题

### Q: 找不到测试文件
A: 检查 `vitest.config.ts` 中的 `include` 配置，确保测试文件命名正确（`*.test.ts` 或 `*.spec.ts`）。

### Q: Vue 组件测试报错
A: 确保安装了 `@vue/test-utils` 和 `jsdom`，并在 `test-setup.ts` 中配置了必要的浏览器 API 模拟。

### Q: 覆盖率不准确
A: 检查 `coverage.exclude` 配置，排除不需要统计的文件（如配置文件、类型定义等）。

## 相关资源

- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils 文档](https://test-utils.vuejs.org/)
- [Vitest 覆盖率指南](https://vitest.dev/guide/coverage.html)