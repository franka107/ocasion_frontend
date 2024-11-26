export interface IRecharge {
    id: string;
    amount: number;
    createdAt: string;
    currency: string;
    operationNumber: string;
    participant: Participant;
    participantId: string;
    rejectionReason: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED"; 
    sustentationFile: SustentationFile | null;
    transferedAt: string;
    updatedAt: string;
    walletId: string;
  }
 export interface Participant {
    id: string;
    email: string;
    availableBalanceAmount: number;
    birthDate: string;
    businessName: string | null;
    commonName: string;
    createdAt: string;
    documentIdentifier: string;
    documentType: string;
    firstName: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    guarantedBalanceAmount: number;
    lastName: string;
    lastResetPasswordDelivery: string | null;
    legalRepresentative: string | null;
    loginAttempts: number;
    maritalStatus: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED"; 
    password: string;
    passwordExpiredAt: string;
    personType: "NATURAL_PERSON" | "LEGAL_ENTITY";
    phoneCountryCode: string;
    phoneNumber: string;
    ruc: string | null;
    status: "ACTIVE" | "INACTIVE";
    suspensionReason: string | null;
    taxAddress: string | null;
    type: "PARTICIPANT" | string; 
    updatedAt: string;
    __entity: string;
  }
  
  interface SustentationFile {
    id: string;
    name:string;
    path:string;
  }
// export interface RetireRequest {
//     id: string;
//     amount: number;
//     currency: Currency;
//     bank: string;
//     destinationAccount: string;
//     destinationCCI: string;
//     accountType: string;
//     transactionNumber: string;
//     status: string;
//     disbursementLot: DisbursementLotEntity | null;
//     createdAt: Date;
//     acceptedTermsAndConditions: boolean;
//   }
  export enum Currency {
    USD = 'USD',
  }
  export interface DisbursementLotEntity{}