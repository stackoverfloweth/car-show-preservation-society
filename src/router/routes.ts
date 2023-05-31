import { RouteLocationRaw, RouteRecordRaw } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteFunction = (...args: any[]) => RouteLocationRaw
type RouteFunctionRecord = Record<string, RouteFunction>

export const routes = {
  home: () => ({ name: 'home' }) as const,
  clubs: () => ({ name: 'clubs.list' }) as const,
  clubCreate: () => ({ name: 'clubs.create' }) as const,
  club: (clubId: string) => ({ name: 'clubs.view', params: { clubId } }) as const,
  clubEditor: (clubId: string) => ({ name: 'clubs.editor', params: { clubId } }) as const,
  authLogin: () => ({ name: 'auth.login' }) as const,
  authSignup: () => ({ name: 'auth.signup' }) as const,
  authAccept: (token: string) => ({ name: 'auth.accept', params: { token } }) as const,
  authConfirm: () => ({ name: 'auth.confirm' }) as const,
  authChange: () => ({ name: 'auth.change' }) as const,
  authRequestRecovery: () => ({ name: 'auth.recover' }) as const,
  authRecovery: () => ({ name: 'auth.recovery' }) as const,
  events: () => ({ name: 'events.list' }) as const,
  eventCreate: () => ({ name: 'events.create' }) as const,
  eventEditor: (eventId: string) => ({ name: 'events.editor', params: { eventId } }) as const,
  eventEditorGeneral: (eventId: string) => ({ name: 'events.editor.general', params: { eventId } }) as const,
  eventEditorJudging: (eventId: string) => ({ name: 'events.editor.judging', params: { eventId } }) as const,
  eventEditorRegistration: (eventId: string) => ({ name: 'events.editor.registration', params: { eventId } }) as const,
  eventEditorSponsors: (eventId: string) => ({ name: 'events.editor.sponsors', params: { eventId } }) as const,
  eventEditorPreview: (eventId: string) => ({ name: 'events.editor.preview', params: { eventId } }) as const,
  eventBallot: (eventId: string, ballotId: string) => ({ name: 'events.ballot', params: { eventId, ballotId } }) as const,
  eventRegister: (eventId: string) => ({ name: 'events.register', params: { eventId } }) as const,
  eventRegistration: (eventId: string, registrationId: string) => ({ name: 'events.registration', params: { eventId, registrationId } }) as const,
  eventRegistrations: (eventId: string) => ({ name: 'events.registrations', params: { eventId } }) as const,
  event: (eventId: string) => ({ name: 'events.view', params: { eventId } }) as const,
  vehicles: () => ({ name: 'vehicles.list' }) as const,
  vehicleCreate: () => ({ name: 'vehicles.create' }) as const,
  vehicle: (vehicleId: string) => ({ name: 'vehicles.view', params: { vehicleId } }) as const,
  vehicleEditor: (vehicleId: string) => ({ name: 'vehicles.editor', params: { vehicleId } }) as const,
  profile: (userId?: string) => ({ name: 'profile.view', query: { userId } }) as const,
  profileEditor: () => ({ name: 'profile.editor' }) as const,
} satisfies RouteFunctionRecord

export type NamedRoute = ReturnType<typeof routes[keyof typeof routes]>['name']
export type AppRouteLocation = Omit<RouteLocationRaw, 'name'> & { name: NamedRoute }
export type AppRouteRecordParent = { name?: NamedRoute, children: AppRouteRecord[] }
export type AppRouteRecordChild = { name: NamedRoute }
export type AppRouteRecord = Omit<RouteRecordRaw, 'name' | 'children'> & AppRouteRecordParent | AppRouteRecordChild