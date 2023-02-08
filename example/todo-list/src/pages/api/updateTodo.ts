import { APIContext, APIRoute } from 'astro'
import { Todo } from '../../model/Todo'
import { readFile, writeFile } from 'fs/promises'

export interface ApiResponse {
  status: 'SUCCESS' | 'ERROR'
  error?: string
  todos: Array<Todo>
}

export interface ApiRequest extends Partial<Todo> {}

export const patch: APIRoute = async ({ props }: APIContext<ApiRequest>) => {
  let todos: Array<Todo> = []
  try {
    todos = JSON.parse(await readFile('./todos.json', { encoding: 'utf-8' }))
  } catch (e) {
    /** let's naively pretend, it just hasn't been created yet ;) */
  }

  // update
  todos.forEach((todo) => {
    // when matching todo is found
    if (props.id === todo.id) {
      if (props.isDone !== todo.isDone) {
        todo.isDone = props.isDone
      }
      if (props.task !== todo.task) {
        todo.task = props.task
      }
    }
  })

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
