import conn from "@database/mariadb";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CategoryDTO } from "@interfaces/categories/category";
import { RowDataPacket } from "mysql2";

const allCategory = (req: Request, res: Response): void => {
  // 카테고리 전체 목록 리스트
  let sql = "SELECT * FROM category";
  conn.query(sql, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      return;
    }
    const categories: CategoryDTO[] = results as CategoryDTO[];
    res.status(StatusCodes.OK).json(categories);
  });
};

export { allCategory };
