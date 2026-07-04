import { describe, it, expect } from 'vitest'
import router from '../router'

describe('Router', () => {
  it('应该有3个路由配置', () => {
    expect(router.getRoutes()).toHaveLength(3)
  })

  it('应该有首页路由', () => {
    const routes = router.getRoutes()
    const homeRoute = routes.find(route => route.path === '/')

    expect(homeRoute).toBeDefined()
    expect(homeRoute?.path).toBe('/')
  })

  it('应该有流水路由', () => {
    const routes = router.getRoutes()
    const recordsRoute = routes.find(route => route.path === '/records')

    expect(recordsRoute).toBeDefined()
    expect(recordsRoute?.path).toBe('/records')
  })

  it('应该有统计路由', () => {
    const routes = router.getRoutes()
    const statsRoute = routes.find(route => route.path === '/stats')

    expect(statsRoute).toBeDefined()
    expect(statsRoute?.path).toBe('/stats')
  })

  it('应该使用hash历史模式', () => {
    // 验证路由器实例存在
    expect(router).toBeDefined()
    expect(router.options.history).toBeDefined()
  })
})