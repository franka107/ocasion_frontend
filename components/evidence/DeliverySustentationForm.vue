<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { X } from 'lucide-vue-next'
import {
  getLocalTimeZone,
  parseAbsolute,
  parseAbsoluteToLocal,
} from '@internationalized/date'
import dayjs from 'dayjs'
import DateTimeInput from '../ui/date-time-input/DateTimeInput.vue'
import DateInput from '../ui/date-input/DateInput.vue'
import ParticipantDetailFields from '../attention-tray/withdrawal-requests/ParticipantDetailFields.vue'
import { SheetClose } from '@/components/ui/sheet' //
import InputFile from '@/components/common/file/Input.vue'

import { UserType } from '~/types/Administrators'
import { GrantId } from '~/types/Grant'
const BASE_SUSTENTATION_MANAGEMENT = '/sustentation-management'
const props = defineProps<{
  id: string | undefined
  readonly: boolean
  onEdit: (values: any) => void
  onConfirm: (values: any) => void
  closeModal: () => void
}>()
const currentMode = ref<'edit' | 'confirm'>('confirm')

const deliverySustentationDetail = ref<any | null>(null)
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()

const formSchema = toTypedSchema(
  z.object({
    evidenceFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(5, 'Puede subir máximo 6 archivos de evidencia'),
    address: z.string().min(1, 'La dirección es requerida.'),
    comment: z.string().min(1, 'El comentario es requerido.'),
    deliveredAtDate: z.string().min(1, 'La fecha de envio es requerida.'),
    deliveredAtTime: z.string().min(1, 'La fecha de envio es requerida.'),
  }),
)

try {
  const { data } = await useAPI<any>(
    `${BASE_SUSTENTATION_MANAGEMENT}/view-delivery-sustentation-detail`,
    {
      query: { id: props.id },
    } as any,
  )

  deliverySustentationDetail.value = {
    ...data.value,
    // deliveredAtDate: data.value.deliveredAt
    //   ? dayjs(data.value.deliveredAt).format('YYYY-MM-DD')
    //   : dayjs(new Date()).format('YYYY-MM-DD'),
    // deliveredAtTime: data.value.deliveredAt
    //   ? dayjs(data.value.deliveredAt).format('HH:mm')
    //   : dayjs(new Date()).format('HH:mm'),
    deliveredAtDate: data.value.deliveredAt
      ? dayjs(data.value.deliveredAt).format('YYYY-MM-DD')
      : null,
    deliveredAtTime: data.value.deliveredAt
      ? dayjs(data.value.deliveredAt).format('HH:mm')
      : null,
  }
} catch (error) {
  console.error('Error al cargar el detalle de Sustento de Entrega', error)
}

const userSession = useUserSession()
if (
  userSession.user.value?.user.type === UserType.OrganizationUser ||
  userSession.user.value?.user.type === UserType.OrganizationAdmin
) {
  currentMode.value = 'edit'
}
const form = useForm({
  validationSchema: formSchema,
  initialValues: deliverySustentationDetail.value,
})

