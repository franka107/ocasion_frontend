export interface IPaymentsLItem {
    id: string
    offer: Offer
    event: Event
    organization: Organization
    submittedAt: string
    amount: number
    status: paymentStatus []
  }
  
  export interface Offer {
    id: string
    name: string
  }
  
  export interface Event {
    id: string
    name: string
  }
  
  export interface Organization {
    id: string
    name: string
  }
  export enum paymentStatus {
    Concreted = 'CONCRETED', // Concretedo
    InReview = 'IN_REVIEW', // En revision
    Observed = 'OBSERVED', // Observado
    Confirmed = 'CONFIRMED', // Confirmado
    Cancelled = 'CANCELLED', // Cancelado
  }