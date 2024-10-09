export interface PendingOfferPaymentsDto {
  concretedCount: number;
  inReviewCount: number;
  cancelledCount: number;
  observedCount: number;
}

export interface ConfirmedOfferPaymentsDto {
  confirmedCount: number;
}

export interface PaymentSummaryDto {
  pendingOfferPayments: PendingOfferPaymentsDto;
  confimedOfferPayments: ConfirmedOfferPaymentsDto;
}
