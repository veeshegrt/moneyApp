#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

interface TestResult {
  numTotalTests: number
  numPassedTests: number
  numFailedTests: number
  numPendingTests: number
  testResults: Array<{
    name: string
    status: 'passed' | 'failed' | 'pending'
    duration: number
    failureMessages?: string[]
  }>
}

interface CoverageResult {
  total: {
    lines: { pct: number; covered: number; total: number }
    statements: { pct: number; covered: number; total: number }
    functions: { pct: number; covered: number; total: number }
    branches: { pct: number; covered: number; total: number }
  }
}

function runTests(): string {
  console.log('🧪 运行单元测试...\n')

  try {
    const output = execSync('npx vitest run --reporter=json', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    })
    return output
  } catch (error: any) {
    // 如果测试失败，仍然返回输出
    return error.stdout || ''
  }
}

function runCoverage(): string {
  console.log('📊 生成覆盖率报告...\n')

  try {
    const output = execSync('npx vitest run --coverage --reporter=json', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    })
    return output
  } catch (error: any) {
    return error.stdout || ''
  }
}

function parseTestResults(output: string): TestResult | null {
  try {
    const lines = output.split('\n')
    const jsonLine = lines.find(line => line.trim().startsWith('{'))

    if (jsonLine) {
      return JSON.parse(jsonLine)
    }
  } catch (error) {
    console.error('解析测试结果失败:', error)
  }
  return null
}

function generateTextReport(result: TestResult): string {
  const { numTotalTests, numPassedTests, numFailedTests, numPendingTests } = result

  let report = `
╔════════════════════════════════════════════════════════════════╗
║                     单元测试报告                              ║
╚════════════════════════════════════════════════════════════════╝

📅 生成时间: ${new Date().toLocaleString('zh-CN')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 测试结果摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ 通过: ${numPassedTests}
  ❌ 失败: ${numFailedTests}
  ⏭️  跳过: ${numPendingTests}
  📊 总计: ${numTotalTests}

  通过率: ${((numPassedTests / numTotalTests) * 100).toFixed(1)}%
`

  if (numFailedTests > 0) {
    report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 失败详情
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

    result.testResults
      .filter(test => test.status === 'failed')
      .forEach(test => {
        report += `
  测试: ${test.name}
  状态: ❌ 失败
  耗时: ${test.duration}ms
  错误信息:
${test.failureMessages?.map(msg => `    ${msg}`).join('\n') || '    无详细错误信息'}
`
      })
  }

  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 测试详情
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

  result.testResults.forEach(test => {
    const statusIcon = test.status === 'passed' ? '✅' :
                      test.status === 'failed' ? '❌' : '⏭️'
    report += `
  ${statusIcon} ${test.name}
     状态: ${test.status === 'passed' ? '通过' :
            test.status === 'failed' ? '失败' : '跳过'}
     耗时: ${test.duration}ms
`
  })

  return report
}

function generateJsonReport(result: TestResult, coverage?: CoverageResult): object {
  return {
    timestamp: new Date().toISOString(),
    summary: {
      total: result.numTotalTests,
      passed: result.numPassedTests,
      failed: result.numFailedTests,
      skipped: result.numPendingTests,
      passRate: ((result.numPassedTests / result.numTotalTests) * 100).toFixed(2) + '%'
    },
    tests: result.testResults.map(test => ({
      name: test.name,
      status: test.status,
      duration: test.duration,
      failureMessages: test.failureMessages || []
    })),
    coverage: coverage?.total || null
  }
}

function saveReport(content: string, filename: string) {
  const reportsDir = join(process.cwd(), 'test-results')

  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true })
  }

  const filePath = join(reportsDir, filename)
  writeFileSync(filePath, content, 'utf-8')
  console.log(`💾 报告已保存到: ${filePath}`)
}

function main() {
  console.log('🚀 开始生成测试报告...\n')

  // 运行测试并生成覆盖率
  const output = runCoverage()

  // 解析测试结果
  const testResult = parseTestResults(output)

  if (!testResult) {
    console.error('❌ 无法解析测试结果')
    console.log('原始输出:')
    console.log(output)
    process.exit(1)
  }

  // 生成文本报告
  const textReport = generateTextReport(testResult)
  console.log(textReport)

  // 生成JSON报告
  const jsonReport = generateJsonReport(testResult)
  saveReport(JSON.stringify(jsonReport, null, 2), 'test-report.json')

  // 保存文本报告
  saveReport(textReport, 'test-report.txt')

  // 检查是否有失败的测试
  if (testResult.numFailedTests > 0) {
    console.log('\n⚠️  存在失败的测试，请检查并修复。')
    process.exit(1)
  } else {
    console.log('\n✅ 所有测试通过！')
    process.exit(0)
  }
}

main()