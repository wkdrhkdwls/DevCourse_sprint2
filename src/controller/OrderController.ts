import mariadb from "mysql2/promise";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";
import ensureAuthorization from "src/auth";
import jwt from "jsonwebtoken";

config();
const order = async (req: Request, res: Response): Promise<void> => {
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
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
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
    values = [
      firstBookTitle,
      totalQuantity,
      totalPrice,
      authorization.id,
      delivery_id,
    ];
    [results] = await conn.execute(sql, values);
    //@ts-ignore
    let order_id = results.insertId;

    //items를 가지고, 장바구니에서 book_id, quantity 조회
    sql = `SELECT book_id, quantity FROM cartitems WHERE id IN (?)`;
    let [orderItems, fields] = await conn.query(sql, [items]);

    // orderedBook 테이블 삽입
    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;

    values = [];
    if (orderItems instanceof Array) {
      orderItems.forEach((item: any) => {
        values.push([order_id, item.book_id, item.quantity]);
      });
    }

    results[0] = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn, items);

    res.status(StatusCodes.OK).json(result);
  }
};

const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartitems WHERE id IN (?)`;

  let result = await conn.query(sql, [items]);
  return result;
};

const getOrders = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });

  let sql = `SELECT orders.id, created_at, address, receiver, contact,
              book_title, total_quantity, total_price              
              FROM orders LEFT JOIN delivery
              ON orders.delivery_id = delivery.id`;
  let [rows, fields] = await conn.query(sql);
  res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });

  let sql = `SELECT book_id, title, author, price, quantity        
              FROM orderedBook LEFT JOIN books
              ON orderedBook.book_id = books.id
              WHERE order_id = ?`;
  let [rows, fields] = await conn.query(sql, [req.params.id]);
  res.status(StatusCodes.OK).json(rows);
};

export { order, getOrders, getOrderDetail };
