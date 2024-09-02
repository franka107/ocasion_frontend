<template>
  <ContentLayout title="Usuarios">
    <CustomSimpleCard
      title="Panel Super administrador"
      class="mb-6"
      sub-title="Gestiona eventos usuarios y reportes"
    />

    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          :data="adminsData"
          :header="administratorsHeader"
          :search="administratorsSearch"
          @onSort="onSort"
          @onSearch="onSearch"
        >
          <template #action-button>
            <Button
              @click="handleExport"
              variant="default"
              class="bg-white text-primary border border-[#052339]"
            >
              <CustomIcons name="Download" class="ml-auto" />
              Exportar
            </Button>
            <Button
              @click="
                () => {
                  admsUserId = undefined;
                  openModal = true;
                }
              "
              variant="default"
              >Agregar</Button
            >
          </template>
          <template #type="{ row }">
            <span class="whitespace-nowrap">{{
              userType.get(row.type) || ""
            }}</span>
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
                  class="bg-primary text-white"
                >
                  <DropdownMenuItem
                    @click="handleSuspend(row.id, row.fullName)"
                    :disabled="row.status !== 'ACTIVE'"
                  >
                    Suspender
                    <CustomIcons name="Forbidden" class="ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleResetPassword(row.id)">
                    Reenviar Correo
                    <CustomIcons name="Reload" class="ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleUpdateForm(row)">
                    Actualizar datos
                    <CustomIcons name="ArrowLeft" class="ml-auto" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="row.status === 'ACTIVE' ? 'Activo' : 'Suspendido'"
              :variant="row.status === 'ACTIVE' ? 'default' : 'destructive'"
            ></CustomChip>
          </template>
        </CustomTable>
        <!-- Fomulario -->
        <SheetContent class="flex flex-col h-full" v-model:open="openModal">
          <AdministratorsForm
            :id="admsUserId"
            :onSubmit="admsUserId !== undefined ? handleEdit : handleCreate"
          />
        </SheetContent>
        <!-- Fomulario -->
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
import AdministratorsForm from "~/components/users/administrators/AdministratorsForm.vue";
import CustomTable from "@/components/ui/custom-table/CustomTable.vue";
import CustomChip from "@/components/ui/custom-chip/CustomChip.vue";
import CustomIcons from "@/components/ui/custom-icons/CustomIcons.vue";
import CustomPagination from "@/components/ui/custom-pagination/CustomPagination.vue";
import { userType } from "~/constants/administrators";
import type { IAdminsLItem } from "@/types/Administrators.ts";
import {
  administratorsHeader,
  administratorsSearch,
} from "~/constants/administrators";
import ContentLayout from "~/layouts/default/ContentLayout.vue";
import CustomSimpleCard from "~/components/ui/custom-simple-card/CustomSimpleCard.vue";

const route = useRoute();
const {
  page,
  sortOptions,
  onSort,
  suspendUser,
  createUser,
  editUser,
  resetUser,
  getExportUser,
} = useAdmins();
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const filterOptions = ref(
  `[{"field":"type","type":"not","value": "PARTICIPANT"}]`,
);
const openModal = ref(false);
const admsUserId = ref<number | undefined>(undefined);
const BASE_ADM_URL = "/user-management";
const onSearch = (item: { [key: string]: string }) => {
  const filters = [
    { field: "type", type: "not", value: "PARTICIPANT" || "" },
    { field: "fullName", type: "like", value: item.fullName || "" },
  ];
  item.status &&
    filters.push({ field: "status", type: "equal", value: item.status || "" });
  item.createdAt &&
    filters.push({
      field: "createdAt",
      type: "equal",
      value: item.createdAt || "",
    });
  filterOptions.value = JSON.stringify(filters);
};

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

const adminsData = computed(() =>
  data.value.data.map((item: IAdminsLItem) => ({
    fullName: `${item.firstName} ${item.lastName}`,
    document: `${item.documentType} - ${item.documentIdentifier}`,
    cellphone: item.phoneNumber,
    organization: item.organizations.map((org) => org.name).join(", "),
    ...item,
  })),
);

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
          message:
            "El usuario no se pudo suspender. \nTe recomendamos intentarlo nuevamente.",
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
  openConfirmModal({
    title: "Crear usuario",
    message: "¿Estás seguro de que deseas crear este usuario?",
    callback: async () => {
      const { status, error }: any = await createUser(values);
      if (status.value === "success") {
        openModal.value = false;
        refresh();
        updateConfirmModal({
          title: "Usuario creado",
          message: "El usuario ha sido creado exitosamente",
          type: "success",
        });
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          "El usuario no se pudo crear, intentalo más tarde";
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
    title: "Actualizar usuario",
    message: "¿Estás seguro de que deseas actualizar este usuario?",
    callback: async () => {
      const { status, error }: any = await editUser(values);
      if (status.value === "success") {
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
    title: "Restablecer contraseña de usuario",
    message: "¿Estás seguro de que deseas restablecer contraseña de usuario?",
    callback: async () => {
      const { status, error }: any = await resetUser(values);
      if (status.value === "success") {
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
      const { status, error, file }: any = await getExportUser(
        filterOptions.value,
      );
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
        const eMsg =
          error.value?.data?.message ||
          "Error al exportar usuarios. Inténtalo de nuevo más tarde.";
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
