import { ref } from 'vue'
import { routes } from '@/router/routes'
import { RouteGuard } from '@/services'
import { env } from '@/utilities'

export const password = ref<string>()

export const protectProd: RouteGuard = {
  before: (to) => {
    const purgatoryRoute = routes.purgatory()

    if (to.name === purgatoryRoute.name) {
      return true
    }

    if (!env().prod && password.value !== env().password) {
      return purgatoryRoute
    }
  },
}