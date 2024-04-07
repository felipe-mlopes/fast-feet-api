import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const authenticateAccountSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

zodToOpenAPI(authenticateAccountSchema);

export class AuthenticateAccountDto extends createZodDto(
  authenticateAccountSchema,
) {}
