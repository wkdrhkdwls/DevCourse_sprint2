const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken"); //jwt 모듈
const crypto = require("crypto"); // crypto 모듈 : 암호화
const dotenv = require("dotenv"); // dotenv모듈
dotenv.config();

const addToCart = (req, res) => {
  res.json("장바구니 담기");
};

const viewCart = (req, res) => {
  res.json("장바구니 조회");
};

const deleteFromCart = (req, res) => {
  res.json("장바구니 도서 삭제");
};

module.exports = { addToCart, viewCart, deleteFromCart };
