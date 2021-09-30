const express = require("express");
//import routes from "./Routes";
const app = express();

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "ms_emails",
  brokers: ["kafka:9092"], //kafka e o nome do broker que esta no docker-compose.yml
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "ms_emails_group" });
async function run() {
  try {
    await producer.connect();
    await consumer.connect();

    /*await consumer.subscribe({ topic: "bets" });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("Resposta", String(message.value));
      },
    });*/
  } catch (error) {}

  app.listen(8080);
}

app.get("/", (req, resp) => {
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
