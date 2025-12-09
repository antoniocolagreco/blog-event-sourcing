import * as z from 'zod';
import { BaseEventSchema } from './base-event';
import { PostIdSchema } from './post';

export const PostCreatedEventSchema = BaseEventSchema.extend({
	type: z.literal('PostCreated'),
	data: z.object({
		postId: PostIdSchema,
		title: z.string(),
		content: z.string(),
		author: z.string(),
		createdAt: z.string(),
	}),
});
export interface PostCreatedEvent
	extends z.output<typeof PostCreatedEventSchema> {}

export const PostPublishedEventSchema = BaseEventSchema.extend({
	type: z.literal('PostPublished'),
	data: z.object({
		postId: PostIdSchema,
		publishedAt: z.string(),
	}),
});
export interface PostPublishedEvent
	extends z.output<typeof PostPublishedEventSchema> {}

const PostArchivedEventSchema = BaseEventSchema.extend({
	type: z.literal('PostArchived'),
	data: z.object({
		postId: PostIdSchema,
		archivedAt: z.string(),
	}),
});
export interface PostArchivedEvent
	extends z.output<typeof PostArchivedEventSchema> {}

export const PostEventSchema = z.union([
	PostCreatedEventSchema,
	PostPublishedEventSchema,
	PostArchivedEventSchema,
]);
export type PostEvent = z.output<typeof PostEventSchema>;
