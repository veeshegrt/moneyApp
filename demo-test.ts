#!/usr/bin/env node

/**
 * 单元测试演示脚本
 *
 * 这个脚本演示了如何使用 Claude 的单元测试技能
 */

import { execSync } from 'child_process'

console.log('🎯 单元测试技能演示\n')

console.log('📋 可用的测试命令：')
console.log('  1. npm test          - 运行所有测试')
console.log('  2. npm run test:watch  - 监听模式运行测试')
console.log('  3. npm run test:coverage - 运行测试并生成覆盖率报告')
console.log('  4. npx tsx scripts/generate-test-report.ts - 生成详细测试报告\n')

console.log('📁 测试文件位置：')
console.log('  - src/__tests__/      - 测试目录')
console.log('  - src/test-setup.ts   - 测试环境配置\n')

console.log('📊 测试报告输出：')
console.log('  - test-results/       - 测试报告目录')
console.log('  - coverage/           - 覆盖率报告目录\n')

console.log('🚀 示例：运行测试\n')

try {
  console.log('正在运行测试...\n')
  const output = execSync('npm test', {
    encoding: 'utf-8',
    stdio: 'inherit'
  })
} catch (error) {
  // 测试可能失败，这里只是演示
  console.log('\n💡 提示：测试运行完成，查看上方输出了解测试结果')
}

console.log('\n✅ 演示完成！')
console.log('\n📖 更多信息请查看 TESTING.md 文件')