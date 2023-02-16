// Listening to the video element
let 阝 = document.querySelector ("#_阝")
let link = document.querySelector (".next a")

// Set up the mouseover event handler
阝.addEventListener("mouseover", function(){
 link.classList.add("play");       // Change to Play
 link.classList.remove("stop");  // Remove Stop 
});

阝.addEventListener("mouseout", function(){
link.classList.add("stop");     // Change to Stop 
link.classList.remove("play");    // Remove Play
});