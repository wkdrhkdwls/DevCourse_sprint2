import { config } from "dotenv";
import mariadb from "mysql2/promise";

config();

const connection = async () => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });

  return conn;
};

export default connection;
