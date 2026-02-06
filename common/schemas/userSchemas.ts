import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
  email: z.string().email(),
  title: z.string(),
  birth_day: z.string(),
  birth_month: z.string(),
  birth_year: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  company: z.string().optional(),
  address1: z.string(),
  address2: z.string().optional(),
  country: z.string(),
  zipcode: z.string(),
  state: z.string(),
  city: z.string(),
  mobile_number: z.string().optional(),
});

export const UserResponseSchema = z.object({
  responseCode: z.number(),
  message: z.string().optional(),
  user: UserSchema,
});

export type UserSchemaType = z.infer<typeof UserSchema>;
export type UserResponseSchemaType = z.infer<typeof UserResponseSchema>;
