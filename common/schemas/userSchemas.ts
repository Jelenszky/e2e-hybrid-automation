import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
  email: z.string().email(),
  title: z.string().optional(),
  birth_day: z.string().optional(),
  birth_month: z.string().optional(),
  birth_year: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  company: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  country: z.string().optional(),
  zipcode: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  mobile_number: z.string().optional(),
});

export const UserResponseSchema = z.object({
  responseCode: z.number(),
  message: z.string().optional(),
  user: UserSchema,
});

export type UserSchemaType = z.infer<typeof UserSchema>;
export type UserResponseSchemaType = z.infer<typeof UserResponseSchema>;
