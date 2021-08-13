var pathName = window.location.pathname.split("/");
let summonerInfo;
const summonerName = document.getElementById("summonerName");
const icon = document.getElementById("profileIcon");
const gameList = document.querySelector(".GameList");

let startNum = 0;
const countNum = 3;
getSummonerData();
function getSummonerData() {
  $.ajax({
    type: "GET",
    url: `/summonerData`,
    data: { summonerName: pathName[2] },
  })
    .done(function (summonerData, status, xhr) {
      if (xhr.responseJSON.status !== undefined) {
        switch (xhr.responseJSON.status.status_code) {
          case 404:
            alert("존재하지 않는 소환사입니다");
            window.location.href = `/`;
            break;
          default:
            alert(xhr.responseJSON.status.message);
            window.location.href = `/`;
            break;
        }
      }
      summonerInfo = summonerData;

      icon.src = `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/profileicon/${summonerData.profileIconId}.png`;
      summonerName.innerText = summonerData.name;
      getMatchId(summonerData.puuid);
      console.log("요청 성공시 호출");
    })
    .fail(function () {
      console.log("요청 실패시 호출");
    })
    .always(function () {
      console.log("성공 실패 상관없이 호출");
    });
}
function getMatchId(puuid) {
  $.ajax({
    type: "GET",
    url: `/matchId`,
    data: { puuid: puuid, count: countNum, start: startNum },
  })
    .done(function (matchId, status, xhr) {
      console.log(matchId);
      console.log("요청 성공시 호출");
      startNum += 3;
      matchId.forEach((element) => {
        getMatchInfo(element);
      });
    })
    .fail(function () {
      console.log("요청 실패시 호출");
    })
    .always(function () {
      console.log("성공 실패 상관없이 호출");
    });
}

// function getRankInfo(id) {
//   $.ajax({
//     type: "GET",
//     url: `/matchId`,
//     data: { id: id },
//   })
//     .done(function (data, status, xhr) {
//       useRankInfo(data);
//       console.log("요청 성공시 호출");
//     })
//     .fail(function () {
//       console.log("요청 실패시 호출");
//     })
//     .always(function () {
//       console.log("성공 실패 상관없이 호출");
//     });
// }

function useRankInfo(data) {}

function getMatchInfo(matchId) {
  $.ajax({
    type: "GET",
    url: `/matchInfo`,
    data: { matchId: matchId },
  })
    .done(function (matchInfo, status, xhr) {
      useMatchInfo(matchInfo);
    })
    .fail(function () {
      console.log("요청 실패시 호출");
    })
    .always(function () {
      console.log("성공 실패 상관없이 호출");
    });
}

function useMatchInfo(matchInfo) {
  console.log(matchInfo);
  const div = document.createElement("div");
  div.classList.add("Game");
  const player = matchInfo.info.participants;

  player.forEach((element) => {
    div.innerHTML +=
      '<img width="20px" src="http://ddragon.leagueoflegends.com/cdn/11.15.1/img/champion/' +
      element.championName +
      '.png">' +
      `${element.kills}/${element.deaths}/${element.assists}/` +
      element.summonerName;
  });

  gameList.append(div);
}

// const icon = document.getElementById("icon");
// icon.src = `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/profileicon/${summonerData.profileIconId}.png`;
