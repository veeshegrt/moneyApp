import { useState } from 'react'
import { ConfigProvider, Layout, Menu, theme } from 'antd'
import {
  HomeOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import Home from './pages/Home'
import Records from './pages/Records'
import Stats from './pages/Stats'

const { Header, Content } = Layout

const pages = [
  { key: 'home', label: '首页', icon: <HomeOutlined /> },
  { key: 'records', label: '流水', icon: <UnorderedListOutlined /> },
  { key: 'stats', label: '统计', icon: <BarChartOutlined /> },
]

export default function App() {
  const [page, setPage] = useState('home')

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home onNavigate={setPage} />
      case 'records': return <Records />
      case 'stats': return <Stats />
      default: return <Home onNavigate={setPage} />
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#1677ff' },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 40 }}>
            💰 记账APP
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[page]}
            items={pages}
            onClick={({ key }) => setPage(key)}
            style={{ flex: 1 }}
          />
        </Header>
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          {renderPage()}
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
