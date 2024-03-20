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
	// Function to smoothly transition between gradients
	function toggleGradients() {
		$('.bgGradientOld').css('opacity', 0); // Fade out old gradient
		$('.bgGradientNew').css('opacity', 1); // Fade in new gradient
	  }
	
  
	// Toggle display manually on .jarCap click
	$(".jarCap").click(function() {
	  $("#particles-js").toggleClass('show');
	  console.log('clicked');
	  $(this).toggleClass('cap-open');
	});
  
	// Drag drop
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
		listeners: { move: dragMoveListener }
	  });
  
	// Enable dropzone
	interact('.jarGlass').dropzone({
	  accept: '.drag-drop',
	  overlap: 0.75,
	  ondrop: function(event) {
		// Call function to toggle gradients
		toggleGradients();
	  }
	});
  });
  
  function dragMoveListener(event) {
	var target = event.target;
	var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
	var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  
	target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
  }
  