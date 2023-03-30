import { RouteLocationRaw, RouteRecordRaw } from 'vue-router'

export const routes = {
  home: () => ({ name: 'home' }) as const,
  clubs: () => ({ name: 'clubs.list' }) as const,
  clubCreate: () => ({ name: 'clubs.create' }) as const,
  club: (clubId: string) => ({ name: 'clubs.view', params: { clubId } }) as const,
  clubEvent: (clubId: string, eventId: string) => ({ name: 'clubs.event', params: { clubId, eventId } }) as const,
  events: () => ({ name: 'events.list' }) as const,
  eventCreate: () => ({ name: 'events.create' }) as const,
  eventEditor: (eventId: string) => ({ name: 'events.editor', params: { eventId } }) as const,
  eventEditorGeneral: (eventId: string) => ({ name: 'events.editor.general', params: { eventId } }) as const,
  eventEditorJudging: (eventId: string) => ({ name: 'events.editor.judging', params: { eventId } }) as const,
  eventEditorRegistration: (eventId: string) => ({ name: 'events.editor.registration', params: { eventId } }) as const,
  eventEditorSponsors: (eventId: string) => ({ name: 'events.editor.sponsors', params: { eventId } }) as const,
  eventEditorPreview: (eventId: string) => ({ name: 'events.editor.preview', params: { eventId } }) as const,
  event: (eventId: string) => ({ name: 'events.view', params: { eventId } }) as const,
  vehicles: () => ({ name: 'vehicles.list' }) as const,
  vehicleCreate: () => ({ name: 'vehicles.create' }) as const,
  vehicle: (vehicleId: string) => ({ name: 'vehicles.view', params: { vehicleId } }) as const,
  vehicleEditor: (vehicleId: string) => ({ name: 'vehicles.editor', params: { vehicleId } }) as const,
}

export type NamedRoute = ReturnType<typeof routes[keyof typeof routes]>['name']
export type AppRouteLocation = Omit<RouteLocationRaw, 'name'> & { name: NamedRoute }
export type AppRouteRecordParent = { name?: NamedRoute, children: AppRouteRecord[] }
export type AppRouteRecordChild = { name: NamedRoute }
export type AppRouteRecord = Omit<RouteRecordRaw, 'name' | 'children'> & AppRouteRecordParent | AppRouteRecordChild