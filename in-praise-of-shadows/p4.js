
  let next = document.querySelector (".next")
  let vasePath = document.querySelector ("#vasePath")

vasePath.addEventListener("mouseover", function foreground (e) {
    document.querySelector(".cls-1").style.opacity = "0";
 })

 vasePath.addEventListener("mouseout", function foreground (e) {
  document.querySelector(".cls-1").style.opacity = "1";
})

vasePath.addEventListener("mouseover", function foreground (e) {
  document.querySelector(".text4").style.opacity = "1";
})

vasePath.addEventListener("mouseout", function foreground (e) {
document.querySelector(".text4").style.opacity = "0";
})



  
// text3d.addEventListener("mouseover", function fade (e) {
//     document.querySelector(".text3bc").style.opacity = "0";
//  })

// text3d.addEventListener("mouseout", function fade (e) {
//   document.querySelector(".text3bc").style.opacity = "1";
// })
