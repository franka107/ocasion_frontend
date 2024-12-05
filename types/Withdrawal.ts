export interface IWithdrawalItem {
    id: string
    amount: number
    currency: string
    bank: string
    destinationAccount: string
    destinationCCI: string
    accountType: string
    operationType: string
    status: string
    createdAt: string
    acceptedTermsAndConditions: boolean
    rejectionReason: string
    rejectionDetails: string
    participant: Participant
  }
  
  export interface Participant {
    id: string
    email: string
    password: string
    firstName: string
    lastName: string
    commonName: string
    documentType: string
    documentIdentifier: string
    phoneNumber: string
    phoneCountryCode: string
    type: string
    status: string
    guarantedBalanceAmount: number
    availabledBalanceAmount: number
    personType: string
    gender: string
    maritalStatus: string
    birthDate: string
    businessName: any
    legalRepresentative: any
    taxAddress: any
    loginAttempts: number
    lastResetPasswordDelivery: any
    passwordUpdatedAt: string
    passwordExpirationNotifiedAt: string
    createdAt: string
    updatedAt: string
    suspensionReason: string
    __entity: string
  }