import express from "express";
const router = express.Router();
import {
  join,
  login,
  PasswordResetrequest,
  passwordReset,
} from "../controller/UserController";

router.use(express.json());

// 회원가입
router.post("/join", join);
// 로그인
router.post("/login", login);
// 비밀번호 초기화 요청
router.post("/reset", PasswordResetrequest);
// 비밀번호 초기화
router.put("/reset", passwordReset);

export default router;
