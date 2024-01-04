import conn from "@database/mariadb";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { UserDTO } from "@interfaces/users/user";

dotenv.config();

const join = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  let sql = `INSERT INTO users (email, password, salt) VALUES (?,?,?)`;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let values = [email, hashPassword, salt];

  conn.query(sql, values, (err: Error, results: ResultSetHeader) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const user: UserDTO = {
      id: results.insertId,
      email,
      password: hashPassword,
      salt,
    };
    res.status(StatusCodes.CREATED).json(user);
  });
};

const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  let sql = `SELECT * FROM users WHERE email = ?`;
  conn.query(sql, email, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const loginUser: UserDTO = results[0] as UserDTO;

    const hashPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
      .toString("base64");

    if (loginUser && loginUser.password == hashPassword) {
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "5m",
          issuer: "pang",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      console.log(token);

      return res.status(StatusCodes.OK).json(token);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const PasswordResetrequest = (req: Request, res: Response): void => {
  const { email } = req.body;

  let sql = `SELECT * FROM users WHERE email = ?`;
  conn.query(sql, email, (err: Error, results: RowDataPacket[]) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const user: UserDTO = results[0] as UserDTO;
    if (user) {
      return res.status(StatusCodes.OK).json(user);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordReset = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  let sql = `UPDATE users SET password=?, salt=? WHERE email=?`;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let values = [hashPassword, salt, email];

  conn.query(sql, values, (err: Error, results: ResultSetHeader) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows == 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      const user: UserDTO = {
        id: results.insertId,
        email,
        password: hashPassword,
        salt,
      };
      return res.status(StatusCodes.OK).json(user);
    }
  });
};

export { join, login, PasswordResetrequest, passwordReset };
