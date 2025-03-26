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
    try {
        // Get today's and yesterday's dates
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Moon phase fetching (moved to front)
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', '-');
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const moonUrl = `https://moon-api1.p.rapidapi.com/phase?date-time=${currentDate}&timezone=${timezone}&angle-units=deg`;
        const moonOptions = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'f01b2ee287mshd6e9c6c6dc7813ep12a790jsnb756494ead87',
                'x-rapidapi-host': 'moon-api1.p.rapidapi.com'
            }
        };

        const moonResponse = await fetch(moonUrl, moonOptions);
        const moonResult = await moonResponse.json();
        const phase = moonResult.phase;
        
        // Add console logs for moon data
        console.log('Moon Data:', moonResult);
        console.log('Moon Phase:', phase);
        
        // Update logo opacity based on moon phase
        const logoElement = document.querySelector('.logo');
        logoElement.style.color = `rgba(0, 0, 0, ${phase})`;

        // Rest of the existing code...
        const todayFormatted = today.toISOString().split('T')[0];
        const yesterdayFormatted = yesterday.toISOString().split('T')[0];
        
        // Weather API call
        const weatherUrl = 'https://open-weather13.p.rapidapi.com/city/new york/EN';
        const weatherResponse = await fetch(weatherUrl, options);
        const weatherResult = await weatherResponse.text();
        const weatherData = JSON.parse(weatherResult);
        const currentTemp = weatherData.main.temp;
        const windSpeed = weatherData.wind.speed;
        
        // Sun data API calls - separate calls for today and yesterday
        const todaySunResponse = await fetch(`https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400&date=${todayFormatted}`);
        const todaySunData = await todaySunResponse.json();
        const yesterdaySunResponse = await fetch(`https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400&date=${yesterdayFormatted}`);
        const yesterdaySunData = await yesterdaySunResponse.json();
        
        const astroTwilightBegin = todaySunData.results.astronomical_twilight_begin;
        const astroTwilightEnd = yesterdaySunData.results.astronomical_twilight_end;
        
        // Parse the time strings and create full Date objects (using existing today/yesterday)
        const [beginTime, beginAmPm] = astroTwilightBegin.split(' ');
        const [beginHours, beginMinutes, beginSeconds] = beginTime.split(':');
        const twilightBeginDate = new Date(today);
        twilightBeginDate.setHours(
            beginAmPm === 'PM' ? parseInt(beginHours) + 12 : parseInt(beginHours),
            parseInt(beginMinutes),
            parseInt(beginSeconds)
        );

        const [endTime, endAmPm] = astroTwilightEnd.split(' ');
        const [endHours, endMinutes, endSeconds] = endTime.split(':');
        const twilightEndDate = new Date(yesterday);
        twilightEndDate.setHours(
            endAmPm === 'PM' ? parseInt(endHours) + 12 : parseInt(endHours),
            parseInt(endMinutes),
            parseInt(endSeconds)
        );

        // Calculate the midpoint (darkest moment)
        const darkestMoment = new Date((twilightEndDate.getTime() + twilightBeginDate.getTime()) / 2);
        
        // Get current time
        const now = new Date();
        
        // Calculate time difference in hours (absolute value)
        const timeDiff = Math.abs(now.getTime() - darkestMoment.getTime()) / (1000 * 60 * 60);
        
        // Map the time difference to slant angle
        // When closer to darkest moment (timeDiff = 0) -> more slanted (45)
        // When further from darkest moment (timeDiff = 12) -> less slanted (0)
        const slantAngle = map(timeDiff, 0, 12, 45, 0);
        
        // Target all relevant letters
        const a1 = document.querySelector(".a1");
        const s2 = document.querySelector(".s2");
        const t3 = document.querySelector(".t3");
        const r4 = document.querySelector(".r4");
        const n6 = document.querySelector(".n6");
        const o7 = document.querySelector(".o7");
        const m8 = document.querySelector(".m8");
        const y9 = document.querySelector(".y9");
        
        // Linear progression from 0 to slantAngle over 4 steps
        const step = slantAngle / 4;
        
        // Positive progression for right side (n6 to y9)
        const n6Slant = step * 1;  // 25% of the way
        const o7Slant = step * 2;  // 50% of the way
        const m8Slant = step * 3;  // 75% of the way
        const y9Slant = slantAngle; // 100%
        
        // Negative progression for left side (a1 to r4)
        const a1Slant = -slantAngle;  // -100%
        const s2Slant = -m8Slant;  // -75%
        const t3Slant = -o7Slant;  // -50%
        const r4Slant = -n6Slant;  // -25%
        
        // Apply the calculated values
        a1.style.fontVariationSettings = `"wght" 500, "slnt" ${a1Slant}`;
        s2.style.fontVariationSettings = `"wght" 500, "slnt" ${s2Slant}`;
        t3.style.fontVariationSettings = `"wght" 500, "slnt" ${t3Slant}`;
        r4.style.fontVariationSettings = `"wght" 500, "slnt" ${r4Slant}`;
        n6.style.fontVariationSettings = `"wght" 500, "slnt" ${n6Slant}`;
        o7.style.fontVariationSettings = `"wght" 500, "slnt" ${o7Slant}`;
        m8.style.fontVariationSettings = `"wght" 500, "slnt" ${m8Slant}`;
        y9.style.fontVariationSettings = `"wght" 500, "slnt" ${y9Slant}`;
        
        console.log("Time difference (hours):", timeDiff);
        console.log("End slantAngle:", slantAngle);
        console.log("Progression:", {
            a1: a1Slant, 
            s2: s2Slant, 
            t3: t3Slant, 
            r4: r4Slant,
            n6: n6Slant, 
            o7: o7Slant, 
            m8: m8Slant, 
            y9: y9Slant
        });

        console.log(weatherData);
        console.log('Astronomical twilight begins:', astroTwilightBegin);
        console.log('Astronomical twilight ends:', astroTwilightEnd);

        console.log("windSpeed", windSpeed); // range between 0, 113
        console.log("currentTemp", currentTemp);

        // STEP 2: Figure out the range of the number you want.
        const hue = map(currentTemp, -15, 106, 209, 360);
        const lightness = map(currentTemp, -15, 106, 92, 50);

        body.style.backgroundColor = `hsl(${hue}%, 100%, ${lightness}%)`;

        // const slantAngle = map(windSpeed, 0, 10, 0, 5)
        // myEl.style.fontVariationSettings = `"wght" 500, "slnt" ${slantAngle}`;
        // console.log("slantAngle", slantAngle);

        return { 
            weather: weatherData, 
            astroTwilightBegin, 
            astroTwilightEnd,
            darkestMoment,
            moonPhase: phase 
        };
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

async function updateMoonPhase() {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', '-');
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const url = `https://moon-api1.p.rapidapi.com/phase?date-time=${currentDate}&timezone=${timezone}&angle-units=deg`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'f01b2ee287mshd6e9c6c6dc7813ep12a790jsnb756494ead87',
            'x-rapidapi-host': 'moon-api1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        // Assuming the API returns phase as a value between 0 and 1
        // If not, you'll need to normalize the value
        const phase = result.phase;
        
        // Update logo opacity based on moon phase
        const logoElement = document.querySelector('.logo');
        logoElement.style.color = `rgba(0, 0, 0, ${phase})`;
        
    } catch (error) {
        console.error('Error fetching moon phase:', error);
    }
}

// Update immediately when page loads
updateMoonPhase();

// Update every hour
setInterval(updateMoonPhase, 3600000);
