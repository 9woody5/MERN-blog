// import * as express from "express";
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const PORT = 4000;

// express 세팅
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

// router 세팅
app.get("/test", (req, res) => {
  res.json("test OK!!");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
