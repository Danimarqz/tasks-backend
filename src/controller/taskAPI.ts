import { Context, Hono } from "hono";
import { getSignedCookie } from "hono/cookie";
import { Env } from "../types/env";
import { checkAPIKEY, checkOrigin, errorCors } from "../cors";
import { ApiResponse } from "../types/apiResponse";
import { createTask, deleteTask, GetAll, GetOne, newTask, Task, updatedTask, updateTask } from "../repository/taskRepo";
import { errorMsg } from "../utils/utils";
import { StatusCode } from "hono/utils/http-status";

export const taskAPI = (app: Hono, env: Env) => {
    app.get('/task/id/:id', async (c: Context) => {
        if (!checkOrigin(c, env)) return errorCors(c)
        if (!checkAPIKEY(c, env)) return errorCors(c)

        const id: number = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) {
            return c.json({ error: 'Invalid ID' }, 400);
        }
        const userid = await getSignedCookie(c, env.SECRET, 'session');
        if (!userid) {
            return c.json({ error: 'User ID is required' }, 400);
        }
        try {
            const { data, status }: ApiResponse<Task> = await GetOne(env, parseInt(userid, 10), id);
            return c.json(data, status);
        } catch (error) {
            return errorMsg(c, error as Error);
        }
    })

    app.get('/task', async (c: Context) => {
        if (!checkOrigin(c, env)) return errorCors(c)
        if (!checkAPIKEY(c, env)) return errorCors(c)

        const id: number = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) {
            return c.json({ error: 'Invalid ID' }, 400);
        }
        const userid = await getSignedCookie(c, env.SECRET, 'session');
        if (!userid) {
            return c.json({ error: 'User ID is required' }, 400);
        }
        try {
            const { data, status }: ApiResponse<Task[]> = await GetAll(env, parseInt(userid, 10));
            return c.json(data, status);
        } catch (error) {
            return errorMsg(c, error as Error);
        }
    })

    app.post('/task/add', async (c: Context) => {
        if (!checkOrigin(c, env)) return errorCors(c)
        if (!checkAPIKEY(c, env)) return errorCors(c)

        const userid = await getSignedCookie(c, env.SECRET, 'session');
        if (!userid) {
            return c.json({ error: 'User ID is required' }, 400);
        }
        const newTask: newTask = await c.req.json();
        newTask.owner = Number(userid)
        try {
            const { data, status }: ApiResponse<Task> = await createTask(env, newTask)
            return c.json(data, status)
        } catch (error) {
            return errorMsg(c, error as Error)
        }
    })

    app.put('/task/id/:id', async (c: Context) => {
        if (!checkOrigin(c, env)) return errorCors(c)
        if (!checkAPIKEY(c, env)) return errorCors(c)
        
        const id: number = parseInt(c.req.param('id'), 10);
        if (isNaN(id)) {
            return c.json({ error: 'Invalid ID' }, 400);
        }
        const userid = await getSignedCookie(c, env.SECRET, 'session');
        if (!userid || isNaN(Number(userid))) {
            return c.json({ error: 'User ID is required' }, 400);
        }
        const update: updatedTask = await c.req.json()
        try {
            const { data, status }: ApiResponse<Task> = await updateTask(env, Number(userid), update)
            return c.json(data, status as StatusCode)
        } catch (error) {
            return errorMsg(c, error as Error)
        }
    })

    app.delete('/task/id/:id', async (c: Context) => {
        if (!checkOrigin(c, env)) return errorCors(c)
        if (!checkAPIKEY(c, env)) return errorCors(c)
        const taskId: number = parseInt(c.req.param('id'), 10);
        if (isNaN(taskId)) {
            return c.json({ error: 'Invalid ID' }, 400);
        }
        const userid = await getSignedCookie(c, env.SECRET, 'session');
        if (!userid || isNaN(Number(userid))) {
            return c.json({ error: 'User ID is required' }, 400);
        }
        try {
            const status: number = await deleteTask(env, Number(userid), taskId)
            return c.json(status as StatusCode)
        } catch(error) {
            return errorMsg(c, error as Error)
        }
    })
}