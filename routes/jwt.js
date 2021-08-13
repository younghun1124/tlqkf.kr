const jwt = require("jsonwebtoken");
const JWT_SECRET = "a2HEX12JKWDQ12dJKas";

module.exports.generate = (summonerData) => {
  try {
    return jwt.sign(
      {
        puuid: summonerData.puuid,
        summonerName: summonerData.name,
      },
      JWT_SECRET,
      {
        expiresIn: "6h",
        issuer: "TLQKF.KR",
      }
    );
  } catch (err) {
    throw err;
  }
};

module.exports.verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.cookies.summonerName, JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        message: "토큰만료",
      });
    }

    return res.status(401).json({
      code: 401,
      message: "유효하지 않은 토큰",
    });
  }
};
