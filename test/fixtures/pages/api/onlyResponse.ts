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

export const GET: APIRoute = async ({ params, request, url }) => {
  const { isLoggedIn } = await checkAuth(request)

  return new Response(JSON.stringify({
    status: isLoggedIn ? 'SUCCESS' : 'FORBIDDEN',
    pages: [
      {
        title: 'FooBar',
        keywords: ['foo', 'bar'],
      },
    ] as Array<Page>,
  }), {
    status: isLoggedIn ? 200 : 403,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
