export interface HistoryItem {
    id: string
    user: User
    initialAmount: number
    modifiedAmount: number
    createdAt: string
    offer: Offer
    updatedAt: string
  }
  
  export interface User {
    id: string
    fullName: string
  }
  
  export interface Offer {
    id: string
  }