import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { AppRouteRecord } from '@/router/routes'
import { RouteGuardExecutioner } from '@/services/routeGuardExecutioner'

const routeRecords: AppRouteRecord[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/TodayViewPage.vue'),
  },
  {
    path: '/clubs',
    children: [
      {
        name: 'clubs.list',
        path: '',
        component: () => import('@/pages/ClubsPage.vue'),
      },
      {
        name: 'clubs.view',
        path: ':clubId',
        component: () => import('@/pages/ClubPage.vue'),
      },
      {
        name: 'clubs.create',
        path: 'new',
        component: () => import('@/pages/ClubCreatePage.vue'),
      },
      {
        name: 'clubs.editor',
        path: ':clubId/editor',
        component: () => import('@/pages/ClubEditorPage.vue'),
      },
    ],
  },
  {
    path: '/events',
    children: [
      {
        name: 'events.list',
        path: '',
        component: () => import('@/pages/EventsPage.vue'),
      },
      {
        name: 'events.view',
        path: ':eventId',
        component: () => import('@/pages/EventPage.vue'),
      },
      {
        name: 'events.create',
        path: 'new',
        component: () => import('@/pages/EventCreatePage.vue'),
      },
      {
        name: 'events.editor',
        path: ':eventId/editor',
        component: () => import('@/pages/EventEditorPage.vue'),
        redirect: { name: 'events.editor.general' },
        children: [
          {
            name: 'events.editor.general',
            path: 'general',
            component: () => import('@/pages/EventFormContainer.vue'),
          },
          {
            name: 'events.editor.judging',
            path: 'judging',
            component: () => import('@/pages/EventFormContainer.vue'),
          },
          {
            name: 'events.editor.registration',
            path: 'registration',
            component: () => import('@/pages/EventFormContainer.vue'),
          },
          {
            name: 'events.editor.sponsors',
            path: 'sponsors',
            component: () => import('@/pages/EventFormContainer.vue'),
          },
          {
            name: 'events.editor.preview',
            path: 'preview',
            component: () => import('@/pages/EventPreview.vue'),
          },
        ],
      },
      {
        name: 'events.register',
        path: ':eventId/register',
        component: () => import('@/pages/RegistrationPage.vue'),
      },
      {
        name: 'events.ballot',
        path: ':eventId/ballots/:ballotId',
        component: () => import('@/pages/BallotPage.vue'),
      },
    ],
  },
  {
    path: '/garage',
    children: [
      {
        name: 'vehicles.list',
        path: '',
        component: () => import('@/pages/VehiclesPage.vue'),
      },
      {
        name: 'vehicles.view',
        path: ':vehicleId',
        component: () => import('@/pages/VehiclePage.vue'),
      },
      {
        name: 'vehicles.create',
        path: 'new',
        component: () => import('@/pages/VehicleCreatePage.vue'),
      },
      {
        name: 'vehicles.editor',
        path: ':vehicleId/editor',
        component: () => import('@/pages/VehicleEditorPage.vue'),
      },
    ],
  },
  {
    path: '/profile',
    children: [
      {
        name: 'profile.view',
        path: '',
        component: () => import('@/pages/ProfilePage.vue'),
      },
      {
        name: 'profile.editor',
        path: 'editor',
        component: () => import('@/pages/ProfileEditorPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routeRecords as RouteRecordRaw[],
})

router.beforeEach(async (to, from) => {
  return await RouteGuardExecutioner.before(to, from)
})

router.afterEach((to, from) => {
  if (to.fullPath !== from.fullPath) {
    document.title = 'Car Show Manager'
  }

  return RouteGuardExecutioner.after(to, from)
})

export { router }