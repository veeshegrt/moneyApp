<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-card title="收支总览">
        <div ref="barChart" style="height: 300px"></div>
      </a-card>
    </a-col>
    <a-col :span="12">
      <a-card title="支出分类">
        <div ref="pieChart" style="height: 300px"></div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

const api = (window as any).api
const barChart = ref<HTMLDivElement>()
const pieChart = ref<HTMLDivElement>()
let barInstance: echarts.ECharts | null = null
let pieInstance: echarts.ECharts | null = null

const loadStats = async () => {
  const month = dayjs().format('YYYY-MM')
  const stats = await api.getMonthlyStats(month)

  if (barInstance) {
    barInstance.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['收入', '支出', '净收入'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: [
          { value: stats.income, itemStyle: { color: '#3f8600' } },
          { value: stats.expense, itemStyle: { color: '#cf1322' } },
          { value: stats.income - stats.expense, itemStyle: { color: '#1890ff' } },
        ],
      }],
    })
  }

  if (pieInstance && stats.byCategory.length > 0) {
    pieInstance.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '60%',
        data: stats.byCategory.map((c: any) => ({ name: c.category, value: c.total })),
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
      }],
    })
  }
}

onMounted(() => {
  if (barChart.value) barInstance = echarts.init(barChart.value)
  if (pieChart.value) pieInstance = echarts.init(pieChart.value)
  loadStats()
})

onUnmounted(() => {
  barInstance?.dispose()
  pieInstance?.dispose()
})
</script>
