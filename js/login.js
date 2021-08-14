const pw = document.querySelector(".header__login-div__password");
function login() {
  $.ajax({
    type: "POST",
    url: `/auth/login`,
    withCredentials: true,
    data: { summonerName: pathName[2], pw: pw.value },
  })
    .done(function (data, status, xhr) {
      alert(data);
    })
    .fail(function (data, textStatus, errorThrown) {
      alert(data.responseText);
      console.log("요청 실패시 호출");
    })
    .always(function () {
      console.log("성공 실패 상관없이 호출");
    });
}
