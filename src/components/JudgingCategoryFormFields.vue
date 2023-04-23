<template>
  <div class="judging-category-form-fields">
    <p-label label="Name" :message="nameError" :state="nameState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="name" :state="nameState" />
      </template>
    </p-label>

    <p-label label="Description" :message="descriptionError" :state="descriptionState">
      <template #default="{ id }">
        <p-textarea :id="id" v-model="description" rows="6" :state="descriptionState" />
      </template>
    </p-label>

    <p-label label="Automatic Entry">
      <template #description>
        This category should include every vehicle registered for the event.
      </template>
      <template #default="{ id }">
        <p-toggle :id="id" v-model="automaticEntry" />
      </template>
    </p-label>

    <p-label label="Maximum Capacity" :message="maxCapacityError" :state="maxCapacityState">
      <template #description>
        Optional, maximum number of registrations accepted for this category.
        <p>(does not apply for categories that apply to all registrations.)</p>
      </template>
      <template #default="{ id }">
        <p-number-input :id="id" v-model="maxCapacity" :disabled="automaticEntry" :min="0" :state="maxCapacityState" />
      </template>
    </p-label>

    <p-label label="Additional Cost" :message="priceInPenniesError" :state="priceInPenniesState">
      <template #description>
        Optional, you can require that registrants pay additional cost to be judged in this category.
      </template>
      <template #default="{ id }">
        <PriceInput :id="id" v-model="priceInPennies" :state="priceInPenniesState" hide-free />
      </template>
    </p-label>

    <p-label label="Restricted Judging">
      <template #description>
        Optional, you can restrict voting in this category to only registrants or only club members.
        <template v-if="driversOnly">
          Currently <strong>only registrants</strong> are able to cast votes for this category.
        </template>
        <template v-else-if="membersOnly">
          Currently <strong>only club members</strong> are able to cast votes for this category.
        </template>
        <template v-else>
          Currently <strong>both</strong> are able to cast votes for this category.
        </template>
      </template>
      <div class="judging-category-form-fields__judging-options">
        <p-toggle v-model="driversOnly" append="Only Registrants" />
        <p-toggle v-model="membersOnly" append="Only Club Members" />
      </div>
    </p-label>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed, ref, watch } from 'vue'
  import PriceInput from '@/components/PriceInput.vue'
  import { VotingCategoryRequest } from '@/models/api'
  import { stringHasValue } from '@/services'

  const props = defineProps<{
    values: VotingCategoryRequest,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: VotingCategoryRequest): void,
  }>()

  const values = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const name = usePatchRef(values, 'name')
  const description = usePatchRef(values, 'description')
  const maxCapacity = usePatchRef(values, 'maxCapacity')
  const driversOnly = usePatchRef(values, 'driversOnly')
  const membersOnly = usePatchRef(values, 'membersOnly')
  const automaticEntry = usePatchRef(values, 'automaticEntry')
  const featured = usePatchRef(values, 'featured')
  const priceInPennies = ref<number>()

  const { error: nameError, state: nameState } = useValidation(name, 'Name', [stringHasValue])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [stringHasValue])
  const { error: maxCapacityError, state: maxCapacityState } = useValidation(maxCapacity, 'Maximum Capacity', [])
  const { error: priceInPenniesError, state: priceInPenniesState } = useValidation(priceInPennies, 'Additional Cost', [])

  watch(driversOnly, value => {
    if (value && membersOnly.value) {
      membersOnly.value = false
    }
  })

  watch(membersOnly, value => {
    if (value && driversOnly.value) {
      driversOnly.value = false
    }
  })
</script>

<style>
.judging-category-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.judging-category-form-fields__judging-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>