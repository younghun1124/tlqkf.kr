const express = require("express");
const cookieParser = require("cookie-parser");
const { verifyToken } = require("./jwt");

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

router.get("/", verifyToken, (req, res) => {
  res.send(req.decoded);
});

module.exports = router;
