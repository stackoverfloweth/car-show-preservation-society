<template>
  <div class="event-registration-page">
    <!-- <EventHeader :event="event" @club:click="openRelatedClub" /> -->

    <!--
      V_IF_CAN_EDIT_EVENT

      <p-label label="Selected Vehicle">
      <VehicleIdCard v-if="existingRegistration.vehicleId" :vehicle-id="existingRegistration.vehicleId" />
      </p-label>

      <p-label label="Judging Category">
      <JudgingCategoriesList :categories="existingRegistration.votingCategories" />
      </p-label>
    -->
    <img class="event-register-page__qr-code" src="/qr-example.png">
    <ul>
      <li>Show Registration Info</li>
      <li>Show if paid, what is owed, option to complete payment</li>
      <li>If event.isHappening, option to "check-in"</li>
      <li>"check-in" includes option to change vehicle/category</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam } from '@prefecthq/vue-compositions'
  import { useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const eventId = useRouteParam('eventId')
  const registrationId = useRouteParam('registrationId')

  useNavigation({
    left: { title: 'Event', route: routes.event(eventId.value) },
  })
</script>