import conn from "@database/mariadb";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CategoryDTO } from "@interfaces/categories/category";
import { RowDataPacket } from "mysql2";

const allCategory = (req: Request, res: Response): void => {
  let sql = "SELECT * FROM category";
  conn.query<RowDataPacket[]>(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    // RowDataPacket[]을 CategoryDTO[]로 변환
    const categories: CategoryDTO[] = results.map((row: RowDataPacket) => {
      return {
        id: row.id,
        category_name: row.category_name,
      } as CategoryDTO;
    });
    res.status(StatusCodes.OK).json(categories);
  });
};

export { allCategory };
