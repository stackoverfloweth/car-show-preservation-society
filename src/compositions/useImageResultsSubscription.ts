import { useSubscription } from '@prefecthq/vue-compositions'
import { ComputedRef, Ref, computed, ref, watch } from 'vue'
import { Image, ImageResults } from '@/models'
import { MaybeRef } from '@/types'

export type UseImageResultsSubscription = {
  images: Ref<Image[]>,
  hasMore: ComputedRef<boolean>,
  loadMore: () => void,
}

type AnyImageResultFunction = (id: string, page?: number) => Promise<ImageResults>
export function useImageResultsSubscription(method: AnyImageResultFunction, id: MaybeRef<string>): UseImageResultsSubscription {
  const idRef = ref(id)
  const page = ref(1)
  const subscription = useSubscription(method, [idRef, page])
  const pageResults = computed(() => subscription.response?.images ?? [])
  const hasMore = computed(() => subscription.response?.hasMore ?? false)

  const images = ref<Image[]>([])

  watch(pageResults, value => {
    images.value = [
      ...images.value,
      ...value,
    ]
  }, { immediate: true })

  function loadMore(): void {
    page.value = page.value + 1
  }

  return {
    images,
    hasMore,
    loadMore,
  }
}