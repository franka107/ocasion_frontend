import { z } from 'zod';

export const economicActivitySchema = z.object({
  id: z.string(),
});

export const districtSchema = z.object({
  id: z.string(),
});

export const addressSchema = z.object({
  addressLine1: z.string(),
  district: districtSchema,
});

export const attachedFileSchema = z.object({
  id: z.string(),
});

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  economicActivity: economicActivitySchema.nullable(),
  representativeFullName: z.string(),
  representativeDocumentType: z.enum(['DNI', 'CE', 'PT']),
  representativeDocumentIdentifier: z.string(),
  representativePhoneNumber: z.string().nullable(),
  billingEmail: z.string().nullable(),
  startPercentage: z.number(),
  contractStartDate: z.string(),
  contractEndDate: z.string(),
  address: addressSchema,
  attachedFiles: z.array(attachedFileSchema),
});

export type Organization = z.infer<typeof organizationSchema>;
