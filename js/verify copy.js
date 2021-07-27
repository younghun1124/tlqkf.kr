const iconBefore = document.querySelector("#iconBefore");
const iconAfter = document.querySelector("#iconAfter");
auth();
function auth() {
  $.ajax({
    type: "POST",
    url: `/auth`,
    data: { summonerName: pathName[2] },
  })
    .done(function (data, status, xhr) {
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
      alert(data);
      console.log("요청성공");
    })
    .fail(function () {
      console.log("요청 실패시 호출");
    })
    .always(function () {
      console.log("성공 실패 상관없이 호출");
    });
}
