import { order, getOrders, getOrderDetail } from "@controller/OrderController";
import express from "express";
const router = express.Router();

router.use(express.json());

// 결제하기 = 주문하기 = 주문 등록 = 데이터베이스 주문 INSERT
router.post("/", order);
// 주문 내역(목록) 조회
router.get(`/`, getOrders);
// 주문 상세 상품 조회
router.get(`/:id`, getOrderDetail);

export default router;
