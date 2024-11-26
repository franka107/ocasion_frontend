  export interface DisbursementLot {
    id: string;
    retireRequests: RetireRequestEntity[];
    paymentMethod: PaymentMethod;
    createdAt: Date;
    totalAmount: number;
    currency: Currency;
    bank: Bank;
    chargeAccount: string;
    generatedFile: FileType;
    paymentSupportFile: FileType | null;
    disbursedAt: Date | null;
    status: DisbursementLotStatus;
    paymentMedium: PaymentMedium;
  }
  export interface FileType {
    id: string;
    name: string;
    path: string;
  }
  export enum PaymentMethod {
    Transference = 'TRANSFERENCE',
  }
  export enum Currency {
    USD = 'USD',
  }
  export enum DisbursementLotStatus {
    Pending = 'PENDING',
    ConfirmedDeposit = 'CONFIRMED_DEPOSIT',
    AnnuledDeposit = 'ANNULED_DEPOSIT',
  }
  export enum PaymentMedium {
    AcoountDeposit = 'ACCOUNT_DEPOSIT', 
  }
  export enum Bank {
    Bbva = 'BBVA',
    Bcp = 'BCP',
    Scotiabank = 'SCOTIABANK',
  }
  interface RetireRequestEntity {
  }
  export interface IGenerateForm {
    id: string
    paymentMethod: string
    currency: string
    bank: string
    chargeAccount: string
    paymentMedium: string
  }