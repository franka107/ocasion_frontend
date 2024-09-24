export interface EvidenseItem {
    id: string
    title: string
    carModel: CarModel
    initialValue: number
    year: number
    description: string
    address: Address
    appraisal: number
    annexesFiles: any[]
    attachedFiles: any[]
    status: evidenceStatus[]
    createdAt: string
    updatedAt: string
    transferenceSupport: TransferenceSupport
    deliverySupport: DeliverySupport
  }
  
  export interface CarModel {
    id: string
    name: string
    brand: Brand
  }
  
  export interface Brand {
    id: string
    name: string
  }
  
  export interface Address {
    addressLine1: string
    district: District
    latitude: number
    longitude: number
  }
  
  export interface District {
    id: string
    name: string
    city: City
  }
  
  export interface City {
    id: string
    name: string
    state: State
  }
  
  export interface State {
    id: string
    name: string
  }
  
  export interface TransferenceSupport {}
  
  export interface DeliverySupport {}

  export enum evidenceStatus {
    ConfirmedDeposit = 'CONFIRMED_DEPOSIT', // Deposito confirmado
    InReview = 'IN_REVIEW', // En revision
    TransferOfGood = 'IN_TRANSFER_OF_GOOD', // En tranferenecia de bienes
    Delivered = 'DELIVERED', // Entrega
  }
  export interface IDateModal {
    id: string;
  }


  export interface DeliveryDetail {
    id: string
    fileIds: string[]
    deliveryDate: string
    deliveryAddress: string
    comment: string
    status: string
    files: DeliveryDetailFile[]
  }
  
  export interface DeliveryDetailFile {
    id: string
    path: string
    createdAt: string
    updatedAt: string
    __entity: string
  }
  