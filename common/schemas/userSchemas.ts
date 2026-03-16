import { z } from 'zod';

const reqString = z.string().trim().min(1, { message: 'Required' });

export const UserSchema = z.object({
  id: z.number().positive(),
  name: reqString,
  email: z.email(),
  title: reqString,
  birth_day: z.coerce.number().int().min(1).max(31),
  birth_month: z.coerce.number().int().min(1).max(12),
  birth_year: z.coerce.number().int().min(1900),
  first_name: reqString,
  last_name: reqString,
  company: z.string().trim().optional(),
  address1: reqString,
  address2: z.string().trim().optional(),
  country: reqString,
  zipcode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: 'Invalid zipcode format' }),
  state: reqString,
  city: reqString,
  mobile_number: z.string().trim().optional(),
});

export const UserResponseSchema = z.object({
  responseCode: z.number(),
  message: z.string().optional(),
  user: UserSchema,
});

export type UserSchemaType = z.infer<typeof UserSchema>;
export type UserResponseSchemaType = z.infer<typeof UserResponseSchema>;
