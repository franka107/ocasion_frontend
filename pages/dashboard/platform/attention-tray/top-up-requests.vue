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
                        @click="openModal(true)"
                      >
                        Detalle solicitud
                        <CustomIcons name="EyeIcon" class="ml-auto" />
                    </DropdownMenuItem>               
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        :disabled="row.status === 'ACTIVE'"
                        @click="openModal(false)"
                      >
                       Editar solicitud
                        <CustomIcons name="Pen" class="ml-auto" />
                      </DropdownMenuItem>
                    <DropdownMenuSeparator />
                      <DropdownMenuItem 
                      @click="openParticipantDetail(row)">
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
          <SheetContent
            v-model:open="openApplicationModal"
            class="flex flex-col h-full"
            custom-width="510px"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
            >
            <ApplicationForm
            :isEditing="!isEditing" 
            :title="isEditing ? 'Editar solicitud' : 'Detalle solicitud'"
            :on-submit="onSubmit"
            />
          </SheetContent>
          <SheetContent
            v-model:open="openParticipantModal"
            class="flex flex-col h-full"
            custom-width="510px"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <ParticipantDetailForm 
            :id="rechargeId"
            />
          </SheetContent>
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
  import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
  import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
  import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
  import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
  import type { IRecharge , Participant } from '~/types/Recharge'
  import {
    rechargeStatus,
    rechargeHeader,
    rechargeSearch,
  } from '~/constants/attention-tray'
  import ContentLayout from '~/layouts/default/ContentLayout.vue'
  import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
  import ApplicationForm from '~/components/attention-tray/top-up-requests/ApplicationForm.vue'
  import ParticipantDetailForm from '~/components/attention-tray/top-up-requests/ParticipantDetailForm.vue'
  import { ref } from 'vue' 
  import dayjs from 'dayjs'
  const openApplicationModal = ref(false); 
  const openParticipantModal = ref(false); 
  const {
    page,
    onSort,
    onSearch,
    filterOptions,
    sortOptions,
  } = useTopUpRequests()
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
  const BASE_RECHAR_URL = '/finance/recharge-request-management'
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
      fullName:item.participant.commonName,
      ...item,
      transferedAt:dayjs(item.transferedAt).format('YYYY-MM-DD'),
      updatedAt:dayjs(item.updatedAt).format('YYYY-MM-DD'),
    })),
  )
  const isEditing = ref(false); 
  const openModal = (editMode: boolean) => {
    isEditing.value = editMode;
    openApplicationModal.value = true;
  };
  const openParticipantDetail = (row: any) => {
    rechargeId.value = row.id
    console.log('Abriendo detalle del participante:', row);
    openParticipantModal.value = true;
  };
  const participantInfo = ref<any>({
    firstName: '',
    lastName:'',
    documentType: '',
    documentIdentifier:'',
    phoneNumber:'',
    email:'',
    gender:'',
    maritalStatus:'',
    birthDate:'',
    status:'',
  })
  </script>
  