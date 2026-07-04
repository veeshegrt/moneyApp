<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header style="display: flex; align-items: center; padding: 0 24px">
      <div style="color: white; font-size: 18px; font-weight: bold; margin-right: 40px">
        💰 记账APP
      </div>
      <a-menu
        mode="horizontal"
        theme="dark"
        :selectedKeys="selectedKeys"
        @click="handleMenuClick"
        style="flex: 1"
      >
        <a-menu-item key="/">首页</a-menu-item>
        <a-menu-item key="/records">流水</a-menu-item>
        <a-menu-item key="/stats">统计</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 24px">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectedKeys = computed(() => [route.path])

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}
</script>
