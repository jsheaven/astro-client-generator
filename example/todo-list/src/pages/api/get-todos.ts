import { APIRoute } from 'astro'
import { Todo } from '../../model/Todo'
import { readFile } from 'fs/promises'

export interface ApiResponse {
  status: 'SUCCESS' | 'ERROR'
  error?: string
  todos: Array<Todo>
}

export const get: APIRoute = async ({ params, request, url }) => {
  let todos: Array<Todo> = []
  try {
    todos = JSON.parse(await readFile('./todos.json', { encoding: 'utf-8' }))
  } catch (e) {
    /** let's naively pretend, it just hasn't been created yet */
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
