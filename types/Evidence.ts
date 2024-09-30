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
  export interface TransferDetail {
    id: string
    fileIds: string[]
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
  
  export enum evidenceStatus {
    Created = 'CREATED', // Nuevo
    Debated = 'DEBATED', // Debadito
    Confirmed = 'CONFIRMED', // Confirmado
    Retired = 'RETIRED', // Retirado
    InProgress = 'IN_PROGRESS', // En curso
    Cancelled = 'CANCELLED', // Cancelado
    InReview = 'IN_REVIEW', // En revision
    Rejected = 'REJECTED', // Rechazado
    InDepositReview = 'IN_DEPOSIT_REVIEW', // Rechazado
    PendingDeposit = 'PENDING_DEPOSIT', // Abono pendiente
    ObservedDeposit = 'OBSERVED_DEPOSIT', // Abono observado
    ConfirmedDeposit = 'CONFIRMED_DEPOSIT', // Deposito confirmado
    InTransferOfGood = 'IN_TRANSFER_OF_GOOD', // En transferencia de bienes
    Delivered = 'DELIVERED', // Enviado
    Concreted = 'CONCRETED', // Concreatedo
    // -----------------
    PendingOfDelivery = 'PENDING_OF_DELIVERY', // Pendiente de entrega
  }
  export enum DeliverySupportStatus {
    Approved = 'APPROVED', // Verde
    Observed = 'OBSERVED', // Amarillo
    Delivered = 'DELIVERED', // Azul
  }
  