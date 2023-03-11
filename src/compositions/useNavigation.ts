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
  left.value = newLeft

  return {
    left,
    title,
    right,
  }
}

export function useNavigationRight(newRight: NavigationRecord): UseNavigation {
  right.value = newRight

  return {
    left,
    title,
    right,
  }
}

export function useNavigationTitle(newTitle: string): UseNavigation {
  title.value = newTitle

  return {
    left,
    title,
    right,
  }
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