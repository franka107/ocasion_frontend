export interface OfferListItem {
    id: string
    title: string
    carModel: Model
    year: number
    initialValue: number
    description: string
    address: Address
    appraisal: number
    annexesFiles: AnnexesFile[]
    attachedFiles: AttachedFile[]
    status: OfferStatus
    createdAt: string
    updatedAt: string
  }

  export interface OfferItem {
    id: string
    title: string
    carModel: Model
    year: number
    initialValue: number
    description: string
    address: Address
    appraisal: number
    annexesFiles: AnnexesFile[]
    attachedFiles: AttachedFile[]
    status: OfferStatus
    createdAt: string
    updatedAt: string
  }

  export enum OfferStatus {
    Retired = 'RETIRED', // Retirado
    Confirmed = 'CONFIRMED', // Confirmado
    New = 'NEW', // Nuevo
    Debated = 'DEBATED', // Debadito
    Cancelled = 'CANCELLED', // Cancelado
    Rejected = 'REJECTED', // Rechazado
}
  export interface Model {
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
  
  export interface AnnexesFile {
    id: string
    path: string
  }
  
  export interface AttachedFile {
    id: string
    path: string
  }
  
  export interface IDebateForm {
    id: string
    name: string
    appraisal: number
  }
  