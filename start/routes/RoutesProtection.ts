import Route from '@ioc:Adonis/Core/Route'
/*
    Todas as rotas que só podem ser acesssadas mediantes autenticação
*/
Route.group(() => {
  Route.resource('users', 'UsersController').apiOnly().except(['store'])
  Route.resource('bets', 'BetsController').apiOnly()
  Route.get('betsAll', 'BetsController.indexAll')
  Route.post('logout', 'UserLogoutsController.store')
  Route.get('usersAll', 'UsersController.indexAll')
  Route.get('usersAll/:id', 'UsersController.showAll')
  Route.get('betsAll/:id', 'BetsController.showAll')
  Route.resource('games', 'GamesController')
    .apiOnly()
    .middleware({
      //Aqui definimos que metodos podem ter a rota protegida por adimin
      store: ['adminAccess'],
      destroy: ['adminAccess'],
      update: ['adminAccess'],
    })
  Route.resource('accessProfiles', 'AccessProfilesController').apiOnly()
}).middleware(['auth'])
