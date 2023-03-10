import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { AppRouteRecord } from '@/router/routes'

const routes: AppRouteRecord[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/EventsOverview.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
})

export { router }