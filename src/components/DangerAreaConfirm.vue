<template>
  <p-message v-if="isOpen" v-bind="$attrs" error class="danger-area-confirm">
    <div class="danger-area-confirm__body">
      <slot name="confirm-text">
        <p v-if="confirmText">
          {{ confirmText }}
        </p>
        <p v-else>
          Are you sure?
        </p>
      </slot>
      <template v-if="forceType">
        <div class="danger-area-confirm__force-type">
          <p-label>
            <template #label>
              Type "{{ forceType }}" to continue
            </template>
            <template #default="{ id }">
              <p-text-input :id="id" v-model="typedValue" />
            </template>
          </p-label>
        </div>
      </template>
      <div class="danger-area-confirm__actions">
        <p-button inset @click="close">
          Cancel
        </p-button>
        <p-button danger :disabled="disabled" @click="confirm">
          Confirm
        </p-button>
      </div>
    </div>
  </p-message>
  <template v-else>
    <slot name="target" v-bind="{ open, close, toggle, isOpen }" />
  </template>
</template>

<script lang="ts">
  export default {
    name: 'DangerAreaConfirm',
    expose: [],
    inheritAttrs: false,
  }
</script>

<script lang="ts" setup>
  import { computed, ref } from 'vue'

  const props = defineProps<{
    confirmText?: string,
    forceType?: string,
  }>()

  const emit = defineEmits<{
    (event: 'confirmed'): void,
  }>()

  const typedValue = ref<string>()
  const isOpen = ref(false)
  const disabled = computed(() => {
    if (props.forceType === undefined) {
      return false
    }

    return props.forceType !== typedValue.value
  })

  function open(): void {
    isOpen.value = true
  }

  function close(): void {
    isOpen.value = false
  }

  function toggle(): void {
    isOpen.value = !isOpen.value
  }

  function confirm(close: () => void): void {
    emit('confirmed')
    close()
  }
</script>

<style>
.danger-area-confirm {
  background: repeating-linear-gradient(
    45deg,
    rgba(220, 38, 38, 0.4),
    rgba(220, 38, 38, 0.4) 10px,
    rgba(220, 38, 38, 0.5) 10px,
    rgba(220, 38, 38, 0.5) 20px
  );
}

.danger-area-confirm__body {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  gap: var(--space-3);
}

.danger-area-confirm__actions {
  display: flex;
  gap: var(--space-3);
}
</style>