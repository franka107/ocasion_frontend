export interface IEventLItem {
    id: string
    organization: Organization
    createdAt: string
    updatedAt: string
    name: string
    type: EventType
    goodType: string
    description: string
    startDate: string
    endDate: string
    closingTime: number
    goodFiles: GoodFile[]
    termsAndConditionsFiles: TermsAndConditionsFile[]
    status: string
  }
  
  interface Organization {
    rucNumber: string
    name: string
  }
  
  interface GoodFile {
    id: string
    path: string
  }
  
  interface TermsAndConditionsFile {
    id: string
    path: string
  }
  

  export interface IOrganizationSummary {
    actionedGoods: ActionedGoods
    status: Status
    goal: Goal
  }
  
  interface ActionedGoods {
    amountRaised: number
    averageTicketAmount: number
    closedCount: number
  }
  
  interface Status {
    closedCount: number
    onlineCount: number
  }
  
  interface Goal {
    amountRaised: number
    goalAmount: number
  }
  
export enum EventType {
  HandOver = 'HAND_OVER', // Puesta en mano
  Auction = 'AUCTION', // Subasta
}
export enum EventStatus {
  Published = 'PUBLISHED', // Publicado
  Cancelled = 'CANCELLED', // Cancelado
  Created = 'CREATED', // Creado
  Finished = 'FINISHED', // Finalizado
  InDebate = 'IN_DEBATE', // En debate
  ReadyToPublish = 'READY_TO_PUBLISH', // Listo para publicar
}