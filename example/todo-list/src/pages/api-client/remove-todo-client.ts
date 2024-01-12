import { type Todo } from '../../model/Todo'





export interface QueryMap {
    [key: string]: string
}

export interface RequestOptions extends RequestInit {
    query?: QueryMap
}

export interface ApiRequest {
    id: number
}

export interface ApiResponse {
    status: 'SUCCESS' | 'ERROR'
    error?: string
    todos: Array<Todo>
}


/** return (await fetch('/api/remove-todo', { method: 'DELETE', ... })).json() */
export const removeTodo = async (payload: ApiRequest, options: RequestOptions = {}): Promise<ApiResponse> => {
    let requestUrl = 'http://127.0.0.1:4321/api/remove-todo'
    if (options && options.query) {
        requestUrl += '?' + Object.keys(options.query)
            .map((key) => key + '=' + options.query![key])
            .join('&');
    }
    delete options.query
    options.method = 'DELETE'
    options.body = JSON.stringify(payload)
    return (await fetch(requestUrl, options)).json()
}
