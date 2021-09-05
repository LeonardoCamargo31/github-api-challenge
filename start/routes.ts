import Route from '@ioc:Adonis/Core/Route'

import 'App/Routes/UserRoute'
import 'App/Routes/RepositoryRoute'
import 'App/Routes/TokenRoute'
import 'App/Routes/StarRoute'

Route.get('/', async () => {
  return { hello: 'world' }
})
