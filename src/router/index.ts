import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { protectedRoute } from '@/router/guards'
import { AppRouteRecord } from '@/router/routes'
import { RouteGuardExecutioner } from '@/services/routeGuardExecutioner'

const routeRecords: AppRouteRecord[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/TodayViewPage.vue'),
  },
  {
    name: 'auth.login',
    path: '/login',
    component: () => import('@/pages/AuthLoginPage.vue'),
  },
  {
    name: 'auth.signup',
    path: '/signup',
    component: () => import('@/pages/AuthSignupPage.vue'),
  },
  {
    name: 'auth.accept',
    path: '/accept-invite/:token',
    component: () => import('@/pages/AuthAcceptInvitePage.vue'),
  },
  {
    name: 'auth.confirm',
    path: '/confirm/:token',
    component: () => import('@/pages/AuthConfirmPage.vue'),
  },
  {
    name: 'auth.change',
    path: '/confirm-change/:token',
    component: () => import('@/pages/AuthConfirmChangePage.vue'),
  },
  {
    name: 'auth.recover',
    path: '/recovery',
    component: () => import('@/pages/AuthRequestRecoveryPage.vue'),
  },
  {
    name: 'auth.recovery',
    path: '/recovery/:token',
    component: () => import('@/pages/AuthRecoveryPage.vue'),
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
        meta: {
          guards: [protectedRoute],
        },
      },
      {
        name: 'clubs.editor',
        path: ':clubId/editor',
        component: () => import('@/pages/ClubEditorPage.vue'),
        meta: {
          guards: [protectedRoute],
        },
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
        meta: {
          guards: [protectedRoute],
        },
      },
      {
        name: 'events.editor',
        path: ':eventId/editor',
        component: () => import('@/pages/EventEditorPage.vue'),
        redirect: { name: 'events.editor.general' },
        meta: {
          guards: [protectedRoute],
        },
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
            component: () => import('@/pages/EventSponsorsFormContainer.vue'),
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
        component: () => import('@/pages/EventRegisterPage.vue'),
        meta: {
          guards: [protectedRoute],
        },
      },
      {
        name: 'events.registrations',
        path: ':eventId/registrations',
        component: () => import('@/pages/EventRegistrationsPage.vue'),
        meta: {
          guards: [protectedRoute],
        },
      },
      {
        name: 'events.registration',
        path: ':eventId/registrations/:registrationId',
        component: () => import('@/pages/EventRegistrationPage.vue'),
        meta: {
          guards: [protectedRoute],
        },
      },
      {
        name: 'events.ballot',
        path: ':eventId/ballots/:ballotId',
        component: () => import('@/pages/BallotPage.vue'),
        meta: {
          guards: [protectedRoute],
        },
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
        meta: {
          guards: [protectedRoute],
        },
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
        meta: {
          guards: [protectedRoute],
        },
      },
      {
        name: 'vehicles.editor',
        path: ':vehicleId/editor',
        component: () => import('@/pages/VehicleEditorPage.vue'),
        meta: {
          guards: [protectedRoute],
        },
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
        meta: {
          guards: [protectedRoute],
        },
      },
      {
        name: 'profile.editor',
        path: 'editor',
        component: () => import('@/pages/ProfileEditorPage.vue'),
        meta: {
          guards: [protectedRoute],
        },
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
  // if (to.fullPath !== from.fullPath) {
  //   document.title = 'Car Show Preservation Society'
  // }

  return RouteGuardExecutioner.after(to, from)
})

export { router }