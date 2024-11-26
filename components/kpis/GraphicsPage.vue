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
          :icon2="'pending'"
          :value2="pendingActivities.pendingDepositReviewOffers"
          label2="Ofertas pendientes de revisión de saldo"
          :icon3="'save'"
          :value3="pendingActivities.pendingDeliveryOffers"
          label3="Ofertas pendientes de entrega"
        />
      </div>
      <div class="mb-8">
        <DashboardCharts :filter-form-values="filterFormValues" />
      </div>
    </div>
    <SheetContent
      v-model:open="isSheetOpen"
      side="right"
      class="flex flex-col h-full"
      @pointer-down-outside="(e) => e.preventDefault()"
      @interact-outside="(e) => e.preventDefault()"
    >
      <SheetHeader>
        <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
          <X class="w-4 h-4 text-muted-foreground" />
        </SheetClose>
        <SheetTitle class="text-xl font-medium text-[#64748B]">
          Filtro
        </SheetTitle>
      </SheetHeader>
      <FilterModal
        v-model:open="isSheetOpen"
        :organizations="allOrganizations"
        :initial-form-values="filterFormValues"
        :on-submit="onSubmit"
      />
    </SheetContent>
    <KpisComparisonModule
      v-if="userSessionExtended.globalType === GlobalType.Platform"
    />
  </ContentLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import FilterModal from './components/FilterModal.vue'
import {
  getCalculatedFilterFormSchema,
  MonthSelect,
} from './components/month-select'
import type { FilterFormSchema } from './components/filter-form-schema'
import DashboardCharts from './components/DashboardCharts.vue'
import { useEventManagementAPI } from '~/composables/useEventManagementAPI'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import ActivityCard from '~/layouts/default/ActivityCard.vue'
import ReusableIconMenu from '~/layouts/default/ReusableIconMenu.vue'
import type { Organization } from '~/models/organizations'
import { GlobalType } from '~/types/Common'

const allOrganizations = ref<Organization[]>([])
const fetchOrganizations = async () => {
  const { data } = await useAPI('/organization-management/find-organizations', {
    method: 'GET',
    default: () => [],
  })
  allOrganizations.value = data.value as any
}

const userSessionExtended = useUserSessionExtended()

if (userSessionExtended.globalType === GlobalType.Platform) {
  await fetchOrganizations()
}

const filterFormValues = ref<FilterFormSchema>({
  ...getCalculatedFilterFormSchema(MonthSelect.ThisMonth),
  organizations:
    userSessionExtended.globalType === GlobalType.Platform
      ? allOrganizations.value.map((org) => org.id)
      : undefined,
})
const isSheetOpen = ref(false)
const openModal = () => {
  isSheetOpen.value = true
}

const onSubmit = (newValues: FilterFormSchema) => {
  filterFormValues.value = {
    ...getCalculatedFilterFormSchema(
      newValues.monthSelect as MonthSelect,
      newValues.rangeStart,
      newValues.rangeEnd,
    ),
    organizations: newValues.organizations,
  }
  isSheetOpen.value = false
}
const { pendingActivities, getEventsPendingActivities } =
  useEventManagementAPI()
</script>
