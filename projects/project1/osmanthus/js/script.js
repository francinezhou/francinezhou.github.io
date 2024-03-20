// Function to scroll to the bottom
function scrollBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

// Function to check viewport width
function checkViewportWidth() {
    return window.innerWidth > 800; // Checks if viewport width is above 800px
}

// Add an event listener for DOMContentLoaded to trigger the scroll only if viewport width is above 800px
function handleDOMContentLoaded(event) {
    event.preventDefault(); // Prevent default browser behavior
    if (checkViewportWidth()) {
        setTimeout(scrollBottom, 100); // Debounce the scroll action
    }
}

// Add event listener for DOMContentLoaded
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", handleDOMContentLoaded, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", handleDOMContentLoaded);
}



$(document).ready(function () {
  // Toggle display manually on .jarCap click
  $(".jarCap").click(function() {
    $("#particles-js").toggleClass('show');
      console.log('clicked')
      $(this).toggleClass('cap-open');
  });
});


// drag drop

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
	event.target.classList.add('drop-active');
},
ondragenter: function (event) {
	var draggableElement = event.relatedTarget;
	var dropzoneElement = event.target;

	// feedback the possibility of a drop
	dropzoneElement.classList.add('drop-target');
	draggableElement.classList.add('can-drop');
},
ondragleave: function (event) {
	// remove the drop feedback style
	event.target.classList.remove('drop-target');
	event.relatedTarget.classList.remove('can-drop');
},
ondrop: function (event) {
	// Add bodyColored class to body
	document.body.classList.add('bodyColored');
},
ondropdeactivate: function (event) {
	// remove active dropzone feedback
	event.target.classList.remove('drop-active');
	event.target.classList.remove('drop-target');
}
});

function dragMoveListener(event) {
var target = event.target;
// keep the dragged position in the data-x/data-y attributes
var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

// translate the element
target.style.webkitTransform =
	target.style.transform =
	'translate(' + x + 'px, ' + y + 'px)';

// update the position attributes
target.setAttribute('data-x', x);
target.setAttribute('data-y', y);
}