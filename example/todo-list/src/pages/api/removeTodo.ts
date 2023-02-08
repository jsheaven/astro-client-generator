import { APIContext, APIRoute } from 'astro'
import { Todo } from '../../model/Todo'
import { readFile, writeFile } from 'fs/promises'

export interface ApiResponse {
  status: 'SUCCESS' | 'ERROR'
  error?: string
  todos: Array<Todo>
}

export interface ApiRequest {
  id: number
}

export const del: APIRoute = async ({ props }: APIContext<ApiRequest>) => {
  let todos: Array<Todo> = []
  try {
    todos = JSON.parse(await readFile('./todos.json', { encoding: 'utf-8' }))
  } catch (e) {
    /** let's naively pretend, it just hasn't been created yet ;) */
  }

  // filter out the one with the matching id
  todos = todos.filter((todo) => todo.id !== props.id)

  try {
    await writeFile('./todos.json', JSON.stringify(todos), { encoding: 'utf-8' })
  } catch (e) {
    /** let's naively pretend that it's not that bad... amnesia... ;) */
  }

  return {
    status: 200,
    body: JSON.stringify({
      status: 'SUCCESS',
      todos,
    } as ApiResponse),
    headers: {
      'Content-Type': 'application/json',
    },
  }
}
