import { z } from 'zod';

export interface IUser {
  id: string;
  name: string;
  dni: string;
  phone: string;
  email: string;
  role: string;
  address: string;
  department: string;
  province: string;
  district: string;
  status: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at?: string | null;
}

export const userSchema = z.object({
  name: z.string(),
  dni: z.string(),
  phone: z.string(),
  email: z.string(),
  role: z.string(),
  address: z.string(),
  department: z.string(),
  province: z.string(),
  district: z.string(),
  status: z.string(),
  is_deleted: z.boolean(),
});

export type User = z.infer<typeof userSchema>;
