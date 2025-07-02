const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");

if (dropdownButton && dropdownMenu) {
  dropdownButton.addEventListener("click", function () {
    if (dropdownMenu.style.display === "block") {
      dropdownMenu.style.display = "none";
      document.getElementById("arrow").style.transform = "rotate(0deg)";
    } else {
      dropdownMenu.style.display = "block";
      document.getElementById("arrow").style.transform = "rotate(180deg)";
    }
  });
}

window.addEventListener("click", function (e) {
  if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.style.display = "none";
    document.getElementById("arrow").style.transform = "rotate(0deg)";
  }
});
