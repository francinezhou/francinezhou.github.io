$(document).ready(function() {
    var myHtml = ""

    for(x=0; x<10; x++){
        myHtml = myHtml + `<div class="card"><div class="front"><div class="back"></div>`

    }

    $('.card').click(function() {
        console.log('clicked')
        $(this).toggleClass('card-rotate')
        $(this).children().slideToggle()
        // $('.back').slideToggle()
    });

    console.log(myHtml)
    $(".container").html(myHtml)
  });

  