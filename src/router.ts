import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Records from './pages/Records.vue'
import Stats from './pages/Stats.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/records', component: Records },
  { path: '/stats', component: Stats },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
