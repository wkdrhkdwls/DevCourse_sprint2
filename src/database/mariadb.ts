import { createConnection } from "mysql2";
import { config } from "dotenv";

config();

const connection = createConnection({
  host: process.env.DB_Host,
  user: process.env.DB_User,
  password: process.env.DB_Password,
  database: process.env.DB_Database,
  dateStrings: true,
});

export default connection;
