var pathName = window.location.pathname.split("/");
const iconBefore = document.querySelector("#iconBefore");
const iconAfter = document.querySelector("#iconAfter");
const summonerName = document.querySelector("#summonerName");

auth();
function auth() {
  $.ajax({
    type: "POST",
    url: `/auth`,
    data: { summonerName: pathName[2] },
  })
    .done(function (data, status, xhr) {
      summonerName.innerText = `닉네임: ${data.summonerData.name}`;
      iconBefore.src = `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/profileicon/${data.summonerData.profileIconId}.png`;
      iconAfter.src = `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/profileicon/${data.randIconId}.png`;
      console.log(data);
    })
    .fail(function () {
      console.log("요청 실패시 호출");
    })
    .always(function () {
      console.log("성공 실패 상관없이 호출");
    });
}

function verify() {
  $.ajax({
    type: "POST",
    url: `/auth/verify`,
    withCredentials: true,
    data: { summonerName: pathName[2] },
  })
    .done(function (data, status, xhr) {
      console.log("요청성공");
    })
    .fail(function () {
      console.log("요청 실패시 호출");
    })
    .always(function () {
      console.log("성공 실패 상관없이 호출");
    });
}
