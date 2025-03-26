// MOON API
// const url = 'https://moon-api1.p.rapidapi.com/phase?date-time=2009-07-11-09-30-00&timezone=%2B3&angle-units=deg';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'x-rapidapi-key': 'f01b2ee287mshd6e9c6c6dc7813ep12a790jsnb756494ead87',
// 		'x-rapidapi-host': 'moon-api1.p.rapidapi.com'
// 	}
// };

//  step 1 use async
//  step 2 use dot text
// ( async () => {
//     try {
//         const response = await fetch(url, options);
//         const result = await response.text();
//         const dataObject = JSON.parse(result)
//         console.log(dataObject);
//     } catch (error) {
//         console.error(error);
//     }
// } )




const body = document.body;
const myEl = document.getElementById("myEl");

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '51c0316e31mshee4f7efa52e21a5p1bb922jsnffdf78609987',
		'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
	}
};


// wrap the `try` function in an asynchronous function. 

async function fetchData() {
    const url = 'https://open-weather13.p.rapidapi.com/city/new york/EN';
    try {
                const response = await fetch(url, options);
                const result = await response.text();
                const dataObject = JSON.parse(result);
                const currentTemp = dataObject.main.temp;
                const windSpeed = dataObject.wind.speed;
                console.log(dataObject);

        console.log("windSpeed", windSpeed); // range between 0, 113

        // STEP 1: Figure out the range of the number you have
        console.log("currentTemp", currentTemp);
        // range between -15, 106

        // STEP 2: Figure out the range of the number you want.

        // BOTTOM RANGE: hsl(209, 100%, 92%);
        // TOP RANGE: hsl(0, 100%, 50%);
        const hue = map(currentTemp, -15, 106, 209, 360);
        const lightness = map(currentTemp, -15, 106, 92, 50);

        body.style.backgroundColor = `hsl(${hue}%, 100%, ${lightness}%)`;


        const skewAngle = map(windSpeed, 0, 10, 0, 200)

        myEl.style.transform = `translate(-50%, -50%) skew(${skewAngle}deg)`;

            } catch (error) {
                console.error(error);
            }
}

// Make sure to call the async function
fetchData();


// async function fetchData() {
//     const url = 'https://open-weather13.p.rapidapi.com/city/london';
//     try {
// 		const response = await fetch(url, options);

// 		// make sure the response is not response.text(). 
// 		// That will not be a dyanmic object.
// 		const result = await response;

// 		// Here, you can do anything you want to the result. 
// 		// Go ahead and console log it, and we'll do something from there!
// 		console.log(result);
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// Make sure to call the async function
// fetchData();







function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}