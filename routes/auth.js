module.exports = (riotRequest) => {
  const crypto = require("crypto");
  const jwt = require("./jwt");
  var router = require("express").Router();
  var path = require("path");
  router.post("/", (req, res) => {
    riotRequest.request(
      "kr",
      "summoner",
      `/lol/summoner/v4/summoners/by-name/${req.body.summonerName}`,
      function (err, summonerData) {
        randIconId = makeRandIcon(summonerData);
        db.collection("authKey").updateOne(
          { puuid: summonerData.puuid },
          {
            $set: {
              puuid: summonerData.puuid,
              summonerName: summonerData.name,
              key: randIconId,
              time: new Date(),
            },
          },
          { upsert: true },
          (err, result) => {
            if (err) {
              console.log("auth DB삽입 에러발생");
              console.log(err);
            } else {
              res.send({
                randIconId: randIconId,
                summonerData: summonerData,
              });
            }
          }
        );
      }
    );
  });
  router.get("/", (req, res) => {
    res.send("하이여");
  });
  router.get("/:authName", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views/auth.html"));
  });

  router.post("/login", (req, res) => {
    riotRequest.request(
      "kr",
      "summoner",
      `/lol/summoner/v4/summoners/by-name/${req.body.summonerName}`,
      function (err, summonerData) {
        db.collection("login").findOne(
          { puuid: summonerData.puuid },
          (err, result) => {
            if (result) {
              crypto.pbkdf2(
                req.body.pw,
                result.salt.toString("base64"),
                102350,
                64,
                "sha512",
                (err, key) => {
                  if (key.toString("base64") === result.pw) {
                    const token = jwt.generate(summonerData);

                    res.cookie("summonerName", token);
                    res.send("ok");
                  } else {
                    res.send("비밀번호 다름");
                  }
                }
              );
            } else {
              res.send("비밀번호 생성 안함");
            }
          }
        );
      }
    );
  });

  router.post("/verify", (req, res) => {
    riotRequest.request(
      "kr",
      "summoner",
      `/lol/summoner/v4/summoners/by-name/${req.body.summonerName}`,
      function (err, summonerData) {
        db.collection("authKey").findOne(
          { summonerName: summonerData.name },
          function (err, result) {
            let dbDate = new Date(result.time).getTime();
            const VERIFY_TIME_KEY = 3;
            const verifyTime = VERIFY_TIME_KEY * 60 * 1000;
            if (getUTCtime() - dbDate < verifyTime) {
              if (result.key === summonerData.profileIconId) {
                crypto.randomBytes(64, (err, buf) => {
                  crypto.pbkdf2(
                    req.body.pw,
                    buf.toString("base64"),
                    102350,
                    64,
                    "sha512",
                    (err, key) => {
                      const query = { puuid: summonerData.puuid };
                      const update = {
                        $set: {
                          name: summonerData.name,
                          puuid: summonerData.puuid,
                          salt: buf.toString("base64"),
                          pw: key.toString("base64"),
                        },
                      };
                      const options = { upsert: true };
                      db.collection("login").updateOne(
                        query,
                        update,
                        options,
                        function (err, result) {
                          const token = jwt.generate(summonerData);
                          res.cookie("summonerName", token);
                          res.send("ok");
                        }
                      );
                    }
                  );
                });
              } else {
                res.status(403);
                res.send("아이콘이 다릅니다.");
              }
            } else {
              res.status(408);
              res.send("요청이 만료되었습니다. 새로고침 후 다시 인증해주세요");
            }
          }
        );
      }
    );
  });

  return router;
};
function getUTCtime() {
  const currTime = new Date();
  return currTime.getTime();
}

function makeRandIcon(summonerData) {
  randIconId = Math.floor(Math.random() * 29);
  console.log(randIconId);
  if (randIconId === summonerData.profileIconId) {
    console.log("중복이라 실행함");
    return makeRandIcon(summonerData);
  } else {
    return randIconId;
  }
}
