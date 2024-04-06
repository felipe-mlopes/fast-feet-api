import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const authenticateDeliverymanSchema = z.object({
  cpf: z.string(),
  password: z.string(),
});

zodToOpenAPI(authenticateDeliverymanSchema);

export class AuthetincateDeliverymanDto extends createZodDto(
  authenticateDeliverymanSchema,
) {}
