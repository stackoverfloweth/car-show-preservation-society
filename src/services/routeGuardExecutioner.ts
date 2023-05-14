import { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { MaybePromise } from '@/types'

export type RouteGuardReturn = MaybePromise<void | Error | RouteLocationRaw | boolean>

export interface RouteGuard {
  before?: (to: RouteLocationNormalized, from: RouteLocationNormalized) => RouteGuardReturn,
  after?: (to: RouteLocationNormalized, from: RouteLocationNormalized) => void,
}

export class RouteGuardExecutioner {
  private static readonly global: RouteGuard[] = []

  public static async before(to: RouteLocationNormalized, from: RouteLocationNormalized): Promise<Awaited<RouteGuardReturn>> {
    const guards = this.getRouteGuards(to)

    for (const guard of guards) {
      // eslint-disable-next-line no-await-in-loop
      const result = await guard.before?.(to, from)

      if (this.isRouteLocation(result)) {
        return result
      }
    }
  }

  public static after(to: RouteLocationNormalized, from: RouteLocationNormalized): void {
    const guards = this.getRouteGuards(to)

    for (const guard of guards) {
      guard.after?.(to, from)
    }
  }

  public static register(guard: RouteGuard): void {
    this.global.push(guard)
  }

  private static getRouteGuards(route: RouteLocationNormalized): RouteGuard[] {
    const guards = route.matched.flatMap(route => route.meta.guards ?? [])

    return [...this.global, ...guards]
  }

  private static isRouteLocation(result: RouteGuardReturn): result is RouteLocationRaw {
    return typeof result === 'string' || typeof result == 'object'
  }

}