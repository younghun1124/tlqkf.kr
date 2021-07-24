const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/views");
require("dotenv").config();

const API_KEY = "RGAPI-f1bb2668-ba04-47dd-8620-ed71aaadbf6d"; //process.env.API_KEY;
const PORT = 8001; //process.env.PORT;
var RiotRequest = require("riot-lol-api");
var riotRequest = new RiotRequest(API_KEY);

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

app.get("/", function (req, res) {
  res.render("search.ejs");
});

function makeNameURI(data, callback) {
  const name = data.body.summonerName;
  const uri = encodeURI(`/lol/summoner/v4/summoners/by-name/${name}`);
  callback(uri);
}

app.post("/search", function (req, res) {
  makeRandIcon(req, function (randIconId) {
    makeNameURI(req, function (uri) {
      riotRequest.request("kr", "summoner", uri, function (err, data) {
        console.log(data);
        res.render("verify.ejs", {
          summonerData: data,
          randIconId: randIconId,
        });
      });
    });
  });
});

app.get("/verify", function (req, res) {
  makeNameURI(req, function (uri) {
    riotRequest.request("kr", "summoner", uri, function (err, data) {
      console.log(data);
      res.render("verify.ejs", {
        summonerData: data,
        randIconId: randIconId,
      });
    });
  });
});

function makeRandIcon(data, callback) {
  randIconId = Math.floor(Math.random() * 29);
  if (randIconId === data.body.profileIconID) {
    makeRandIcon(data);
  } else {
    callback(randIconId);
  }
}
