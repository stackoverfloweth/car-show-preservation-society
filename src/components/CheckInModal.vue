<template>
  <p-modal v-bind="$attrs" v-model:showModal="showModal" title="Check In" class="check-in-modal" auto-close>
    check-in-modal
  </p-modal>
  <slot name="target" v-bind="{ showModal, open, close }" />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'CheckInModal',
    expose: [],
    inheritAttrs: false,
  })
</script>

<script lang="ts" setup>
  import { useShowModal } from '@/compositions'

  const { showModal, open, close } = useShowModal()
</script>