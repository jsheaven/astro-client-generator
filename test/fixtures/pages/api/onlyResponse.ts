import { APIRoute } from 'astro'

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

export const get: APIRoute = async ({ params, request, url }) => {
  const { isLoggedIn } = await checkAuth(request)

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
