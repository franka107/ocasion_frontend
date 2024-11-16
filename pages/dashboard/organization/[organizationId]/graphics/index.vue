<template>
  <ContentLayout title="Dashboard">
    <div class="bg-[#F4F7FA]">
      <div class="mb-4">
        <ReusableIconMenu
          iconSrc="icon"
          @open-sheet="openModal"
        />
      </div>
      <div>
        <ActivityCard
            title="Actividades pendientes"
            :icon1="'calendar_today'"
            :value1="pendingActivities.eventsInDebate"
            label1="Envíos debate"
            onClick1="handleViewDetail1"
            :icon2="'pending'"
            :value2="pendingActivities.pendingDepositReviewOffers"
            label2="Ofertas pendientes de revisión de saldo"
            :icon3="'save'"
            onClick2="handleViewDetail1"
            :value3="pendingActivities.pendingDeliveryOffers"
            label3="Ofertas pendientes de entrega"
            onClick3="handleViewDetail1"
          />

      </div>
      <div class="mb-8">
        <dashboard-charts />
      </div>
    </div>
    <FilterModal v-model:open="isSheetOpen" />
  </ContentLayout>
</template>

<script setup lang="ts">
import { ref,onMounted } from "vue";
import { useEventManagementAPI } from "~/composables/useEventManagementAPI";
import ContentLayout from "~/layouts/default/ContentLayout.vue";
import ActivityCard from "~/layouts/default/ActivityCard.vue";
import ReusableIconMenu from "~/layouts/default/ReusableIconMenu.vue";
import DashboardCharts from "../components/DashboardCharts.vue";
import FilterModal from "../components/FilterModal.vue";

const isSheetOpen = ref(false)
const openModal = () => {
  console.log('Opening modal')
  isSheetOpen.value = true
}
const {pendingActivities,getEventsPendingActivities}= useEventManagementAPI()

//
onMounted(async() =>{})

</script>
