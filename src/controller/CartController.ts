import mariadb from "mysql2/promise";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";

config();
const addToCart = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { book_id, quantity, user_id } = req.body;

  let sql =
    "INSERT INTO cartitems (book_id, quantity, user_id) VALUES (?, ?, ?)";
  let values = [book_id, quantity, user_id];

  let [results] = await conn.execute(sql, values);
  res.status(StatusCodes.OK).json(results);
};

const getCartItems = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { user_id, selected } = req.body;
  let sql =
    "SELECT cartitems.id, book_id, title, summary, quantity, price FROM cartitems LEFT JOIN books ON cartitems.book_id = books.id WHERE user_id=? AND cartitems.id IN (?)";
  let values = [user_id, selected];
  let [results] = await conn.execute(sql, values);
  res.status(StatusCodes.OK).json(results);
};

const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { id } = req.params;

  let sql = "DELETE FROM carts WHERE id = ?";
  let values = [id];

  let [results] = await conn.execute(sql, values);
  res.status(StatusCodes.OK).json(results);
};

export { addToCart, getCartItems, removeCartItem };
