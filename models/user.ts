import type { DocumentType } from './document-type';

export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentIdentifier: DocumentType;
  phoneNumber: string;
  phoneCountryCode: string;
  type: string;
  roles: any[];
  organizations: any[];
  createdAt: any[];
  updatedAt: any[];
}



