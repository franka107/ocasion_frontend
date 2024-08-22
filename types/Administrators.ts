export interface IAdminsLItem {
    id: string
    email: string
    firstName: string
    lastName: string
    documentType: string
    documentIdentifier: string
    phoneNumber: string
    phoneCountryCode: string
    type: string
    createdAt: string
    updatedAt: string
    organizations: Organization
  }
  
  export interface Organization {
    rucNumber: string
    name: string
  }