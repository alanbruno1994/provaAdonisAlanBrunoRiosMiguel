
const express = require("express");
const app = express();
const ShootGamesAdmins =require("./Queue");
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
      eachMessage: async ({ topic, partition, message }) => {
        let object = JSON.parse(String(message.value));
        console.log("Resposta", object);
        ShootGamesAdmins.add({
          user:object.user,
          bets: object.bets,
          admins:object.admins,
          sum:object.sum
        });
       // console.log(ShootGamesAdmins)
      },
    });
  } catch (error) {}

  app.listen(9090);
}

app.get("/", (req, resp) => {
  console.log("conect", consumer);
  return resp.json({ ok: true });
});

run().catch(console.error);