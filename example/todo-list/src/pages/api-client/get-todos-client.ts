import { type Todo } from '../../model/Todo'





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


/** return (await fetch('/api/get-todos', { method: 'GET', ... })).json() */
export const getTodos = async (options: RequestOptions = {}): Promise<ApiResponse> => {
    let requestUrl = 'http://localhost:4321/api/get-todos'
    if (options && options.query) {
        requestUrl += '?' + Object.keys(options.query)
            .map((key) => key + '=' + options.query![key])
            .join('&');
    }
    delete options.query
    options.method = 'GET'

    return (await fetch(requestUrl, options)).json()
}
