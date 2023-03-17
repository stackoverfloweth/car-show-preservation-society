<template>
  <p-base-input class="image-upload">
    <template #control="{ attrs }">
      <div class="image-upload__dropzone" v-bind="attrs" />
    </template>
  </p-base-input>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { Image } from '@/models'

  const props = defineProps<{
    image: Image | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:image', value: Image | undefined): void,
  }>()

  const image = computed({
    get() {
      return props.image
    },
    set(value) {
      emit('update:image', value)
    },
  })
</script>

<style>
.image-upload {
  flex-grow: 1;
}

.image-upload__dropzone {
  color: var(--slate-500);
  display: flex;
  padding: var(--space-2) var(--space-4);
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  min-height: 40px;
  height: 100%;
}

.image-upload__dropzone::after {
  content: 'Drop File'
}

@media(max-width: 768px){
  .image-upload__dropzone {
    justify-content: start;
  }

  .image-upload__dropzone::after {
    content: 'Change Image'
  }
}
</style>