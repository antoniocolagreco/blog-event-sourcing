import { Router } from 'express';
import type { QueryService } from '../services/query-service';

export function createQueryRouter(queryService: QueryService) {
	const router = Router();

	router.get('/posts', async (_req, res) => {
		try {
			const posts = await queryService.getAllPosts();
			res.json(posts);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : error;
			console.error('Error reading Posts:', errorMessage);
			res.status(500).json({ message: errorMessage });
		}
	});

	router.get('/posts/:postId', async (req, res) => {
		try {
			const post = await queryService.getPostById(req.params.postId);

			if (!post) {
				res.status(404).json({ error: 'Post not found' });
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : error;
			console.error('Error reading Post:', errorMessage);
			res.status(500).json({ message: errorMessage });
		}
	});

	router.get('/posts/published/all', async (_req, res) => {
		try {
			const posts = await queryService.getPublishedPosts();
			res.json(posts);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : error;
			console.error('Error reading Published Post:', errorMessage);
			res.status(500).json({ message: errorMessage });
		}
	});

	return router;
}
