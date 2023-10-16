import { connect } from "mongoose";

process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import config from "./config";
import app from "./app";
import { Server } from "http";
import { error } from "console";

const DB: string = config.LOCAL_DATABASE;

run().catch((error) => console.log(error));

async function run() {
  connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
    .then((con: any) => {
      console.log("DB connection successful!");
    })
    .catch((err: any) => {
      console.log(err);
    });
}

const port: number = config.PORT || 3000;
const server: Server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLER REJECTIONN! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    //.close() finish all request are still pending or being handled
    process.exit(1);
  });
});
