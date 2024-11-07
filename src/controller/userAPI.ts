import { Hono } from "hono";
import { Env } from "../types/env";
import { checkOrigin, errorCors } from "../cors";
import { CryptoType } from "../types/cryptoType";
import { decrypt } from "../utils/security";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { errorMsg } from "../utils/utils";
import { ApiResponse } from "../types/apiResponse";
import { GetUser, newUser, User } from "../repository/userRepo";

const userAPI = (app: Hono, env: Env) => {

	const CRYPTO_KEY = env.CRYPTO_KEY
	app.post('/auth', async (c) => {
		if (!checkOrigin(c, env)) return errorCors(c);

		const { iv, encryptedDataString } = await c.req.json()

		const { data }: CryptoType = decrypt(CRYPTO_KEY, iv, encryptedDataString)

		if (data) {
			const { username, password }: newUser = JSON.parse(data)
			try {
				const { data, status }: ApiResponse<User> = await GetUser(env, username)

				if (password !== data.password) return c.json({ error: 'Invalid credentials' }, 401)

				await setSignedCookie(c, 'session', String(data.id), env.SECRET, {
					path: '/',
					secure: true,
					domain: env.CORS,
					httpOnly: true,
					maxAge: 3600 * 24 * 30,
					expires: new Date(new Date().getTime() + 3600 * 24 * 30 * 1000),
			})
			return c.json({ message: 'Authenticated ' }, status)
		} catch (error: any) {
			return errorMsg(c, error)
		}
	}
	})
	app.post('/auth/check', async (c) => {
		if (!checkOrigin(c, env)) return errorCors(c);

		const sessionCookie = await getSignedCookie(c, env.SECRET, 'session');

		if (!sessionCookie) {
			return c.json({ error: 'No valid session' }, 401);
		}
		try {
			const { data, status }: ApiResponse<User> = await GetUser(env, sessionCookie)
			return c.json({ message: 'Valid session', username: sessionCookie }, status);
		} catch (error: any) {
			return errorMsg(c, error)
		 }
	});
	app.post('/auth/signout', async(c) => {
		if (!checkOrigin(c, env)) return errorCors(c);
		try {
			deleteCookie(c, 'session', {
				path: '/',
				secure: true,
				domain: env.CORS,
			})
			return c.json({ message: 'Signed out'}, 200)
		} catch(error: any){
			return errorMsg(c, error)
		}

	})
}

export default userAPI;