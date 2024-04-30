$.getJSON("pups.json", function(pup) {
    // console.log(pup[0].image)

var newhtml = ""

for (x=0; x<6; x++){
    console.log(`<img src=${pup[x].image}">`);
    newhtml = newhtml +`<img src="${pup[x].image}
    ">`
}

console.log(newhtml)
$(".pup-grid").html(newhtml)
$.each()



// first drill into data set
    // console.log(pup[1].image)

// then iterate through 
//  $.each(pup, function(i, dog) {
//        console.log(pup[i])
//     });


//then create html elements


    // let html = '';
    // $.each(pup, function(i, dog) {
    //     html += `<div class="container">
    //     <div class="image-container">
    //         <img src=${dog.image}>
    //     </div>
    //     <h2>${dog.name}</h2>
    //     <p>${dog.caption}</p>
    //     </div>`
    // });

    // $(".pup-grid").append(html);
});
