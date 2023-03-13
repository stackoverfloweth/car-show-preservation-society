import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { clearNavigation } from '@/compositions'
import { AppRouteRecord } from '@/router/routes'

const routes: AppRouteRecord[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/TodayView.vue'),
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
        component: () => import('@/pages/ClubCreate.vue'),
      },
    ],
  },
  {
    path: '/events',
    children: [
      {
        name: 'events.list',
        path: '',
        component: () => import('@/pages/EventsOverview.vue'),
      },
      {
        name: 'events.view',
        path: ':eventId',
        component: () => import('@/pages/EventOverview.vue'),
      },
      {
        name: 'events.create',
        path: 'new',
        component: () => import('@/pages/EventCreate.vue'),
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