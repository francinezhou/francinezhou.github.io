jQuery(function($) {
    $('#img').mouseover(function() {
        var dWidth = $(document).width() - 100, // 100 = image width
            dHeight = $(document).height() - 100, // 100 = image height
            nextX = Math.floor(Math.random() * dWidth),
            nextY = Math.floor(Math.random() * dHeight);
        $(this).animate({ left: nextX + 'px', top: nextY + 'px' });
    });
});

// let image = document.getElementById("#img");

//  document.querySelector('#img').mouseover(function () {
//   let dWidth = document.querySelector(document).width() - 100, // 100 = image width
//             dHeight = document.querySelector(document).height() - 100, // 100 = image height
//             nextX = Math.floor(Math.random() * dWidth),
//             nextY = Math.floor(Math.random() * dHeight);
// function mouseOver() {
//   document.getElementById("demo").animate({ left: nextX + 'px', top: nextY + 'px' });
// }
