import { StatusCode } from "hono/utils/http-status";
import { createSupabaseClient } from "../db";
import { ApiResponse } from "../types/apiResponse";
import { Tables, TablesInsert, TablesUpdate } from "../types/database.types";
import { Env } from "../types/env";

export type User = Tables<'user'>
export type newUser = TablesInsert<'user'>
export type updateUser = TablesUpdate<'user'>

export const GetUser = async (env: Env, username: string): Promise<ApiResponse<User>> => {
	const { data, error, status } = await createSupabaseClient(env)
		.from('user')
		.select('*')
		.eq('username', username)
		.returns<User>();

	if (error) throw error
	return { data, status: status as StatusCode }
}

export const CreateUser = async (env: Env, user: newUser): Promise<ApiResponse<User>> => {
	const { data, error, status } = await createSupabaseClient(env)
		.from('user')
		.insert([user])
		.select()
		.returns<User>()

	if (error) throw error;
	return { data, status: status as StatusCode }
}
