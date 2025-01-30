<template>
  <div
    class="flex flex-col md:flex-row justify-between items-center pt-[24px] pb-[28px] px-10 rounded-xl bg-white w-full"
  >
    <h1 class="text-[20px] font-[700] leading-[28px] text-primary">
      Mi monedero
    </h1>
    <div class="flex align-middle space-x-2">
      <Button variant="default" class="text-[16px]" @click="toggleBalance">
        <EyeIcon v-if="!showBalance" class="h-4 w-4" />
        <EyeOffIcon v-else class="h-4 w-4" />
        <span class="ml-2">
          {{ showBalance ? 'Ocultar saldo' : 'Mostrar saldo' }}
        </span>
      </Button>
      <Button
        class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent w-[97px]"
        @click="
          () => {
            isWithdrawModalOpen = true
          }
        "
      >
        Retirar
      </Button>
      <Button
        variant="default"
        class="w-[97px] text-[16px]"
        @click="
          () => {
            isRechargeModalOpen = true
          }
        "
      >
        Recargar
      </Button>
    </div>
  </div>
  <div class="w-full mt-4 gap-x-4">
    <div
      class="flex flex-wrap md:flex-nowrap justify-center gap-y-[32px] gap-x-[32px] w-[100%] bg-white rounded-xl px-[16px] py-6"
    >
      <div
        v-for="(card, index) in cardsData"
        :key="index"
        class="max-w-[356px] bg-[#F3F8FC] p-4 flex flex-col rounded-[8px] w-full"
      >
        <div class="flex justify-between items-center">
          <h4
            class="text-[16px] text-[#20445E] font-[500] leading-[15px] mb-[16px]"
          >
            {{ card.subtitle }}
          </h4>
          <button
            v-if="card.amountKey === 'guaranteedBalance'"
            class="text-[#F97316] text-[14px] mb-[16px]"
            @click="openModal"
          >
            Ver detalle
          </button>
        </div>
        <h3
          class="text-[20px] text-[#152A3C] font-bold leading-[14px] mb-[16px]"
        >
          {{ formatBalance(purseDetail[card.amountKey]) }}
        </h3>
        <p class="font-[400] text-[12px] text-[#86868A] leading-[15px]">
          {{ card.description }}
        </p>
      </div>
    </div>
  </div>
  <SheetContent
    v-model:open="openPurseDetailsModal"
    class="flex flex-col h-full"
    @pointer-down-outside="(e) => e.preventDefault()"
    @interact-outside="(e) => e.preventDefault()"
  >
    <PurseForm
      :purse-id="purseId"
      :bid-id="appraisalHistoryModal.offerId"
      title="Detalle de saldo garantizado"
    />
  </SheetContent>
  <WithdrawCashModal
    v-model="isWithdrawModalOpen"
    :refresh-history-transaction-table="refreshHistoryTransactionTable"
  />
  <RechargeBalanceModal
    v-model="isRechargeModalOpen"
    :refresh-history-transaction-table="refreshHistoryTransactionTable"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import PurseForm from '@/components/purse/PurseForm.vue'
import RechargeBalanceModal from '@/components/purse/RechargeBalanceModal.vue'
import WithdrawCashModal from '@/components/purse/WithdrawCashModal.vue'
const purseId = ref<number | undefined>(undefined)
const appraisalHistoryModal = ref<any>({ offerId: '' })
const props = defineProps<{ refreshHistoryTransactionTable: () => void }>()

const openPurseDetailsModal = ref(false)
const { rechargeMyWallet } = useUserParticipantAPI()
const isWithdrawModalOpen = ref(false)
const isRechargeModalOpen = ref(false)

const handleRecharge = async () => {
  const { status, error } = await rechargeMyWallet({})
  refresh()
}

const { data: purseDetail, refresh } = await useAPI<any>(
  `/user-management/get-my-wallet`,
  {
    query: {},
    default: () => ({}),
  },
)
const showBalance = ref(false)

const toggleBalance = () => {
  showBalance.value = !showBalance.value
}

const formatBalance = (amount: number) => {
  if (!showBalance.value) return '****'
  return `$${amount}`
  // return new Intl.NumberFormat('es-AR', {
  //   style: 'currency',
  //   currency: 'ARS',
  //   minimumFractionDigits: 0,
  //   maximumFractionDigits: 0
  // }).format(amount)
}

const cardsData = ref([
  {
    subtitle: 'Saldo disponible',
    amountKey: 'availableBalance',
    description:
      'Saldo que ha cargado y que puede disponer para uso de garantía en participación de eventos.',
  },
  {
    subtitle: 'Saldo garantizado',
    amountKey: 'guaranteedBalance',
    description:
      'Saldo que está siendo utilizado como garantía para la participación de uno o más eventos (no puede disponerse).',
  },
  {
    subtitle: 'Saldo Total',
    amountKey: 'totalAmount',
    description: 'Suma del saldo que tiene el Monedero.',
  },
])

const openModal = () => {
  openPurseDetailsModal.value = true
}
</script>
