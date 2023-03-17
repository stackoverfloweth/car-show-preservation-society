<template>
  <p-empty-state class="judging-categories-empty-state">
    <template #description>
      No judging categories exist for this event yet.
    </template>
    <template #actions>
      <slot name="actions"/>
    </template>
  </p-empty-state>
</template>