import conn from "../mariadb";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface CategoryDTO {
  id: number;
  name: string;
}

const allCategory = (req: Request, res: Response): void => {
  // 카테고리 전체 목록 리스트
  let sql = "SELECT * FROM category";
  conn.query(sql, (err: Error, results: CategoryDTO[]) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
      return;
    }

    res.status(StatusCodes.OK).json(results);
  });
};

export { allCategory };
