import conn from "@database/mariadb";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { BookDTO } from "@interfaces/books/book";
import { RowDataPacket } from "mysql2";

const allBooks = (req: Request, res: Response): void => {
  let { category_id, news }: { category_id?: string; news?: string } =
    req.query as { category_id?: string; news?: string };

  let sql = "SELECT * FROM books";
  let values = [];
  if (category_id && news) {
    sql +=
      " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values = [category_id, news];
  } else if (category_id) {
    sql += " WHERE category_id = ?";
    values = [category_id];
  } else if (news) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values = [news];
  }

  conn.query(sql, values, (err: Error, results: RowDataPacket[]) => {
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
