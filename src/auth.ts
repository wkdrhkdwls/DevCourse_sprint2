import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const ensureAuthorization = (req: Request, res: Response) => {
  try {
    let receivedJwt = req.headers["authorization"];
    if (receivedJwt) {
      let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
      return decodedJwt;
    } else {
      return new ReferenceError("jwt must be provided");
    }
  } catch (err) {
    console.log(err.name);
    console.log(err.message);

    return err;
  }
};
export default ensureAuthorization;
