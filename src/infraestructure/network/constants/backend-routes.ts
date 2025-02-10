/**
 * Application routes with its version
 * https://github.com/Sairyss/backend-best-practices#api-versioning
 */

// Root
const authManagement = 'auth-management'
const auctionManagement = 'auction-management'
const organizationManagement = 'organization-management'
const transferenceManagement = 'transference-management'
const deliveryManagement = 'delivery-management'
const eventManagement = 'event-management'
const paymentManagement = 'payment-management'
const offerManagement = 'offer-management'
const userManagement = 'user-management'
const notifications = 'notifications'
const bidManagement = 'bid-management'
const roleConfiguration = 'role-configuration'
const audit = 'audit'
const landing = 'landing'
const finance = 'finance'
const walletManagement = 'wallet-management'
const disbursementManagement = 'disbursement-management'
const transactionHistoryManagement = 'transaction-history-management'
const rechargeRequestManagement = 'recharge-request-management'
const kpiManagement = 'kpi-management'
const withdrawalManagement = 'withdrawal-request-management'
const accountValidation = 'account-validation'
const sustentationManagement = 'sustentation-management'
const billingManagement = 'billing-management'

const sharedKernel = 'shared-kernel'
// SubRoots
const car = 'car'

// Api Versions
const v1 = 'v1'

