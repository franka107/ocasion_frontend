<template>
  <ContentLayout title="Recargas">
    <CustomSimpleCard
      title="Listado de recargas"
      class="mb-6"
      sub-title="Vizualización de las recargas realizadas por los participantes"
    />

    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          :data="rechargeData"
          :header="rechargeHeader"
          :search="rechargeSearch"
          @on-sort="onSort"
          @on-search="onSearch"
        >
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
                  class="bg-primary text-white"
                >
                  <DropdownMenuItem 
                      @click="openModal(row.id)"
                    >
                      Detalle solicitud
                      <CustomIcons name="EyeIcon" class="ml-auto" />
                  </DropdownMenuItem>               
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                      @click="openModalEditRequest(row.id)"
                    >
                     Editar solicitud
                      <CustomIcons name="Pen" class="ml-auto" />
                    </DropdownMenuItem>
                  <DropdownMenuSeparator />
                    <DropdownMenuItem 
                    @click="openParticipantDetail(row.id)">
                      Detalle participante
                      <CustomIcons name="EyeIcon" class="ml-[10px]" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <template #livelihood="{ row }">
            <div
              class="flex items-center justify-center"
              @click=""
            >
              <CustomIcons
                name="Doc-Loupe"
              />
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
            :text="rechargeStatus.get(row.status)?.name || ''"
            :variant="rechargeStatus.get(row.status)?.color as any"
            ></CustomChip>
          </template>
        </CustomTable>
        <!-- Modal de Detalle de Solicitud -->
        <SheetContent
          v-model:open="openDetailModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e: Event) => e.preventDefault()"
          @interact-outside="(e: Event) => e.preventDefault()"
        >
          <RequestDetailForm
            :id="rechargeId"
            :on-authorize="handleAuthorize"
            :on-reject="handleOpenRejectModal"
          />
        </SheetContent>

        <!-- Modal de Editar Solicitud -->
        <SheetContent
          v-model:open="openEditModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e: Event) => e.preventDefault()"
          @interact-outside="(e: Event) => e.preventDefault()"
        >
          <EditRequestForm
            :id="rechargeId"
            :refresh-table="refresh"
            :on-authorize="handleAuthorize"
            :on-reject="handleOpenRejectModal"
          />
        </SheetContent>

        <!-- Modal de Detalle Participante -->
        <SheetContent
          v-model:open="openParticipantModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e: Event) => e.preventDefault()"
          @interact-outside="(e: Event) => e.preventDefault()"
        >
          <ParticipantDetailForm 
            :participant-id="rechargeId"
          />
        </SheetContent>

        <!-- Modal para rechazar recarga -->
        <!-- <ModalRejectRecharge
          v-model:open="openRejectModal"
          :details="rejectDetails"
        /> -->
      </div>
      <CustomPagination
        v-model:page="page"
        class="mt-5 mb-[19px]"
        :total="data.count"
        :limit="data.limit"
      />
    </div>
  </ContentLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import ContentLayout from '~/layouts/default/ContentLayout.vue';
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue';
import CustomTable from '~/components/ui/custom-table/CustomTable.vue';
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue';
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue';
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue';
import RequestDetailForm from '~/components/attention-tray/top-up-requests/RequestDetailForm.vue';
import ParticipantDetailForm from '~/components/attention-tray/top-up-requests/ParticipantDetailForm.vue';
import EditRequestForm from '~/components/attention-tray/top-up-requests/EditRequestForm.vue';
import ModalRejectRecharge from '~/components/attention-tray/top-up-requests/ModalRejectRecharge.vue';
import { rechargeStatus, rechargeHeader, rechargeSearch } from '~/constants/attention-tray';
import { IuseRecharge } from '@/composables/useRecharge';
import { useTopUpRequests } from '~/composables/useTopUpRequests';
import { useAPI } from '~/composables/useAPI';

// Variables de estado para los modales
const openDetailModal = ref(false); // Modal de Detalle de Solicitud
const openEditModal = ref(false); // Modal de Editar Solicitud
const openParticipantModal = ref(false); // Modal de Detalle Participante
const openRejectModal = ref(false); // Modal de rechazar recarga

const rechargeId = ref<number | undefined>(undefined);
const rejectDetails = ref(null);

// Funciones para manejar los modales
const openModal = (rowId: number) => {
  rechargeId.value = rowId;
  openDetailModal.value = true;
};

const openModalEditRequest = (rowId: number) => {
  rechargeId.value = rowId;
  openEditModal.value = true;
};

const openParticipantDetail = (row: any) => {
  rechargeId.value = row.participantId;
  console.log('Abriendo detalle del participante:', row.participantId);
  openParticipantModal.value = true;
};

// Data y API
const { page, onSort, onSearch, filterOptions, sortOptions } = useTopUpRequests();
const { autorizationRecharge } = IuseRecharge();
const BASE_RECHAR_URL = '/finance/recharge-request-management';
const { data, refresh }: any = await useAPI(
  `${BASE_RECHAR_URL}/view-paginated-recharge-requests`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const rechargeData = computed(() =>
  data.value?.data.map((item: any) => ({
    fullName: item.participant.commonName,
    ...item,
    transferedAt: dayjs(item.transferedAt).format('YYYY-MM-DD'),
    updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD'),
  }))
);

// Manejo de acciones
const handleAuthorize = async (values: { id: string }) => {
  console.log('Autorizando recarga:', values);
};
const handleOpenRejectModal = (details: any) => {
  rejectDetails.value = details;
  openRejectModal.value = true;
};
</script>
