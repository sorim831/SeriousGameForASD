const express = require("express");
const { verifyToken } = require("./middlewares");
const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  // 토큰이 유효하면 home 페이지로
  res.json({
    success: true,
    user: req.decoded,
  });
});

module.exports = router;