export const routesV1 = {
  version: v1,
  auctionManagement: {
    root: auctionManagement,
    viewUserSubscriptionPreview: `/${auctionManagement}/view-user-subscription-preview`,
    subscribeToOffer: `/${auctionManagement}/subscribe-to-offer`,
    subscribeToOfferPreview: `/${auctionManagement}/subscribe-to-offer-preview`,
  },
  deliveryManagement: {
    root: deliveryManagement,
    confirmDeliverySupport: `/${deliveryManagement}/confirm-delivery-support`,
    updateDeliverySupport: `/${deliveryManagement}/update-delivery-support`,
    getDeliverySupportDetail: `/${deliveryManagement}/get-delivery-support-detail`,
  },
  transferenceManagement: {
    root: transferenceManagement,
    confirmTransferenceSupport: `/${transferenceManagement}/confirm-transference-support`,
    uploadTransferenceSupport: `/${transferenceManagement}/upload-transference-support`,
    getTransferenceSupportDetail: `/${transferenceManagement}/get-transference-support-detail`,
  },
  finance: {
    root: finance,
    transactionHistoryManagement: {
      root: transactionHistoryManagement,
      viewTransactionHistories: `/${finance}/${transactionHistoryManagement}/view-transaction-histories`,
      viewTransactionHistoriesResume: `/${finance}/${transactionHistoryManagement}/view-transaction-histories-resume`,
      viewTransactionHistoriesPaginated: `/${finance}/${transactionHistoryManagement}/view-transaction-histories-paginated`,
      viewTransactionHistoriesPaginatedParticipant: `/${finance}/${transactionHistoryManagement}/view-transaction-histories-paginated-participant`,
      exportTransactionHistories: `/${finance}/${transactionHistoryManagement}/export-transaction-histories`,
    },
    disbursementManagement: {
      root: disbursementManagement,
      generateDisbursementLot: `/${finance}/${disbursementManagement}/generate-disbursement-lot`,
      generateDisbursementLotPreview: `/${finance}/${disbursementManagement}/generate-disbursement-lot-preview`,
      viewDisbursementLotDetail: `/${finance}/${disbursementManagement}/view-disbursement-lot-detail`,
      viewAvailableBankAccounts: `/${finance}/${disbursementManagement}/view-available-bank-accounts`,
      annulDisbursementLot: `/${finance}/${disbursementManagement}/annul-disbursement-lot`,
      viewPaginatedDisbursementLots: `/${finance}/${disbursementManagement}/view-paginated-disbursement-lots`,
      exportDisbursermentLots: `/${finance}/${disbursementManagement}/export-disbursement-lots`,
      confirmDisbursementLot: `/${finance}/${disbursementManagement}/confirm-disbursement-lot`,
      findDisbursementLots: `/${finance}/${disbursementManagement}/find-disbursement-lots`,
    },
    rechargeRequestManagement: {
      root: rechargeRequestManagement,
      viewPaginatedRechargeRequests: `/${finance}/${rechargeRequestManagement}/view-paginated-recharge-requests`,
      exportRechargeRequests: `/${finance}/${rechargeRequestManagement}/export-recharge-requests`,
      viewRechargeRequestDetail: `/${finance}/${rechargeRequestManagement}/view-recharge-request-detail`,
      requestRecharge: `/${finance}/${rechargeRequestManagement}/request-recharge`,
      authorizeRechargeRequest: `/${finance}/${rechargeRequestManagement}/authorize-recharge-request`,
      rejectRechargeRequest: `/${finance}/${rechargeRequestManagement}/reject-recharge-request`,
      updateRechargeRequests: `/${finance}/${rechargeRequestManagement}/update-recharge-requests`,
    },
    withdrawalManagement: {
      root: withdrawalManagement,
      viewPaginatedWithdrawalRequests: `/${finance}/${withdrawalManagement}/view-paginated-withdrawal-requests`,
      viewWithdrawalRequestDetail: `/${finance}/${withdrawalManagement}/view-withdrawal-request-detail`,
      requestWithdrawal: `/${finance}/${withdrawalManagement}/request-withdrawal`,
      authorizeWithdrawalRequest: `/${finance}/${withdrawalManagement}/authorize-withdrawal-request`,
      rejectWithdrawalRequest: `/${finance}/${withdrawalManagement}/reject-withdrawal-request`,
    },

    accountValidation: {
      root: accountValidation,
      viewPaginatedAccountValidations: `/${finance}/${accountValidation}/view-paginated-account-validations`,
      approvalAccountBank: `/${finance}/${accountValidation}/approval-account-bank`,
      rejectAccountBank: `/${finance}/${accountValidation}/reject-account-bank`,
      viewAccountValidationDetail: `/${finance}/${accountValidation}/view-account-validation-detail`,
      exportAccountValidations: `/${finance}/${accountValidation}/export-account-validations`,
    },
    walletManagement: {
      root: walletManagement,
      viewWalletBalance: `/${finance}/${walletManagement}/view-wallet-balance`,
      viewWalletsPaginated: `/${finance}/${walletManagement}/view-wallets-paginated`,
      viewWalletsResume: `/${finance}/${walletManagement}/view-wallets-resume`,
    },
  },
  sustentationManagement: {
    root: sustentationManagement,
    viewSustentationsPaginated: `/${sustentationManagement}/view-sustentations-paginated`,
    viewTransferenceSustentationDetail: `/${sustentationManagement}/view-transference-sustentation-detail`,
    viewDeliverySustentationDetail: `/${sustentationManagement}/view-delivery-sustentation-detail`,
    uploadTransferenceSustentationFiles: `/${sustentationManagement}/upload-transference-sustentation-files`,
    uploadTransferenceSustentationFilesForParticipant: `/${sustentationManagement}/upload-transference-sustentation-files-for-participant`,
    uploadDeliverySustentationFilesForOrganization: `/${sustentationManagement}/upload-delivery-sustentation-files-for-organization`,
    uploadDeliverySustentationFilesForPlatform: `/${sustentationManagement}/upload-delivery-sustentation-files-for-platform`,
    confirmTransferenceSustentation: `/${sustentationManagement}/confirm-transference-sustentation`,
    confirmDeliverySustentation: `/${sustentationManagement}/confirm-delivery-sustentation`,
  },
  sharedKernel: {
    root: sharedKernel,
    car: {
      root: car,
      getCarBrands: `/${sharedKernel}/${car}/get-car-brands`,
      getCarModels: `/${sharedKernel}/${car}/get-car-models`,
    },
  },
  roleConfiguration: {
    root: roleConfiguration,
    findRoles: `/${roleConfiguration}/find-roles`,
    findGrants: `/${roleConfiguration}/find-grants`,
    findRolesPaginated: `/${roleConfiguration}/find-roles-paginated`,
    createRole: `/${roleConfiguration}/create-role`,
    deleteRole: `/${roleConfiguration}/delete-role`,
    updateRole: `/${roleConfiguration}/update-role`,
    getRoleDetail: `/${roleConfiguration}/get-role-detail`,
  },
  paymentManagement: {
    root: paymentManagement,
    getPaymentsSummary: `/${paymentManagement}/get-payments-summary`,
    confirmComissionPayment: `/${paymentManagement}/confirm-comission-payment`,
    confirmPropertyPayment: `/${paymentManagement}/confirm-property-payment`,
    observeComissionPayment: `/${paymentManagement}/observe-comission-payment`,
    observePropertyPayment: `/${paymentManagement}/observe-property-payment`,
    uploadCompostSupportFiles: `/${paymentManagement}/upload-compost-support-files`,
    viewPaymentDetail: `/${paymentManagement}/view-payment-detail`,
    viewPaymentsPaginatedForOrganization: `/${paymentManagement}/view-payments-paginated-for-organization`,
    updatePaymentForParticipant: `/${paymentManagement}/update-payment-for-participant`,
    findPaymentDetailForParticipant: `/${paymentManagement}/find-payment-detail-for-participant`,
    cancelPayment: `/${paymentManagement}/cancel-payment`,
  },

  userManagement: {
    root: userManagement,
    createUser: `/${userManagement}/create-user`,
    exportUsers: `/${userManagement}/export-users`,
    updateUser: `/${userManagement}/update-user`,
    getUserDetail: `/${userManagement}/get-user-detail`,
    resetUserPassword: `/${userManagement}/reset-user-password`,
    suspendUser: `/${userManagement}/suspend-users`,
    findAdministratorsPaginated: `/${userManagement}/find-administrators-paginated`,
    findAdministrators: `/${userManagement}/find-administrators`,
    findParticipantsPaginated: `/${userManagement}/find-participants-paginated`,
    getUserTypes: `/${userManagement}/get-user-types`,
    updateParticipant: `/${userManagement}/update-participant`,
    changeMyPassword: `/${userManagement}/change-my-password`,
    getMyWallet: `/${userManagement}/get-my-wallet`,
    getMyGuaranteedAmounts: `/${userManagement}/get-my-guaranteed-amounts`,
    getMyTransactionHistories: `/${userManagement}/get-my-transaction-histories`,
    rechargeMyWallet: `/${userManagement}/recharge-my-wallet`,
    suspendParticipant: `/${userManagement}/suspend-participant`,
    viewParticipantsPaginated: `/${userManagement}/view-participants-paginated`,
    exportParticipants: `/${userManagement}/export-participants`,
    suspendedParticipant: `/${userManagement}/suspended-participant`,
  },
  audit: {
    root: audit,
    findAuditHistories: `/${audit}/find-audit-histories`,
    findBidHistories: `/${audit}/find-bid-histories`,
    viewAuditableEvents: `/${audit}/view-auditable-events`,
  },
  landing: {
    root: landing,
    getComments: `/${landing}/get-comments`,
    createComment: `/${landing}/create-comment`,
    updateComment: `/${landing}/update-comment`,
    deleteComment: `/${landing}/delete-comment`,
    getCarrousel: `/${landing}/get-carrousel`,
    createCarrousel: `/${landing}/create-carrousel`,
    updateCarrousel: `/${landing}/update-carrousel`,
    deleteCarrousel: `/${landing}/delete-carrousel`,
    contactUs: `/${landing}/contact-us`,
  },
  bidManagement: {
    root: bidManagement,
    placeBid: `/${bidManagement}/place-bid`,
    acceptBids: `/${bidManagement}/accept-offer-bids`,
    rejectBids: `/${bidManagement}/reject-offer-bids`,
    findBidsPaginated: `/${bidManagement}/find-bids-paginated`,
    findBidsPaginatedForParticipant: `/${bidManagement}/find-bids-paginated-for-participant`,
    counterOfferBid: `/${bidManagement}/counter-offer-bid`,
  },
  offerManagement: {
    root: offerManagement,
    viewPaginatedOffers: `/${offerManagement}/view-paginated-offers`,
    findOffersPaginated: `/${offerManagement}/find-offers-paginated`,
    findOffersPaginatedForParticipant: `/${offerManagement}/find-offers-paginated-for-participant`,
    findOffersPaginatedForParticipantGuaranted: `/${offerManagement}/find-offers-paginated-for-participant-guaranted`,
    findOffersPaginatedForParticipantParticipating: `/${offerManagement}/find-offers-paginated-for-participant-participating`,
    findOffersPaginatedForParticipantWon: `/${offerManagement}/find-offers-paginated-for-participant-won`,
    findOffersPaginatedForParticipantExpired: `/${offerManagement}/find-offers-paginated-for-participant-expired`,
    viewOffersTypeCount: `/${offerManagement}/view-offers-type-count`,
    createOffer: `/${offerManagement}/create-offer`,
    updateOffer: `/${offerManagement}/update-offer`,
    discussOffer: `/${offerManagement}/discuss-offer`,
    retireOffers: `/${offerManagement}/retire-offers`,
    rejectOffers: `/${offerManagement}/reject-offers`,
    confirmOffers: `/${offerManagement}/confirm-offers`,
    viewOfferDetailForPlatform: `/${offerManagement}/view-offer-detail-for-platform`,
    getOfferDetailForParticipant: `/${offerManagement}/get-offer-detail-for-participant`,
    modifyOfferAppraisal: `/${offerManagement}/modify-offer-appraisal`,
    viewCategories: `/${offerManagement}/view-categories`,
    viewSubCategories: `/${offerManagement}/view-sub-categories`,
  },
  notifications: {
    root: notifications,
    findNotificationsPaginated: `/${notifications}/find-notifications-paginated`,
    listenDomainEvents: `/${notifications}/listen-domain-events`,
    markNotificationsAsRead: `/${notifications}/mark-notifications-as-read`,
    removeNotifications: `/${notifications}/remove-notifications`,
    removeNotification: `/${notifications}/remove-notification`,
    readNotification: `/${notifications}/read-notification`,
    getNotReadedNotificationsCount: `/${notifications}/get-not-readed-notifications-count`,
    removeAllNotificationsByParticipant: `/${notifications}/remove-all-notifications-by-participant`,
    markAllNotificationsAsReadByParticipant: `/${notifications}/mark-all-notifications-as-read-by-participant`,
  },
  authManagement: {
    root: authManagement,
    loginUser: `/${authManagement}/login-user`,
    registerParticipant: `/${authManagement}/register-participant`,
    resendOtp: `/${authManagement}/resend-otp`,
    registerParticipantByOtp: `/${authManagement}/register-participant-by-otp`,
    validateOtp: `/${authManagement}/validate-otp`,
    resetUserPassword: `/${authManagement}/reset-user-password`,
    restoreUserPassword: `/${authManagement}/restore-user-password`,
    recoveryUserPassword: `/${authManagement}/recovery-user-password`,
    getMyGrants: `/${authManagement}/get-my-grants`,
    getMyInfo: `/${authManagement}/get-my-info`,
  },
  eventManagement: {
    root: eventManagement,
    createEvent: `/${eventManagement}/create-event`,
    updateEvent: `/${eventManagement}/update-event`,
    getEventDetail: `/${eventManagement}/get-event-detail`,
    viewEventDetail: `/${eventManagement}/view-event-detail`,
    getEventDetailForParticipant: `/${eventManagement}/get-event-detail-for-participant`,
    getEventActions: `/${eventManagement}/get-event-actions`,
    findEventsPaginated: `/${eventManagement}/find-events-paginated`,
    getEventsForCalendar: `/${eventManagement}/get-events-for-calendar`,
    getEventsCountForCalendar: `/${eventManagement}/get-events-count-for-calendar`,
    findEventsPaginatedForParticipant: `/${eventManagement}/find-events-paginated-for-participant`,
    findEventsPaginatedForParticipantTest: `/${eventManagement}/find-events-paginated-for-participant-test`,
    cancelEvent: `/${eventManagement}/cancel-event`,
    publishEvent: `/${eventManagement}/publish-event`,
    getEventsSummary: `/${eventManagement}/get-events-summary`,
    getEventsPendingActivities: `/${eventManagement}/get-events-pending-activities`,
    getMonthlyEventsForPlatform: `/${eventManagement}/get-monthly-events`,
    getMonthlyEventsForOrganization: `/${eventManagement}/get-monthly-events-for-organization`,
    getMonthlyRevenue: `/${eventManagement}/get-monthly-revenue`,
    getMonthlyTopGoods: `/${eventManagement}/get-monthly-top-goods`,
    getMonthlyAverageOffers: `/${eventManagement}/get-monthly-average-offers`,
  },
  organizationManagement: {
    root: organizationManagement,
    getOrganizationDetail: `/${organizationManagement}/get-organization-detail`,
    findOrganizations: `/${organizationManagement}/find-organizations`,
    viewOrganizationIdAndNameList: `/${organizationManagement}/view-organization-id-and-name-list`,
    findOrganizationsForParticipant: `/${organizationManagement}/find-organizations-for-participant`,
    findOrganizationsPaginated: `/${organizationManagement}/find-organizations-paginated`,
    createOrganization: `/${organizationManagement}/create-organization`,
    assignAdministrator: `/${organizationManagement}/assign-administrator`,
    updateOrganization: `/${organizationManagement}/update-organization`,
    suspendOrganization: `/${organizationManagement}/suspend-organization`,
    activateOrganization: `/${organizationManagement}/activate-organization`,
  },
  billlingManagement: {
    root: billingManagement,
    createBilling: `/${billingManagement}/create-billing`,
    viewPaginatedInvoicesForParticipant: `/${billingManagement}/view-paginated-invoices-for-participant`,
  },
  kpiManagement: {
    root: kpiManagement,
    getQuickIndicators: `/${kpiManagement}/get-quick-indicators`,
    getPendingAdvicesForPlatform: `/${kpiManagement}/get-pending-advices-for-platform`,
    compareOrganizationsForPlatform: `/${kpiManagement}/compare-organizations-for-platform`,
  },
}
