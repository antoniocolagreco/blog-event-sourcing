import z from 'zod';
import type { BaseEvent } from './base-event';
import { BaseEventSchema } from './base-event';
import { CorrelationIdSchema } from './correlation-id';

export const CreateEventSchema = z.object({
	streamId: z.string().min(1),
	version: z.number().optional(),
	correlationId: CorrelationIdSchema,
	event: BaseEventSchema,
});

type CreateEventBase = z.infer<typeof CreateEventSchema>;

export interface CreateEvent<T extends BaseEvent = BaseEvent>
	extends CreateEventBase {
	event: T;
}
