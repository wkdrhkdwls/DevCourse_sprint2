import { config } from "dotenv";
import mariadb from "mysql2";

config();

const connection = mariadb.createConnection({
  host: process.env.DB_Host,
  user: process.env.DB_User,
  password: process.env.DB_Password,
  database: process.env.DB_Database,
  dateStrings: true,
});

export default connection;
