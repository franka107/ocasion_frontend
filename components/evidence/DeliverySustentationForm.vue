<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { X } from 'lucide-vue-next'
import DateTimeInput from '../ui/date-time-input/DateTimeInput.vue'
import { SheetClose } from '@/components/ui/sheet' //
import InputFile from '@/components/common/file/Input.vue'

import { UserType } from '~/types/Administrators'
import { GrantId } from '~/types/Grant'
const BASE_SUSTENTATION_MANAGEMENT = '/sustentation-management'
const props = defineProps<{
  id: string | undefined
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
    deliveredAt: z.string().min(1, 'La fecha de envio es requerida.'),
  }),
)

try {
  const { data } = await useAPI<any>(
    `${BASE_SUSTENTATION_MANAGEMENT}/view-delivery-sustentation-detail`,
    {
      query: { id: props.id },
    } as any,
  )

  deliverySustentationDetail.value = data.value
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
    <form class="min-h-full" @submit="onSubmit">
      <section class="flex flex-col gap-4 flex-grow p-5">
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
          </section>
          <section class="mb-6">
            <h3
              class="tracking-[1px] font-[600] text-[#152A3C] text-[14px] leading-5 mb-[12px]"
            >
              DATODS DE LA ENTREGA
            </h3>
            <div>
              <h4
                class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]"
              >
                Fecha y hora de envio
              </h4>
              <FormField v-slot="{ componentField }" name="deliveredAt">
                <FormItem class="w-1/2">
                  <FormControl>
                    <DateTimeInput
                      class="my-2"
                      label="Fecha y hora de envio"
                      :value="componentField.modelValue"
                      @update:model-value="componentField.onChange"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <h4
                class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]"
              >
                Dirección
              </h4>

              <FormField v-slot="{ componentField }" name="address">
                <FormItem>
                  <FormControl>
                    <CustomInput
                      type="text"
                      label="Lugar"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <h4
                class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]"
              >
                Comentarios
              </h4>

              <FormField v-slot="{ componentField }" name="comment">
                <FormItem>
                  <FormControl>
                    <Textarea
                      type="text"
                      label="Comentarios"
                      v-bind="componentField"
                    />
                    <FormMessage />
                  </FormControl>
                </FormItem>
              </FormField>
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
                      :disabled="currentMode === 'confirm'"
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
            <div
              v-if="
                deliverySustentationDetail.participant.maritalStatus ===
                  'MARRIED' &&
                deliverySustentationDetail.participant.personType ===
                  'NATURAL_PERSON'
              "
            >
              <h4
                class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]"
              >
                Foto legible de DNI del cónyuge (Frontal y dorsal)
              </h4>
              <FormField
                v-slot="{ componentField }"
                name="identifierSpouseFiles"
              >
                <FormItem>
                  <FormControl>
                    <InputFile
                      v-model="form.values.identifierSpouseFiles"
                      title="Foto legible de DNI del cónyuge"
                      instructions-text="Cargar máximo hasta 1 archivo (png, jpg, jpeg o pdf)"
                      :accepted-file-types="['.jpg', '.png', '.jpeg', '.pdf']"
                      :disabled="currentMode === 'confirm'"
                      :hide-remove-icon="currentMode === 'confirm'"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div
              v-if="
                deliverySustentationDetail.participant.personType ===
                'JURIDIC_PERSON'
              "
            >
              <h4
                class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]"
              >
                Ficha RUC de la empresa de labor
              </h4>
              <FormField v-slot="{ componentField }" name="rucCardFiles">
                <FormItem>
                  <FormControl>
                    <InputFile
                      v-model="form.values.rucCardFiles"
                      title="Ficha RUC de la empresa de labor"
                      :disabled="currentMode === 'confirm'"
                      :hide-remove-icon="currentMode === 'confirm'"
                      v-bind="componentField"
                      instructions-text="Cargar máximo hasta 1 archivo (png, jpg, jpeg o pdf)"
                      :accepted-file-types="['.jpg', '.png', '.jpeg', '.pdf']"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div
              v-if="
                deliverySustentationDetail.participant.personType ===
                'JURIDIC_PERSON'
              "
            >
              <h4
                class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]"
              >
                Vigencia de poder (no superior a 3 meses)
              </h4>
              <FormField
                v-slot="{ componentField }"
                name="validityOfPowerFiles"
              >
                <FormItem>
                  <FormControl>
                    <InputFile
                      v-model="form.values.validityOfPowerFiles"
                      title="Vigencia de poder (no superior a 3 meses)"
                      :disabled="currentMode === 'confirm'"
                      :hide-remove-icon="currentMode === 'confirm'"
                      v-bind="componentField"
                      instructions-text="Cargar máximo hasta 1 archivo (png, jpg, jpeg o pdf)"
                      :accepted-file-types="['.jpg', '.png', '.jpeg', '.pdf']"
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
