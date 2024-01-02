const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken"); //jwt 모듈
const dotenv = require("dotenv"); // dotenv모듈
dotenv.config();

const join = (req, res) => {
  const { email, password } = req.body;

  let sql = `INSERT INTO users (email, password) VALUES (?,?)`;
  let values = [email, password];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }

    res.status(StatusCodes.CREATED).json(results);
  });

  res.json("회원가입");
};

const login = (req, res) => {
  const { email, password } = req.body;

  let sql = `SELECT * FROM users WHERE email = ?`;
  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }

    const loginUser = results[0];
    if (loginUser && loginUser.password == password) {
      // 토큰 발행
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "5m",
          issuer: "pang",
        }
      );
      // 토큰 쿠키에 담기
      res.cookie("token", token, {
        httpOnly: true,
      });

      console.log(token);

      return res.status(StatusCodes.OK).json(token);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end(); //401 : Unauthorized (비인증) , 403 : Forbidden (접근 권리 없음)
    }
  });
};

const PasswordResetrequest = (req, res) => {
  res.json("비밀번호 초기화 요청");
};

const passwordReset = (req, res) => {
  res.json("비밀번호 초기화");
};

module.exports = { join, login, PasswordResetrequest, passwordReset };
