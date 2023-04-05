import { connect, ConnectOptions, connection } from "mongoose";
import chalk from "chalk";

module.exports = (connectionString: string, log: boolean = true) => {
  connect(connectionString, <ConnectOptions>{ autoIndex: true });

  if (log) {
    //write to logs
    connection.on("connected", () => {
      console.log(chalk.green("mongoose connection is open"));
    });
    connection.on("error", (err) => {
      console.error(chalk.red("mongoose connection error", err));
    });
    connection.on("disconnected", () => {
      console.log(chalk.red("mongoose connection is disconnected"));
    });
  }

  process.on("SIGINT", () => {
    connection.close(() => {
      console.log(
        chalk.red(
          "mongoose connection is disconnected due to application termination"
        )
      );
      process.exit();
    });
  });
};
