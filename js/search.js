const input = document.querySelector("#searchInput");
console.log(input.value);
function search() {
  window.location.href = `/summoner/${input.value}`;
}
function enterkey() {
  if (window.event.keyCode === 13) {
    window.location.href = `/summoner/${input.value}`;
  }
}
