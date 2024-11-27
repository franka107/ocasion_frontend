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
  status: EventStatus
}

interface Organization {
  id: string
  name: string
}

interface GoodFile {
  id: string
  path: string
}

interface TermsAndConditionsFile {
  id: string
  name: string
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
  finishedCount: number
  inProgressCount: number
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
  Created = 'CREATED', // Creado
  InDebate = 'IN_DEBATE', // En debate
  ReadyToPublish = 'READY_TO_PUBLISH', // Listo para publicar
  Published = 'PUBLISHED', // Publicado
  InProgress = 'IN_PROGRESS', // Publicado
  Cancelled = 'CANCELLED', // Cancelado
  Finished = 'FINISHED', // Finalizado
  Completed = 'COMPLETED', // Completado
}
