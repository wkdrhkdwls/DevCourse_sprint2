import mariadb from "mysql2/promise";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";

config();
const allCategory = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  let sql = "SELECT * FROM category";
  let [results] = await conn.execute(sql);
  res.status(StatusCodes.OK).json(results);
};

export { allCategory };
