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
const API_KEY = "RGAPI-d3b4a1b1-d67e-4898-8b15-2ae32b414d81"; //process.env.API_KEY;
const PORT = 8001; //process.env.PORT;

var RiotRequest = require("riot-lol-api");
var riotRequest = new RiotRequest(API_KEY);
app.use("/auth", require("./routes/auth.js")(riotRequest));
app.use("/review", require("./routes/review.js"));

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

app.get("/rankInfo", (req, res) => {
  riotRequest.request(
    "kr",
    "match",
    `/lol/league/v4/entries/by-summoner/${req.query.id}`,
    function (err, rankInfo) {
      res.send(rankInfo);
    }
  );
});

app.get("/matchInfo", (req, res) => {
  riotRequest.request(
    "asia",
    "league",
    `/lol/match/v5/matches/${req.query.matchId}`,
    function (err, matchInfo) {
      res.send(matchInfo);
    }
  );
});
app.get("//riot.txt", (req, res) => {
  res.sendFile(__dirname + "/riot.txt");
});
