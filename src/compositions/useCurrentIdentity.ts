import { useSubscription } from '@prefecthq/vue-compositions'
import { Ref, computed } from 'vue'
import { useApi } from '@/compositions/useApi'
import { User } from '@/models/user'
import { auth } from '@/services/auth'

export type UseCurrentIdentity = {
  user: Ref<User | undefined>,
}

export function useCurrentIdentity(): UseCurrentIdentity {
  const value = auth.currentUser()

  if (!value) {
    throw 'No user currently authenticated!'
  }

  const api = useApi()
  const userSubscription = useSubscription(api.users.getCurrentUser, [])
  const user = computed(() => userSubscription.response)

  return {
    user,
  }
}