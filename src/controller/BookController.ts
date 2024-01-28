import mariadb from "mysql2/promise";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";
import ensureAuthorization from "src/auth";
import jwt from "jsonwebtoken";

config();
const allBooks = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });

  let { category_id, news, limit, currentPage } = req.query;

  let offset = Number(limit) * (Number(currentPage) - 1);

  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books";
  let values: Array<number | string> = [];
  if (category_id && news) {
    sql +=
      " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values = [Number(category_id)]; // Convert category_id to number
  } else if (category_id) {
    sql += " WHERE category_id = ?";
    values = [Number(category_id)]; // Convert category_id to number
  } else if (news) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(Number(limit), offset);

  let [results] = await conn.execute(sql, values);
  res.status(StatusCodes.OK).json(results);
};

const bookDetail = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  // 로그인 상태가 아니면 => liked 빼고 보내주면 되고
  // 로그인 상태이면 => liked도 추가해서
  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
  } else if (authorization instanceof ReferenceError) {
    let book_id = req.params.id;
    let sql =
      "SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?;";

    let values = [book_id];
    let [results] = await conn.execute(sql, values);
    res.status(StatusCodes.OK).json(results);
  } else {
    let book_id = req.params.id;

    let sql =
      "SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?;";

    let values = [authorization.id, book_id, book_id];
    let [results] = await conn.execute(sql, values);
    res.status(StatusCodes.OK).json(results);
  }
};

export { allBooks, bookDetail };
