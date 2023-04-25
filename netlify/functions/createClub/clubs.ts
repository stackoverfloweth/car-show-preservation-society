import { Handler } from '@netlify/functions'
import { Event } from '@netlify/functions/dist/function/event'
import { withPlanetscale } from '@netlify/planetscale'
import { Connection } from '@planetscale/database'


export const handler: Handler = withPlanetscale(async (event, context) => {
  const {
    planetscale: { connection },
  } = context

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: await getClubs(connection),
    }
  }

  const name = getQueryStringParameter(event.queryStringParameters, 'name', 'stranger')

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name}!`,
    }),
  }
})

function getQueryStringParameter(query: Event['queryStringParameters'] | null, parameter: string, defaultValue?: string): string | undefined {
  if (!query || !Object.keys(query).includes(parameter)) {
    return defaultValue
  }

  return query[parameter] ?? defaultValue
}

async function getClubs(connection: Connection): Promise<string> {
  const results = await connection.execute('SELECT * FROM club')

  return JSON.stringify(results.rows)
}