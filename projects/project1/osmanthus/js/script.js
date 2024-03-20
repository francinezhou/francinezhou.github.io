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


