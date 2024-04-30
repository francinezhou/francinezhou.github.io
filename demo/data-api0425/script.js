
$.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=33.4&lon=-94.04&appid=d5edf94e431f5e5afc9ac2c34acc6841', function(data) {
    console.log(data.wind.deg);
    console.log(data);
    var degrees = data.wind.deg
    var gust = data.wind.gust
    var speed = data.wind.speed

    $(".degree-container").text(degrees);
});




// use this data to make a visualization of the wind 
// use the wind speed, atmospheric pressure (this will help us think about particles in the air), and wind direction as variables to inform your visualization
// you can use p5js or jquery to help you 

//In class exercise: We'll have a quick review at the end of class. 


