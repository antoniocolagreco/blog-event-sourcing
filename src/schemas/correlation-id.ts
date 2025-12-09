import { z } from 'zod';

export const CorrelationIdSchema = z
	.string()
	.min(1)
	.max(20)
	.brand<'CorrelationId'>();
export type CorrelationId = z.output<typeof CorrelationIdSchema>;
