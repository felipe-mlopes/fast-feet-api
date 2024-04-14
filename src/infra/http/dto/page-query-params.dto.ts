import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const pageQueryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
});

zodToOpenAPI(pageQueryParamsSchema);

export class PageQueryParamsDto extends createZodDto(pageQueryParamsSchema) {}
