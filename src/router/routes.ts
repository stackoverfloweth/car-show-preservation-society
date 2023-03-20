import { RouteLocationRaw, RouteRecordRaw } from 'vue-router'

export const routes = {
  home: () => ({ name: 'home' }) as const,
  clubs: () => ({ name: 'clubs.list' }) as const,
  clubsCreate: () => ({ name: 'clubs.create' }) as const,
  club: (clubId: string) => ({ name: 'clubs.view', params: { clubId } }) as const,
  clubEvent: (clubId: string, eventId: string) => ({ name: 'clubs.event', params: { clubId, eventId } }) as const,
  events: () => ({ name: 'events.list' }) as const,
  eventsCreate: () => ({ name: 'events.create' }) as const,
  eventsEditor: (eventId: string) => ({ name: 'events.editor', params: { eventId } }) as const,
  eventsEditorGeneral: (eventId: string) => ({ name: 'events.editor.general', params: { eventId } }) as const,
  eventsEditorJudging: (eventId: string) => ({ name: 'events.editor.judging', params: { eventId } }) as const,
  eventsEditorRegistration: (eventId: string) => ({ name: 'events.editor.registration', params: { eventId } }) as const,
  eventsEditorSponsors: (eventId: string) => ({ name: 'events.editor.sponsors', params: { eventId } }) as const,
  eventsEditorPreview: (eventId: string) => ({ name: 'events.editor.preview', params: { eventId } }) as const,
  event: (eventId: string) => ({ name: 'events.view', params: { eventId } }) as const,
}

export type NamedRoute = ReturnType<typeof routes[keyof typeof routes]>['name']
export type AppRouteLocation = Omit<RouteLocationRaw, 'name'> & { name: NamedRoute }
export type AppRouteRecordParent = { name?: NamedRoute, children: AppRouteRecord[] }
export type AppRouteRecordChild = { name: NamedRoute }
export type AppRouteRecord = Omit<RouteRecordRaw, 'name' | 'children'> & AppRouteRecordParent | AppRouteRecordChild