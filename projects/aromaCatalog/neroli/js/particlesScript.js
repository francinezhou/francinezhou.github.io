particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 45,
      "density": {
        "enable": true,
        "value_area": 721.5354273894853
      }
    },
    "color": {
      "value": "#ffe351" // Change the fill color to #ffe351
    },
    "shape": {
      "type": "circle", // Change the shape to "circle"
      "stroke": {
        "width": 2, // Set the outline width to 2pt
        "color": "#ffffff" // Set the outline color to white
      }
    },
    "opacity": {
      "value": 1,
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
        "size_min": 2,
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
      "out_mode": "bounce",
      "bounce": true,
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
        "size": 12,
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
