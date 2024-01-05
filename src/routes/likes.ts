import { addLike, removeLike } from "@controller/LikeController";
import express from "express";
const router = express.Router();

router.use(express.json());

// 좋아요 추가
router.post(`/:id`, addLike);
// 좋아요 취소
router.delete(`/:id`, removeLike);

export default router;
