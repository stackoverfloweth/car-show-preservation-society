<template>
  <MenuHeader />
  <NavigationHeader />
  <router-view />
</template>

<script lang="ts" setup>
  import MenuHeader from '@/components/MenuHeader.vue'
  import NavigationHeader from '@/components/NavigationHeader.vue'
</script>

<style>
  html, body {
    background-color: var(--slate-900);
  }
</style>