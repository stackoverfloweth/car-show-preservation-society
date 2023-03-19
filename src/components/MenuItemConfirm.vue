<template>
  <template v-if="showConfirm">
    <div class="menu-item-confirm__message">
      Are you sure?
    </div>
    <p-overflow-menu-item class="menu-item-confirm__yes" label="Yes" @click="confirm" />
    <p-overflow-menu-item class="menu-item-confirm__no" label="No" @click.stop="close" />
  </template>
  <template v-else>
    <slot :open="open" />
  </template>
</template>

<script lang="ts">
  export default {
    name: 'MenuItemConfirm',
    expose: [],
    inheritAttrs: false,
  }
</script>

<script lang="ts" setup>
  import { ref } from 'vue'

  const emit = defineEmits<{
    (event: 'confirm'): void,
  }>()

  const showConfirm = ref(false)

  function confirm(): void {
    emit('confirm')
  }

  function close(): void {
    showConfirm.value = false
  }

  function open(): void {
    showConfirm.value = true
  }
</script>

<style>
.menu-item-confirm__message {
  color: var(--slate-400);
  padding: var(--space-4);
}

.menu-item-confirm__yes {
  color: var(--red-400);
}
</style>