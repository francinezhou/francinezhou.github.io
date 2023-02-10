const scrollContainer = document.querySelector("main");

scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
});

let main = document.getElementsByTagName("main")[0];
        main.style.backgroundColor = "#CBC3E3";
let bulbLight1 = document.querySelectorAll("bulbLight light1");

        // trigger this function every time the user scrolls
        // main.onscroll = function (event) {
        //     let scroll = main.pageLOffset;
        //     if (scroll < 2000) {
        //         // yellow
        //         bulbLight1.classList.toggle("bulbLightPink");
                
        //      } else if (scroll >= 2000 && scroll < 4000) {
        //       // blue
        //         main.style.backgroundColor = 'blue';
        //      } else {
        //       // purple
        //      main.style.backgroundColor = 'purple';
        //     }
        // }