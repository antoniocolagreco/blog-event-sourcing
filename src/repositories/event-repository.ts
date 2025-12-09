import type { Pool } from 'pg';
import type { BaseEvent } from '../schemas/base-event';
import type { CreateEvent } from '../schemas/create-event';

class EventRepository {
	constructor(private pool: Pool) {}

	async createEvent<T extends BaseEvent>(
		createEvent: CreateEvent<T>,
	): Promise<void> {
		const { streamId, event, correlationId, version } = createEvent;

		const client = await this.pool.connect();

		// Optimistic Locking
		try {
			// Inizio Transazione
			await client.query('BEGIN');

			const currentVersionResult = await client.query(
				'SELECT MAX(version) as currentVersion FROM events WHERE stream_id = $1',
				[streamId],
			);

			const currentVersion =
				currentVersionResult.rows.at(0)?.currentVersion;

			let newVersion = 0;

			if (!currentVersion) {
				if (version) {
					throw new Error(
						'Cannot specify a version when creating a new stream.',
					);
				}
			} else {
				if (version !== currentVersion) {
					throw new Error(
						`Wrong version: expected ${currentVersion}, got ${version}`,
					);
				}
				newVersion++;
			}

			await client.query(
				`INSERT INTO events
      (stream_id, version, correlation_id, event_type, event_version, event_data)
      VALUES ($1, $2, $3, $4, $5, $6)`,
				[
					streamId,
					newVersion,
					correlationId,
					event.type,
					event.eventVersion,
					JSON.stringify(event),
				],
			);

			await client.query('COMMIT');
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}
	}

	async getEvents(streamId: string): Promise<BaseEvent[]> {
		const client = await this.pool.connect();

		const result = await client.query(
			`SELECT event_data FROM events WHERE stream_id = $1 ORDER BY version`,
			[streamId],
		);

		return result.rows.map((row) => row.event_data);
	}
}

export { EventRepository, type CreateEvent };
