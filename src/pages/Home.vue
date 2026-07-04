<template>
  <div>
    <a-row :gutter="16" style="margin-bottom: 24px">
      <a-col :span="8">
        <a-card>
          <a-statistic title="本月收入" :value="stats.income" :precision="2" suffix="元">
            <template #prefix>
              <arrow-up-outlined style="color: #3f8600" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-statistic title="本月支出" :value="stats.expense" :precision="2" suffix="元">
            <template #prefix>
              <arrow-down-outlined style="color: #cf1322" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-statistic
            title="本月净收入"
            :value="stats.income - stats.expense"
            :precision="2"
            suffix="元"
            :valueStyle="{ color: stats.income - stats.expense >= 0 ? '#3f8600' : '#cf1322' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <div style="text-align: center; margin-top: 40px">
      <a-button type="primary" size="large" @click="open = true" style="width: 200px; height: 60px; font-size: 18px">
        <plus-outlined /> 快速记账
      </a-button>
    </div>

    <a-modal v-model:open="open" title="快速记账" @ok="handleSubmit" okText="保存" cancelText="取消" :confirmLoading="loading">
      <a-form layout="vertical">
        <a-form-item>
          <a-select v-model:value="type" style="width: 120px">
            <a-select-option value="expense">💸 支出</a-select-option>
            <a-select-option value="income">💰 收入</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="金额" required>
          <a-input-number v-model:value="form.amount" :min="0.01" :precision="2" prefix="¥" style="width: 100%" size="large" />
        </a-form-item>
        <a-form-item label="分类" required>
          <a-select
            v-model:value="form.category"
            mode="tags"
            :maxCount="1"
            :options="categories.map(c => ({ value: c, label: c }))"
            placeholder="选择或输入新分类"
          />
        </a-form-item>
        <a-form-item label="日期" required>
          <a-date-picker v-model:value="form.date" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="form.note" :rows="2" placeholder="可选" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const api = (window as any).api
const month = dayjs().format('YYYY-MM')

const open = ref(false)
const type = ref<'income' | 'expense'>('expense')
const loading = ref(false)
const categories = ref<string[]>([])
const stats = reactive({ income: 0, expense: 0 })

const form = reactive({
  amount: null as number | null,
  category: undefined as string | undefined,
  date: dayjs(),
  note: '',
})

const loadStats = async () => {
  const result = await api.getMonthlyStats(month)
  stats.income = result.income
  stats.expense = result.expense
}

const loadCategories = async () => {
  categories.value = await api.getCategories(type.value)
}

onMounted(() => {
  loadStats()
  loadCategories()
})

watch(type, () => {
  loadCategories()
  form.category = undefined
})

const handleSubmit = async () => {
  if (!form.amount || !form.category || !form.date) {
    message.warning('请填写完整')
    return
  }
  loading.value = true
  try {
    const cat = Array.isArray(form.category) ? form.category[0] : form.category
    if (!categories.value.includes(cat)) {
      await api.addCategory(type.value, cat)
      loadCategories()
    }
    await api.addTransaction({
      type: type.value,
      amount: form.amount,
      category: cat,
      note: form.note || '',
      date: form.date.format('YYYY-MM-DD'),
    })
    message.success('记录成功！')
    open.value = false
    form.amount = null
    form.category = undefined
    form.note = ''
    form.date = dayjs()
    loadStats()
  } finally {
    loading.value = false
  }
}
</script>
