import { Hono } from 'hono'
import { Env } from './types/env';
import userAPI from './controller/userAPI';
import { taskAPI } from './controller/taskAPI';

export default {
	async fetch(request: Request, env: Env, context: ExecutionContext): Promise<Response> {
		const app = new Hono();
		const api = app.basePath('/api');

		userAPI(api, env);
		taskAPI(api, env);

		return app.fetch(request, env, context);
	}
}