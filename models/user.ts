import type { DocumentType } from './document-type'
import type { Color } from '~/constants/ui'

export interface IUser {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  documentType: DocumentType
  documentIdentifier: DocumentType
  phoneNumber: string
  phoneCountryCode: string
  type: string
  roles: any[]
  organizations: any[]
  createdAt: any[]
  updatedAt: any[]
}

export enum UserStatus {
  Suspended = 'SUSPENDED',
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
  NotVerified = 'NOT_VERIFIED',
}

export const userStatusMap: Record<UserStatus, { name: string; color: Color }> =
  {
    [UserStatus.Suspended]: {
      name: 'Suspendido',
      color: 'red',
    },
    [UserStatus.Active]: {
      name: 'Activado',
      color: 'green',
    },
    [UserStatus.NotVerified]: {
      name: 'No verificado',
      color: 'brown',
    },
    [UserStatus.Blocked]: {
      name: 'Bloqueado',
      color: 'red',
    },
  }
