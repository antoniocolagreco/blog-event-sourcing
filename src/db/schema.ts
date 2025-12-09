import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
	id: varchar('id', { length: 255 }).primaryKey(),
	title: varchar('title', { length: 200 }).notNull(),
	content: text('content').notNull(),
	author: varchar('author', { length: 100 }).notNull(),
	state: varchar('state', { length: 20 })
		.notNull()
		.$type<'draft' | 'published' | 'archived'>(),
	createdAt: timestamp('created_at').notNull(),
	publishedAt: timestamp('published_at'),
	archivedAt: timestamp('archived_at'),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type InserPost = typeof posts.$inferInsert;
