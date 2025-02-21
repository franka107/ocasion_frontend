<template>
  <ContentLayout title="Eventos">
    <section v-if="data">
      <OrganizationDetails
        v-if="organizationSummary"
        :data="organizationSummary"
      />
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mt-4 pb-4">
        <CustomTable
          class="mb-4"
          :data="eventsData"
          :header="
            eventListHeaders(props.organizationId ? 'organization' : 'platform')
          "
          :search="
            eventSearch(props.organizationId ? 'organization' : 'platform')
          "
          @on-sort="onSort"
          @on-search="onSearch"
        >
          <template #action-button>
            <div
              v-if="
                props.organizationId &&
                myGrants.data.value.includes(
                  GrantId.OrganizationEventsCanCreate,
                )
              "
            >
              <Button
                @click="
                  () => {
                    eventId = undefined
                    openEventModal = true
                  }
                "
                >Crear evento</Button
              >
            </div>
          </template>
          <template #type="{ row }">
            <span class="whitespace-nowrap">{{
              eventType.get(row?.type) || ''
            }}</span>
          </template>
          <template #closingTime="{ row }">
            <span class="whitespace-nowrap">{{
              eventTimes.get(String(row.closingTime))
            }}</span>
          </template>
          <template #id="{ row }">
            <Button as-child variant="link">
              <NuxtLink
                :to="
                  props.organizationId
                    ? `/dashboard/organization/${props.organizationId}/events/${row.id}`
                    : `/dashboard/platform/events/${row.id}`
                "
              >
                {{ row.id }}
              </NuxtLink>
            </Button>
          </template>
          <template #actions="{ row }">
            <div class="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 data-[state=open]:bg-accent"
                  >
                    <CustomIcons name="VerticalDots" class="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  class="bg-primary text-white w-40"
                >
                  <DropdownMenuItem>
                    <NuxtLink
                      class="flex justify-between w-full"
                      :to="
                        props.organizationId
                          ? `/dashboard/organization/${props.organizationId}/events/${row.id}`
                          : `/dashboard/platform/events/${row.id}`
                      "
                    >
                      Ver Evento
                      <CustomIcons name="EyeIcon" class="ml-auto" />
                    </NuxtLink>
                  </DropdownMenuItem>
                  <div
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.OrganizationEventsCanEdit,
                      )
                    "
                  >
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      :disabled="
                        row.status === 'CANCELLED' || row.status === 'PUBLISHED'
                      "
                      @click="
                        () => {
                          eventId = row.id
                          openEventModal = true
                        }
                      "
                    >
                      Editar
                      <CustomIcons name="Pen" class="ml-auto" />
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator />
                  <div
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.PlatformEventsCanCancel,
                      )
                    "
                  >
                    <DropdownMenuItem
                      :disabled="row.status === 'CANCELLED'"
                      @click="
                        () => {
                          eventId = row.id
                          openCancelModal = true
                        }
                      "
                    >
                      Cancelar
                      <CustomIcons name="Close" class="ml-auto" />
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="eventStatusRecord[row?.status as EventStatus]?.name || ''"
              :variant="
                eventStatusRecord[row?.status as EventStatus]?.color as any
              "
            ></CustomChip>
          </template>
          <template #expectedAmount="{ row }">
            <MoneyLabel :amount="row.expectedAmount" />
          </template>
          <template #createdAt="{ row }">
            <DateLabel :value="row.createdAt" />
          </template>
          <template #goodType="{ row }">
            <CustomChip
              :text="goodType.get(row?.goodType) || ''"
              variant="brown"
            ></CustomChip>
          </template>
        </CustomTable>
        <div>
          <SheetContent
            v-model:open="openEventModal"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <EventForm
              :id="eventId"
              :orgid="String(props.organizationId)"
              :onsubmit="eventId !== undefined ? handleEdit : handleCreate"
            />
          </SheetContent>
          <SheetContent
            v-model:open="openCancelModal"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <EventCancel :event-id="String(eventId)" :onsubmit="handleCancel" />
          </SheetContent>
        </div>
      </div>
      <CustomPagination
        v-model:page="page"
        class="mt-5 mb-[19px]"
        :total="data?.count"
        :limit="data?.limit"
      />
    </section>
  </ContentLayout>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { DateFormatter, parseAbsolute } from '@internationalized/date'
