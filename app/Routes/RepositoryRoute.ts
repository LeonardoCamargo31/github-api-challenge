import Route from '@ioc:Adonis/Core/Route'

Route.get('/repository/:username', 'RepositoryController.findAllByUsername')
Route.get('/repository/:username/:slug', 'RepositoryController.findBySlug')
Route.post('/repository', 'RepositoryController.create')
Route.put('/repository/:slug', 'RepositoryController.update')
Route.delete('/repository/:slug', 'RepositoryController.delete')
