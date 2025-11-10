window.onload = function() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  let next = document.querySelector (".next")
  let text3d = document.querySelector (".text3d")

text3d.addEventListener("mouseover", function fade (e) {
    document.querySelector(".text3a").style.opacity = "0";
 })

text3d.addEventListener("mouseout", function fade (e) {
  document.querySelector(".text3a").style.opacity = "1";
})
  
text3d.addEventListener("mouseover", function fade (e) {
    document.querySelector(".text3bc").style.opacity = "0";
 })

text3d.addEventListener("mouseout", function fade (e) {
  document.querySelector(".text3bc").style.opacity = "1";
})
