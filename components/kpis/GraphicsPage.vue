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
              class="flex-1 min-w-[150px]"
              :kpi-value="
                rechargeRequestAdvicesForPlatform.retireRequestPendingCount.toFixed(
                  0,
                )
              "
              :description="'Solicitudes de retiro pendientes'"
              @view-detail-button-pressed="
                () => {
                  console.log('view-detail-button-pressed')
                  router.push(
                    '/dashboard/platform/attention-tray/withdrawal-requests',
                  )
                }
              "
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                rechargeRequestAdvicesForPlatform.retireRequestApprovedCount.toFixed(
                  0,
                )
              "
              :description="'Solicitudes de retiro aprobadas'"
              @view-detail-button-pressed="
                () => {
                  router.push('/dashboard/platform/reports/transactions')
                }
              "
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                rechargeRequestAdvicesForPlatform.rechargeRequestPendingCount.toFixed(
                  0,
                )
              "
              :description="'Solicitudes de recarga pendientes'"
              @view-detail-button-pressed="
                () => {
                  router.push(
                    '/dashboard/platform/attention-tray/top-up-requests',
                  )
                }
              "
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                rechargeRequestAdvicesForPlatform.accountValidationPendingCount.toFixed(
                  0,
                )
              "
              :description="'Validaciones de cuenta pendientes'"
              @view-detail-button-pressed="
                () => {
                  router.push(
                    '/dashboard/platform/attention-tray/account-validation',
                  )
                }
              "
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                offerAdvicesForPlatform.offersInDepositReviewCount.toFixed(0)
              "
              :description="'Ofertas en revisión de abono'"
              @view-detail-button-pressed="
                () => {
                  router.push('/dashboard/platform/payments')
                }
              "
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                offerAdvicesForPlatform.offersPendingOfDeliveryCount.toFixed(0)
              "
              :description="'Ofertas pendientes de entrega'"
              @view-detail-button-pressed="
                () => {
                  router.push('/dashboard/platform/sustentation')
                }
              "
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                eventAdvicesForPlatform.eventsInDebateCount.toFixed(0)
              "
              :description="'Eventos en debate'"
              @view-detail-button-pressed="
                () => {
                  router.push('/dashboard/platform/events')
                }
              "
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Organization"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                offerAdvicesForOrganization.offersPendingOfDeliveryCount.toFixed(
                  0,
                )
              "
              :description="'Ofertas pendientes de entrega'"
              @view-detail-button-pressed="
                () => {
                  router.push(
                    `/dashboard/organization/${route.params.organizationId}/sustentation`,
                  )
                }
              "
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Organization"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                offerAdvicesForOrganization.offersInDepositReviewCount.toFixed(
                  0,
                )
              "
              :description="'Ofertas en revisión de abono'"
              @view-detail-button-pressed="
                () => {
                  router.push(
                    `/dashboard/organization/${route.params.organizationId}/payments`,
                  )
                }
              "
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Organization"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                offerAdvicesForOrganization.offersInTransferOfGoodCount.toFixed(
                  0,
                )
              "
              :description="'Ofertas en transferencia de bienes'"
              @view-detail-button-pressed="
                () => {
                  router.push(
                    `/dashboard/organization/${route.params.organizationId}/sustentation`,
                  )
                }
              "
            />
          </div>
        </BerlinSimpleCard>

        <BerlinSimpleCard
          v-if="userSessionExtended.globalType === GlobalType.Platform"
          title="Finanzas"
          class="mb-6"
        >
          <div class="w-full flex flex-wrap gap-4">
            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                kpiFinanceForPlatform.participantsWithGuaranteeSeparatedCount.toFixed(
                  0,
                )
              "
              :description="'Cantidad de participantes con garantía separada'"
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              type="money"
              :kpi-value="kpiFinanceForPlatform.guaranteeSeparatedAmount"
              :description="'Total de garantía separada'"
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                kpiFinanceForPlatform.numberOfParticipantsPerOfferAverage.toFixed(
                  2,
                )
              "
              :description="'Promedio de cantidad de participantes por oferta'"
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="kpiFinanceForPlatform.bidsPerOfferAverage.toFixed(2)"
              :description="'Promedio de pujas por oferta'"
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="
                kpiFinanceForPlatform.comissionsChargedCount.toFixed(0)
              "
              :description="'Total de comisiones cobradas'"
            />

            <BerlinActivityCard
              v-if="userSessionExtended.globalType === GlobalType.Platform"
              class="flex-1 min-w-[150px]"
              :kpi-value="kpiFinanceForPlatform.penaltyChargedCount.toFixed(0)"
              :description="'Total de penalidades cobradas'"
            />
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

