import { type APIRoute } from 'astro'
import { type Todo } from '../../model/Todo'
import { readFile, writeFile } from 'fs/promises'

export interface ApiResponse {
  status: 'SUCCESS' | 'ERROR'
  error?: string
  todos: Array<Todo>
}

export interface ApiRequest extends Partial<Todo> {}

export const POST: APIRoute = async ({ request }) => {
  let todos: Array<Todo> = []

  const body: ApiRequest = await request.json()

  // read from "DB"
  try {
    todos = JSON.parse(await readFile('./todos.json', { encoding: 'utf-8' }))
  } catch (e) {
    /** let's naively pretend, it just hasn't been created yet ;) */
  }

  const mostRecentTodo = todos[todos.length - 1] || { id: 0 } // phantom if undefined

  todos.push({
    id: mostRecentTodo.id + 1,
    task: body.task,
    isDone: body.isDone,
  })

  // save to "DB"
  try {
    await writeFile('./todos.json', JSON.stringify(todos), { encoding: 'utf-8' })
  } catch (e) {
    /** let's naively pretend that it's not that bad... amnesia... ;) */
  }

  return new Response(
    JSON.stringify({
      status: 'SUCCESS', // no!
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
