export interface IAccountLItem {
    id: string
    transactionNumber: string
    createdAt: string
    bank: string
    currency: string
    destinationAccountNumber: string
    rejectionReason: string
    rejectionDetails: string
    status: string
    participant: Participant
    participantId: string
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
    suspensionReason: any
    __entity: string
  }
  