// document.getElementById("yin").addEventListener("mouseover", mouseOver);
// document.getElementById("demo").addEventListener("mouseout", mouseOut);

// function mouseOver() {//from w w  w .  j a v  a  2  s .  c o  m
//     document.getElementById("demo").style.color = "red";
// }

// function mouseOut() {
//     document.getElementById("demo").style.color = "black";
// }


// Listening to the video element
let video = document.querySelector("#fog")
let 阝 = document.querySelector ("#_阝")
let strokes =document.querySelector (".cls-1")

/* Adding the event listeners on the video to play/pause the video. */

阝.addEventListener("mouseover", function fog (e) {
    video.style.opacity = "1";
 })

/* Applying the mouse out event to pause the video */

strokes.addEventListener("mouseout", function fog (e) {
    video.style.opacity = "0";
})

