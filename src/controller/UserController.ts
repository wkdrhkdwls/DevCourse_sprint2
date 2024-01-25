import mariadb from "mysql2/promise";
import { Request, Response } from "express";
import { config } from "dotenv";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import crypto from "crypto";

config();

const join = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { email, password } = req.body;

  let sql = `INSERT INTO users (email, password, salt) VALUES (?,?,?)`;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let values = [email, hashPassword, salt];

  let [results] = await conn.execute(sql, values);
  res.status(StatusCodes.OK).json(results);
};

const login = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { email, password } = req.body;

  let sql = `SELECT * FROM users WHERE email = ?`;

  try {
    let [results] = await conn.execute(sql, [email]);
    const loginUser = results[0];

    const hashPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
      .toString("base64");

    if (loginUser && loginUser.password == hashPassword) {
      const token = jwt.sign(
        {
          id: loginUser.id,
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "3m",
          issuer: "pang",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      console.log(token);

      res.status(StatusCodes.OK).json(token);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const PasswordResetrequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { email } = req.body;

  let sql = `SELECT * FROM users WHERE email = ?`;

  try {
    let [results] = await conn.execute(sql, [email]);
    const user = results[0];
    if (user) {
      res.status(StatusCodes.OK).json(user);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const passwordReset = async (req: Request, res: Response): Promise<void> => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: process.env.DB_Database,
    dateStrings: true,
  });
  const { email, password } = req.body;

  let sql = `UPDATE users SET password=?, salt=? WHERE email=?`;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let values = [hashPassword, salt, email];

  try {
    let [results] = await conn.execute(sql, values);
    //@ts-ignore
    if (results.affectedRows == 0) {
      res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      const user = {
        //@ts-ignore
        id: results.insertId,
        email,
        password: hashPassword,
        salt,
      };
      res.status(StatusCodes.OK).json(user);
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).end();
  }
};

export { join, login, PasswordResetrequest, passwordReset };
