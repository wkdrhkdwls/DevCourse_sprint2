import mariadb from "mysql2/promise";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";

config();
const addLike = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { id } = req.params;
  const { user_id } = req.body;
  let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
  let values = [user_id, id];
  let [results] = await conn.execute(sql, values);
  res.status(StatusCodes.OK).json(results);
};

const removeLike = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { id } = req.params;
  const { user_id } = req.body;
  let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
  let values = [user_id, id];
  let [results] = await conn.execute(sql, values);
  res.status(StatusCodes.OK).json(results);
};

export { addLike, removeLike };
