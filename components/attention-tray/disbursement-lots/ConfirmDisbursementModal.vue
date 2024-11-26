<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import InputFile from '@/components/common/file/Input.vue';
import { useDisbursement } from '@/composables/useDisbursement'
const props = defineProps<{
  id: string
  paymentSupportFile: {}
  disbursedAt: {}
  modelValue: boolean
  refreshTable: () => void
}>()
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const {confirmDisbursement} = useDisbursement()
const emit = defineEmits(['update:modelValue'])
const formSchema = toTypedSchema(
  z.object({
    disbursedAt: z.string().nonempty('La fecha de desembolso es requerida').optional(),
    paymentSupportFile: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(3, 'Puede subir un máximo de tres archivos.'),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})
const onSubmit = form.handleSubmit((values:any) => {
  const { paymentSupportFile, disbursedAt } = values
  handleConfirm ({ id: props.id, paymentSupportFile, disbursedAt })
  console.log('Formulario enviado con los valores:', values)
  emit('update:modelValue', false) 
})

const handleConfirm = async (values: { id: string; paymentSupportFile:{}; disbursedAt:{} }) => {
  openConfirmModal({
    title: 'Confirmar lote de desembolso',
    message: '¿Estás seguro deseas confirmar este lote de desembolso?',
    callback: async () => {
      const { id, paymentSupportFile, disbursedAt } = values;
      const { status, error } = await confirmDisbursement({
        id,
        paymentSupportFile,
        disbursedAt,
      });

      if (status.value === 'success') {
        emit('update:modelValue', false);
        props.refreshTable();
        updateConfirmModal({
          title: 'Desembolso confirmado',
          message: 'Se ha confirmado con éxito el lote de desembolso',
          type: 'success',
        });
      } else {
        const eMsg =
          error?.value?.data?.errors?.[0]?.message ||
          error?.value?.data?.message ||
          'El desembolso no se pudo confirmar, inténtalo más tarde';

        updateConfirmModal({
          title: 'Error al confirmar desembolso',
          message: eMsg,
          type: 'error',
        });
      }
    },
  });
};
const handleFilesChange = (files: File[]) => {
  form.values.paymentSupportFile = files.map((file) => file.name);
};
</script>

<template>
  <AlertDialog
    :open="modelValue"
    class="z-[30]"
    @update:open="(event) => emit('update:modelValue', event)"
  >
    <AlertDialogContent class="z-[98] h-auto max-w-[670px] px-0">
      <form class="flex flex-col gap-6 flex-grow max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/50" @submit="onSubmit">
        <!-- Título -->
        <AlertDialogHeader class="border-b border-primary">
          <AlertDialogTitle
            class="text-xl tracking-[-0.5px] text-primary text-start font-[600] px-6 pb-[18px]"
            >Confirmar desembolso</AlertDialogTitle
          >
        </AlertDialogHeader>
        <!-- Formulario -->
        <div class="grid grid-cols-1 gap-2 xl:gap-4 px-6">
            <!-- Fecha de Desembolso -->
                <FormField v-slot="{ componentField }" name="disbursedAt">
                    <FormItem>
                        <FormControl>
                            <CustomInput staticLabel type="date" label="Fecha de desembolso" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <div class="flex flex-col">
                    <h2 class="font-[600] text-sm text-[#152A3C] pr-[4px] mb-4">
                        CARGAR SUSTENTO
                    </h2>
                  <FormField v-slot="{ componentField }" name="paymentSupportFile">
                    <FormItem >
                        <FormControl >
                            <InputFile 
                            v-model="form.values.paymentSupportFile" 
                            @update:value="handleFilesChange"
                            title="Archivos adjuntos"
                            :limit-files="3"
                            instructionsText="JPG, PNG, JPEG o PDF Tamaño máx 5MB"
                            v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
        </div>
        <!-- Botones -->
        <AlertDialogFooter class="px-6">
          <Button
            type="button"
            size="xl"
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent mt-[16px]"
            @click="emit('update:modelValue', false)"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="xl"
            class="text-[16px] font-[600] mt-[16px]"
            :disabled="!form.meta.value.valid"
          >
            Confirmar
          </Button>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>
