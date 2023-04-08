<template>
  <p-base-input class="image-upload">
    <template #control="{ attrs }">
      <input
        type="file"
        accept="image/*"
        class="image-upload__dropzone"
        v-bind="attrs"
        @change="handleChange"
      >
    </template>
  </p-base-input>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { ImageRequest } from '@/models/api'
  import { cloudFlareApi } from '@/services/cloudFlareApi'

  const props = defineProps<{
    image: ImageRequest | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:image', value: ImageRequest | undefined): void,
  }>()

  const image = computed({
    get() {
      return props.image
    },
    set(value) {
      emit('update:image', value)
    },
  })

  function handleChange(event: Event): void {
    const target = event.target as HTMLInputElement
    const [file] = target.files!

    const data = new FormData()
    data.append('name', 'my-picture')
    data.append('file', file)

    cloudFlareApi.uploadImage(data)
  }
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

.image-upload__dropzone::before {
  content: 'Drop File'
}

.image-upload__dropzone::file-selector-button {
  display: none;
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