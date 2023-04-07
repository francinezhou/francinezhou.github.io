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
const rocket = document.getElementById('rocket');
const performance = document.getElementById('performance');
const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#ff9800', '#ff5722'];
let firework = document.querySelector(".firework");

/*  click rocket for fireworks card animation */
let fireworks = document.querySelectorAll(".firework");

rocket.addEventListener('click', () => {
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



const max_fireworks = 4,
max_sparks = 10;
let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');
let fws = [];

for (let i = 0; i < max_fireworks; i++) {
let fw = {
  sparks: []
};
for (let n = 0; n < max_sparks; n++) {
  let spark = {
    vx: Math.random() * 5 + .5,
    vy: Math.random() * 5 + .5,
    weight: Math.random() * .3 + .03,
    red: Math.floor(Math.random() * 2),
    green: Math.floor(Math.random() * 2),
    blue: Math.floor(Math.random() * 2)
  };
  if (Math.random() > .5) spark.vx = -spark.vx;
  if (Math.random() > .5) spark.vy = -spark.vy;
  fw.sparks.push(spark);
}
fws.push(fw);
resetFirework(fw);
}
window.requestAnimationFrame(explode);

function resetFirework(fw) {
fw.x = Math.floor(Math.random() * canvas.width);
fw.y = canvas.height;
fw.age = 0;
fw.phase = 'fly';
}

function explode() {
context.clearRect(0, 0, canvas.width, canvas.height);
fws.forEach((fw,index) => {
  if (fw.phase == 'explode') {
      fw.sparks.forEach((spark) => {
      for (let i = 0; i < 10; i++) {
        let trailAge = fw.age + i;
        let x = fw.x + spark.vx * trailAge;
        let y = fw.y + spark.vy * trailAge + spark.weight * trailAge * spark.weight * trailAge;
        let fade = i * 80 - fw.age * 1;
        let r = Math.floor(spark.red * fade);
        let g = Math.floor(spark.green * fade);
        let b = Math.floor(spark.blue * fade);
        context.beginPath();
        context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + '10)';
        context.rect(x, y, 7, 7);
        context.fill();
      }
    });
    fw.age++;
    if (fw.age > 200 && Math.random() < .05) {
      resetFirework(fw);
    }
  } else {
    fw.y = fw.y - 10;
    for (let spark = 0; spark < 15; spark++) {
      context.beginPath();
      context.fillStyle = 'rgba(' + index * 50 + ',' + spark * 17 + ',0,1)';
      context.rect(fw.x + Math.random() * spark - spark / 2, fw.y + spark * 4, 5, 5);
      context.fill();
    }
    if (Math.random() < .001 || fw.y < 200) fw.phase = 'explode';
  }
});
window.requestAnimationFrame(explode);
}


function createImageOnCanvas(imageId) {
    //canvas.style.display = "block";
    //document.getElementById("images").style.overflowY = "hidden";
    //var img = new Image(300, 300);
    //img.src = document.getElementById(imageId).src;
    //context.drawImage(img, (0), (0)); //onload....
}

function draw(e) {
    var pos = getMousePos(canvas, e);
    posx = pos.x;
    posy = pos.y;
    context.fillStyle = "#000000";
    context.fillRect(posx, posy, 4, 4);
}
window.addEventListener('mousemove', draw, false);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}
 


/*  card expand on click */
// let cardSmalls = document.querySelectorAll(".cardSmall");
// function cardSize() {
// 	cardSmall.classList.toggle("cardLarge");
//   }
// let cardSmall = document.querySelector(".cardSmall");
// let cardLarge = document.querySelector(".cardLarge");
// cardSmall.addEventListener("click", cardSize);


// // Get all the elements on the page
// const elements = document.getElementsByTagName('*');

// // Loop through each element
// for (let i = 0; i < elements.length; i++) {
//   const element = elements[i];

//   // Only modify elements that contain text
//   if (element.childNodes.length && element.tagName !== 'SCRIPT' && element.tagName !== 'STYLE') {
//     // Loop through each child node of the element
//     for (let j = 0; j < element.childNodes.length; j++) {
//       const node = element.childNodes[j];

//       // Replace the letter "Q" with the specified <span> element
//       if (node.nodeType === 3 && node.nodeValue.includes('Q')) {
//         const text = node.nodeValue;
//         const replacedText = text.replace(/Q/g, '<span class="font-replace">Q</span>');
//         const newNode = document.createElement('span');
//         newNode.innerHTML = replacedText;
//         element.replaceChild(newNode, node);
//       }
//     }
//   }
// }

// document.addEventListener("DOMContentLoaded", function() {

//   var element = document.querySelector("#html-content-holder");
//   var getCanvas;
  
//   html2canvas(element, {
//     onrendered: function(canvas) {
//       document.querySelector("body").appendChild(canvas);
//       getCanvas = canvas;
//     }
//   });

//   document.querySelector("#btn-Convert-Html2Image").addEventListener("click", function() {
//     var imageData = getCanvas.toDataURL("image/png");
//     var newData = imageData.replace(/^data:image\/png/, "data:application/octet-stream");
//     this.setAttribute("download", "your_pic_name.png");
//     this.setAttribute("href", newData);
//   });

// });



