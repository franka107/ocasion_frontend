export enum GrantId {
  /* Platform */
  PlatformKpisManagement = 'PLATFORM_KPIS_MANAGEMENT',
  PlatformUsersManagement = 'PLATFORM_USERS_MANAGEMENT',
  PlatformUsersCanCreate = 'PLATFORM_USERS_CAN_CREATE',
  PlatformUsersCanSuspend = 'PLATFORM_USERS_CAN_SUSPEND',
  PlatformOrganizationsManagement = 'PLATFORM_ORGANIZATIONS_MANAGEMENT',
  PlatformOrganizationsCanCreate = 'PLATFORM_ORGANIZATIONS_CAN_CREATE',
  PlatformOrganizationsCanUpdate = 'PLATFORM_ORGANIZATIONS_CAN_UPDATE',
  PlatformOrganizationsCanActivate = 'PLATFORM_ORGANIZATIONS_CAN_ACTIVATE',
  PlatformOrganizationsCanAssignAdministrator = 'PLATFORM_ORGANIZATIONS_CAN_ASSIGN_ADMINISTRATOR',
  PlatformOrganizationsCanSuspend = 'PLATFORM_ORGANIZATIONS_CAN_SUSPEND',
  PlatformRolesManagement = 'PLATFORM_ROLES_MANAGEMENT',
  PlatformRolesCanDelete = 'PLATFORM_ROLES_CAN_DELETE',
  PlatformEventsManagement = 'PLATFORM_EVENTS_MANAGEMENT',
  PlatformEventsCanCancel = 'PLATFORM_EVENTS_CAN_CANCEL',
  PlatformEventsCanPublish = 'PLATFORM_EVENTS_CAN_PUBLISH',
  PlatformOfferCanCreate = 'PLATFORM_OFFER_CAN_CREATE',
  PlatformOfferCanUpdate = 'PLATFORM_OFFER_CAN_UPDATE',
  PlatformOfferCanUpdateAppraisal = 'PLATFORM_OFFER_CAN_UPDATE_APPRAISAL',
  PlarformUsersCanViewParticipants = 'PLATFORM_USERS_CAN_VIEW_PARTICIPANTS',
  PlatformUsersCanViewAdministrators = 'PLATFORM_USERS_CAN_VIEW_ADMINISTRATORS',
  PlatformOfferCanRetire = 'PLATFORM_OFFER_CAN_RETIRE',
  PlatformUsersCanExportAdministrators = 'PLATFORM_USERS_CAN_EXPORT_ADMINISTRATORS',
  PlatformPaymentManagement = 'PLATFORM_PAYMENT_MANAGEMENT',
  PlatformPaymentCanConfirm = 'PLATFORM_PAYMENT_CAN_CONFIRM',
  PlatformPaymentCanObserve = 'PLATFORM_PAYMENT_CAN_OBSERVE',
  PlatformTransferenceMangement = 'PLATFORM_TRANSFERENCE_MANAGEMENT',
  PlatformAttentionManagement = 'PLATFORM_ATTENTION_MANAGEMENT',
  PlatformAttentionCanViewRechargeRequest = 'PLATFORM_ATTENTION_CAN_VIEW_RECHARGE_REQUEST',
  PlatformAttentionCanViewAccountValidation = 'PLATFORM_ATTENTION_CAN_VIEW_ACCOUNT_VALIDATION',
  PlatformAttentionCanViewWithDrawalRequest = 'PLATFORM_ATTENTION_CAN_VIEW_WITHDRAWAL_REQUEST',
  PlatformAttentionCanViewDisbursementLots = 'PLATFORM_ATTENTION_CAN_VIEW_DISBURSEMENT_LOTS',
  PlatformReportsManagement = 'PLATFORM_REPORTS_MANAGEMENT',
  PlatformReportsCanViewGlobalTransactions = 'PLATFORM_REPORTS_CAN_VIEW_GLOBAL_TRANSACTIONS',
  PlatformReportsCanViewDisbursementLots = 'PLATFORM_REPORTS_CAN_VIEW_DISBURSEMENT_LOTS',
  PlatformReportsCanViewAccountValidations = 'PLATFORM_REPORTS_CAN_VIEW_ACCOUNT_VALIDATIONS',
  PlatformReportsCanViewAccountBalance = 'PLATFORM_REPORTS_CAN_VIEW_ACCOUNT_BALANCE',
  /* Organization */
  OrganizationKpisManagement = 'ORGANIZATION_KPIS_MANAGEMENT',
  OrganizationEventsManagement = 'ORGANIZATION_EVENTS_MANAGEMENT',
  OrganizationEventsCanCreate = 'ORGANIZATION_EVENTS_CAN_CREATE',
  OrganizationEventsCanEdit = 'ORGANIZATION_EVENTS_CAN_EDIT',
  OrganizationUsersManagement = 'ORGANIZATION_USERS_MANAGEMENT',
  OrganizationUsersCanViewParticipants = 'ORGANIZATION_USERS_CAN_VIEW_PARTICIPANTS',
  OrganizationUsersCanViewAdministrators = 'ORGANIZATION_USERS_CAN_VIEW_ADMINISTRATORS',
  OrganizationUsersCanExportAdministrators = 'ORGANIZATION_USERS_CAN_EXPORT_ADMINISTRATORS',
  OrganizationUsersCanSuspend = 'ORGANIZATION_USERS_CAN_SUSPEND',
  OrganizationUsersCanCreate = 'ORGANIZATION_USERS_CAN_CREATE',
  OrganizationRolesManagement = 'ORGANIZATION_ROLES_MANAGEMENT',
  OrganizationRolesCanDelete = 'ORGANIZATION_ROLES_CAN_DELETE',
  OrganizationBidManagement = 'ORGANIZATION_BIDS_MANAGEMENT',
  OrganizationBidCanView = 'ORGANIZATION_BIDS_CAN_VIEW',
  PlatformBidCanView = 'PLATFORM_BIDS_CAN_VIEW',
  OrganizationBidCanAccept = 'ORGANIZATION_BIDS_CAN_ACCEPT',
  OrganizationBidCanReject = 'ORGANIZATION_BIDS_CAN_REJECT',
  OrganizationOffersCanDiscuss = 'ORGANIZATION_OFFERS_CAN_DISCUSS',
  OrganizationBidCanCounterOffer = 'ORGANIZATION_BID_CAN_COUNTER_OFFER',
  OrganizationOffersCanConfirm = 'ORGANIZATION_OFFERS_CAN_CONFIRM',
  OrganizationOffersCanReject = 'ORGANIZATION_OFFERS_CAN_REJECT',
  OrganizationPaymentManagement = 'ORGANIZATION_PAYMENT_MANAGEMENT',
  OrganizationPaymentCanConfirm = 'ORGANIZATION_PAYMENT_CAN_CONFIRM',
  OrganizationPaymentCanObserve = 'ORGANIZATION_PAYMENT_CAN_OBSERVE',
  OrganizationTransferenceManagement = 'ORGANIZATION_TRANSFERENCE_MANAGEMENT',
}
