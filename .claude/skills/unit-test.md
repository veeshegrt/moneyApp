# 单元测试技能

## 技能描述
对项目代码进行单元测试，生成详细的测试报告，包括测试结果、覆盖率统计和失败详情。

## 使用场景
- 用户想要运行项目的单元测试
- 用户想要查看测试覆盖率报告
- 用户想要验证代码质量
- 用户在修改代码后想要确认没有引入回归问题

## 前置条件
1. 项目已安装测试依赖（vitest、@vue/test-utils 等）
2. 已配置测试环境（vitest.config.ts）
3. 已编写测试文件（*.test.ts 或 *.spec.ts）

## 执行步骤

### 1. 检查测试环境
```bash
# 检查是否安装了测试依赖
npm list vitest @vue/test-utils jsdom happy-dom

# 如果没有安装，执行以下命令安装
npm install -D vitest @vue/test-utils jsdom
```

### 2. 检查测试配置
检查项目根目录是否存在 `vitest.config.ts` 或 `vite.config.ts` 中的测试配置。

如果不存在，创建 `vitest.config.ts`：
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
    exclude: ['node_modules', 'dist', 'dist-electron', 'release']
  }
})
```

### 3. 运行测试
```bash
# 运行所有测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行测试并监听文件变化
npm run test:watch
```

### 4. 生成测试报告

测试报告将包含以下内容：

#### 4.1 测试结果摘要
- 总测试数
- 通过数
- 失败数
- 跳过数
- 执行时间

#### 4.2 覆盖率报告
- 语句覆盖率（Statements）
- 分支覆盖率（Branches）
- 函数覆盖率（Functions）
- 行覆盖率（Lines）

#### 4.3 失败详情
如果存在失败的测试，显示：
- 测试名称
- 错误信息
- 预期值与实际值的对比
- 错误堆栈

## 输出格式

### 控制台输出
```
✓ 通过的测试用绿色显示
✗ 失败的测试用红色显示
○ 跳过的测试用黄色显示

测试结果摘要：
  总计: 15
  通过: 12
  失败: 2
  跳过: 1

覆盖率报告：
  语句: 85.7% (120/140)
  分支: 75.0% (30/40)
  函数: 90.0% (18/20)
  行: 85.0% (85/100)
```

### JSON 报告
生成详细的 JSON 报告文件：`./test-results/test-report.json`

### HTML 覆盖率报告
生成可视化 HTML 覆盖率报告：`./coverage/index.html`

## 配置选项

在 `package.json` 中添加测试脚本：
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## 示例测试文件

### 工具函数测试示例
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

  it('应该处理零', () => {
    expect(formatAmount(0)).toBe('0.00')
  })
})
```

### Vue 组件测试示例
```typescript
// src/components/__tests__/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button', () => {
  it('应该正确渲染文本', () => {
    const wrapper = mount(Button, {
      props: {
        text: '点击我'
      }
    })
    expect(wrapper.text()).toContain('点击我')
  })

  it('应该在点击时触发事件', async () => {
    const wrapper = mount(Button, {
      props: {
        text: '点击'
      }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

## 注意事项

1. **测试文件命名**：测试文件应命名为 `*.test.ts` 或 `*.spec.ts`，并放在 `__tests__` 目录或与被测文件同目录。

2. **测试隔离**：每个测试应该相互独立，不依赖外部状态。

3. **Mock 使用**：对于外部依赖（如数据库、API），使用 vi.mock() 进行模拟。

4. **覆盖率阈值**：可以在配置中设置最低覆盖率要求：
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

## 故障排除

### 问题：找不到测试文件
**解决方案**：检查 `vitest.config.ts` 中的 `include` 配置是否正确。

### 问题：Vue 组件测试报错
**解决方案**：确保安装了 `@vue/test-utils` 和 `jsdom`（或 `happy-dom`）。

### 问题：覆盖率报告不准确
**解决方案**：检查 `coverage.exclude` 配置，排除不需要统计的文件。

## 相关资源
- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest 覆盖率配置](https://vitest.dev/guide/coverage.html)