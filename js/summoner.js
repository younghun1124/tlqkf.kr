var pathname = window.location.pathname.split("/");
let summonerInfo;
const summonerName = document.getElementById("summonerName");
const icon = document.getElementById("icon");
const matchList = document.getElementById("matchList");

//pathname[1]==> summoner
//pathname[2]==> {summonerName}

let startNum = 0;
const countNum = 3;
getSummonerData();

function getSummonerData() {
  $.ajax({
    type: "GET",
    url: `/summonerData`,
    data: { summonerName: pathname[2] },
  })
    .done(function (summonerData, status, xhr) {
      if (xhr.responseJSON.status !== undefined) {
        switch (xhr.responseJSON.status.status_code) {
          case 404:
            alert("존재하지 않는 소환사입니다");

          default:
            window.location.href = `/`;
            break;
        }
      }
      summonerInfo = summonerData;

      icon.src = `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/profileicon/${summonerData.profileIconId}.png`;
      summonerName.append(summonerData.name);
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
  const li = document.createElement("li");
  const player = matchInfo.info.participants;

  player.forEach((element) => {
    li.innerHTML +=
      '<img class="matchListCampIcon" src="http://ddragon.leagueoflegends.com/cdn/11.15.1/img/champion/' +
      element.championName +
      '.png">' +
      element.summonerName;
  });

  matchList.append(li);
}
// const icon = document.getElementById("icon");
// icon.src = `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/profileicon/${summonerData.profileIconId}.png`;
