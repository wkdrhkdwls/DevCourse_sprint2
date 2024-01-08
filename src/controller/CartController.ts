import conn from "@database/mariadb";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { RowDataPacket } from "mysql2";

const addToCart = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { user_id } = req.body;
  let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
  let values = [user_id, id];
  conn.query(sql, values, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      return;
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const getCartItems = (req: Request, res: Response): void => {};

const removeCartItem = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { user_id } = req.body;
  let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
  let values = [user_id, id];
  conn.query(sql, values, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      return;
    }

    res.status(StatusCodes.OK).json(results);
  });
};

export { addToCart, getCartItems, removeCartItem };
