import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import Database from 'better-sqlite3'

// 数据库初始化
const dbPath = path.join(app.getPath('userData'), 'money.db')
const db = new Database(dbPath)

// 建表
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    note TEXT DEFAULT '',
    date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    UNIQUE(type, name)
  )
`)

// 初始化默认分类
const defaultIncome = ['工资', '兼职', '理财', '红包', '其他']
const defaultExpense = ['餐饮', '交通', '购物', '住房', '娱乐', '医疗', '教育', '其他']
const insertCat = db.prepare('INSERT OR IGNORE INTO categories (type, name) VALUES (?, ?)')
for (const name of defaultIncome) insertCat.run('income', name)
for (const name of defaultExpense) insertCat.run('expense', name)

// IPC 处理：获取所有记录
ipcMain.handle('get-transactions', (_, month?: string) => {
  if (month) {
    return db.prepare('SELECT * FROM transactions WHERE date LIKE ? ORDER BY date DESC').all(`${month}%`)
  }
  return db.prepare('SELECT * FROM transactions ORDER BY date DESC').all()
})

// IPC 处理：添加记录
ipcMain.handle('add-transaction', (_, data) => {
  const stmt = db.prepare('INSERT INTO transactions (type, amount, category, note, date) VALUES (?, ?, ?, ?, ?)')
  return stmt.run(data.type, data.amount, data.category, data.note || '', data.date)
})

// IPC 处理：删除记录
ipcMain.handle('delete-transaction', (_, id: number) => {
  return db.prepare('DELETE FROM transactions WHERE id = ?').run(id)
})

// IPC 处理：更新记录
ipcMain.handle('update-transaction', (_, id: number, data) => {
  const stmt = db.prepare('UPDATE transactions SET type=?, amount=?, category=?, note=?, date=? WHERE id=?')
  return stmt.run(data.type, data.amount, data.category, data.note || '', data.date, id)
})

// IPC 处理：获取月度统计
ipcMain.handle('get-monthly-stats', (_, month: string) => {
  const income = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type='income' AND date LIKE ?").get(`${month}%`)
  const expense = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type='expense' AND date LIKE ?").get(`${month}%`)
  const byCategory = db.prepare("SELECT category, SUM(amount) as total FROM transactions WHERE type='expense' AND date LIKE ? GROUP BY category ORDER BY total DESC").all(`${month}%`)
  return { income: (income as any).total, expense: (expense as any).total, byCategory }
})

// IPC 处理：获取分类
ipcMain.handle('get-categories', (_, type: string) => {
  return db.prepare('SELECT name FROM categories WHERE type = ? ORDER BY id').all(type).map((r: any) => r.name)
})

// IPC 处理：添加分类
ipcMain.handle('add-category', (_, type: string, name: string) => {
  return db.prepare('INSERT OR IGNORE INTO categories (type, name) VALUES (?, ?)').run(type, name)
})

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // 开发模式加载 Vite 服务器，生产模式加载打包文件
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
