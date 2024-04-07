import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const registerRecipientSchema = z.object({
  name: z.string().transform((str) => str.toLowerCase()),
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase()),
  zipcode: z.number().refine((str) => String(str).length === 8, {
    message: 'Zipcode must have 8 numbers.',
  }),
  address: z.string().transform((str) => str.toLowerCase()),
  city: z.string().transform((str) => str.toLowerCase()),
  state: z
    .string()
    .min(2)
    .max(2)
    .regex(/^[A-Z]+$/)
    .refine((str) => str.length === 2)
    .transform((str) => str.toUpperCase()),
  neighborhood: z.string().transform((str) => str.toLowerCase()),
});

zodToOpenAPI(registerRecipientSchema);

export class RegisterRecipientDto extends createZodDto(
  registerRecipientSchema,
) {}
