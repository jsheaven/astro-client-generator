import { APIContext, APIRoute } from 'astro'

type Keyword = string | symbol

// mocks
interface Page {
  title: string
  keywords: Array<Keyword>
}

const checkAuth = async (request: Request) => {
  return {
    isLoggedIn: true,
  }
}

// actual implementation code

export interface ApiResponse {
  status: 'SUCCESS' | 'FORBIDDEN'
  pages: Array<Page>
}

export interface ApiRequest {
  pageId: string
  pages: Array<Page>
}

// the APIContext<ApiRequest> makes sure that the typing of props is precisely defined as to what is in POST body
export const del: APIRoute = async ({ params, request, url, props }: APIContext<ApiRequest>) => {
  const { isLoggedIn } = await checkAuth(request)

  // from ApiRequest
  console.log('pageId to delete', props.pageId)

  return {
    status: isLoggedIn ? 200 : 403,
    body: JSON.stringify({
      status: isLoggedIn ? 'SUCCESS' : 'FORBIDDEN',
      pages: [
        {
          title: 'FooBar',
          keywords: ['foo', 'bar'],
        },
      ] as Array<Page>,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }
}

// the APIContext<ApiRequest> makes sure that the typing of props is precisely defined as to what is in POST body
export const post: APIRoute = async ({ params, request, url, props }: APIContext<ApiRequest>) => {
  const { isLoggedIn } = await checkAuth(request)

  // from ApiRequest
  console.log('props', props.pages)

  return {
    status: isLoggedIn ? 200 : 403,
    body: JSON.stringify({
      status: isLoggedIn ? 'SUCCESS' : 'FORBIDDEN',
      pages: [
        // echo back the pages we've received
        ...props.pages,
        {
          title: 'FooBar',
          keywords: ['foo', 'bar'],
        },
      ] as Array<Page>,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }
}
