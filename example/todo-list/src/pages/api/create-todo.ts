import { APIContext, APIRoute } from 'astro'
import { Todo } from '../../model/Todo'
import { readFile, writeFile } from 'fs/promises'

export interface ApiResponse {
  status: 'SUCCESS' | 'ERROR'
  error?: string
  todos: Array<Todo>
}

export interface ApiRequest extends Partial<Todo> {}

export const post: APIRoute = async ({ props }: APIContext<ApiRequest>) => {
  let todos: Array<Todo> = []
  try {
    todos = JSON.parse(await readFile('./todos.json', { encoding: 'utf-8' }))
  } catch (e) {
    /** let's naively pretend, it just hasn't been created yet ;) */
  }

  console.log('Received props', props)

  const mostRecentTodo = todos[todos.length - 1] || { id: 0 } // phantom if undefined

  todos.push({
    id: mostRecentTodo.id + 1,
    task: props.task,
    isDone: props.isDone,
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
