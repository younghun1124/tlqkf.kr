const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/views");
app.use("/js", express.static(__dirname + "/js"));
app.use("/img", express.static(__dirname + "/img"));
app.use("/public", express.static(__dirname + "/public"));
require("dotenv").config();

const API_KEY = "RGAPI-5d59cc12-3aa5-4111-97af-cca8922914f5"; //process.env.API_KEY;
const PORT = 8001; //process.env.PORT;
var RiotRequest = require("riot-lol-api");
var riotRequest = new RiotRequest(API_KEY);

//passport
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const Users = require('./user');

// module.exports = () => {
//   passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
//     done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
//   });

//   passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
//     done(null, user); // 여기의 user가 req.user가 됨
//   });

//   passport.use(
//     new LocalStrategy(
//       {
//         usernameField: "id",
//         passwordField: "pw",
//         session: true,
//         passReqToCallback: true,
//       },
//       function (req, 입력한아이디, 입력한비번, done) {
//         //req에 있는 값
// console.log(req)

//         //console.log(입력한아이디, 입력한비번);
//         db.collection("login").findOne(
//           { id: 입력한아이디 },
//           function (에러, 결과) {
//             if (에러) return done(에러);

//             if (!결과)
//               return done(null, false, { message: "존재하지않는 아이디요" });
//             if (입력한비번 == req.body.randIconId) {
//               return done(null, 결과);
//             } else {
//               return done(null, false, { message: "비번틀렸어요" });
//             }
//           }
//         );
//       }
//     )
//   );

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

app.get("/", function (req, res) {
  res.render("main.ejs");
});

app.get("/summoner/:summonerName", function (req, res) {
  res.render("summoner.ejs");
});
// app.get("/summoner/:summonerName", function (req, res) {
//   makeNameURI(req, function (uri) {
//     riotRequest.request("kr", "summoner", uri, function (err, summonerData) {
//       console.log(summonerData);
//       riotRequest.request(
//         "asia",
//         "match",
//         `/lol/match/v5/matches/by-puuid/${summonerData.puuid}/ids?count=3`,
//         (err, matchData) => {
//           console.log(matchData);
//           res.render("summoner.ejs", {
//             summonerData: summonerData,
//           });
//         }
//       );
//     });
//   });
// });

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
  console.log(req.query);
  riotRequest.request(
    "asia",
    "match",
    `/lol/match/v5/matches/${req.query.matchId}`,
    function (err, matchInfo) {
      console.log(matchInfo);
      res.send(matchInfo);
    }
  );
});

function makeRandIcon(data, callback) {
  randIconId = Math.floor(Math.random() * 29);
  if (randIconId === data.body.profileIconID) {
    makeRandIcon(data);
  } else {
    callback(randIconId);
  }
}
