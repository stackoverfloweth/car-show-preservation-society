<template>
  <MenuHeader />
  <NavigationHeader v-bind="{ left, center, right }" />
  <div>user: {{ user }}</div>
  <div>inviteToken: {{ inviteToken }}</div>
  <router-view :key="$route.fullPath" />
</template>

<script lang="ts" setup>
  import { useColorTheme } from '@prefecthq/prefect-design'
  import { useRouteQueryParam } from '@prefecthq/vue-compositions'
  import { provide } from 'vue'
  import { useRouter } from 'vue-router'
  import MenuHeader from '@/components/MenuHeader.vue'
  import NavigationHeader from '@/components/NavigationHeader.vue'
  import { useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'
  import { ApiConfig, auth } from '@/services'
  import { apiKey, createApi } from '@/services/createApi'
  import { env } from '@/utilities'

  const router = useRouter()
  const { setTheme } = useColorTheme()
  setTheme('dark')

  const inviteToken = useRouteQueryParam('invite_token')
  if (inviteToken.value) {
    router.push(routes.accept(inviteToken.value))
  }

  const user = auth.currentUser()

  const { left, center, right } = useNavigation()

  const config: ApiConfig = {
    baseUrl: env().baseApiUrl,
  }
  const api = createApi(config)
  provide(apiKey, api)
</script>

<style>
  html, body {
    min-height: 100%;
    scroll-behavior: smooth;
    background-color: var(--gray-900);
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>