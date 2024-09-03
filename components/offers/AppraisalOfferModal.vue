<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";

const props = defineProps<{
  offerId: string;
  offerTitle: string;
  oldAppraisal: number;
  newAppraisal: number;
  modelValue: boolean;
  refreshTable: () => void;
}>();
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const { modifyOfferAppraisal } = useOfferAPI();
const formSchema = toTypedSchema(
  z.object({
    newAppraisal: z
      .number()
      .gte(1, { message: "La nueva tasacion es requerida." }),
  }),
);
const emit = defineEmits(["update:modelValue"]);
const form = useForm({
  validationSchema: formSchema,
});
const onSubmit = form.handleSubmit((values: any) => {
  const { newAppraisal } = values;
  handleSubmit({ offerId: props.offerId, newAppraisal });
  console.log("newAppraisal", newAppraisal);
});
const handleSubmit = async (values: any) => {
  openConfirmModal({
    title: "Actualizar Nueva Tasacion",
    message: "¿Estás seguro de que deseas actualizar la tasación de la oferta?",
    callback: async () => {
      const { status, error }: any = await modifyOfferAppraisal(values);
      if (status.value === "success") {
        emit("update:modelValue", false);
        props.refreshTable();
        updateConfirmModal({
          title: "Tasacion actualizada",
          message: "La tasacion a sido actualizada exitosamente",
          type: "success",
        });
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          "No se pudo modificar la tasacion, intentalo más tarde";
        updateConfirmModal({
          title: "Error al modificar la tasacion",
          message: eMsg,
          type: "error",
        });
      }
    },
  });
};
</script>

<template>
  <AlertDialog
    :open="modelValue"
    @update:open="(event) => emit('update:modelValue', event)"
    class="z-[30]"
  >
    <AlertDialogContent class="z-[98]">
      <form
        class="flex flex-col gap-4 flex-grow pt-5 pr-5 pl-5"
        @submit="onSubmit"
      >
        <AlertDialogHeader>
          <AlertDialogTitle class="text-center"
            >Cambio de tasacion</AlertDialogTitle
          >
        </AlertDialogHeader>
        <Input
          type="string"
          :disabled="true"
          placeholder="Nombre del evento"
          :model-value="props.offerTitle"
        />
        <div class="grid grid-cols-2 gap-3">
          <Input
            type="number"
            :disabled="true"
            placeholder="Tasación actual"
            :model-value="props.oldAppraisal"
          />
          <FormField v-slot="{ componentField }" name="newAppraisal">
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nuevo valor de tasacion"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <AlertDialogFooter>
          <Button
            @click="
              () => {
                emit('update:modelValue', false);
              }
            "
            type="button"
            class="ml-3"
            >Cancelar</Button
          >
          <Button type="submit" class="ml-3" :disabled="!form.meta.value.valid"
            >Confirmar</Button
          >
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>
