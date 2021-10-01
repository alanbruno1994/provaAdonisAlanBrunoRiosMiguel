import { Kafka } from 'kafkajs'
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import './routes/ReleasedRoutes'
import './routes/RoutesProtection'

Route.get('/oi', async () => {
  const kafka = new Kafka({
    clientId: 'api',
    brokers: ['kafka:29092'], //kafka e o nome do broker que esta no docker-compose.yml
  })

  const producer = kafka.producer()
  await producer.connect()
  await producer.send({
    topic: 'bets',
    messages: [
      {
        value: JSON.stringify('ok'),
      },
    ],
  })
  await producer.disconnect()

  return { hello: producer }
})
