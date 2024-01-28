import mariadb from "mysql2/promise";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";
import { jwt } from "jsonwebtoken";
import ensureAuthorization from "src/auth";

config();

const addToCart = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { book_id, quantity } = req.body;
  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
  } else {
    let sql =
      "INSERT INTO cartitems (book_id, quantity, user_id) VALUES (?, ?, ?)";
    let values = [book_id, quantity, authorization.id];

    let [results] = await conn.execute(sql, values);
    res.status(StatusCodes.OK).json(results);
  }
};

const getCartItems = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { selected } = req.body;

  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired" });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
  } else {
    let sql =
      "SELECT cartitems.id, book_id, title, summary, quantity, price FROM cartitems LEFT JOIN books ON cartitems.book_id = books.id WHERE user_id=?";
    let values = [authorization.id];
    if (selected) {
      // 주문서 작성 시 '선택한 장바구니 목록 조회'
      sql += " AND cartitems.id IN (?)";
      values.push(selected);
    }

    let [results] = await conn.execute(sql, values);
    res.status(StatusCodes.OK).json(results);
  }
};

const removeCartItem = async (req: Request, res: Response): Promise<void> => {
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
    let sql = "DELETE FROM carts WHERE id = ?";
    let values = [req.params.id]; //cartItemId

    let [results] = await conn.execute(sql, values);
    res.status(StatusCodes.OK).json(results);
  }
};

export { addToCart, getCartItems, removeCartItem };
