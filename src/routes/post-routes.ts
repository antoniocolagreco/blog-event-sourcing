import { Router } from 'express';
import type { CorrelationId } from '../schemas/correlation-id';
import type { PostId } from '../schemas/post';
import { CreatePostSchema } from '../schemas/post';
import type { PostService } from '../services/post-service';
import { generateId, unsafeBrandId } from '../utils';

export function createPostRouter(postService: PostService) {
	const router = Router();

	router.post('/posts', async (req, res) => {
		try {
			const input = CreatePostSchema.parse(req.body);
			const correlationId = generateId<CorrelationId>();

			const postId = await postService.createPost(input, correlationId);

			res.status(201).json({ postId });
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : error;
			console.error('Error creating Post:', errorMessage);
			res.status(400).json({ message: errorMessage });
		}
	});

	router.post('/posts/:postId/publish', async (req, res) => {
		try {
			const postId = unsafeBrandId<PostId>(req.params.postId);
			const correlationId = generateId<CorrelationId>();

			await postService.publishPost(postId, correlationId);

			res.status(200).json({ message: 'Post published' });
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : error;
			console.error('Error publishing Post:', errorMessage);
			res.status(400).json({ message: errorMessage });
		}
	});

	router.post('/posts/:postId/archive', async (req, res) => {
		try {
			const postId = unsafeBrandId<PostId>(req.params.postId);
			const correlationId = generateId<CorrelationId>();

			await postService.archivePost(postId, correlationId);

			res.status(200).json({ message: 'Post Archived' });
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : error;
			console.error('Error archiving Post:', errorMessage);
			res.status(400).json({ message: errorMessage });
		}
	});

	return router;
}
