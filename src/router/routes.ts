import { RouteLocationRaw, RouteRecordName, RouteRecordRaw } from 'vue-router'

export const settingsRoutes = {
  accountSettings: () => ({ name: 'settings.account' }) as const,
  locales: () => ({ name: 'settings.locales' }) as const,
  emailTemplates: () => ({ name: 'settings.emailTemplates' }) as const,
}

export const routes = {
  home: () => ({ name: 'home' }) as const,
  reports: () => ({ name: 'reports.list' }) as const,
  report: (id: string) => ({ name: 'reports.report', params: { id } }) as const,
  rentalPlans: () => ({ name: 'rentalPlans.list' }) as const,
  rentalPlan: (id: string) => ({ name: 'rentalPlans.plan', params: { id } }) as const,
  rentalPlanCreate: () => ({ name: 'rentalPlans.new' }) as const,
  contractTemplates: () => ({ name: 'contractTemplates.list' }) as const,
  contractTemplate: (id: string) => ({ name: 'contractTemplates.template', params: { id } }) as const,
  contractTemplateCreate: () => ({ name: 'contractTemplates.new' }) as const,
  units: () => ({ name: 'units.list' }) as const,
  unit: (id: string) => ({ name: 'units.unit', params: { id } }) as const,
  unitCreate: () => ({ name: 'units.new' }) as const,
  settings: () => ({ name: 'settings' }) as const,
  ...settingsRoutes,
  communications: () => ({ name: 'communications' }) as const,
  staffMembers: () => ({ name: 'staffMembers' }) as const,
  subscription: () => ({ name: 'subscription' }) as const,
}

export type NamedRoute = ReturnType<typeof routes[keyof typeof routes]>['name']

export function isNamedRoute(route?: RouteRecordName | null): route is NamedRoute {
  return typeof route === 'string' && Object.keys(routes).includes(route)
}

export type AppRouteLocation = Omit<RouteLocationRaw, 'name'> & { name: NamedRoute }
export type AppRouteRecordParent = { name?: NamedRoute, children: AppRouteRecord[] }
export type AppRouteRecordChild = { name: NamedRoute }
export type AppRouteRecord = Omit<RouteRecordRaw, 'name' | 'children'> & AppRouteRecordParent | AppRouteRecordChild