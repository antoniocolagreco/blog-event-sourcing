import express from 'express';
import { Pool } from 'pg';
import { EventRepository } from './repositories/event-repository';
import { createPostRouter } from './routes/post-routes';
import { PostService } from './services/post-service';

const app = express();
app.use(express.json());

const pool = new Pool({
	host: process.env.EVENT_STORE_HOST,
	port: Number(process.env.EVENT_STORE_PORT),
	user: process.env.EVENT_STORE_USER,
	password: process.env.EVENT_STORE_PASSWORD,
	database: process.env.EVENT_STORE_DATABASE,
});

const eventRepository = new EventRepository(pool);
const postService = new PostService(eventRepository);

app.use('/api', createPostRouter(postService));

app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
	console.log(`🚀 Process Service running on http://localhost:${PORT}`);
});
