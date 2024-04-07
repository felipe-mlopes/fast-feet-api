import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const getRecipientByEmailSchema = z.object({
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase()),
});

zodToOpenAPI(getRecipientByEmailSchema);

export class GetRecipientByEmailDto extends createZodDto(
  getRecipientByEmailSchema,
) {}
