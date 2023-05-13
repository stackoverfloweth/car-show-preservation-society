import { Ref, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { MaybeRef } from '@/types'

export function useRouteHash(key: MaybeRef<string>): Ref<string | undefined> {
  const keyRef = ref(key)
  const route = useRoute()

  const regexp = new RegExp(`^#${keyRef.value.replaceAll('#', '')}=(.*?)$`)

  return computed(() => {
    const [, value] = route.hash.match(regexp) ?? []

    return value
  })
}