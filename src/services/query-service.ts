import { desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';
import type { Post } from '../db/schema';
import { posts } from '../db/schema';

export class QueryService {
	private db;

	constructor(pool: Pool) {
		this.db = drizzle(pool);
	}

	async getAllPosts(): Promise<Post[]> {
		const result = await this.db
			.select()
			.from(posts)
			.orderBy(desc(posts.createdAt));
		return result;
	}

	async getPostById(id: string): Promise<Post | undefined> {
		const result = await this.db
			.select()
			.from(posts)
			.where(eq(posts.id, id))
			.limit(1);
		return result[0];
	}

	async getPublishedPosts(): Promise<Post[]> {
		const result = await this.db
			.select()
			.from(posts)
			.where(eq(posts.state, 'published'))
			.orderBy(desc(posts.publishedAt));

		return result;
	}
}
