<template>
    <ContentLayout title="Reporte de lotes de desembolsos">
      <CustomSimpleCard
        title="Listado de reportes de lotes de desembolsos"
        class="mb-6"
        sub-title="Vizualización de reporte de lotes de desembolsos de los participantes"
      />
      <div class="w-full flex flex-col">
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
          <CustomTable
            :data="disbursementData"
            :header="disbursementHeader"
            :search="disbursementSearch"
            @on-sort="onSort"
            @on-search="onSearch"
          >
                <template #action-button>
                <div class="flex">
                    <Button
                    variant="default"
                    class="text-[#F97316] bg-white hover:text-white hover:bg-[#F97316] mr-[8px]"
                    @click="
                        () => {
                        
                        }
                    "
                    >Mas filtros</Button>
                    <Button
                    variant="default"
                    @click="handleExport"
                    >
                    <CustomIcons name="Download" class="ml-auto" />
                    Exportar
                    </Button>
                </div>
            </template>
            <template #archive="{ row }">
              <div
                class="flex items-center justify-center"
                @click=""
              >
                <CustomIcons
                  name="Doc-Loupe"
                />
              </div>
            </template>
            <template #proofOfDisbursement="{ row }">
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
              :text="disbursementStatus.get(row.status)?.name || ''"
              :variant="disbursementStatus.get(row.status)?.color as any"
              ></CustomChip>
            </template>
          </CustomTable>
        </div>
        <CustomPagination
          v-model:page="page"
          class="mt-5 mb-[19px]"
          :total="1"
          :limit="1"
        />
      </div>
    </ContentLayout>
  </template>
  <script setup lang="ts">
  import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
  import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
  import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
  import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
  import type { OrganizationItem } from '~/types/Order.ts'
  import {
    disbursementStatus,
    disbursementHeader,
    disbursementSearch,
  } from '~/constants/reports'
  import ContentLayout from '~/layouts/default/ContentLayout.vue'
  import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
  import { ref } from 'vue' 
  import { useDisbursement } from '@/composables/useDisbursement'
  import dayjs from 'dayjs'
  const openApplicationModal = ref(false); 
  const openParticipantModal = ref(false); 
  const {
   page,
   onSort,
   onSearch,
   filterOptions,
   sortOptions,
   handleExport,
 } = useDisbursement()
  const onSubmit = (formData: any) => {
    console.log("Formulario enviado:", formData);
    openApplicationModal.value = false; 
  }; 
  const onParticipantSubmit = (formData: any) => {
    console.log('Detalle del participante enviado:', formData);
    openParticipantModal.value = false;
  };
  const rechargeId = ref<number | undefined>(undefined)
  const { openConfirmModal, updateConfirmModal } = useConfirmModal()
  const rechargeModal = ref<any>({ offerId: '' })
  const BASE_DIS_URL = '/finance/disbursement-management'
  const { data, refresh }: any = await useAPI(
    `${BASE_DIS_URL}/view-paginated-disbursement-lots`,
    {
      query: {
        limit: 8,
        page,
        filterOptions,
        sortOptions,
      },
    } as any,
  )
  
  const disbursementData = computed(() =>
    data.value?.data.map((item: any) => ({   
      ...item,
      createdAt:dayjs(item.createdAt).format('YYYY-MM-DD'),
    })),
  )
const isEditing = ref(false); 
const openModal = (editMode: boolean) => {
  isEditing.value = editMode;
  openApplicationModal.value = true;
};
const openParticipantDetail = (row: any) => {
  console.log('Abriendo detalle del participante:', row);
  openParticipantModal.value = true;
};
  </script>
  