import EventCancel from '@/components/events/EventCancel.vue'
import OrganizationDetails from '@/components/organizations/OrganizationDetails.vue'
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import {
  eventListHeaders,
  eventType,
  eventSearch,
  goodType,
  eventTimes,
  eventStatusRecord,
} from '~/constants/events'
import type { EventStatus, EventDto, IOrganizationSummary } from '@/types/Event'
import type { IDataResponse } from '@/types/Common'
import EventForm from '@/components/events/EventForm.vue'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import { GrantId } from '~/types/Grant'
import MoneyLabel from '~/design-system/ui/money-label/MoneyLabel.vue'
import DateLabel from '~/design-system/ui/data-label/DateLabel.vue'
const bidsId = ref<number | undefined>(undefined)
const openModal = ref(false)
const { page, sortOptions, onSort, createEvent, editEvent, cancelEvent } =
  useEvent()
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()

const props = defineProps<{ organizationId: string | null }>()
// const filterOptions = ref(
//   props.organizationId
//     ? `[{ "field": "organization.id", "type": "equal", "value": "${props.organizationId}" }]`
//     : "[]",
// );
const filterOptions = ref(JSON.stringify([]))
const eventId = ref<string | undefined>('EVE-1')
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const openEventModal = ref(false)
const openCancelModal = ref(false)

const onSearch = (item: { [key: string]: string }) => {
  filterOptions.value = JSON.stringify([
    { field: 'name', type: 'like', value: item?.name || '' },
    { field: 'status', type: 'equal', value: item.status || '' },
    {
      field: 'organization.name',
      type: 'like',
      value: item.organizationName || '',
    },
    {
      field: 'id',
      type: 'like',
      value: item.id || '',
    },
    { field: 'status', type: 'equal', value: item.status || '' },
    { field: 'type', type: 'equal', value: item.type || '' },
    { field: 'goodType', type: 'equal', value: item.goodType || '' },
    ...(props.organizationId
      ? [
          {
            field: 'organization.id',
            type: 'equal',
            value: props.organizationId,
          },
        ]
      : []),
  ])
  page.value = 1
}
const BASE_ORG_URL = '/event-management'
const [eventListData, organizationSummaryData] = await Promise.all([
  useAPI<IDataResponse<EventDto[]>>(`${BASE_ORG_URL}/find-events-paginated`, {
    query: {
      limit: 6,
      page,
      filterOptions,
      sortOptions,
    },
  } as any),
  useAPI<IOrganizationSummary>(
    `${BASE_ORG_URL}/get-events-summary`,
    {} as any,
    true,
  ),
])
const { data, refresh } = eventListData

const organizationSummary = organizationSummaryData.data.value
const eventsData = computed(() =>
  data.value?.data.map((item: any) => ({
    ...item,
  })),
)

const handleCreate = async (values: any) => {
  openConfirmModal({
    title: 'Crear evento',
    message: '¿Estás seguro de que deseas crear este evento?',
    callback: async () => {
      const { status, error }: any = await createEvent(values)
      if (status.value === 'success') {
        openEventModal.value = false
        organizationSummaryData.refresh()
        refresh()
        updateConfirmModal({
          title: 'Evento creado',
          message: 'El evento ha sido creada exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El evento no se pudo crear, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al crear evento',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleEdit = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar evento',
    message: '¿Estás seguro de que deseas actualizar este evento?',
    callback: async () => {
      const { status, error }: any = await editEvent(values)
      if (status.value === 'success') {
        openEventModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Evento actualizada',
          message: 'El evento ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El evento no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al crear evento',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleCancel = async (values: any) => {
  openConfirmModal({
    title: 'Cancelar evento',
    message: '¿Estás seguro de que deseas cancelar este evento?',
    callback: async () => {
      const { status, error }: any = await cancelEvent(values)
      if (status.value === 'success') {
        openCancelModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Evento cancelado',
          message: 'El evento ha sido cancelar exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El evento no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al cancelar evento',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
