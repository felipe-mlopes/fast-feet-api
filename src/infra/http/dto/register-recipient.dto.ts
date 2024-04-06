import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const registerRecipientSchema = z.object({
  name: z.string().transform((str) => str.toLowerCase()),
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase()),
  zipcode: z.number(),
  address: z.string().transform((str) => str.toLowerCase()),
  city: z.string().transform((str) => str.toLowerCase()),
  state: z
    .string()
    .regex(/^[a-zA-Z]+$/)
    .refine((str) => str.length === 2)
    .transform((str) => str.toUpperCase()),
  neighborhood: z.string().transform((str) => str.toLowerCase()),
});

zodToOpenAPI(registerRecipientSchema);

export class RegisterRecipientDto extends createZodDto(
  registerRecipientSchema,
) {}
