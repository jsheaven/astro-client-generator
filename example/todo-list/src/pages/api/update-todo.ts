import { APIContext, APIRoute } from 'astro'
import { Todo } from '../../model/Todo'
import { readFile, writeFile } from 'fs/promises'

export interface ApiResponse {
  status: 'SUCCESS' | 'ERROR'
  error?: string
  todos: Array<Todo>
}

export interface ApiRequest extends Partial<Todo> {}

export const PATCH: APIRoute = async ({ request }) => {
  let todos: Array<Todo> = []
  const body: ApiRequest = await request.json()
  try {
    todos = JSON.parse(await readFile('./todos.json', { encoding: 'utf-8' }))
  } catch (e) {
    /** let's naively pretend, it just hasn't been created yet ;) */
  }

  // update
  todos.forEach((todo) => {
    // when matching todo is found
    if (body.id === todo.id) {
      if (body.isDone !== todo.isDone) {
        todo.isDone = body.isDone
      }
      if (body.task !== todo.task) {
        todo.task = body.task
      }
    }
  })

  try {
    await writeFile('./todos.json', JSON.stringify(todos), { encoding: 'utf-8' })
  } catch (e) {
    /** let's naively pretend that it's not that bad... amnesia... ;) */
  }

  return new Response(
    JSON.stringify({
      status: 'SUCCESS',
      todos,
    } as ApiResponse),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
