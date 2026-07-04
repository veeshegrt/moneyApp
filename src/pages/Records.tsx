import { useState, useEffect } from 'react'
import { Card, List, Tag, DatePicker, Empty, Button, Popconfirm, message, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { Transaction } from '../types'

export default function Records() {
  const [records, setRecords] = useState<Transaction[]>([])
  const [month, setMonth] = useState(dayjs())

  const loadRecords = async () => {
    const data = await (window as any).api.getTransactions(month.format('YYYY-MM'))
    setRecords(data as Transaction[])
  }

  useEffect(() => { loadRecords() }, [month])

  const handleDelete = async (id: number) => {
    await (window as any).api.deleteTransaction(id)
    message.success('已删除')
    loadRecords()
  }

  return (
    <Card
      title="收支流水"
      extra={
        <DatePicker
          picker="month"
          value={month}
          onChange={(v) => v && setMonth(v)}
          allowClear={false}
        />
      }
    >
      {records.length === 0 ? (
        <Empty description="暂无记录" />
      ) : (
        <List
          dataSource={records}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="确定删除？"
                  onConfirm={() => handleDelete(item.id)}
                  okText="是"
                  cancelText="否"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Tag color={item.type === 'income' ? 'green' : 'red'}>
                      {item.type === 'income' ? '收入' : '支出'}
                    </Tag>
                    <span>{item.category}</span>
                  </Space>
                }
                description={
                  <span>
                    {item.date}
                    {item.note ? ` · ${item.note}` : ''}
                  </span>
                }
              />
              <div style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: item.type === 'income' ? '#3f8600' : '#cf1322',
              }}>
                {item.type === 'income' ? '+' : '-'}¥{item.amount.toFixed(2)}
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}
