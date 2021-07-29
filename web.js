const express = require("express");
const app = express();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/views");
app.use("/js", express.static(__dirname + "/js"));
app.use("/img", express.static(__dirname + "/img"));
app.use("/public", express.static(__dirname + "/public"));
const { verifyToken } = require("./routes/middleware");

JWT_SECRET = "SASDjha89dy21HJGa1";
const API_KEY = "RGAPI-29933d3c-1b2f-4e71-a0e1-2cb4e0b50a6d"; //process.env.API_KEY;
const PORT = 8001; //process.env.PORT;

var RiotRequest = require("riot-lol-api");
var riotRequest = new RiotRequest(API_KEY);

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "mongodb+srv://FilmmiTLQKF:HJzvb5Db7YIKBE6X@tlqkf.cm4ec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  function (에러, client) {
    if (에러) {
      return console.log(에러);
    }
    db = client.db("TLQKF");
    app.listen(PORT, function () {
      console.log(`listening on port ${PORT}`);
    });
  }
);
app.get("/", function (req, res) {
  // res.render("main.ejs");
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/summoner/:summonerName", function (req, res) {
  // res.render("summoner.ejs");
  res.sendFile(__dirname + "/views/search.html");
});

app.get("/summonerData", (req, res) => {
  riotRequest.request(
    "kr",
    "summoner",
    `/lol/summoner/v4/summoners/by-name/${req.query.summonerName}`,
    function (err, summonerData) {
      res.send(summonerData);
    }
  );
});

app.get("/matchId", (req, res) => {
  riotRequest.request(
    "asia",
    "match",
    `/lol/match/v5/matches/by-puuid/${req.query.puuid}/ids?start=${req.query.start}&count=${req.query.count}`,
    function (err, matchId) {
      res.send(matchId);
    }
  );
});

app.get("/matchInfo", (req, res) => {
  riotRequest.request(
    "asia",
    "match",
    `/lol/match/v5/matches/${req.query.matchId}`,
    function (err, matchInfo) {
      res.send(matchInfo);
    }
  );
});
app.post("/auth", (req, res) => {
  riotRequest.request(
    "kr",
    "summoner",
    `/lol/summoner/v4/summoners/by-name/${req.body.summonerName}`,
    function (err, summonerData) {
      makeRandIcon(summonerData, function (randIconId) {
        db.collection("authKey").updateOne(
          { puuid: summonerData.puuid },
          {
            $set: {
              puuid: summonerData.puuid,
              summonerName: summonerData.name,
              key: randIconId,
              time: getCurrentDate(),
            },
          },
          { upsert: true },
          (err, result) => {
            if (err) {
              console.log("auth DB삽입 에러발생");
              console.log(err);
            } else {
              res.send({ randIconId: randIconId, summonerData: summonerData });
            }
          }
        );
      });
    }
  );
});

app.get("/auth/:authName", (req, res) => {
  res.sendFile(__dirname + "/views/auth.html");
});

app.post("/auth/verify", (req, res) => {
  console.log(req.body.summonerName);
  riotRequest.request(
    "kr",
    "summoner",
    `/lol/summoner/v4/summoners/by-name/${req.body.summonerName}`,
    function (err, summonerData) {
      console.log(summonerData.name);
      db.collection("authKey").findOne(
        { summonerName: summonerData.name },
        function (err, result) {
          console.log(result);
          console.log(summonerData.profileIconId);
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
                      const token = jwt.sign(
                        {
                          puuid: summonerData.puuid,
                          summonerName: summonerData.summonerName,
                        },
                        JWT_SECRET,
                        {
                          expiresIn: "6h",
                          issuer: "TLQKF.KR",
                        }
                      );

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
        }
      );
    }
  );
});

app.post("/login", (req, res) => {
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
                console.log(key);
                if (key.toString("base64") === result.pw) {
                  const token = jwt.sign(
                    {
                      puuid: result.puuid,
                      summonerName: result.summonerName,
                    },
                    JWT_SECRET,
                    {
                      expiresIn: "6h",
                      issuer: "TLQKF.KR",
                    }
                  );

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
function getCurrentDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = date.getMilliseconds();
  return new Date(
    Date.UTC(year, month, today, hours, minutes, seconds, milliseconds)
  );
}

function makeRandIcon(summonerData, callback) {
  randIconId = Math.floor(Math.random() * 29);
  console.log(randIconId);
  console.log(summonerData.profileIconId);
  if (randIconId === summonerData.profileIconId) {
    makeRandIcon(summonerData);
  } else {
    callback(randIconId);
  }
}
