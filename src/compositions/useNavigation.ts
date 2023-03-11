import { ref, Ref } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export type NavigationRecord = {
  name: string | undefined,
  route: RouteLocationRaw,
  showChevron?: boolean,
}

export type UseNavigation = {
  left: Ref<NavigationRecord | undefined>,
  title: Ref<string | undefined>,
  right: Ref<NavigationRecord | undefined>,
}

const left = ref<NavigationRecord>()
const title = ref<string>()
const right = ref<NavigationRecord>()

export function clearNavigation(): UseNavigation {
  return useNavigation(undefined, undefined, undefined)
}

export function useNavigationLeft(newLeft: NavigationRecord): UseNavigation {
  return useNavigation(newLeft)
}

export function useNavigationRight(newRight: NavigationRecord): UseNavigation {
  return useNavigation(undefined, undefined, newRight)
}

export function useNavigationTitle(name: string): UseNavigation {
  return useNavigation(undefined, name)
}

export function useNavigation(newLeft?: NavigationRecord, newTitle?: string, newRight?: NavigationRecord): UseNavigation {
  left.value = newLeft
  title.value = newTitle
  right.value = newRight

  return {
    left,
    title,
    right,
  }
}