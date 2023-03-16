import { inject, InjectionKey, provide, reactive } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import { MaybePromise } from '@/types'

export type NavigationRecord = {
  title: string | undefined,
  route: RouteLocationRaw | undefined,
  showChevron: boolean | undefined,
  pending: boolean | undefined,
  disabled: boolean | undefined,
  callback: (() => MaybePromise<void>) | undefined,
}

export type NavigationContext = {
  left: NavigationRecord,
  center: NavigationRecord,
  right: NavigationRecord,
}

export type PartialNavigationContext = {
  left?: Partial<NavigationRecord>,
  center?: Partial<NavigationRecord>,
  right?: Partial<NavigationRecord>,
}

export type UseNavigation = NavigationContext & {
  set: (context?: PartialNavigationContext) => void,
}

export function useNavigation(context?: PartialNavigationContext): UseNavigation {
  let navigation = inject(useNavigationKey)

  if (navigation === undefined) {
    navigation = createNavigation()
  }

  function set(context?: PartialNavigationContext): void {
    if (!navigation) {
      return
    }

    const empty = createEmptyNavigationRecord()
    Object.assign(navigation.left, {
      ...empty,
      ...context?.left,
    })
    Object.assign(navigation.center, {
      ...empty,
      ...context?.center,
    })
    Object.assign(navigation.right, {
      ...empty,
      ...context?.right,
    })
  }

  if (context) {
    set(context)
  }

  return { ...navigation, set }
}

function createNavigation(): NavigationContext {
  const navigation: NavigationContext = {
    left: reactive<NavigationRecord>(createEmptyNavigationRecord()),
    center: reactive<NavigationRecord>(createEmptyNavigationRecord()),
    right: reactive<NavigationRecord>(createEmptyNavigationRecord()),
  }

  provide(useNavigationKey, navigation)

  return navigation
}

function createEmptyNavigationRecord(): NavigationRecord {
  return {
    title: undefined,
    route: undefined,
    showChevron: undefined,
    pending: undefined,
    disabled: undefined,
    callback: undefined,
  }
}

export const useNavigationKey: InjectionKey<NavigationContext> = Symbol('UseNavigation')