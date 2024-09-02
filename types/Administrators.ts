export interface IAdminsLItem {
    id: string
    email: string
    firstName: string
    lastName: string
    documentType: string
    documentIdentifier: string
    phoneNumber: string
    phoneCountryCode: string
    type: UserType
    createdAt: string
    updatedAt: string
    organizations: Organization[]
    roles?: Roles[]
  }
  
  export interface Organization {
    rucNumber: string
    name: string
  }

  export interface Roles {
    id: string
    name: string
  }
  export enum UserType {
    SuperAdmin = 'SUPER_ADMIN', //Super Adminitrador
    PlatformAdmin = 'PLATFORM_ADMIN', // Administrador de plataforma
    PlatformUser = 'PLATFORM_USER', // Usuario plataforma
    OrganizationAdmin = 'ORGANIZATION_ADMIN', // Adminitrador de organizacion
    OrganizationUser = 'ORGANIZATION_USER', // Usuario de organizacion
    Participant = 'PARTICIPANT' // Participante
  }
  