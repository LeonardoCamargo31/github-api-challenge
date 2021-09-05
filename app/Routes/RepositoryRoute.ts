import Route from '@ioc:Adonis/Core/Route'

Route.get('/:username/repository', 'RepositoryController.findAllByUsername')
Route.get('/:username/:slug', 'RepositoryController.findBySlug')
Route.post('/:username/repository', 'RepositoryController.create')
Route.put('/:username/:slug', 'RepositoryController.update')
Route.delete('/:username/:slug', 'RepositoryController.delete')
