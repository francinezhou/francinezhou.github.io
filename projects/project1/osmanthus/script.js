// Function to scroll to the bottom
function scrollBottom() {
  window.scrollTo(0, 99999);
}
// Add an event listener for DOMContentLoaded to trigger the scroll
if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", function () {
      scrollBottom();
  }, false);
} else if (window.attachEvent) {
  window.attachEvent("onload", function () {
      scrollBottom();
  });
}

particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 63,
      "density": {
        "enable": true,
        "value_area": 721.5354273894853
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "image",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "data:image/svg+xml;utf8," + encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?>
          <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.81 38.81">
            <defs>
              <style>
                .cls-1 {
                  fill: #ffbc00;
                }
              </style>
            </defs>
            <g id="osmanthus_layer" data-name="osmanthus layer">
              <path class="cls-1" d="M30,19.4c18.06,15.83,5.23,28.65-10.6,10.6-15.83,18.06-28.65,5.23-10.6-10.6C-9.25,3.58,3.58-9.25,19.4,8.81c15.83-18.06,28.65-5.23,10.6,10.60Z"/>
            </g>
          </svg>`),
        "width": 50,
        "height": 50
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 6,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "bounce", // Set out_mode to "bounce"
      "bounce": true, // Enable bouncing
      "attract": {
        "enable": true,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "bubble"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 170.52652093416066,
        "size": 9,
        "duration": 1.0556403676876611,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 113.68434728944044,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});


$(document).ready(function () {

  // Toggle display manually on .jar-cap click
  $(".jar-cap").click(function() {
    $("#particles-js").toggleClass('show');
      console.log('clicked')
      $(this).toggleClass('cap-open');
  });

 
  
});
