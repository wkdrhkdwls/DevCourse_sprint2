import express from "express";
import { allBooks, bookDetail } from "src/controller/BookController";

const router = express.Router();

router.use(express.json());

router.get("/", allBooks); // (카테고리별)전체 도서 조회
router.get("/:id", bookDetail); // 개별 도서 조회

export default router;
