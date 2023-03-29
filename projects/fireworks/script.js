// define our variables
let toggleMain = document.querySelector(".main-title");
let headerStatus = document.querySelector(".header");

// when user clicks on "menu", open and close the mobile navigation
toggleMain.addEventListener( "click", () => {
    if (headerStatus.classList.contains("open")) {
      headerStatus.classList.remove("open");
    } else {
      headerStatus.classList.add("open");
    }
  },
  false
);

let body = document.body;
const button = document.getElementById('button');
const performance = document.getElementById('performance');
const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#ff9800', '#ff5722'];
let firework = document.querySelector(".firework");

/*  click fire button for fireworks card animation */
let fireworks = document.querySelectorAll(".firework");

button.addEventListener('click', () => {
  // Create 1 firework per click
  for (let i = 0; i < 1; i++) {
    const firework = document.createElement('div');
    firework.classList.add('firework');
    fireworks.forEach(function (firework) {
    firework.style.right = (100 * Math.random()) + '%';
    firework.style.top = (100 * Math.random()) + '%';
  });
    performance.appendChild(firework);
  }

  // Create 8 confetti items
  for (let i = 0; i < 8; i++) {
    const cardSmall = document.createElement('div');
    cardSmall.classList.add('cardSmall');
    cardSmall.style.background = colors[Math.floor(Math.random() * colors.length)];
	cardSmall.style.setProperty('--translate-x', Math.cos(i * Math.PI / 4) * 100 + 'px');
    cardSmall.style.setProperty('--translate-y', Math.sin(i * Math.PI / 4) * 100 + 'px');
    
    firework.appendChild(cardSmall);
  }
});


/*  card expand on click */
let cardSmalls = document.querySelectorAll(".cardSmall");
function cardSize() {
	cardSmall.classList.toggle("cardLarge");
  }
let cardSmall = document.querySelector(".cardSmall");
let cardLarge = document.querySelector(".cardLarge");
cardSmall.addEventListener("click", cardSize);




// fetch("fireworks.json")
// .then(function(response){
// 	return response.json();
// })
// .then(function(fireworks){
// 	let placeholder = document.querySelector("#preview");
// 	let out = "";
// 	for(let fireworks of fireworks){
//     out+= `
//     <div class="icon">
// 		<div class="cardLarge" style="background:${rgb()}">
// 		<div class="image"><img src="${fireworks.imageLink}"></div>
// 		<div class="category">${fireworks.name || '-'}</div>
// 		<div class="description">${fireworks.inventory || '-'}</div>
// 		<div class="year">${fireworks.productCode}</div>
// 		</div>
//     </div>`
// 	}

// 	placeholder.innerHTML = out;
// });
//   function rgb() {
//     const r = Math.floor(Math.random() * 256)
//     const g = Math.floor(Math.random() * 256)
//     const b = Math.floor(Math.random() * 256)
//     return `rgb(${r},${g},${b},.5)`
//   }

