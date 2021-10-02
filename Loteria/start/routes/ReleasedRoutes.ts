import Route from '@ioc:Adonis/Core/Route'

Route.post('users', 'UsersController.store')

Route.post('login', 'UserLoginsController.login')

Route.post('recover_password', 'RecoverPasswordsController.store')

Route.put('fogots', 'RecoverPasswordsController.update')
