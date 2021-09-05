import Route from '@ioc:Adonis/Core/Route'

Route.get('/user', 'UserController.findAll')
Route.get('/user/:id', 'UserController.findById')
Route.post('/user', 'UserController.create')
Route.put('/user/:id', 'UserController.update')
Route.delete('/user/:id', 'UserController.delete')