const router = useRouter()
const route = useRoute()

const allOrganizations = ref<Organization[]>([])
const fetchOrganizations = async () => {
  const { data } = await useAPI('/organization-management/find-organizations', {
    method: 'GET',
    default: () => [],
  })
  allOrganizations.value = data.value as any
}

const userSessionExtended = useUserSessionExtended()

const offerAdvicesForOrganization = ref({
  offersInDepositReviewCount: 0,
  offersPendingOfDeliveryCount: 0,
  offersInTransferOfGoodCount: 0,
})

const fetchOfferAdvicesForOrganization = async () => {
  const { data, error } = await useAPI(
    `offer-management/view-offer-advices-for-organization`,
    {
      method: 'GET',
      default: () => {
        return {
          offersInDepositReviewCount: 0,
          offersPendingOfDeliveryCount: 0,
          offersInTransferOfGoodCount: 0,
        }
      },
    },
  )
  offerAdvicesForOrganization.value = data.value
}

const rechargeRequestAdvicesForPlatform = ref({
  rechargeRequestPendingCount: 0,
  accountValidationPendingCount: 0,
  retireRequestPendingCount: 0,
  retireRequestApprovedCount: 0,
})

const fetchRechargeRequestAdvicesForPlatform = async () => {
  const { data, error } = await useAPI(
    `offer-management/view-recharge-request-advices-for-platform`,
    {
      method: 'GET',
      default: () => {
        return {
          rechargeRequestPendingCount: 0,
          accountValidationPendingCount: 0,
          retireRequestPendingCount: 0,
          retireRequestApprovedCount: 0,
        }
      },
    },
  )
  rechargeRequestAdvicesForPlatform.value = data.value
}

const eventAdvicesForPlatform = ref({
  eventsInDebateCount: 0,
})
const fetchEventAdvicesForPlatform = async () => {
  const { data, error } = await useAPI(
    `offer-management/view-event-advices-for-platform`,
    {
      method: 'GET',
      default: () => {
        return {
          eventsInDebateCount: 0,
        }
      },
    },
  )
  eventAdvicesForPlatform.value = data.value
}

const offerAdvicesForPlatform = ref({
  offersInDepositReviewCount: 0,
  offersPendingOfDeliveryCount: 0,
})

const kpiFinanceForPlatform = ref({
  participantsWithGuaranteeSeparatedCount: 0,
  guaranteeSeparatedAmount: 0,
  numberOfParticipantsPerOfferAverage: 0,
  bidsPerOfferAverage: 0,
  comissionsChargedCount: 0,
  penaltyChargedCount: 0,
})

const fetchKpiFinanceForPlatform = async () => {
  const { data, error } = await useAPI(
    `kpi-management/view-finance-for-platform`,
    {
      method: 'GET',
      default: () => {
        return {
          participantsWithGuaranteeSeparatedCount: 0,
          guaranteeSeparatedAmount: 0,
          numberOfParticipantsPerOfferAverage: 0,
          bidsPerOfferAverage: 0,
          comissionsChargedCount: 0,
          penaltyChargedCount: 0,
        }
      },
    },
  )
  kpiFinanceForPlatform.value = data.value
}

const fetchOfferAdvicesForPlatform = async () => {
  const { data, error } = await useAPI(
    `offer-management/view-offer-advices-for-platform`,
    {
      method: 'GET',
      default: () => {
        return {
          offersInDepositReviewCount: 0,
          offersPendingOfDeliveryCount: 0,
        }
      },
    },
  )
  offerAdvicesForPlatform.value = data.value
}

if (userSessionExtended.globalType === GlobalType.Platform) {
  await fetchOrganizations()
  await fetchOfferAdvicesForPlatform()
  await fetchEventAdvicesForPlatform()
  await fetchRechargeRequestAdvicesForPlatform()
  await fetchKpiFinanceForPlatform()
} else {
  await fetchOfferAdvicesForOrganization()
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
