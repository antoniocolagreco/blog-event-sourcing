import z from 'zod';

export const BaseEventSchema = z.object({
	type: z.string(),
	eventVersion: z.number(),
});
export interface BaseEvent extends z.infer<typeof BaseEventSchema> {}
