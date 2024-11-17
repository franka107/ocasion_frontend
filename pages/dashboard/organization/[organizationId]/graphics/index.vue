<template>
  <ContentLayout title="Dashboard">
    <div class="bg-[#F4F7FA]">
      <div class="mb-4">
        <ReusableIconMenu icon-src="icon" @open-sheet="openModal" />
      </div>
      <div>
        <ActivityCard
          title="Actividades pendientes"
          :icon1="'calendar_today'"
          :value1="pendingActivities.eventsInDebate"
          label1="Envíos debate"
          on-click1="handleViewDetail1"
          :icon2="'pending'"
          :value2="pendingActivities.pendingDepositReviewOffers"
          label2="Ofertas pendientes de revisión de saldo"
          :icon3="'save'"
          on-click2="handleViewDetail1"
          :value3="pendingActivities.pendingDeliveryOffers"
          label3="Ofertas pendientes de entrega"
          on-click3="handleViewDetail1"
        />
      </div>
      <div class="mb-8">
        <dashboard-charts />
      </div>
    </div>
    <div>{{ JSON.stringify(filterFormValues) }}</div>
    <FilterModal
      v-model:open="isSheetOpen"
      :initial-form-values="filterFormValues"
      :on-submit="onSubmit"
    />
  </ContentLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardCharts from '../components/DashboardCharts.vue'
import FilterModal from '../components/FilterModal.vue'
import {
  getCalculatedFilterFormSchema,
  MonthSelect,
} from '../components/month-select'
import type { FilterFormSchema } from '../components/filter-form-schema'
import { useEventManagementAPI } from '~/composables/useEventManagementAPI'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import ActivityCard from '~/layouts/default/ActivityCard.vue'
import ReusableIconMenu from '~/layouts/default/ReusableIconMenu.vue'

const filterFormValues = ref<FilterFormSchema>(
  getCalculatedFilterFormSchema(MonthSelect.ThisMonth),
)
const isSheetOpen = ref(false)
const openModal = () => {
  console.log('Opening modal')
  isSheetOpen.value = true
}

const onSubmit = (newValues: FilterFormSchema) => {
  filterFormValues.value = getCalculatedFilterFormSchema(
    newValues.monthSelect as MonthSelect,
    newValues.rangeStart,
    newValues.rangeEnd,
  )
  isSheetOpen.value = false
}
const { pendingActivities, getEventsPendingActivities } =
  useEventManagementAPI()

onMounted(async () => {})
</script>
