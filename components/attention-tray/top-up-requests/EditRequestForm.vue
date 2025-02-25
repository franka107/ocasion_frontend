<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import dayjs from 'dayjs'
import InputFile from '@/components/common/file/Input.vue'
import { IuseRecharge } from '@/composables/useRecharge'
const { autorizationRecharge } = IuseRecharge()
const BASE_RECHAR_URL = '/finance/recharge-request-management'
const props = defineProps<{
  id: string | undefined | number
  onsubmit: (values: any) => void
}>()
const emit = defineEmits(['update:modelValue', 'open-reject-modal'])
const formSchema = toTypedSchema(
  z.object({
    operationNumber: z
      .string()
      .regex(/^\d{10,20}$/, 'Ingrese número de operación válido.'),
    transferedAt: z
      .string()
      .nonempty('La fecha de transferencia es requerida')
      .optional(),
    amount: z
      .number()
      .positive('Debe ser un monto positivo.')
      .lte(999999, 'El monto no puede exceder los 6 dígitos.'),
    currency: z.string().min(1, 'Seleccione una moneda.'),
    attachedFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(3, 'Puede subir un máximo de cinco archivos.'),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {},
})

const cancelEdit = () => {
  emit('update:modelValue', false)
}

if (props.id) {
  const { data } = await useAPI<any>(
    `${BASE_RECHAR_URL}/view-recharge-request-detail`,
    {
      method: 'GET',
      query: {
        id: props.id,
      },
    } as any,
  )
  if (data.value) {
    form.setValues({
      ...data.value,
      transferedAt: dayjs(data.value.transferedAt).format('YYYY-MM-DD'),
      attachedFiles: data.value.sustentationFile
        ? [data.value.sustentationFile]
        : [],
    })
  }
}

const handleFilesChange = (files: File[]) => {
  const existingFiles = form.values.attachedFiles || []
  form.values.attachedFiles = [...existingFiles, ...files]
}

const onSubmit = form.handleSubmit((values) => {
  const formattedValues = {
    ...values,
    id: props.id,
    sustentationFile: values.attachedFiles?.[0] || null,
  }
  props.onsubmit(formattedValues)
})
</script>

<template>
  <SheetHeader class="justify-between">
    <SheetTitle class="ml-2 text-[18px] font-[700] text-[#152A3C]">
      Editar solicitud de recarga
    </SheetTitle>
    <SheetClose class="rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <form
      class="flex flex-col gap-6 flex-grow pb-[32px] pt-[40px] px-6 gap-y-[24px]"
      @submit="onSubmit"
    >
      <section class="flex-grow">
        <div class="grid grid-cols-2 gap-4 mb-[24px]">
          <!-- N° operación -->
          <FormField v-slot="{ componentField }" name="operationNumber">
            <FormItem>
              <FormControl>
                <CustomInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Ingrese número"
                  label="N° operación"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Fecha de Transferencia -->
          <FormField v-slot="{ componentField }" name="transferedAt">
            <FormItem>
              <FormControl>
                <CustomInput
                  type="date"
                  label="Fecha de transferencia"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Monto -->
          <FormField v-slot="{ componentField }" name="amount">
            <FormItem>
              <FormControl>
                <CustomInput
                  disabled
                  v-bind="componentField"
                  type="number"
                  placeholder="0.00"
                  label="Ingresa monto"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Moneda -->
          <FormField v-slot="{ componentField }" name="currency">
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="[{ id: 'USD', name: 'USD' }]"
                  placeholder="Moneda"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex flex-col">
          <h2 class="font-[700] text-sm text-[#20445E] pr-[4px]">SUSTENTO</h2>
          <FormField v-slot="{ componentField }" name="attachedFiles">
            <FormItem>
              <FormControl>
                <InputFile
                  v-model="form.values.attachedFiles"
                  title="Archivos adjuntos"
                  disabled
                  hide-remove-icon
                  instructions-text="Cargar máximo 3 elementos(xlsx, docx, pdf)"
                  :limit-files="3"
                  v-bind="componentField"
                  @update:value="handleFilesChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </section>
      <div
        class="mt-4 flex flex-wrap md:flex-nowrap justify-center gap-y-[10px] gap-x-[16px] w-full"
      >
        <Button
          type="button"
          size="xl"
          class="w-full max-w-[223px] text-[14px] md:text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent"
          @click.prevent="cancelEdit"
          >Cancelar</Button
        >
        <Button
          type="submit"
          :disabled="!form.meta.value.valid"
          :class="
            cn(
              'w-full max-w-[223px] text-[14px] md:text-[16px] font-[600] bg-[#062339] hover:bg-gray-700',
              !form.meta.value.valid
                ? 'text-white'
                : 'hover:text-primary hover:bg-bgtheme',
            )
          "
          size="xl"
          >Guardar</Button
        >
      </div>
    </form>
  </div>
</template>
