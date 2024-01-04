import { createConnection } from "mysql2";
import { config } from "dotenv";

config();

const connection = createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_Password,
  database: "bookshop",
  dateStrings: true,
});

export default connection;
