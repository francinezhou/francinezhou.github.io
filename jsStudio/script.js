let bubble1 = document.querySelector(".bubble1");
let bubble2 = document.querySelector(".bubble2");
let bubble3 = document.querySelector(".bubble3");
let title1 = document.querySelector(".title1");
let title2 = document.querySelector(".title2");
let title3 = document.querySelector(".title3");

bubble1.addEventListener("click", function show(e) {
    var text1 = document.querySelector(".text1");

    if (text1.style.display === "none" || text1.style.display === "") {
        text1.style.display = "block";
    } else {
        text1.style.display = "none";
    }
});

title1.addEventListener("click", function show(e) {
    var text1 = document.querySelector(".text1");

    if (text1.style.display === "none" || text1.style.display === "") {
        text1.style.display = "block";
    } else {
        text1.style.display = "none";
    }
});


