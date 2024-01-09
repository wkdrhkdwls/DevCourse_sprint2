import conn from "@database/mariadb";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { RowDataPacket } from "mysql2";

const addToCart = (req: Request, res: Response): void => {
  const { book_id, quantity, user_id } = req.body;
  let sql =
    "INSERT INTO cartitems (book_id, quantity, user_id) VALUES (?, ?, ?)";
  let values = [book_id, quantity, user_id];
  conn.query(sql, values, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      return;
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const getCartItems = (req: Request, res: Response): void => {
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

const removeCartItem = (req: Request, res: Response): void => {
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

export { addToCart, getCartItems, removeCartItem };
