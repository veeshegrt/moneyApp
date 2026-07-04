export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: number
  type: TransactionType
  amount: number
  category: string
  note: string
  date: string
  created_at: string
}

export const INCOME_CATEGORIES = ['工资', '兼职', '理财', '红包', '其他']
export const EXPENSE_CATEGORIES = ['餐饮', '交通', '购物', '住房', '娱乐', '医疗', '教育', '其他']
