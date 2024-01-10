import conn from "@database/mariadb";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { RowDataPacket } from "mysql2";

const order = (req: Request, res: Response): void => {
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  let delivery_id;
  let order_id;

  let sql = `INSERT INTO delivery (address, receiver, contact)
     VALUES (?, ?, ?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];

  conn.query(sql, values, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }

    // @ts-ignore
    delivery_id = results.insertId;
    // @ts-ignore
    console.log(results.insertId);

    res.status(StatusCodes.OK).json(results);
  });
  sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
          VALUES (?,?,?,?,?)`;
  values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
  conn.query(sql, values, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }

    // @ts-ignore
    order_id = results.insertId;

    res.status(StatusCodes.OK).json(results);
  });

  sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
  values = [];

  items.forEach((item: any) => {
    values.push([order_id, item.book_id, item.quantity]);
    console.log(values);
  });
  conn.query(sql, [values], (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const getOrders = (req: Request, res: Response): void => {
  const { user_id, selected } = req.body;
  let sql =
    "SELECT cartitems.id, book_id, title, summary, quantity, price FROM cartitems LEFT JOIN books ON cartitems.book_id = books.id WHERE user_id=? AND cartitems.id IN (?)";
  let values = [user_id, selected];
  conn.query(sql, values, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      return;
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const getOrderDetail = (req: Request, res: Response): void => {
  const { id } = req.params;

  let sql = "DELETE FROM carts WHERE id = ?";

  conn.query(sql, id, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      return;
    }

    res.status(StatusCodes.OK).json(results);
  });
};

export { order, getOrders, getOrderDetail };
