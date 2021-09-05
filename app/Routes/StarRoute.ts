import Route from '@ioc:Adonis/Core/Route'

Route.post('/star', 'StarsController.add')
Route.delete('/star/:id', 'StarsController.delete')
