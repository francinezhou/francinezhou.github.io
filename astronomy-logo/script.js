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
		'x-rapidapi-key': 'f01b2ee287mshd6e9c6c6dc7813ep12a790jsnb756494ead87',
		'x-rapidapi-host': 'moon-phase.p.rapidapi.com'
	}
};

async function fetchData() {
    const url = 'https://moon-phase.p.rapidapi.com/advanced?lat=51.4768&lon=-0.0004&date=2025-03-26';    // Format current date to YYYY-MM-DD
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toISOString().split('T')[0];
    
    // Construct the URL with London coordinates and dynamic date
    // const url = `https://moon-phase.p.rapidapi.com/advanced?lat=51.4768&lon=-0.0004&date=${formattedDate}`;
    
    try {
        const response = await fetch(url, options);
        const result = await response;
        
        console.log('Moon API Response:', result);
        
        // Get today's and yesterday's dates
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
      

        const todayFormatted = today.toISOString().split('T')[0];
        const yesterdayFormatted = yesterday.toISOString().split('T')[0];
        
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
        
         // STEP 2: Figure out the range of the number you want.


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

       
        console.log('Astronomical twilight begins:', astroTwilightBegin);
        console.log('Astronomical twilight ends:', astroTwilightEnd);



       
        
        // Console log the raw response first
        console.log('Moon API Response:', result);
        
        // Then we can parse the JSON later once we verify the response
        // const moonData = await response.json();
        // console.log('Moon Data:', moonData);

        return { 
            astroTwilightBegin, 
            astroTwilightEnd,
            darkestMoment,
            moonPhase: result 
        };
    } catch (error) {
        console.error('Moon API Error:', error);
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
