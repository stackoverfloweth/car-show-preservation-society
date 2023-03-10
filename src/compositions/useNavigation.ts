import { computed, reactive, Ref, ref } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import { last } from '@/utilities'

export type NavigationRecord = { name: string | undefined, route: RouteLocationRaw }
const history = reactive<NavigationRecord[]>([])
const right = ref<NavigationRecord>()

export type UseNavigation = {
  push: (route: RouteLocationRaw, name?: string) => void,
  pop: () => NavigationRecord | undefined,
  next: (route: RouteLocationRaw, name?: string) => void,
  left: Ref<NavigationRecord | undefined>,
  right: Ref<NavigationRecord | undefined>,
}

export function useNavigation(): UseNavigation {
  const push: UseNavigation['push'] = (route, name) => {
    history.push({ name, route })
  }

  const pop: UseNavigation['pop'] = () => {
    return history.pop()
  }

  const next: UseNavigation['next'] = (route, name) => {
    right.value = { name, route }
  }

  const left = computed(() => last(history))

  return {
    left,
    right,
    push,
    pop,
    next,
  }
}