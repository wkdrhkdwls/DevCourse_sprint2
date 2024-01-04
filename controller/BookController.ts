import conn from "../mariadb";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { BookDTO } from "../types/books/book";
import { RowDataPacket } from "mysql2";

const allBooks = (req: Request, res: Response): void => {
  let category_id: string | undefined = req.query.category_id as string;

  if (category_id) {
    let sql = "SELECT * FROM books WHERE category_id = ?";
    conn.query(sql, category_id, (err: Error, results: RowDataPacket[]) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      }
      const books: BookDTO[] = results as BookDTO[];

      if (books.length) {
        return res.status(StatusCodes.OK).json(books);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      } // NOT FOUND
    });
  } else {
    let sql = "SELECT * FROM books";
    conn.query(sql, (err: Error, results: RowDataPacket[]) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      }
      const books: BookDTO[] = results as BookDTO[];
      return res.status(StatusCodes.OK).json(books);
    });
  }
};

const bookDetail = (req: Request, res: Response) => {
  let { id } = req.params;

  let sql =
    "SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?;";
  conn.query(sql, id, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }
    const book: BookDTO = results[0] as BookDTO;
    if (book) {
      return res.status(StatusCodes.OK).json(book);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    } // NOT FOUND
  });
};

export { allBooks, bookDetail };
