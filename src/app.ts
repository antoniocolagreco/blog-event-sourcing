import express from 'express';
import { Pool } from 'pg';
import { EventRepository } from './repositories/event-repository';
import { createPostRouter } from './routes/post-routes';
import { createQueryRouter } from './routes/query-routes';
import { PostService } from './services/post-service';
import { QueryService } from './services/query-service';

const app = express();
app.use(express.json());

const eventStorePool = new Pool({
	host: process.env.EVENT_STORE_HOST,
	port: Number(process.env.EVENT_STORE_PORT),
	user: process.env.EVENT_STORE_USER,
	password: process.env.EVENT_STORE_PASSWORD,
	database: process.env.EVENT_STORE_DATABASE,
});

const readModelPool = new Pool({
	host: process.env.READ_MODEL_HOST,
	port: Number(process.env.READ_MODEL_PORT),
	user: process.env.READ_MODEL_USER,
	password: process.env.READ_MODEL_PASSWORD,
	database: process.env.READ_MODEL_DATABASE,
});

const eventRepository = new EventRepository(eventStorePool);
const postService = new PostService(eventRepository);
const queryService = new QueryService(readModelPool);

app.use('/api', createPostRouter(postService));
app.use('/api', createQueryRouter(queryService));

app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
	console.log(`   - Command API (write): POST /api/posts`);
	console.log(`   - Query API (read): GET /api/posts`);
});
