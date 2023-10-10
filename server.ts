import { connect } from "mongoose";
import * as dotenv from "dotenv";
import config from "./config";

dotenv.config({ path: "./.env" });
console.log(process.env.LOCAL_DATABASE);
import { app } from "./app";

const DB: string = `${process.env.LOCAL_DATABASE}`;

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

let port: any = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
