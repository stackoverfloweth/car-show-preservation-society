<template>
  <SizedImage v-if="image" class="event-advertisement" :image="image">
    [Event Advertisement]
  </SizedImage>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { toRefs, computed } from 'vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi } from '@/compositions'
  import { mocker } from '@/services'

  const props = defineProps<{
    eventId: string,
  }>()

  const { eventId } = toRefs(props)
  const api = useApi()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const event = computed(() => eventSubscription.response)

  const image = mocker.create('image')
</script>