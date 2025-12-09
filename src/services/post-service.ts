import type { EventRepository } from '../repositories/event-repository';
import type { CorrelationId } from '../schemas/correlation-id';
import type { CreatePostInput, PostId } from '../schemas/post';
import type {
	PostArchivedEvent,
	PostCreatedEvent,
	PostPublishedEvent,
} from '../schemas/post-events';
import { generateId } from '../utils';

export class PostService {
	constructor(private eventRepository: EventRepository) {}

	async createPost(
		input: CreatePostInput,
		correlationId: CorrelationId,
	): Promise<PostId> {
		const postId = generateId<PostId>();

		console.log(input);

		const event: PostCreatedEvent = {
			type: 'PostCreated',
			eventVersion: 1,
			data: {
				postId,
				title: input.title,
				content: input.content,
				author: input.author,
				createdAt: new Date().toISOString(),
			},
		};

		await this.eventRepository.createEvent<PostCreatedEvent>({
			streamId: postId,
			correlationId,
			event,
		});

		console.log(`Post created: ${postId}`);
		return postId;
	}

	async publishPost(
		postId: PostId,
		correlationId: CorrelationId,
	): Promise<void> {
		const events = await this.eventRepository.getEvents(postId);
		const currentVersion = events.length - 1;

		const event: PostPublishedEvent = {
			type: 'PostPublished',
			eventVersion: 1,
			data: {
				postId,
				publishedAt: new Date().toISOString(),
			},
		};

		await this.eventRepository.createEvent<PostPublishedEvent>({
			streamId: postId,
			version: currentVersion,
			correlationId,
			event,
		});

		console.log(`Post published: ${postId}`);
	}

	async archivePost(
		postId: PostId,
		correlationId: CorrelationId,
	): Promise<void> {
		const events = await this.eventRepository.getEvents(postId);
		const currentVersion = events.length - 1;

		const event: PostArchivedEvent = {
			type: 'PostArchived',
			eventVersion: 1,
			data: {
				postId,
				archivedAt: new Date().toISOString(),
			},
		};

		await this.eventRepository.createEvent<PostArchivedEvent>({
			streamId: postId,
			version: currentVersion,
			correlationId,
			event,
		});

		console.log(`Post archived ${postId}`);
	}
}
