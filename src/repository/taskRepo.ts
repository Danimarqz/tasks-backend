import { StatusCode } from "hono/utils/http-status";
import { createSupabaseClient } from "../db";
import { ApiResponse } from "../types/apiResponse";
import { Tables, TablesInsert, TablesUpdate } from "../types/database.types";
import { Env } from "../types/env";

export type Task = Tables<'task'>
export type newTask = TablesInsert<'task'>
export type updatedTask = TablesUpdate<'task'>

export const GetAll = async (env: Env, userid: number): Promise<ApiResponse<Task[]>> => {
    const { data, error, status } = await createSupabaseClient(env)
        .from('task')
        .select('*')
        .eq('owner', userid)
        .returns<Task[]>()

    if (error) throw error;
    return { data, status: status as StatusCode };
}

export const GetOne = async (env: Env, userid: number, taskid: number): Promise<ApiResponse<Task>> => {
    const { data, error, status } = await createSupabaseClient(env)
        .from('task')
        .select('*')
        .eq('owner', userid)
        .eq('id', taskid)
        .returns<Task>()

    if (error) throw error;
    return { data, status: status as StatusCode }
}

export const updateTask = async (env: Env, userid: number, task: updatedTask): Promise<ApiResponse<Task>> => {
    const { data, status, error } = await createSupabaseClient(env)
        .from('task')
        .update(task)
        .eq('id', task.id)
        .eq('owner', userid)
        .select()
        .returns<Task>()

    if (error) throw error;
    return { data, status: status as StatusCode }
}

export const createTask = async (env: Env,  task: newTask): Promise<ApiResponse<Task>> => {
    const { data, status, error } = await createSupabaseClient(env)
        .from('task')
        .insert([task])
        .select()
        .returns<Task>()

    if (error) throw error;
    return { data, status: status as StatusCode }
}

export const deleteTask = async (env: Env, userid: number, taskid: number): Promise<number> => {
    const { error, status } = await createSupabaseClient(env)
        .from('task')
        .delete()
        .eq('id', taskid)
        .eq('owner', userid)
    
        if (error) throw error;
        return status as StatusCode 
}