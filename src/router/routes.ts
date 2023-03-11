import { RouteLocationRaw, RouteRecordName, RouteRecordRaw } from 'vue-router'

export const routes = {
  home: () => ({ name: 'home' }) as const,
  clubs: () => ({ name: 'clubs.list' }) as const,
  clubsCreate: () => ({ name: 'clubs.create' }) as const,
  club: (clubId: string) => ({ name: 'clubs.view', params: { clubId } }) as const,
}

export type NamedRoute = ReturnType<typeof routes[keyof typeof routes]>['name']

export function isNamedRoute(route?: RouteRecordName | null): route is NamedRoute {
  return typeof route === 'string' && Object.keys(routes).includes(route)
}

export type AppRouteLocation = Omit<RouteLocationRaw, 'name'> & { name: NamedRoute }
export type AppRouteRecordParent = { name?: NamedRoute, children: AppRouteRecord[] }
export type AppRouteRecordChild = { name: NamedRoute }
export type AppRouteRecord = Omit<RouteRecordRaw, 'name' | 'children'> & AppRouteRecordParent | AppRouteRecordChild