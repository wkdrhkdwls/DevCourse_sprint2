import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const ensureAuthorization = (req: Request, res: Response) => {
  try {
    let receivedJwt = req.headers["authorization"];
    let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    return decodedJwt;
  } catch (err) {
    console.log(err.name);
    console.log(err.message);

    return err;
  }
};
export default ensureAuthorization;
