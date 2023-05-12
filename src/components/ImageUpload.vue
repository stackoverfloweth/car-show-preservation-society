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
  <p-modal v-model:showModal="showModal" title="Upload Image" auto-close>
    <img v-if="typeof imageFile === 'string'" :src="imageFile">
    <p-form @submit="submit">
      <p-label label="Caption (optional)" :message="captionError" :state="captionState">
        <p-text-input v-model="caption" :state="captionState" />
      </p-label>
      <div class="image-upload__modal-actions">
        <p-button inset @click="close">
          Cancel
        </p-button>
        <p-button type="submit" :loading="pending">
          Save
        </p-button>
      </div>
    </p-form>
  </p-modal>
</template>

<script lang="ts" setup>
  import { useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import { ImageRequest } from '@/models/api'

  const props = defineProps<{
    image: Partial<ImageRequest> | undefined | null,
  }>()

  const emit = defineEmits<{
    (event: 'update:image', value: Partial<ImageRequest>): void,
  }>()

  const image = computed({
    get() {
      return props.image ?? {}
    },
    set(value) {
      emit('update:image', value)
    },
  })

  const { validate, pending } = useValidationObserver()
  const imageFile = ref<string>()
  const caption = ref<string>()

  const { error: captionError, state: captionState } = useValidation(caption, 'Caption', [])

  const showModal = computed({
    get() {
      return !!imageFile.value
    },
    set(value) {
      if (!value) {
        imageFile.value = undefined
      }
    },
  })

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || !imageFile.value) {
      return
    }

    image.value = {
      ...image.value,
      file: imageFile.value,
      caption: caption.value,
    }

    close()
  }

  function close(): void {
    showModal.value = false
  }

  function handleChange(event: Event): void {
    const target = event.target as HTMLInputElement
    const [file] = target.files!
    const reader = new FileReader()

    reader.onload = () => imageFile.value = typeof reader.result === 'string' ? reader.result : undefined
    reader.onerror = () => imageFile.value = undefined
    reader.readAsDataURL(file)
  }
</script>

<style>
.image-upload {
  flex-grow: 1;
}

.image-upload__dropzone {
  color: var(--gray-500);
  display: flex;
  padding: var(--space-sm) var(--space-md);
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

.image-upload__modal-actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

@media(max-width: 768px){
  .image-upload__dropzone {
    justify-content: start;
  }

  .image-upload__dropzone::after {
    content: 'Change Image'
  }

  .image-upload__modal-actions {
    flex-direction: column;
  }
}
</style>