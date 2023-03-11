import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { clearNavigation } from '@/compositions'
import { AppRouteRecord } from '@/router/routes'

const routes: AppRouteRecord[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/EventsOverview.vue'),
  },
  {
    path: '/clubs',
    children: [
      {
        name: 'clubs.list',
        path: '',
        component: () => import('@/pages/ClubsOverview.vue'),
      },
      {
        name: 'clubs.view',
        path: ':clubId',
        component: () => import('@/pages/ClubOverview.vue'),
      },
      {
        name: 'clubs.create',
        path: 'new',
        component: () => import('@/pages/ClubsCreate.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
})

router.beforeEach(() => {
  clearNavigation()

  return true
})

export { router }