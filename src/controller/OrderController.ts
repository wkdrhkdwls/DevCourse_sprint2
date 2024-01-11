import mariadb from "mysql2/promise";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";

config();
const order = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });

  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  // delivery 테이블 삽입
  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, values);
  //@ts-ignore
  let delivery_id = results.insertId;

  // orders 테이블 삽입
  sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
          VALUES (?,?,?,?,?)`;
  values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
  [results] = await conn.execute(sql, values);
  //@ts-ignore
  let order_id = results.insertId;

  // orderedBook 테이블 삽입
  sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
  values = [];

  items.forEach((item: any) => {
    values.push([order_id, item.book_id, item.quantity]);
    console.log(values);
  });
  [results] = await conn.query(sql, [values]);

  res.status(StatusCodes.OK).json(results);
};

const getOrders = (req: Request, res: Response): void => {};

const getOrderDetail = (req: Request, res: Response): void => {};

export { order, getOrders, getOrderDetail };
