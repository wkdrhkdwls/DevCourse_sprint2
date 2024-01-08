import conn from "@database/mariadb";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { BookDTO, QueryParamsDTO } from "@interfaces/books/book";
import { RowDataPacket } from "mysql2";

const allBooks = (req: Request, res: Response): void => {
  let { category_id, news, limit, currentPage } = req.query as QueryParamsDTO;

  let offset = Number(limit) * (Number(currentPage) - 1);

  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books";
  let values: Array<number | string> = [];
  if (category_id && news) {
    sql +=
      " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values = [category_id];
  } else if (category_id) {
    sql += " WHERE category_id = ?";
    values = [category_id];
  } else if (news) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(Number(limit), offset);

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
  let { user_id } = req.body;
  let book_id = req.params.id;

  let sql =
    "SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) AS likes, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?;";

  let values = [user_id, book_id, book_id];
  conn.query(sql, values, (err: Error, results: RowDataPacket[]) => {
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
