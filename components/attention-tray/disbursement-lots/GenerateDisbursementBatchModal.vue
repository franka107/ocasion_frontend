<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { getLocalTimeZone, parseAbsolute } from '@internationalized/date'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDisbursement } from '@/composables/useDisbursement'
import {
  bankType,
  paymentMethodType,
  currencyType,
  paymentMediumType,
  withdrawalRequeststHeaderShortly,
  withdrawalRequestsSearch,
  rechargeStatus,
} from '@/constants/attention-tray'
import MoneyLabel from '~/design-system/ui/money-label/MoneyLabel.vue'
import { Bank, type DisbursementLot, type FileType } from '~/types/Disbursement'
import type { IDataResponse } from '~/types/Common'
import type { IWithdrawalItem } from '~/types/Withdrawal'
import type { SearchValues } from '~/components/ui/custom-table/CustomTable.vue'
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
import DateLabel from '~/design-system/ui/data-label/DateLabel.vue'
const {
  generatelPreviewDisbursement,
  generatelDisbursement,
  viewAvailableBankAccounts,
} = useDisbursement('all')

const availableBankAccounts = ref<string[]>([])

const handleBankChange = async (bank: string) => {
  const viewAvailableBankAccountsResponse = await viewAvailableBankAccounts(
    bank as Bank,
  )
  availableBankAccounts.value = viewAvailableBankAccountsResponse?.data
    .value as string[]
}

const emit = defineEmits(['update:modelValue'])
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const props = defineProps<{
  id?: string
  modelValue: boolean
  bank: string
  // retireRequests: { type: string; ids: string[] }
  onSubmit: (values: any) => void
  refreshTable: () => void
}>()
interface DetailPreviewInfo {
  retireRequestsCount?: number
  sumOfAmountToBeDisbursed?: number
  bank?: string
  chargeAccount?: string
}
const paymentMethodOptions = Array.from(paymentMethodType).map(
  ([id, name]) => ({
    id,
    name,
  }),
)

const banksOptions = Array.from(bankType).map(([id, name]) => ({
  id,
  name,
}))

const currencyOptions = Array.from(currencyType).map(([id, name]) => ({
  id,
  name,
}))

