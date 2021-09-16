import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet';

export default class BetsController {
  public async index ({}: HttpContextContract) {
    return await Bet.all();
  }

  public async store ({request}: HttpContextContract) {
      await request.validate({ schema: Bet.getRulesValidation()})
      let bet=request.only(['userId','gameID','priceGame','numberChoose']);
      return await Bet.create(bet);
  }

  public async show ({params,response}: HttpContextContract) {
      try{
        let bet=await Bet.findByOrFail('id',params.id);
        return bet;
      }catch(erro)
      {
          return response.badRequest({mensage:'Not found bet'});
      }
  }

 

  public async update ({request,params,response}: HttpContextContract) {
     try{
        let bet=await Bet.findByOrFail('id',params.id);
        await bet.merge(request.all()).save();
        return bet;
      }catch(erro)
      {
          return response.badRequest({mensage:'Not found bet'});
      }
  }

  public async destroy ({params,response}: HttpContextContract) {
    try{
        let bet=await Bet.findByOrFail('id',params.id);
        await bet.delete();        
      }catch(erro)
      {
          return response.badRequest({mensage:'Not found bet'});
      }
  }
}
