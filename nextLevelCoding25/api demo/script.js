const body = document.body;
const myEl = document.getElementById("myEl");

// when you are representing data, diff kind of data if you don't have defined points. it's not where am i in a range, it's let's visualize the scale of the thing.
const options = {
    method: "GET",
    headers: {
        "x-rapidapi-key": "b6651d4235msh5c68ef0b9c7eaacp167691jsn563c4e6ce800",
        "x-rapidapi-host": "open-weather13.p.rapidapi.com",
    },
};


async function fetchData() {
    const url = "https://open-weather13.p.rapidapi.com/city/new york/EN";
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        const dataObject = JSON.parse(result);
        const currentTemp = dataObject.main.temp;
        const windSpeed = dataObject.wind.speed;
        const weatherDescription = dataObject.weather[0].description;

        console.log("currentTemp", currentTemp);
        console.log("windSpeed", windSpeed);
        console.log("dataObject", dataObject);


        const hue = map(currentTemp, -15, 106, 209, 360);
        const lightness = map(currentTemp, -15, 106, 92, 50);
        const skewAngle = map(windSpeed, 0, 113, 0, 89);
        myEl.style.transform = `translate(-50%, -50%) skew(89deg)`;
        myEl.innerHTML = weatherDescription;
        body.style.backgroundColor = `hsl(${hue}, 100%, ${lightness}%)`;

        // const body = document.body;
        // body.style.backgroundColor = red;
    } catch (error) {
        console.error(error);
    }
}

// Make sure to call the async function
fetchData();

function map(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}