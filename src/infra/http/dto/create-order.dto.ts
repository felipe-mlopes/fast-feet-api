import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createOrderSchema = z.object({
  title: z.string().transform((str) => str.toLowerCase()),
  recipientId: z.string().uuid(),
});

zodToOpenAPI(createOrderSchema);

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
