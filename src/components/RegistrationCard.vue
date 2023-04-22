<template>
  <div class="registration-card">
    <ul>
      <li>Show Registration Info</li>
      <li>Show if paid, what is owed, option to complete payment</li>
      <li>If event.isHappening, option to "check-in"</li>
      <li>"check-in" includes option to change vehicle/category</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { Registration } from '@/models'

  defineProps<{
    registration: Registration,
  }>()
</script>

<style>

</style>