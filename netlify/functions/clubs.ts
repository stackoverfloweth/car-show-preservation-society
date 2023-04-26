import { Handler } from '@netlify/functions'
import { withPlanetscale } from '@netlify/planetscale'
import { Api } from 'netlify/utilities'

const api = new Api()

export const handler: Handler = (event, context) => api.execute(event, context)

api.get(/^\/\.netlify\/functions\/clubs$\/?$/, () => withPlanetscale(async (event, context) => {
  const { planetscale: { connection } } = context
  const results = await connection.execute('SELECT * FROM club WHERE NOT deleted;')

  return {
    statusCode: 200,
    body: JSON.stringify(results.rows),
  }
}))

api.post(/^\/\.netlify\/functions\/clubs$\/?$/, () => withPlanetscale(async (event, context) => {
  const { planetscale: { connection } } = context
  const results = await connection.execute('SELECT * FROM club WHERE NOT deleted;')

  return {
    statusCode: 200,
    body: JSON.stringify(results.rows),
  }
}))

api.get(/^\/\.netlify\/functions\/clubs\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/?$/, (clubId: string) => withPlanetscale(async (event, context) => {
  const { planetscale: { connection } } = context
  const results = await connection.execute('SELECT * FROM club WHERE clubId = :clubId AND NOT deleted', { clubId })

  if (results.rows.length !== 1) {
    return {
      statusCode: 404,
    }
  }

  const [club] = results.rows

  return {
    statusCode: 200,
    body: JSON.stringify(club),
  }
}))

api.put(/^\/\.netlify\/functions\/clubs\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/?$/, (clubId: string) => withPlanetscale(async (event, context) => {
  const { planetscale: { connection } } = context
  const results = await connection.execute('SELECT * FROM club WHERE NOT deleted;')

  return {
    statusCode: 200,
    body: JSON.stringify(results.rows),
  }
}))

api.delete(/^\/\.netlify\/functions\/clubs\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/?$/, (clubId: string) => withPlanetscale(async (event, context) => {
  const { planetscale: { connection } } = context
  const results = await connection.execute('SELECT * FROM club WHERE NOT deleted;')

  return {
    statusCode: 200,
    body: JSON.stringify(results.rows),
  }
}))

// unhex(replace(uuid(),'-',''))