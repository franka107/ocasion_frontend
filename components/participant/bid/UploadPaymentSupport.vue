<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { X } from 'lucide-vue-next'
import { SheetClose } from '@/components/ui/sheet'
import InputFile from '@/components/common/file/Input.vue'
import type { OrganizationDto } from '~/types/Organization'

const props = defineProps<{
  onSubmit: (values: any) => void
  organization: OrganizationDto
  id: string
}>()

const formSchema = toTypedSchema(
  z.object({
    compostPropertyPaymentFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(1, 'Puede subir solo un archivo para el voucher de pago del bien'),
    compostComissionPaymentFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(
        1,
        'Puede subir solo un archivo para el voucher de pago de comisión',
      ),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    compostPropertyPaymentFiles: [],
    compostComissionPaymentFiles: [],
  },
})

const onSubmit = form.handleSubmit(async (values) => {
  console.log('Valores del formulario:', values)
  props.onSubmit(values)
})

if (props.id) {
  const { data } = await useAPI<any>(`payment-management/view-payment-detail`, {
    method: 'GET',
    query: {
      id: props.id,
    },
  } as any)
  if (data.value) {
    form.setValues({
      ...data.value,
      compostPropertyPaymentFiles: data.value.compostPropertyPaymentFile
        ? [data.value.compostPropertyPaymentFile]
        : [],
      compostComissionPaymentFiles: data.value.compostComissionPaymentFile
        ? [data.value.compostComissionPaymentFile]
        : [],
      // transferedAt: dayjs(data.value.transferedAt).format('YYYY-MM-DD'),
      // attachedFiles: data.value.sustentationFile ? [data.value.sustentationFile] : [],
    })
  }
}

const handlePaymentVoucherChange = (files: File[]) => {
  form.values.compostPropertyPaymentFiles = files.map((file) => file.name)
}

const handleCommissionVoucherChange = (files: File[]) => {
  form.values.compostComissionPaymentFiles = files.map((file) => file.name)
}
</script>

<template>
  <SheetHeader class="flex justify-between">
    <SheetTitle
      class="text-[16px] md:text-[20px] font-medium text-[#152A3C] leading-[28px] tracking-[-0.5px]"
    >
      Cargar sustento de abono
    </SheetTitle>
    <SheetClose class="rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <form class="flex flex-col h-full" @submit="onSubmit">
      <section class="p-5 flex-grow">
        <!-- Información de Pasos a Seguir -->
        <div
          class="h-auto md:h-[234px] flex flex-col leading-[20px] justify-between mb-4 md:mb-6 text-[#20445E] bg-[#E6F0F8] rounded-[8px] p-4"
        >
          <div>
            <h2 class="text-2 md:text-4 font-[700]">Pasos a seguir:</h2>
            <ul class="text-[12px] md:text-[14px] tracking-[0.5px] font-[400]">
              <li>1. Confirmar la continuación del proceso</li>
              <li>
                2. Realizar el abono a la organización
                {{ organization.name }} por concepto de pago de subasta
              </li>
              <li>3. Realizar el abono por la comisión a DeOcasión</li>
              <li>4. Enviar los sustentos a las entidades correspondientes</li>
              <li>5. Firmar la documentación de transferencia de propiedad</li>
              <li>
                6. Coordinar la entrega con la organización
                {{ organization.name }}
              </li>
            </ul>
          </div>
          <p class="text-[12px] tracking-[0.5px]">
            <span class="font-[700]">Nota:</span> Realizar la carga de
            documentos en un plazo de 2 días útiles.
          </p>
        </div>

        <!-- Adjuntar Voucher de Pago de Bien -->
        <div class="mb-6 leading-[20px]">
          <div class="text-[#152A3C]">
            <h2
              class="text-sm font-[600] mb-2 md:mb-4 uppercase tracking-[0.5px]"
            >
              Adjuntar voucher pago de bien
            </h2>
          </div>
          <FormField
            v-slot="{ componentField }"
            name="compostPropertyPaymentFiles"
          >
            <FormItem>
              <FormControl>
                <InputFile
                  v-model="form.values.compostPropertyPaymentFiles"
                  title="Arrastrar o abrir archivo"
                  :accepted-file-types="['.jpg', '.png', '.jpeg', '.pdf']"
                  instructions-text="Cargar máximo 1 archivo (jpg, png, jpeg o pdf)"
                  :limit-files="1"
                  v-bind="componentField"
                  @update:value="handlePaymentVoucherChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Adjuntar Voucher de Pago de Comisión -->
        <div class="mb-6 leading-[20px]">
          <div class="text-[#152A3C]">
            <h2
              class="text-sm font-[600] mb-2 md:mb-4 uppercase tracking-[0.5px]"
            >
              Adjuntar voucher pago de comisión
            </h2>
          </div>
          <FormField
            v-slot="{ componentField }"
            name="compostComissionPaymentFiles"
          >
            <FormItem>
              <FormControl>
                <InputFile
                  v-model="form.values.compostComissionPaymentFiles"
                  title="Arrastrar o abrir archivo"
                  :accepted-file-types="['.jpg', '.png', '.jpeg', '.pdf']"
                  instructions-text="Cargar máximo 1 archivo (jpg, png, jpeg o pdf)"
                  :limit-files="1"
                  v-bind="componentField"
                  @update:value="handleCommissionVoucherChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </section>
      <div class="mt-auto p-6">
        <Button
          variant="default"
          :disabled="!form.meta.value.valid"
          type="submit"
          class="w-full"
        >
          Cargar documentos
        </Button>
      </div>
    </form>
  </div>
</template>
