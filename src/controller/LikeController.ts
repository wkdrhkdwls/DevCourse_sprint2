import mariadb from "mysql2/promise";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

config();
const addLike = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });

  let decodedJwt: any = ensureAuthorization(req);
  let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
  let values = [decodedJwt.id, req.params.id];
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

  let decodedJwt: any = ensureAuthorization(req);

  let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
  let values = [decodedJwt.id, req.params.id];
  let [results] = await conn.execute(sql, values);
  res.status(StatusCodes.OK).json(results);
};

function ensureAuthorization(req: Request) {
  let receivedJwt = req.headers["authorization"];
  let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
  return decodedJwt;
}
export { addLike, removeLike };
