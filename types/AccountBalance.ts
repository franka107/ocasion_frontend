export interface IAccountBalanceItem {
    id: string
    availableBalance: number
    guaranteedBalance: number
    createdAt: string
    user: User
    userId: string
    __entity: string
    penaltyBalance: number
    dischargeBalance: number
    chargeBalance: number
    pendingWithdrawalBalance: number
    pendingRechargeBalance: number
  }
  
  export interface User {
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
  