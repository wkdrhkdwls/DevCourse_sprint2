import express from "express";
import { allCategory } from "../controller/CategoryController";

const router = express.Router();
router.use(express.json());

router.get("/", allCategory); // 전체 카테고리 조회'

export default router;
