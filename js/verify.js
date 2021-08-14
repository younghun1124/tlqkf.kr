var pathName = window.location.pathname.split("/");
const iconBefore = document.querySelector(".main__icon-div__before-div__img");
const iconAfter = document.querySelector(".main__icon-div__after-div__img");
const summonerName = document.querySelector(".main__summoner-name");

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
const pw = document.querySelector(".main__password-div__password");
const pwCheck = document.querySelector("#passwordCheck");

function verify() {
  if (pwOkay) {
    $.ajax({
      type: "POST",
      url: `/auth/verify`,
      withCredentials: true,
      data: { summonerName: pathName[2], pw: pw.value },
    })
      .done(function (data, status, xhr) {
        alert("인증 성공");
        window.location.href = `/summoner/${pathName[2]}`;

        console.log("요청성공");
      })
      .fail(function (data, textStatus, errorThrown) {
        alert(data.responseText);
        console.log("요청 실패시 호출");
      })
      .always(function () {
        console.log("성공 실패 상관없이 호출");
      });
  }
}

let pwOkay = false;
function checkPassword() {
  let reg_pw = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{8,16}/;
  const password = document.querySelector(
    ".main__password-div__password"
  ).value;
  const passwordCheck = document.querySelector("#passwordCheck").value;
  let hint = document.querySelector("#passwordHint");
  if (!reg_pw.test(password) || password.length > 16) {
    hint.innerText =
      "숫자와 영문자, 특수문자 조합으로 8~16자리를 사용해야 합니다.";
    pwOkay = false;
  } else if (password !== passwordCheck) {
    hint.innerText = "비밀번호가 같지 않습니다.";
    pwOkay = false;
  } else {
    hint.innerText = "유효한 비밀번호입니다.";
    pwOkay = true;
  }
}
