import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  getTransactions: (month?: string) => ipcRenderer.invoke('get-transactions', month),
  addTransaction: (data: any) => ipcRenderer.invoke('add-transaction', data),
  deleteTransaction: (id: number) => ipcRenderer.invoke('delete-transaction', id),
  updateTransaction: (id: number, data: any) => ipcRenderer.invoke('update-transaction', id, data),
  getMonthlyStats: (month: string) => ipcRenderer.invoke('get-monthly-stats', month),
  getCategories: (type: string) => ipcRenderer.invoke('get-categories', type),
  addCategory: (type: string, name: string) => ipcRenderer.invoke('add-category', type, name),
})
