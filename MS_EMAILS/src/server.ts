const express = require("express");
//import routes from "./Routes";
const app = express();
import ShootGamesAdmins from "./Queue";
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "ms_emails",
  brokers: ["kafka:29092"], //kafka e o nome do broker que esta no docker-compose.yml
});

const consumer = kafka.consumer({ groupId: "ms_emails_group" });
async function run() {
  try {
    await consumer.connect();

    await consumer.subscribe({ topic: "bets" });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        let objeto = JSON.parse(String(message.value));
        ShootGamesAdmins.add({
          user: "",
          bets: "",
        });
        console.log("Resposta", objeto);
      },
    });
  } catch (error) {}

  app.listen(9090);
}

app.get("/", (req: any, resp: any) => {
  console.log("conect", consumer);
  return resp.json({ ok: true });
});

run().catch(console.error);
/*
//Aqui disponibiliza o producer para todas as rotas
app.use((req, resp, next) => {
  req.producer = producer;
  next();
});*/

//app.use(routes);
