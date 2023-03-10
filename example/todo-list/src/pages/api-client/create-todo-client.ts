import { APIRoute } from 'astro'
import { Todo } from '../../model/Todo'
import { readFile, writeFile } from 'fs/promises'





export interface QueryMap {
  [key: string]: string
}

export interface RequestOptions extends RequestInit {
  query?: QueryMap
}

export interface ApiRequest extends Partial<Todo> {}

export interface ApiResponse {
  status: 'SUCCESS' | 'ERROR'
  error?: string
  todos: Array<Todo>
}
  

/** return (await fetch('/api/create-todo', { method: 'POST', ... })).json() */
export const createTodo = async(payload: ApiRequest, options: RequestOptions = {}): Promise<ApiResponse> => {
  let requestUrl = 'http://localhost:3000/api/create-todo'
  if (options && options.query) {
    requestUrl += '?' + Object.keys(options.query)
        .map((key) => key + '=' + options.query![key])
        .join('&');
  }
  delete options.query
  options.method = 'POST'
  options.body = JSON.stringify(payload)
  return (await fetch(requestUrl, options)).json()
}