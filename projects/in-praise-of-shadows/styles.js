// Listening to the video element
// let fog = document.querySelector("#fog")
let 阝 = document.querySelector ("#_阝")
let 人 = document.querySelector ("#_人")
let 云 = document.querySelector ("#_云")
let 医 = document.querySelector ("#_医")
let 殳 = document.querySelector ("#_殳")
let 羽 = document.querySelector ("#_羽")
let 礻 = document.querySelector ("#_礻")
let 乚 = document.querySelector ("#_乚")
let 言 = document.querySelector ("#_言")
let 替 = document.querySelector ("#_替")



/* Adding the event listeners on the video to play the video. */

人 .addEventListener("mouseover", function leaf (e) {
    document.querySelector("#leaf").style.opacity = "1";
 })

云 .addEventListener("mouseover", function sand (e) {
    document.querySelector("#sand").style.opacity = "1";
 })

殳.addEventListener("mouseover", function darkest (e) {
    document.querySelector("#darkest").style.opacity = "1";
 })

羽 .addEventListener("mouseover", function warm (e) {
    document.querySelector("#warm").style.opacity = "1";
 })

 礻.addEventListener("mouseover", function glow (e) {
    document.querySelector("#glow").style.opacity = "1";
 })

 乚.addEventListener("mouseover", function hand (e) {
    document.querySelector("#hand").style.opacity = "1";
 })

 替.addEventListener("mouseover", function fog (e) {
    document.querySelector("#fog").style.opacity = "1";
 })

/* Applying the mouse out event to hide the video */



人 .addEventListener("mouseout", function leaf (e) {
    document.querySelector("#leaf").style.opacity = "0";
 })

云 .addEventListener("mouseout", function sand (e) {
    document.querySelector("#sand").style.opacity = "0";
 })

殳.addEventListener("mouseout", function darkest (e) {
    document.querySelector("#darkest").style.opacity = "0";
 })

羽 .addEventListener("mouseout", function warm (e) {
    document.querySelector("#warm").style.opacity = "0";
 })

 礻.addEventListener("mouseout", function glow (e) {
    document.querySelector("#glow").style.opacity = "0";
 })

 乚.addEventListener("mouseout", function hand (e) {
    document.querySelector("#hand").style.opacity = "0";
})

替.addEventListener("mouseout", function fog (e) {
    document.querySelector("#fog").style.opacity = "0";
})


// BOTTOM BAR
// hover stroke to hide EN title
const p = document.querySelectorAll("path");
p.forEach (function(item) {
  item.addEventListener("mouseover", function en () {
   document.querySelector(".en-title").style.opacity = "0";
    console.log(p);
  });
})
// mouse out stroke to hide EN title
p.forEach (function(item) {
   item.addEventListener("mouseout", function en () {
    document.querySelector(".en-title").style.opacity = "1";
     console.log(p);
   });
 })


// hover stroke to show JP title 

阝.addEventListener("mouseover", function jp1 (e) {
   document.querySelector(".jp-title1").style.opacity = "1";
})

人 .addEventListener("mouseover", function jp1 (e) {
   document.querySelector(".jp-title1").style.opacity = "1";
})

云.addEventListener("mouseover", function jp1 (e) {
   document.querySelector(".jp-title1").style.opacity = "1";
})

医 .addEventListener("mouseover", function jp1 (e) {
   document.querySelector(".jp-title1").style.opacity = "1";
})

殳 .addEventListener("mouseover", function jp1 (e) {
   document.querySelector(".jp-title1").style.opacity = "1";
})

羽 .addEventListener("mouseover", function jp2 (e) {
   document.querySelector(".jp-title2").style.opacity = "1";
})

礻 .addEventListener("mouseover", function jp2 (e) {
   document.querySelector(".jp-title2").style.opacity = "1";
})

乚 .addEventListener("mouseover", function jp2 (e) {
   document.querySelector(".jp-title2").style.opacity = "1";
})

言 .addEventListener("mouseover", function jp3 (e) {
   document.querySelector(".jp-title3").style.opacity = "1";
})

替 .addEventListener("mouseover", function jp3 (e) {
   document.querySelector(".jp-title3").style.opacity = "1";
})

// mouse out stroke to hide JP title

阝.addEventListener("mouseout", function jp1 (e) {
   document.querySelector(".jp-title1").style.opacity = "0";
})

人 .addEventListener("mouseout", function jp1 (e) {
   document.querySelector(".jp-title1").style.opacity = "0";
})

云.addEventListener("mouseout", function jp1 (e) {
   document.querySelector(".jp-title1").style.opacity = "0";
})

医 .addEventListener("mouseout", function jp1 (e) {
   document.querySelector(".jp-title1").style.opacity = "0";
})
殳 .addEventListener("mouseout", function jp1 (e) {
   document.querySelector(".jp-title1").style.opacity = "0";
})

羽 .addEventListener("mouseout", function jp2 (e) {
   document.querySelector(".jp-title2").style.opacity = "0";
})
礻 .addEventListener("mouseout", function jp2 (e) {
   document.querySelector(".jp-title2").style.opacity = "0";
})

乚 .addEventListener("mouseout", function jp2 (e) {
   document.querySelector(".jp-title2").style.opacity = "0";
})

言.addEventListener("mouseout", function jp3 (e) {
   document.querySelector(".jp-title3").style.opacity = "0";
})

替.addEventListener("mouseout", function jp3 (e) {
   document.querySelector(".jp-title3").style.opacity = "0";
})
