/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }
  //Aqui ira pegar globalmente todos erros que acontecerem no sistema
  public async handle(error: any, ctx: HttpContextContract) {
    //console.log('-->>>>>>>>>>', error.code)
    /**
     * Self handle the validation exception
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send(error.messages)
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      //esse erro acontece quando por exemplo,  não existe uma coluna na tabela
      return ctx.response.status(404).send('A certain parameter does not exist in the database!')
    } else if (error.code === undefined) {
      //Aqui é chamado, quando voce por exemplo atualiza com patch e passa um dados que não é esperado pelo servidor
      return ctx.response.status(500).send("You may have passed a parameter that doesn't exist!")
    } else if (error.code === 'E_ROUTE_NOT_FOUND') {
      return ctx.response.status(400).send('The route does not exist!')
    } else if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return ctx.response.status(500).send('Operation not allowed!')
    }
    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)
  }
}
