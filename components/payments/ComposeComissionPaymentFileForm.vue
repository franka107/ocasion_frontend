<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { X } from 'lucide-vue-next'
import ParticipantDetailFields from '../attention-tray/withdrawal-requests/ParticipantDetailFields.vue'
import { SheetClose } from '@/components/ui/sheet'
import InputFile from '@/components/common/file/Input.vue'
import { GrantId } from '~/types/Grant'

const props = defineProps<{
  onConfirm: (values: any) => void
  onObserve: (values: any) => void
  id: string
}>()

const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()

const formSchema = toTypedSchema(
  z.object({
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
    // compostPropertyPaymentFiles: [],
    compostComissionPaymentFiles: [],
  },
})

const onSubmit = form.handleSubmit(async (values) => {
  console.log('Valores del formulario:', values)
  props.onConfirm(values)
})

const { data } = await useAPI<any>(`payment-management/view-payment-detail`, {
  method: 'GET',
  query: {
    id: props.id,
  },
} as any)
if (data.value) {
  form.setValues({
    ...data.value,
    // compostPropertyPaymentFiles: data.value.compostPropertyPaymentFile
    //   ? [data.value.compostPropertyPaymentFile]
    //   : [],
    compostComissionPaymentFiles: data.value.compostComissionPaymentFile
      ? [data.value.compostComissionPaymentFile]
      : [],
    // transferedAt: dayjs(data.value.transferedAt).format('YYYY-MM-DD'),
    // attachedFiles: data.value.sustentationFile ? [data.value.sustentationFile] : [],
  })
}

// const handlePaymentVoucherChange = (files: File[]) => {
//   form.values.compostPropertyPaymentFiles = files.map((file) => file.name)
// }

const handleCommissionVoucherChange = (files: File[]) => {
  form.values.compostComissionPaymentFiles = files.map((file) => file.name)
}
</script>

<template>
  <SheetHeader class="flex justify-between">
    <SheetTitle
      class="text-[16px] md:text-[20px] font-medium text-[#152A3C] leading-[28px] tracking-[-0.5px]"
    >
      Sustento de pago de comisión
    </SheetTitle>
    <SheetClose class="rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <form class="flex flex-col h-full" @submit="onSubmit">
      <section class="p-5 flex-grow">
        <!-- Adjuntar Voucher de Pago de Bien -->
        <!-- <div class="mb-6 leading-[20px]"> -->
        <!--   <div class="text-[#152A3C]"></div> -->
        <!--   <FormField -->
        <!--     v-slot="{ componentField }" -->
        <!--     name="compostPropertyPaymentFiles" -->
        <!--   > -->
        <!--     <FormItem> -->
        <!--       <FormControl> -->
        <!--         <InputFile -->
        <!--           v-model="form.values.compostPropertyPaymentFiles" -->
        <!--           title="Arrastrar o abrir archivo" -->
        <!--           instructions-text="JPG, PNG, JPEG o PDF Tamaño máx 5MB" -->
        <!--           :limit-files="1" -->
        <!--           v-bind="componentField" -->
        <!--           @update:value="handlePaymentVoucherChange" -->
        <!--         /> -->
        <!--       </FormControl> -->
        <!--       <FormMessage /> -->
        <!--     </FormItem> -->
        <!--   </FormField> -->
        <!-- </div> -->

        <!-- Adjuntar Voucher de Pago de Comisión -->
        <div class="mb-6 leading-[20px]">
          <!-- <div class="text-[#152A3C]"> -->
          <!--   <h2 -->
          <!--     class="text-sm font-[600] mb-2 md:mb-4 uppercase tracking-[0.5px]" -->
          <!--   > -->
          <!--     Adjuntar voucher pago de comisión -->
          <!--   </h2> -->
          <!-- </div> -->
          <h2 class="mb-4 font-bold uppercase text-gray-500 text-sm">
            Voucher de pago de comisión
          </h2>
          <FormField
            v-slot="{ componentField }"
            name="compostComissionPaymentFiles"
          >
            <FormItem>
              <FormControl>
                <InputFile
                  v-model="form.values.compostComissionPaymentFiles"
                  disabled
                  title="Arrastrar o abrir archivo"
                  instructions-text="JPG, PNG, JPEG o PDF Tamaño máx 5MB"
                  :limit-files="1"
                  v-bind="componentField"
                  @update:value="handleCommissionVoucherChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div v-if="data.compostComissionPaymentObservationMotive">
            <h2 class="mt-4 font-bold uppercase text-gray-500 text-sm">
              Última observación
            </h2>
            <Textarea
              type="text"
              label="Descripción"
              :readonly="true"
              class="mt-6"
              :default-value="data.compostComissionPaymentObservationMotive"
            />
          </div>
          <h2 class="mt-4 font-bold uppercase text-gray-500 text-sm">
            Detalle de participante
          </h2>
          <ParticipantDetailFields :participant-id="data.user.id" />
        </div>
      </section>
      <div class="flex flex-row space-x-4 p-6">
        <Button
          v-if="
            myGrants.data.value.includes(
              GrantId.PlatformPaymentComissionCanObserve,
            )
          "
          variant="default"
          as="div"
          :disabled="!form.meta.value.valid"
          class="w-full bg-yellow-500 cursor-pointer"
          @click="onObserve"
        >
          Observar abono
        </Button>
        <Button
          v-if="
            myGrants.data.value.includes(
              GrantId.PlatformPaymentComissionCanConfirm,
            )
          "
          variant="default"
          :disabled="!form.meta.value.valid"
          class="w-full"
          @click="onConfirm"
        >
          Confirmar sustento
        </Button>
      </div>
    </form>
  </div>
</template>
