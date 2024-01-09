import {
  addToCart,
  getCartItems,
  removeCartItem,
} from "@controller/CartController";
import express from "express";

const router = express.Router();

router.use(express.json());

// 장바구니 담기
router.post("/", addToCart);
// 장바구니 조회
router.get(`/`, getCartItems);
// 장바구니 도서 삭제
router.delete(`/:id`, removeCartItem);
// (장바구니에서 선택한)주문 "예상" 상품 목록 조회
// router.get(`/carts/:id`, (req, res) => {
//   res.json("상품 목록 조회");
// });
// router.get("/carts"); // 장바구니에서 선택한(장바구니 도서 id) 아이템 목록 조회 ( = 선택한 장바구니 상품 목록 조회)

export default router;
