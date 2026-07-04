import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Button, Modal, Form, InputNumber, Select, DatePicker, Input, message } from 'antd'
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

interface Props {
  onNavigate: (page: string) => void
}

export default function Home({ onNavigate }: Props) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [stats, setStats] = useState({ income: 0, expense: 0 })
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  const month = dayjs().format('YYYY-MM')

  const loadCategories = async (t: string) => {
    const data = await (window as any).api.getCategories(t)
    setCategories(data)
  }

  useEffect(() => {
    loadCategories(type)
    form.setFieldValue('category', undefined)
  }, [type])

  const loadStats = async () => {
    const result = await (window as any).api.getMonthlyStats(month)
    setStats({ income: result.income, expense: result.expense })
  }

  useEffect(() => { loadStats() }, [])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      // 保存新分类
      const cat = Array.isArray(values.category) ? values.category[0] : values.category
      if (!categories.includes(cat)) {
        await (window as any).api.addCategory(type, cat)
        loadCategories(type)
      }
      await (window as any).api.addTransaction({
        type,
        amount: values.amount,
        category: Array.isArray(values.category) ? values.category[0] : values.category,
        note: values.note || '',
        date: values.date.format('YYYY-MM-DD'),
      })
      message.success('记录成功！')
      setOpen(false)
      form.resetFields()
      loadStats()
    } catch {
      // validation error, ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="本月收入"
              value={stats.income}
              precision={2}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="本月支出"
              value={stats.expense}
              precision={2}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="本月净收入"
              value={stats.income - stats.expense}
              precision={2}
              valueStyle={{ color: stats.income - stats.expense >= 0 ? '#3f8600' : '#cf1322' }}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
          style={{ width: 200, height: 60, fontSize: 18 }}
        >
          快速记账
        </Button>
      </div>

      <Modal
        title="快速记账"
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        confirmLoading={loading}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" initialValues={{ date: dayjs() }}>
          <Form.Item>
            <Select
              value={type}
              onChange={setType}
              options={[
                { value: 'expense', label: '💸 支出' },
                { value: 'income', label: '💰 收入' },
              ]}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true, message: '请输入金额' }]}>
            <InputNumber min={0.01} precision={2} prefix="¥" style={{ width: '100%' }} size="large" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择或输入分类' }]}>
            <Select
              mode="tags"
              maxCount={1}
              options={categories.map(c => ({ value: c, label: c }))}
              placeholder="选择或输入新分类"
            />
          </Form.Item>
          <Form.Item name="date" label="日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="note" label="备注">
            <Input.TextArea rows={2} placeholder="可选" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
