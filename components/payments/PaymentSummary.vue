<template>
  <div class="flex flex-col md:flex-row w-full md:space-x-5">
    <CommonCardPropertyListCard
      title="Pendientes de abonar"
      class="flex-2"
      :property-list="pendingPropertyList"
    >
    </CommonCardPropertyListCard>
    <CommonCardPropertyListCard
      class="flex-1"
      title="Confirmadas"
      :property-list="confirmedPropertyList"
    >
    </CommonCardPropertyListCard>
  </div>
</template>

<script setup lang="tsx">
import type { PaymentSummaryDto } from "~/types/PaymentSummary";
import type { Property } from "../common/card/PropertyListCard.vue";

const BASE_PAYMENT_MANAGEMENT = "/payment-management";

const [paymentSummaryFetch] = await Promise.all([
  useAPI<PaymentSummaryDto>(
    `${BASE_PAYMENT_MANAGEMENT}/get-payments-summary`,
    {} as any,
    true,
  ),
]);

const { data: paymentSummary } = paymentSummaryFetch;

/* Properties */
const pendingPropertyList = computed<Property[]>(() => {
  return [
    {
      label: "Concretados",
      value: String(paymentSummary.value.pendingOfferPayments.concretedCount),
    },
    {
      label: "En revisión",
      value: String(paymentSummary.value.pendingOfferPayments.inReviewCount),
    },
    {
      label: "Cancelados",
      value: String(paymentSummary.value.pendingOfferPayments.cancelledCount),
    },
    {
      label: "Observados",
      value: String(paymentSummary.value.pendingOfferPayments.observedCount),
    },
  ];
});

const confirmedPropertyList = computed<Property[]>(() => [
  {
    label: "Confirmados",
    value: String(paymentSummary.value.confimedOfferPayments.confirmedCount),
  },
]);
</script>
