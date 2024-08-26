<template>
	<ContentLayout title="Usuarios" >
		<CustomSimpleCard
    title="Panel Super administrador"
		class="mb-6"
    sub-title="Gestiona eventos participantes"
    />

  <div class="w-full flex flex-col">
    <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
      <CustomTable
        :data="adminsData"
        :header="participantsHeader"
        @onSort="onSort"
        @onSearch="onSearch"
      >
        <template #type="{ row }">
          <span class="whitespace-nowrap">{{  userType.get(row.type) || '' }}</span>
        </template>
        <template #status="{ row }">
          <CustomChip
            :text="row.status === 'ACTIVE' ? 'Activo' : 'Suspendido'"
            :variant="row.status === 'ACTIVE' ? 'default' : 'destructive'"
          ></CustomChip>
        </template>
      </CustomTable>
    </div>
    <CustomPagination
      class="mt-5 mb-[19px]"
      :total="data.count"
      :limit="data.limit"
      v-model:page="page"
    /> 
  </div>
	</ContentLayout>
</template>
<script setup lang="ts">
import CustomTable from "@/components/ui/custom-table/CustomTable.vue";
import CustomChip from "@/components/ui/custom-chip/CustomChip.vue";
import CustomPagination from "@/components/ui/custom-pagination/CustomPagination.vue";
import { userType } from '~/constants/administrators';
import type { IAdminsLItem } from "@/types/Administrators.ts";
import { participantsHeader } from "~/constants/participants";
import ContentLayout from "~/layouts/default/ContentLayout.vue";
import CustomSimpleCard from "~/components/ui/custom-simple-card/CustomSimpleCard.vue";

const route = useRoute()
const {page, sortOptions, onSort, suspendUser,createUser, editUser, resetUser, getExportUser} = useAdmins();
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const filterOptions = ref(`[{"field":"type","type":"equal","value": "PARTICIPANT"}]`)
const openModal = ref(false)
const admsUserId = ref<number | undefined>(undefined)
const BASE_ADM_URL = "/user-management";
const onSearch = (item: {[key: string]: string }) => {
  console.log(item)
  const filters = [
    { field:"type", type:"equal", value:"PARTICIPANT" || ''},
    { field: 'firstName', type: 'like', value: item.fullName || '' },
    { field: 'status', type: 'equal', value: item.status || '' },

  ]
  filterOptions.value = JSON.stringify(filters)
}

const { data, refresh }: any = await useAPI(
  `${BASE_ADM_URL}/find-users-paginated`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
);

const adminsData= computed(() => data.value.data.map((item: IAdminsLItem) => ({
    fullName: `${item.firstName} ${item.lastName}`,
    document: `${item.documentType} - ${item.documentIdentifier}`,
    cellphone: item.phoneNumber,
    organization: item.organizations.map(org => org.name).join(', '),
    ...item
  })))


  const handleSuspend = async (id: string, fullName: string) => {
  openConfirmModal({
    title: "Suspender usuario",
    message: `¿Estás seguro de suspender a ❝${fullName}❞?`,
    callback: async () => {
      const { status, error }: any = await suspendUser(id);
      if (status.value === "success") {
        updateConfirmModal({
          title: "¡Suspensión exitosa!",
          message: "El usuario ha sido suspendido.",
          type: "success",
        });
        refresh();
      } else {
        updateConfirmModal({
          title: "Error al suspender",
          message: "El usuario no se pudo suspender. \nTe recomendamos intentarlo nuevamente.",
          type: "error",
        });
      }
    },
  });
};

const handleUpdateForm = async (user: any) => {
  openModal.value = true;
  admsUserId.value = user.id;
};

const handleCreate = async (values: any) => {
  console.log("handleCreate ejecutado", values); 
  openConfirmModal({title: 'Crear usuario', message: '¿Estás seguro de que deseas crear este usuario?',
    callback: async () => {
      const { status, error } : any = await createUser(values);
      if (status.value === 'success') {
        openModal.value = false;
        refresh();
        updateConfirmModal({
          title: "Usuario creado",
          message: "El usuario ha sido creado exitosamente",
          type: "success",
        });
      } else {
        const eMsg = error.value.data?.errors?.[0].message || error.value.data.message || "El usuario no se pudo crear, intentalo más tarde";
        updateConfirmModal({
          title: "Error al crear usuario",
          message: eMsg,
          type: "error",
        });
      }
    },
  });
};

const handleEdit = async (values: any) => {
  console.log("handleEdit ejecutado", values);
  openConfirmModal({
    title: 'Actualizar usuario', message: '¿Estás seguro de que deseas actualizar este usuario?', callback: async () => {
      const { status, error } : any = await editUser(values);
      if (status.value === 'success') {
        openModal.value = false;
        refresh();
        updateConfirmModal({
          title: "Usuario actualizado",
          message: "El usuario ha sido actualizado exitosamente",
          type: "success",
        });
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          "El usuario no se pudo actualizar, intentalo más tarde";
        updateConfirmModal({
          title: "Error al actualizar usuario",
          message: eMsg,
          type: "error",
        });
      }
    },
  });
};

const handleResetPassword = async (values: any) => {
  openConfirmModal({
    title: 'Restablecer contraseña de usuario', message: '¿Estás seguro de que deseas restablecer contraseña de usuario?', callback: async () => {
      const { status, error } : any = await resetUser(values);
      if (status.value === 'success') {
        openModal.value = false;
        refresh();
        updateConfirmModal({
          title: "Contraseña de usuario restablecida",
          message: "El usuario ha restablecido la contraseña exitosamente",
          type: "success",
        });
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          "El usuario no se pudo restablecer la contraseña de usuario, intentalo más tarde";
        updateConfirmModal({
          title: "Error al restablecer contraseña de usuario",
          message: eMsg,
          type: "error",
        });
      }
    },
  });
};

const handleExport = async () => {
  openConfirmModal({
    title: "Exportar usuarios",
    message: "¿Estás seguro de que deseas exportar los usuarios?",
    callback: async () => {
      const { status, error, file }: any = await getExportUser();
      if (status.value === "success") {
        const url = window.URL.createObjectURL(new Blob([file]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "usuarios_exportados.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        updateConfirmModal({
          title: "Exportación exitosa",
          message: "Los usuarios han sido exportados exitosamente.",
          type: "success",
        });
      } else {
        const eMsg = error.value?.data?.message || "Error al exportar usuarios. Inténtalo de nuevo más tarde.";
        updateConfirmModal({
          title: "Error al exportar usuarios",
          message: eMsg,
          type: "error",
        });
      }
    },
  });
};
</script>
