document.addEventListener("DOMContentLoaded", function() {
  let infoButton = document.querySelector(".infoButton");
  infoButton.addEventListener("click", function show() {
      let signBig = document.querySelector(".signBig");
      if (signBig.style.opacity === "0" || signBig.style.opacity === "") {
          signBig.style.opacity = "1";
      } else {
          signBig.style.opacity = "0";
      }
  });
});
