import Database from '@ioc:Adonis/Lucid/Database'
import { BaseTask } from 'adonis5-scheduler/build'
import Env from '@ioc:Adonis/Core/Env'
import EmailTemplate from 'App/Mailers/EmailTemplate'
import Queue from 'App/lib/Queue'
import Bet from 'App/Models/Bet'

//Aqui seria o elemento que faz o dispara todos os dias as 9 horas da manhã para aqueles usuários que não fizeram um jogo a 1 semana
export default class ShootEmail7DaysToPlayersNotPlayed extends BaseTask {
  /*
  O * mais esquerdo seria o segundo,
  depois o anteior a este seria o minuto,
  depois a hora.
  Exemplo para disparar as 9:10:00, 0 10 9 * * *  
  */
  public static get schedule() {
    return '10 41 16 * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }
  //Aqui e o conteudo que será executado, para tal usar o comando: node ace scheduler:run
  public async handle() {
    let dateNow = new Date()
    let dateNowFormat = `${dateNow.getFullYear()}-${
      dateNow.getMonth() + 1
    }-${dateNow.getDate()} ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`
    let emails_1 = await Database.rawQuery(
      'SELECT users.id FROM users,bets WHERE users.id=bets.user_id AND users.id NOT IN (SELECT users.id FROM users,bets WHERE users.id=bets.user_id AND TIMESTAMPDIFF(DAY,users.created_at,bets.created_at)<7 group by users.id) AND TIMESTAMPDIFF(DAY,bets.created_at,?)=7 group by users.id',
      [dateNowFormat]
    )
    this.userBetsGamesDispatch(emails_1[0])
    let emails_2 = await Database.rawQuery(
      'SELECT users.name FROM users WHERE users.id NOT IN (Select users.id from users,bets where users.id=bets.user_id group by users.id) AND TIMESTAMPDIFF(DAY,created_at,?)=7',
      [dateNowFormat]
    )
    this.userBetsDispatchForEmail(emails_2[0])
    console.log('dispatch to send emails ', dateNowFormat)
  }

  public async userBetsDispatchForEmail(value) {
    value.forEach((value, id) => {
      console.log('dispared ', value)
      /*Queue.RegisterUser.add({
        email: user.email,
        subject: 'You have registered to the betting system!',
        template: 'email/new_user',
      })*/
    })
  }

  public async userBetsGamesDispatch(value) {
    value.forEach(async (value, id) => {
      let bets = await Bet.query().where('user_id', value.id).preload('games').preload('users')
      bets.forEach((value) => console.log('teste ', value))
      /*Queue.RegisterUser.add({
        email: user.email,
        subject: 'You have registered to the betting system!',
        template: 'email/new_user',
      })*/
    })
  }
}
