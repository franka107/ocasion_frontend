<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { X } from 'lucide-vue-next'
import ParticipantDetailFields from '../attention-tray/withdrawal-requests/ParticipantDetailFields.vue'
import { SheetClose } from '@/components/ui/sheet' //
import InputFile from '@/components/common/file/Input.vue'
import type {
  TransferenceSustentationDto,
  DeliveryDetailFile,
} from '@/types/Evidence.ts'
import { UserType } from '~/types/Administrators'
const BASE_SUSTENTATION_MANAGEMENT = '/sustentation-management'
const props = defineProps<{
  id: string | undefined
  onEdit: (values: any) => void
  onConfirm: (values: any) => void
  closeModal: () => void
}>()
const currentMode = ref<'edit' | 'confirm'>('confirm')

const transferenceSustentationDetail = ref<TransferenceSustentationDto | null>(
  null,
)

const formSchema = toTypedSchema(
  z.object({
    identifierHolderFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(
        1,
        'Puede subir solo un archivo para el voucher de pago de comisión',
      ),
    identifierSpouseFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(
        1,
        'Puede subir solo un archivo para el voucher de pago de comisión',
      ),
    rucCardFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(
        1,
        'Puede subir solo un archivo para el voucher de pago de comisión',
      ),
    soatFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(
        1,
        'Puede subir solo un archivo para el voucher de pago de comisión',
      ),
    validityOfPowerFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(
        1,
        'Puede subir solo un archivo para el voucher de pago de comisión',
      ),
  }),
)

try {
  const { data } = await useAPI<TransferenceSustentationDto>(
    `${BASE_SUSTENTATION_MANAGEMENT}/view-transference-sustentation-detail`,
    {
      query: { id: props.id },
    } as any,
  )

  transferenceSustentationDetail.value = data.value
} catch (error) {
  console.error('Error al cargar el detalle de Sustento de Entrega', error)
}
const form = useForm({
  validationSchema: formSchema,
  initialValues: transferenceSustentationDetail.value,
})

const onSubmit = async (values: any) => {
  let formattedValues = null
  if (currentMode.value === 'edit') {
    const { valid } = await form.validate()
    if (valid) {
      const { files } = form.values
      formattedValues = {
        id: props.id,
        files,
      }
      props.onEdit(formattedValues)
    }
  } else if (currentMode.value === 'confirm') {
    formattedValues = {
      transferenceSupportId: props.id,
    }
    props.onConfirm(formattedValues)
  }
}

const userSession = useUserSession()
</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]"
      >Detalle transferencia de bienes</SheetTitle
    >
  </SheetHeader>

  <div class="flex-grow flex flex-col overflow-y-auto no-scrollbar">
    <form class="min-h-full" @submit.prevent="onSubmit">
      <section class="flex flex-col gap-4 flex-grow p-5 h-full">
        <div v-if="transferenceSustentationDetail">
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
              :participant-id="transferenceSustentationDetail.participantId"
            />
          </section>
          <section class="mb-6">
            <h3
              class="tracking-[1px] font-[600] text-[#152A3C] text-[14px] leading-5 mb-[12px]"
            >
              ARCHIVOS SUBIDOS
            </h3>
            <div>
              <h4
                class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]"
              >
                SOAT (en caso que la unidad no cuente con SOAT vigente)
              </h4>
              <!-- Fields -->
              <FormField v-slot="{ componentField }" name="soatFiles">
                <FormItem>
                  <FormControl>
                    <InputFile
                      v-model="form.values.soatFiles"
                      title="SOAT"
                      :disabled="currentMode === 'confirm'"
                      :hide-remove-icon="currentMode === 'confirm'"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div>
              <h4
                class="font-[600] mt-3 text-[#152A3C] text-[12px] leading-5 mb-[12px]"
              >
                Foto legible de DNI del titular (Frontal y dorsal)
              </h4>
              <FormField
                v-slot="{ componentField }"
                name="identifierHolderFiles"
              >
                <FormItem>
                  <FormControl>
                    <InputFile
                      v-model="form.values.identifierHolderFiles"
                      title="Foto legible de DNI del titular"
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
                transferenceSustentationDetail.participant.maritalStatus ===
                  'MARRIED' &&
                transferenceSustentationDetail.participant.personType ===
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
                transferenceSustentationDetail.participant.personType ===
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div
              v-if="
                transferenceSustentationDetail.participant.personType ===
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
            type="button"
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent w-[200px]"
            size="xll"
            @click="currentMode = 'edit'"
          >
            Editar
          </Button>
          <Button
            type="submit"
            class="text-[16px] font-[600] w-[200px]"
            size="xll"
          >
            Confirmar
          </Button>
        </template>
        <template v-else>
          <Button
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
