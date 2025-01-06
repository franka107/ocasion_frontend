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
import { GrantId } from '~/types/Grant'
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
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()

const formSchema = toTypedSchema(
  z
    .object({
      identifierHolderFiles: z
        .array(z.any())
        .min(1, 'Debe subir al menos un archivo')
        .max(
          1,
          'Puede subir solo un archivo para el voucher de pago de comisión',
        ),
      identifierSpouseFiles: z.array(z.any()),
      // .min(1, 'Debe subir al menos un archivo')
      // .max(
      //   1,
      //   'Puede subir solo un archivo para el voucher de pago de comisión',
      // ),
      rucCardFiles: z.array(z.any()),
      // .min(1, 'Debe subir al menos un archivo')
      // .max(
      //   1,
      //   'Puede subir solo un archivo para el voucher de pago de comisión',
      // ),
      soatFiles: z
        .array(z.any())
        .min(1, 'Debe subir al menos un archivo')
        .max(
          1,
          'Puede subir solo un archivo para el voucher de pago de comisión',
        ),
      validityOfPowerFiles: z.array(z.any()),
      // .min(1, 'Debe subir al menos un archivo')
      // .max(
      //   1,
      //   'Puede subir solo un archivo para el voucher de pago de comisión',
      // ),
    })
    .superRefine((values, ctx) => {
      // Condición para validar identifierSpouseFiles (cónyuge casado y persona natural)
      if (
        transferenceSustentationDetail.value?.participant.maritalStatus ===
          'MARRIED' &&
        transferenceSustentationDetail.value?.participant.personType ===
          'NATURAL_PERSON'
      ) {
        if (
          !values.identifierSpouseFiles ||
          values.identifierSpouseFiles.length === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['identifierSpouseFiles'],
            message: 'Debe subir al menos un archivo para el cónyuge',
          })
        }
      }

      // Condición para validar rucCardFiles y validityOfPowerFiles (persona jurídica)
      if (
        transferenceSustentationDetail.value?.participant.personType ===
        'JURIDIC_PERSON'
      ) {
        if (!values.rucCardFiles || values.rucCardFiles.length === 0) {
          ctx.addIssue({
            path: ['rucCardFiles'],
            code: z.ZodIssueCode.custom,
            message: 'Debe subir al menos un archivo para la ficha RUC',
          })
        }
        if (
          !values.validityOfPowerFiles ||
          values.validityOfPowerFiles.length === 0
        ) {
          ctx.addIssue({
            path: ['validityOfPowerFiles'],
            code: z.ZodIssueCode.custom,
            message: 'Debe subir al menos un archivo para la vigencia de poder',
          })
        }
      }
    }),
)

const stepsTitle = computed(() => {
  switch (transferenceSustentationDetail.value?.participant.personType) {
    case 'NATURAL_PERSON':
      if (
        transferenceSustentationDetail.value?.participant.maritalStatus ===
        'MARRIED'
      ) {
        return 'Pasos a seguir para persona casada:'
      }

      return 'Pasos a seguir para persona soltera:'
    case 'JURIDIC_PERSON':
      return 'Pasos a seguir para persona jurídica:'
    default:
      return 'Pasos a seguir:'
  }
})

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

const userSession = useUserSession()
if (userSession.user.value?.user.type === UserType.Participant) {
  currentMode.value = 'edit'
}
const form = useForm({
  validationSchema: formSchema,
  initialValues: transferenceSustentationDetail.value,
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
      >Detalle transferencia de bienes</SheetTitle
    >
  </SheetHeader>

  <div class="flex-grow flex flex-col overflow-y-auto no-scrollbar">
    <form class="min-h-full" @submit="onSubmit">
      <div class="min-h-full">
        <section class="px-5 pt-5 flex-grow">
          <div
            class="h-auto flex flex-col leading-[20px] justify-between mb-4 md:mb-6 text-[#20445E] bg-[#E6F0F8] rounded-[8px] p-4"
          >
            <div>
              <h2 class="text-2 md:text-4 font-[700] mb-4">{{ stepsTitle }}</h2>
              <ul
                class="text-[12px] md:text-[14px] tracking-[0.5px] font-[400]"
              >
                <li>
                  1. Carga de documentos solicitados (deben estar vigentes)
                </li>
                <li>2. Programación de la firma en notaría</li>
                <li>3. Toma de firma para transferencia del bien</li>
                <li>4. Entrega del bien</li>
              </ul>
            </div>
            <p class="text-[12px] tracking-[0.5px] pt-4">
              <span class="font-[700]">Nota:</span> Realizar la carga de
              documentos en un plazo de 4 días útiles.
            </p>
            <p class="text-[12px] tracking-[0.5px] pt-2">
              <span class="font-[700]">Nota:</span> En caso algún sustento sea
              observado por parte de
              {{
                transferenceSustentationDetail?.sustentation.organization?.name
              }}
              o DeOcasión, tendrá 02 días útiles tras la notificación para
              susbsanarlas
            </p>
          </div>
        </section>
        <section class="flex flex-col gap-4 flex-grow px-5">
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
                        instructions-text="Cargar máximo hasta 1 archivo (png, jpg, jpeg o pdf)"
                        :accepted-file-types="['.jpg', '.png', '.jpeg', '.pdf']"
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
      </div>
      <SheetFooter class="mt-auto flex gap-x-4 px-6">
        <template v-if="currentMode === 'confirm'">
          <Button
            v-if="
              myGrants.data.value.includes(
                GrantId.OrganizationSustentationTransferenceCanEdit,
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
                GrantId.OrganizationSustentationTransferenceCanConfirm,
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
                GrantId.OrganizationSustentationTransferenceCanEdit,
              ) || userSession.user.value?.user.type === UserType.Participant
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
