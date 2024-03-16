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



$(document).ready(function () {

  // Toggle display manually on .jarCap click
  $(".jarCap").click(function() {
    $("#particles-js").toggleClass('show');
      console.log('clicked')
      $(this).toggleClass('cap-open');
  });

});
// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
      }
    }
  })

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener

interact('.drag-drop')
.draggable({
  inertia: true,
  modifiers: [
	interact.modifiers.restrictRect({
	  restriction: 'parent',
	  endOnly: true
	})
  ],
  autoScroll: true,
  // dragMoveListener from the dragging demo above
  listeners: { move: dragMoveListener }
})

// enable dropzone
interact('.jarGlass').dropzone({
// only accept elements matching this CSS selector
accept: '.drag-drop',
// Require a 75% element overlap for a drop to be possible
overlap: 0.75,

// listen for drop related events:

ondropactivate: function (event) {
  // add active dropzone feedback
  event.target.classList.add('drop-active')
},
ondragenter: function (event) {
  var draggableElement = event.relatedTarget
  var dropzoneElement = event.target

  // feedback the possibility of a drop
  dropzoneElement.classList.add('drop-target')
  draggableElement.classList.add('can-drop')
  draggableElement.textContent = 'Dragged in'
},
ondragleave: function (event) {
  // remove the drop feedback style
  event.target.classList.remove('drop-target')
  event.relatedTarget.classList.remove('can-drop')
  event.relatedTarget.textContent = 'Dragged out'
},
ondrop: function (event) {
  event.relatedTarget.textContent = 'Dropped'
},
ondropdeactivate: function (event) {
  // remove active dropzone feedback
  event.target.classList.remove('drop-active')
  event.target.classList.remove('drop-target')
}
})

function dragMoveListener(event) {
var target = event.target
// keep the dragged position in the data-x/data-y attributes
var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

// translate the element
target.style.webkitTransform =
  target.style.transform =
	'translate(' + x + 'px, ' + y + 'px)'

// update the position attributes
target.setAttribute('data-x', x)
target.setAttribute('data-y', y)
}

// Code ported to Paper.js from http://the389.com/9/1/
// with permission.

var values = {
	friction: 0.8,
	timeStep: 0.01,
	amount: 15,
	mass: 2,
	count: 0
};
values.invMass = 1 / values.mass;

var path, springs;
var size = view.size * [1.2, 1];

var Spring = function(a, b, strength, restLength) {
	this.a = a;
	this.b = b;
	this.restLength = restLength || 80;
	this.strength = strength ? strength : 0.55;
	this.mamb = values.invMass * values.invMass;
};

Spring.prototype.update = function() {
	var delta = this.b - this.a;
	var dist = delta.length;
	var normDistStrength = (dist - this.restLength) /
			(dist * this.mamb) * this.strength;
	delta.y *= normDistStrength * values.invMass * 0.2;
	if (!this.a.fixed)
		this.a.y += delta.y;
	if (!this.b.fixed)
		this.b.y -= delta.y;
};


function createPath(strength) {
	var path = new Path({
		fillColor: 'black'
	});
	springs = [];
	for (var i = 0; i <= values.amount; i++) {
		var segment = path.add(new Point(i / values.amount, 0.5) * size);
		var point = segment.point;
		if (i == 0 || i == values.amount)
			point.y += size.height;
		point.px = point.x;
		point.py = point.y;
		// The first two and last two points are fixed:
		point.fixed = i < 2 || i > values.amount - 2;
		if (i > 0) {
			var spring = new Spring(segment.previous.point, point, strength);
			springs.push(spring);
		}
	}
	path.position.x -= size.width / 4;
	return path;
}

function onResize() {
	if (path)
		path.remove();
	size = view.bounds.size * [2, 1];
	path = createPath(0.1);
}

function onMouseMove(event) {
	var location = path.getNearestLocation(event.point);
	var segment = location.segment;
	var point = segment.point;

	if (!point.fixed && location.distance < size.height / 4) {
		var y = event.point.y;
		point.y += (y - point.y) / 6;
		if (segment.previous && !segment.previous.fixed) {
			var previous = segment.previous.point;
			previous.y += (y - previous.y) / 24;
		}
		if (segment.next && !segment.next.fixed) {
			var next = segment.next.point;
			next.y += (y - next.y) / 24;
		}
	}
}

function onFrame(event) {
	updateWave(path);
}

function updateWave(path) {
	var force = 1 - values.friction * values.timeStep * values.timeStep;
	for (var i = 0, l = path.segments.length; i < l; i++) {
		var point = path.segments[i].point;
		var dy = (point.y - point.py) * force;
		point.py = point.y;
		point.y = Math.max(point.y + dy, 0);
	}

	for (var j = 0, l = springs.length; j < l; j++) {
		springs[j].update();
	}
	path.smooth({ type: 'continuous' });
}

function onKeyDown(event) {
	if (event.key == 'space') {
		path.fullySelected = !path.fullySelected;
		path.fillColor = path.fullySelected ? null : 'black';
	}
}



