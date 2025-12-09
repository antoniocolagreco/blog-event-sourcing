import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { EachMessagePayload } from 'kafkajs';
import { Kafka } from 'kafkajs';
import { Pool } from 'pg';
import { posts } from '../db/schema';
import type { PostEvent } from '../schemas/post-events';

const kafka = new Kafka({
	clientId: process.env.KAFKA_CLIENT_ID,
	brokers: process.env.KAFKA_BROKERS.split(','),
});

const consumer = kafka.consumer({ groupId: 'blog-read-model-writer' });

const pool = new Pool({
	host: process.env.READ_MODEL_HOST,
	port: parseInt(process.env.READ_MODEL_PORT, 10),
	user: process.env.READ_MODEL_USER,
	password: process.env.READ_MODEL_PASSWORD,
	database: process.env.READ_MODEL_DATABASE,
});

const db = drizzle(pool);

async function handleMessage(payload: EachMessagePayload) {
	const { message } = payload;
	if (!message.value) return;

	const debeziumMessage = JSON.parse(message.value.toString());

	if (debeziumMessage.payload?.after) {
		const eventRow = debeziumMessage.payload.after;
		const event: PostEvent = JSON.parse(eventRow.event_data);

		console.log(`Received event: ${event.type}`);

		switch (event.type) {
			case 'PostCreated': {
				await db.insert(posts).values({
					id: event.data.postId,
					title: event.data.title,
					content: event.data.content,
					author: event.data.author,
					state: 'draft',
					createdAt: new Date(event.data.createdAt),
				});
				console.log(`Post created in Read Mode: ${event.data.postId}`);
				break;
			}

			case 'PostPublished': {
				await db
					.update(posts)
					.set({
						state: 'published',
						publishedAt: new Date(event.data.publishedAt),
						updatedAt: new Date(),
					})
					.where(eq(posts.id, event.data.postId));
				console.log(
					`Post published in Read Mode: ${event.data.postId}`,
				);
				break;
			}

			case 'PostArchived':
				{
					await db
						.update(posts)
						.set({
							state: 'archived',
							archivedAt: new Date(event.data.archivedAt),
							updatedAt: new Date(),
						})
						.where(eq(posts.id, event.data.postId));
				}
				break;
		}
	}
}

async function run() {
	await consumer.connect();
	console.log(`Consumer connected to Kafka`);

	await consumer.subscribe({
		topic: 'blog.public.events',
		fromBeginning: true,
	});

	await consumer.run({
		eachMessage: handleMessage,
	});
}

run().catch(console.error);
