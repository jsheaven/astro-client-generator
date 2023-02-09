import { APIRoute } from 'astro'
import { Todo } from '../../model/Todo'
import { readFile } from 'fs/promises'





export interface QueryMap {
  [key: string]: string
}

export interface RequestOptions extends RequestInit {
  query?: QueryMap
}



export interface ApiResponse {
  status: 'SUCCESS' | 'ERROR'
  error?: string
  todos: Array<Todo>
}

/** return (await fetch('/api/getTodos', { method: 'GET', ... })).json() */
export const apiGetTodosGet = async(options: RequestOptions = {}): Promise<ApiResponse> => {
  let requestUrl = '/api/getTodos'
  if (options && options.query) {
    requestUrl += '?' + Object.keys(options.query)
        .map((key) => key + '=' + options.query![key])
        .join('&');
  }
  delete options.query
  options.method = 'GET'
  
  return (await fetch(requestUrl, options)).json()
}