const onSubmit = form.handleSubmit(async (values: any) => {
  if (currentMode.value === 'edit') {
    const { valid } = await form.validate()
    if (valid) {
      const formattedValues = {
        id: props.id,
        deliveredAt: new Date(
          `${values.deliveredAtDate} ${values.deliveredAtTime}`,
        ).toISOString(),

        ...values,
      }
      props.onEdit(formattedValues)
    }
  } else if (currentMode.value === 'confirm') {
    const formattedValues = {
      id: props.id,
    }
    props.onConfirm(formattedValues)
  }
})
</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]"
      >Detalle entrega de bien</SheetTitle
    >
  </SheetHeader>

  <div class="flex-grow flex flex-col overflow-y-auto no-scrollbar">
    <form class="" @submit="onSubmit">
      <section class="flex flex-col gap-4 flex-grow p-5 min-h-full">
        <div v-if="deliverySustentationDetail">
          <section
            v-if="userSession.user.value?.user.type !== UserType.Participant"
            class=""
          >
            <h3
              class="tracking-[1px] font-[600] text-[#152A3C] text-[14px] leading-5"
            >
              DATOS DEL PARTICIPANTE
            </h3>

            <ParticipantDetailFields
              :participant-id="
                deliverySustentationDetail.sustentation.bid.userId
              "
            />
          </section>
          <section class="mb-6">
            <h3
              class="tracking-[1px] font-[600] text-[#152A3C] text-[14px] leading-5 mb-[12px]"
            >
              DATOS DE LA ENTREGA
            </h3>
            <div>
              <!-- <h4 -->
              <!--   class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]" -->
              <!-- > -->
              <!--   Fecha y hora de envio -->
              <!-- </h4> -->
              <div class="mb-[12px]">
                <div class="flex gap-2">
                  <!-- Fecha -->
                  <FormField v-slot="{ componentField }" name="deliveredAtDate">
                    <FormItem class="w-1/2">
                      <FormControl>
                        <DateInput
                          label="Fecha"
                          :readonly="readonly"
                          :value="componentField.modelValue"
                          @update:model-value="componentField.onChange"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <!-- Hora-->
                  <FormField v-slot="{ componentField }" name="deliveredAtTime">
                    <FormItem class="w-1/2">
                      <FormControl>
                        <CustomInput
                          type="time"
                          label="Hora"
                          v-bind="componentField"
                          :readonly="readonly"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <!-- <FormField v-slot="{ componentField }" name="deliveredAt"> -->
                <!--   <FormItem> -->
                <!--     <FormControl> -->
                <!--       <DateInput -->
                <!--         class="my-2" -->
                <!--         label="Fecha y hora de envio" -->
                <!--         :value="componentField.modelValue" -->
                <!--         @update:model-value="componentField.onChange" -->
                <!--       /> -->
                <!--     </FormControl> -->
                <!--     <FormMessage /> -->
                <!--   </FormItem> -->
                <!-- </FormField> -->
              </div>
              <!-- <h4 -->
              <!--   class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]" -->
              <!-- > -->
              <!--   Dirección -->
              <!-- </h4> -->

              <div class="mb-[12px]">
                <FormField v-slot="{ componentField }" name="address">
                  <FormItem>
                    <FormControl>
                      <CustomInput
                        type="text"
                        label="Dirección"
                        v-bind="componentField"
                        :readonly="readonly"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="mt-5">
                <FormField v-slot="{ componentField }" name="comment">
                  <FormItem>
                    <FormControl>
                      <Textarea
                        type="text"
                        label="Comentarios"
                        :readonly="readonly"
                        v-bind="componentField"
                      />
                      <FormMessage />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
            </div>
            <div>
              <h4
                class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]"
              >
                Evidencias de entrega
              </h4>
              <FormField v-slot="{ componentField }" name="evidenceFiles">
                <FormItem>
                  <FormControl>
                    <InputFile
                      v-model="form.values.evidenceFiles"
                      title="Evidencia"
                      :disabled="currentMode === 'confirm' || readonly"
                      :hide-remove-icon="currentMode === 'confirm'"
                      v-bind="componentField"
                      instructions-text="Cargar máximo hasta 5 archivo (png, jpg, o jpeg)"
                      :accepted-file-types="['.jpg', '.png', '.jpeg']"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </section>
        </div>
      </section>
      <SheetFooter class="mt-auto flex gap-x-4 px-6">
        <template v-if="currentMode === 'confirm'">
          <Button
            v-if="
              myGrants.data.value.includes(
                GrantId.OrganizationSustentationDeliveryCanEdit,
              ) ||
              myGrants.data.value.includes(
                GrantId.PlatformSustentationDeliveryCanEdit,
              )
            "
            type="button"
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent w-[200px]"
            size="xll"
            @click="currentMode = 'edit'"
          >
            Editar
          </Button>
          <Button
            v-if="
              myGrants.data.value.includes(
                GrantId.PlatformSustentationDeliveryCanConfirm,
              )
            "
            type="submit"
            class="text-[16px] font-[600] w-[200px]"
            size="xll"
          >
            Confirmar
          </Button>
        </template>
        <template v-else>
          <Button
            v-if="
              myGrants.data.value.includes(
                GrantId.OrganizationSustentationDeliveryCanEdit,
              ) ||
              myGrants.data.value.includes(
                GrantId.PlatformSustentationDeliveryCanEdit,
              )
            "
            type="submit"
            :disabled="!form.meta.value.valid"
            class="text-[16px] font-[600] w-full"
            size="xll"
          >
            Guardar documentos
          </Button>
        </template>
      </SheetFooter>
    </form>
  </div>
</template>
