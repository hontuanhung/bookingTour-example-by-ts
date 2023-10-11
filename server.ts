import { connect } from "mongoose";
import config from "./config";
// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });

import { app } from "./app";

const DB: string = config.LOCAL_DATABASE;

run().catch((err) => console.log(err));

async function run() {
  connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
    .then((con: any) => {
      // console.log(con.connect);
      console.log("DB connection successful!");
    })
    .catch((err: any) => {
      console.log(err);
    });
}

// console.log(process.env.PORT);

app.listen(config.PORT, () => {
  console.log(`App running on port ${config.PORT}...`);
});
