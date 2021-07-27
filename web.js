const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/views");
app.use("/js", express.static(__dirname + "/js"));
app.use("/img", express.static(__dirname + "/img"));
app.use("/public", express.static(__dirname + "/public"));
const { verifyToken } = require("./routes/middleware");

JWT_SECRET = "SASDjha89dy21HJGa1";
const API_KEY = "RGAPI-ee2c50bb-a3fd-46a5-9358-0edd04cfc530"; //process.env.API_KEY;
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
      makeRandIcon(summonerData, (randIconId) => {
        db.collection("authKey").insertOne(
          {
            summonerName: decodeURI(summonerData.name),
            key: randIconId,
            time: getCurrentDate(),
          },
          (err, result) => {
            if (err) {
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
            const token = jwt.sign(
              {
                puuid: summonerData.puuid,
                summonerName: summonerData.summonerName,
              },
              JWT_SECRET,
              {
                expiresIn: "30h", // 1분
                issuer: "TLQKF.KR",
              }
            );

            res.cookie("summonerName", token);
            res.send("ok");
          } else {
            res.send("Icon not correct");
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
