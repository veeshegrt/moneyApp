import { useState, useEffect } from 'react'
import { Card, Row, Col, DatePicker, Empty } from 'antd'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'

interface StatsData {
  income: number
  expense: number
  byCategory: { category: string; total: number }[]
}

export default function Stats() {
  const [month, setMonth] = useState(dayjs())
  const [stats, setStats] = useState<StatsData | null>(null)

  const loadStats = async () => {
    const data = await (window as any).api.getMonthlyStats(month.format('YYYY-MM'))
    setStats(data)
  }

  useEffect(() => { loadStats() }, [month])

  if (!stats) return null

  const hasData = stats.income > 0 || stats.expense > 0

  const pieOption = {
    tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: stats.byCategory.map((item) => ({
          name: item.category,
          value: item.total,
        })),
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
      },
    ],
  }

  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['收入', '支出', '净收入'],
    },
    yAxis: { type: 'value', name: '金额 (元)' },
    series: [
      {
        type: 'bar',
        data: [
          { value: stats.income, itemStyle: { color: '#3f8600' } },
          { value: stats.expense, itemStyle: { color: '#cf1322' } },
          {
            value: stats.income - stats.expense,
            itemStyle: { color: stats.income - stats.expense >= 0 ? '#1677ff' : '#cf1322' },
          },
        ],
        label: {
          show: true,
          position: 'top',
          formatter: (p: any) => `¥${p.value.toFixed(2)}`,
        },
      },
    ],
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <DatePicker
          picker="month"
          value={month}
          onChange={(v) => v && setMonth(v)}
          allowClear={false}
        />
      </div>

      {!hasData ? (
        <Card><Empty description="本月暂无数据" /></Card>
      ) : (
        <Row gutter={16}>
          <Col span={12}>
            <Card title="收支概览">
              <ReactECharts option={barOption} style={{ height: 300 }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="支出分类">
              {stats.byCategory.length > 0 ? (
                <ReactECharts option={pieOption} style={{ height: 300 }} />
              ) : (
                <Empty description="暂无支出数据" />
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}
