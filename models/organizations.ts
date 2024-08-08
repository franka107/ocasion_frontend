import { z } from 'zod';

export interface IOrganization {
  rucNumber: string;
  name: string;
  economicActivity: {
    id: string;
  };
  representativeFullName: string;
  representativeDocumentType: string;
  representativeDocumentIdentifier: string;
  representativePhoneNumber: string;
  billingEmail: string;
  startPercentage: number;
  contractStartDate: string;
  contractEndDate: string;
  address: {
    addressLine1: string;
    district: {
      id: string;
    };
  };
  attachedFiles: string[];
}

export const organizationSchema = z.object({
  rucNumber: z.string(),
  name: z.string(),
  economicActivity: z.object({
    id: z.string(),
  }),
  representativeFullName: z.string(),
  representativeDocumentType: z.string(),
  representativeDocumentIdentifier: z.string(),
  representativePhoneNumber: z.string(),
  billingEmail: z.string(),
  startPercentage: z.number(),
  contractStartDate: z.string(),
  contractEndDate: z.string(),
  address: z.object({
    addressLine1: z.string(),
    district: z.object({
      id: z.string(),
    }),
  }),
  attachedFiles: z.array(z.string()),
});

export type Organization = z.infer<typeof organizationSchema>;
