let bubble1 = document.querySelector(".bubble1");
let bubble2 = document.querySelector(".bubble2");
let bubble3 = document.querySelector(".bubble3");

    titleText.addEventListener("click", function show(e) {
        if (document.querySelector(".signBig").style.opacity === "0") {
            document.querySelector(".signBig").style.opacity = "1";
        } else {
          document.querySelector(".signBig").style.opacity = "0";
        }
    });