const paymentMediumOptions = Array.from(paymentMediumType).map(
  ([id, name]) => ({
    id,
    name,
  }),
)
const showDetailPreview = ref(false)
const detailPreviewInfo = ref<DetailPreviewInfo>({})
const formSchema = toTypedSchema(
  z.object({
    paymentMethod: z.string().min(1, 'Seleccione una forma de pago.'),

    bank: z.string().min(1, 'Seleccione un banco'),

    disbursedAt: z
      .string()
      .nonempty('La fecha de desembolso es requerida')
      .optional(),
    currency: z.string().min(1, 'Seleccione una moneda.'),
    chargeAccount: z
      .string()
      .regex(/^\d{10,20}$/, 'Ingrese un número de cuenta válido.'),
    paymentMedium: z.string().min(1, 'Seleccione un medio de pago.'),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})
const BASE_DIS_URL = '/finance/disbursement-management'

const {
  page,
  onSort,
  onSearch,
  filterOptions,
  sortOptions,
  requestWithdrawal,
  authorizeWithdrawal,
  rejectWithdrawal,
} = useWithdrawalRequests('not-pendings')

const BASE_WITH_URL = '/finance/withdrawal-request-management'
const { data, refresh } = await useAPI<IDataResponse<IWithdrawalItem>>(
  () => `${BASE_WITH_URL}/view-paginated-withdrawal-requests`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const onSubmit = form.handleSubmit((values) => {
  const { paymentMethod, bank, currency, chargeAccount, paymentMedium } = values
  console.log('Formulario enviado con los valores:', values)
  handlePreview({
    id: props.id,
    paymentMethod,
    bank,
    currency,
    chargeAccount,
    paymentMedium,
  })
})
const handlePreview = async (values: any) => {
  console.log('values', values)
  const valuesToSend = {
    bank: values.bank,
    chargeAccount: values.chargeAccount,
    disbursedAt: values.disbursedAt,
    batchRetireRequests: selectedMultipleData,
  }
  const { status, error, data }: any =
    await generatelPreviewDisbursement(valuesToSend)
  if (status.value === 'success') {
    showDetailPreview.value = true
    detailPreviewInfo.value = data.value
  } else {
    const eMsg =
      error.value.data?.errors?.[0].message ||
      error.value.data.message ||
      'El desembolso no se pudo generar, intentalo más tarde'
    openConfirmModal({ title: '', message: '', callback: async () => {} })
    updateConfirmModal({
      title: 'Error al generar desembolso',
      message: eMsg,
      type: 'error',
    })
  }
}
const handleSubmit = async () => {
  const valuesToSend = {
    ...form.values,
    batchRetireRequests: selectedMultipleData,
  }
  openConfirmModal({
    title: 'Resumen del desembolso',
    message: `
      ¿Está seguro de generar el lote del desembolso?
    `,
    callback: async () => {
      const { status, error, data }: any =
        await generatelDisbursement(valuesToSend)
      if (status.value === 'success') {
        showDetailPreview.value = false
        detailPreviewInfo.value = {}
        emit('update:modelValue', false)
        props.refreshTable()
        downloadFile(data.value.voucherGeneratedFile)
        updateConfirmModal({
          title: 'Desembolso generado',
          message: 'El desembolso ha sido generado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El desembolso no se pudo generar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al generar desembolso',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const initialSearchValues: SearchValues = {}

const selectedMultipleData = ref<{ type: string; ids: string[] }>({
  type: 'empty',
  ids: [],
})
const resetMultipleSelect = ref<Function | undefined>(undefined)
async function downloadFile(file: FileType) {
  try {
    // Realiza la solicitud al servidor para obtener el archivo
    const response = await fetch(file.path)
    if (!response.ok) {
      throw new Error(`Error al descargar el archivo: ${response.statusText}`)
    }

    // Convierte la respuesta a un blob
    const blob = await response.blob()

    // Crea un enlace para descargar el blob
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = file.name
    document.body.appendChild(link)
    link.click()

    // Limpia el objeto URL y elimina el enlace
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error al descargar el archivo:', error)
  }
}
</script>

<template>
  <AlertDialog
    :open="modelValue"
    class="z-[30]"
    @update:open="(event) => emit('update:modelValue', event)"
  >
    <AlertDialogContent
      class="z-[98] h-auto w-full px-0"
      :class="[showDetailPreview ? 'max-w-[450px]' : 'max-w-[770px]']"
    >
      <div
        v-show="!showDetailPreview"
        class="flex flex-col gap-6 flex-grow max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/50"
      >
        <form v-show="!showDetailPreview" class="" @submit="onSubmit">
          <!-- Título -->
          <AlertDialogHeader class="border-b border-primary">
            <AlertDialogTitle
              class="text-xl tracking-[-0.5px] text-primary text-start font-[600] px-6 pb-[18px]"
              >Generar lote de desembolso</AlertDialogTitle
            >
          </AlertDialogHeader>
          <div class="grid grid-cols-2 gap-2 xl:gap-4 px-6 pt-6">
            <!-- Forma de pago -->
            <FormField v-slot="{ componentField }" name="paymentMethod">
              <FormItem>
                <FormControl>
                  <CustomSelect
                    v-bind="componentField"
                    :items="paymentMethodOptions"
                    placeholder="Forma de pago"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Banco -->
            <FormField v-slot="{ componentField }" name="bank">
              <FormItem>
                <FormControl>
                  <CustomSelect
                    v-bind="componentField"
                    :items="banksOptions"
                    placeholder="Banco"
                    @update:model-value="
                      (value) => {
                        handleBankChange(value)
                      }
                    "
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
                    :items="currencyOptions"
                    placeholder="Moneda"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="chargeAccount">
              <FormItem class="">
                <FormControl>
                  <CustomSelect
                    v-bind="componentField"
                    :disabled="!form.values.bank"
                    :items="
                      availableBankAccounts.map((e) => ({
                        id: e,
                        name: e,
                      })) || []
                    "
                    placeholder="Cuenta cargo"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Medio de pago -->
            <FormField v-slot="{ componentField }" name="paymentMedium">
              <FormItem>
                <FormControl>
                  <div class="mt-[6px]">
                    <CustomSelect
                      v-bind="componentField"
                      :items="paymentMediumOptions"
                      placeholder="Medio de pago"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="disbursedAt">
              <FormItem>
                <FormControl>
                  <DateInput
                    label="Fecha de desembolso"
                    :value="componentField.modelValue"
                    :min-value="
                      parseAbsolute(
                        new Date().toISOString(),
                        getLocalTimeZone(),
                      )
                    "
                    @update:model-value="componentField.onChange"
                  />
                  <!-- <CustomInput staticLabel type="date" label="Fecha de desembolso" v-bind="componentField" /> -->
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Table -->
          </div>
          <!-- Botones -->
        </form>
        <div class="px-6">
          <CustomTable
            :data="data.data"
            :header="withdrawalRequeststHeaderShortly"
            :search="withdrawalRequestsSearch"
            class="mb-4"
            multiple-select
            @on-sort="onSort"
            @on-search="onSearch"
            @on-multiple-select="
              ({ ids, type, resetMultipleSelect: onResetMultipleSelect }) => {
                selectedMultipleData = { ids, type }
                resetMultipleSelect = onResetMultipleSelect
              }
            "
          >
            <template #createdAt="{ row }">
              <DateLabel :value="row.createdAt" />
            </template>
            <template #amount="{ row }">
              <MoneyLabel :amount="row.amount" />
            </template>

            <template #status="{ row }">
              <CustomChip
                :text="rechargeStatus.get(row.status)?.name || ''"
                :variant="rechargeStatus.get(row.status)?.color as any"
              ></CustomChip>
            </template>
          </CustomTable>
        </div>

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
            size="xl"
            class="text-[16px] font-[600] mt-[16px]"
            :disabled="!form.meta.value.valid"
            @click="
              () => {
                onSubmit()
              }
            "
          >
            Generar
          </Button>
        </AlertDialogFooter>
      </div>

      <div v-show="showDetailPreview" class="mx-auto">
        <div class="flex flex-col items-center px-6">
          <CustomIcons name="Icon-USD" class="w-[48px] h-[48px] pb-[16px]" />
          <h2 class="text-[#152A3C] text-[16px] font-[600] pb-[12px]">
            Resumen del desembolso
          </h2>
          <p class="text-[#68686C] text-[14px] font-[500] pb-[20px]">
            ¿Está seguro de generar el lote del desembolso?
          </p>
        </div>
        <div class="flex flex-col items-left px-6 pb-[32px]">
          <div class="flex font-[500] text-[14px]"></div>
          <div class="flex font-[500] text-[14px]">
            <h3 class="text-[#225B82] pr-2">N° solicitudes:</h3>
            <p class="">{{ detailPreviewInfo.retireRequestsCount }}</p>
          </div>
          <div class="flex font-[500] text-[14px]">
            <h3 class="text-[#225B82] pr-1">Suma de monto a desembolsar:</h3>
            <MoneyLabel
              class="p-0 w-auto text-[#68686C]"
              :amount="detailPreviewInfo.sumOfAmountToBeDisbursed || 0"
            />
          </div>
          <div class="flex font-[500] text-[14px]">
            <h3 class="text-[#225B82] pr-1">Banco de origen:</h3>
            <p class="">{{ detailPreviewInfo.bank }}</p>
          </div>
          <div class="flex font-[500] text-[14px]">
            <h3 class="text-[#225B82] pr-1">Cuenta de origen:</h3>
            <p class="">{{ detailPreviewInfo.chargeAccount }}</p>
          </div>
        </div>
        <AlertDialogFooter class="px-6">
          <Button
            type="button"
            size="xl"
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent"
            @click="showDetailPreview = !showDetailPreview"
          >
            Cancelar
          </Button>
          <Button
            size="xl"
            class="text-[16px] font-[600]"
            @click="handleSubmit"
          >
            Confirmar
          </Button>
        </AlertDialogFooter>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>
