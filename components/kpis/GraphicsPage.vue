<template>
  <ContentLayout title="Dashboard">
    <div class="bg-[#F4F7FA]">
      <div class="mb-4">
        <ReusableIconMenu icon-src="icon" @open-sheet="openModal" />
      </div>
      <div>
        <BerlinSimpleCard title="Actividades pendientes" class="mb-6">
          <div class="w-full flex flex-wrap gap-4">
            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[250px]"
              custom-icon-name="calendar_today"
              :kpi-value="pendingActivities.eventsInDebate.toString()"
              :description="'Eventos en debate'"
            />
            <!-- <BerlinActivityCard -->
            <!--   class="flex-1 min-w-[250px]" -->
            <!--   custom-icon-name="calendar_today" -->
            <!--   :kpi-value="pendingActivities.eventsInDebate.toString()" -->
            <!--   :description="'Ofertas en transferencia de bienes'" -->
            <!-- /> -->
            <!-- <BerlinActivityCard -->
            <!--   class="flex-1 min-w-[250px]" -->
            <!--   custom-icon-name="pending" -->
            <!--   :kpi-value=" -->
            <!--     pendingActivities.pendingDepositReviewOffers.toString() -->
            <!--   " -->
            <!--   :description="'Ofertas pendientes de revisión de abono'" -->
            <!-- /> -->
            <!---->
            <!-- <BerlinActivityCard -->
            <!--   class="flex-1 min-w-[250px]" -->
            <!--   custom-icon-name="save" -->
            <!--   :kpi-value="pendingActivities.pendingDeliveryOffers.toString()" -->
            <!--   :description="'Ofertas pendientes de entrega'" -->
            <!-- /> -->
          </div>
        </BerlinSimpleCard>
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
import ActivityCard from '~/layouts/default/ActivityCardDeprecated.vue'
import ReusableIconMenu from '~/layouts/default/ReusableIconMenu.vue'
import type { Organization } from '~/models/organizations'
import { GlobalType } from '~/types/Common'
import ActivityCardDeprecated from '~/layouts/default/ActivityCardDeprecated.vue'
import BerlinSimpleCard from '~/design-system/berlin/cards/simple-card/BerlinSimpleCard.vue'
import BerlinActivityCard from '~/design-system/berlin/cards/activity-card/BerlinActivityCard.vue'

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
