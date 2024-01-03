import dotenv from "dotenv";
import express, { Application } from "express";
import userRouter from "./routes/users";
import bookRouter from "./routes/books";
import categoryRouter from "./routes/category";
import likeRouter from "./routes/likes";
import cartRouter from "./routes/carts";
import orderRouter from "./routes/orders";

dotenv.config();

const app: Application = express();

app.listen(process.env.PORT);

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
