import conn from "../mariadb";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

interface BookDTO {
  id: number;
  title: string;
  img: number;
  category: string;
  form: string;
  isbn: string;
  summary: string;
  detail: string;
  author: string;
  page: number;
  contents: string;
  price: number;
  likes: number;
  liked: boolean;
  pub_date: Date;
}

const allBooks = (req: Request, res: Response): void => {
  let category_id: string | undefined = req.query.category_id as string;

  if (category_id) {
    let sql = "SELECT * FROM books WHERE category_id = ?";
    conn.query(sql, category_id, (err: Error, results: BookDTO[]) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      }

      if (results.length) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      } // NOT FOUND
    });
  } else {
    let sql = "SELECT * FROM books";
    conn.query(sql, (err: Error, results: BookDTO[]) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      }

      return res.status(StatusCodes.OK).json(results);
    });
  }
};
const bookDetail = (req: Request, res: Response) => {
  let { id } = req.params;
  let sql = "SELECT * FROM books WHERE id = ?";
  conn.query(sql, id, (err: Error, results: BookDTO[]) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }

    if (results[0]) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    } // NOT FOUND
  });
};

export { allBooks, bookDetail };
