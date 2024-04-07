import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createAccountSchema = z.object({
  name: z.string().transform((str) => str.toLowerCase()),
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase()),
  cpf: z.string().refine((str) => str.length === 14, {
    message: 'CPF must have 14 characters.',
  }),
  password: z.string().refine((str) => str.length > 5, {
    message: 'Password needs at least 6 characters.',
  }),
});

zodToOpenAPI(createAccountSchema);

export class CreateAccountDto extends createZodDto(createAccountSchema) {}
