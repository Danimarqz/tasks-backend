import { Context } from 'hono';

export const errorMsg = (c: Context, error: Error): Response => {
	return c.json({ error: error.message }, 500);
};
