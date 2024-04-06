import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const registerDeliverymanSchema = z.object({
  name: z.string().transform((str) => str.toLowerCase()),
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase()),
  cpf: z.string(),
  password: z.string(),
});

zodToOpenAPI(registerDeliverymanSchema);

export class RegisterDeliverymanDto extends createZodDto(
  registerDeliverymanSchema,
) {}
