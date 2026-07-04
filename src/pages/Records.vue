<template>
  <a-card title="收支流水">
    <template #extra>
      <a-month-picker v-model:value="month" @change="loadRecords" />
    </template>
    <a-empty v-if="records.length === 0" description="暂无记录" />
    <a-list v-else :dataSource="records">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a-popconfirm title="确定删除？" @confirm="handleDelete(item.id)" okText="是" cancelText="否">
              <a-button type="text" danger>
                <delete-outlined />
              </a-button>
            </a-popconfirm>
          </template>
          <a-list-item-meta>
            <template #title>
              <a-space>
                <a-tag :color="item.type === 'income' ? 'green' : 'red'">
                  {{ item.type === 'income' ? '收入' : '支出' }}
                </a-tag>
                <span>{{ item.category }}</span>
              </a-space>
            </template>
            <template #description>
              <span>{{ item.date }}{{ item.note ? ` · ${item.note}` : '' }}</span>
            </template>
          </a-list-item-meta>
          <div :style="{ fontSize: '16px', fontWeight: 'bold', color: item.type === 'income' ? '#3f8600' : '#cf1322' }">
            {{ item.type === 'income' ? '+' : '-' }}¥{{ item.amount.toFixed(2) }}
          </div>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const api = (window as any).api

interface Transaction {
  id: number
  type: 'income' | 'expense'
  amount: number
  category: string
  note: string
  date: string
  created_at: string
}

const records = ref<Transaction[]>([])
const month = ref(dayjs())

const loadRecords = async () => {
  records.value = await api.getTransactions(month.value.format('YYYY-MM'))
}

onMounted(loadRecords)
watch(month, loadRecords)

const handleDelete = async (id: number) => {
  await api.deleteTransaction(id)
  message.success('已删除')
  loadRecords()
}
</script>
