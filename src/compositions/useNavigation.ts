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