# 记账APP

轻量级个人记账桌面工具，支持 Windows / macOS。

## 功能

- **收支记录**：快速记录收入和支出，支持自定义分类
- **数据展示**：本月收支概览、近7天趋势
- **分类统计**：饼图展示各类别占比
- **流水管理**：按月查看记录，支持删除

## 技术栈

- Electron 28 + React 18 + TypeScript
- Ant Design UI 组件
- ECharts 图表
- better-sqlite3 本地存储

## 开发

```bash
# 安装依赖
npm install

# 重建原生模块（better-sqlite3）
npx electron-rebuild -f -w better-sqlite3

# 启动开发模式
npm run dev
```

## 打包

```bash
# Windows
npm run pack:win

# macOS
npm run pack:mac
```

打包产物在 `dist-release/` 目录下。

## 数据存储

数据保存在本地 SQLite 数据库，路径：
- Windows: `%APPDATA%/money-app/money.db`
- macOS: `~/Library/Application Support/money-app/money.db`
