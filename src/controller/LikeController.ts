import mariadb from "mysql2/promise";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import ensureAuthorization from "src/auth";

config();

const addLike = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });

  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
  } else {
    let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
    let values = [authorization.id, req.params.id];
    let [results] = await conn.execute(sql, values);
    res.status(StatusCodes.OK).json(results);
  }
};

const removeLike = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });

  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
  } else {
    let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
    let values = [authorization.id, req.params.id];
    let [results] = await conn.execute(sql, values);
    res.status(StatusCodes.OK).json(results);
  }
};

export { addLike, removeLike };
