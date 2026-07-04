import { describe, it, expect } from 'vitest'
import {
  TransactionType,
  Transaction,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES
} from '../types'

describe('Types', () => {
  describe('INCOME_CATEGORIES', () => {
    it('应该包含5个收入分类', () => {
      expect(INCOME_CATEGORIES).toHaveLength(5)
    })

    it('应该包含正确的分类', () => {
      expect(INCOME_CATEGORIES).toEqual([
        '工资',
        '兼职',
        '理财',
        '红包',
        '其他'
      ])
    })
  })

  describe('EXPENSE_CATEGORIES', () => {
    it('应该包含8个支出分类', () => {
      expect(EXPENSE_CATEGORIES).toHaveLength(8)
    })

    it('应该包含正确的分类', () => {
      expect(EXPENSE_CATEGORIES).toEqual([
        '餐饮',
        '交通',
        '购物',
        '住房',
        '娱乐',
        '医疗',
        '教育',
        '其他'
      ])
    })
  })

  describe('Transaction', () => {
    it('应该能够创建有效的交易记录类型', () => {
      // 这是一个类型测试，确保接口定义正确
      const transaction: Transaction = {
        id: 1,
        type: 'income',
        amount: 1000,
        category: '工资',
        note: '测试',
        date: '2024-01-01',
        created_at: '2024-01-01 10:00:00'
      }

      expect(transaction.type).toBe('income')
      expect(transaction.amount).toBe(1000)
    })

    it('应该支持收入和支出两种类型', () => {
      const incomeType: TransactionType = 'income'
      const expenseType: TransactionType = 'expense'

      expect(incomeType).toBe('income')
      expect(expenseType).toBe('expense')
    })
  })
})