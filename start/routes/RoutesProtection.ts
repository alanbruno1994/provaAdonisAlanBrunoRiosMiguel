import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('users', 'UsersController').apiOnly().except(['store'])
  Route.resource('bets', 'BetsController').apiOnly()
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
