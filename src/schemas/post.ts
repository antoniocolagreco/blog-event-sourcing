import { z } from 'zod';

export const PostIdSchema = z.string().min(1).max(20).brand<'PostId'>();
export type PostId = z.output<typeof PostIdSchema>;

export const CreatePostSchema = z.object({
	title: z.string().min(1).max(200),
	content: z.string().min(1),
	author: z.string().min(1).max(100),
});
export interface CreatePostInput extends z.infer<typeof CreatePostSchema> {}

export const PublishPostSchema = z.object({
	postId: z.uuid(),
});

export interface PublishPostInput extends z.infer<typeof PublishPostSchema> {}

export const PostStateSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export type PostState = z.output<typeof PostStateSchema>;

export const PostSchema = z.object({
	id: PostIdSchema,
	title: z.string().min(1).max(100),
	content: z.string().min(1),
	author: z.string().min(1).max(50),
	state: PostStateSchema,
	createdAt: z.date(),
	publishedAt: z.date().optional(),
});
export interface Post extends z.output<typeof PostSchema> {}
