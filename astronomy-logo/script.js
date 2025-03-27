const body = document.body;
const myEl = document.querySelectorAll(".myEl"); 

const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'f01b2ee287mshd6e9c6c6dc7813ep12a790jsnb756494ead87',
		'x-rapidapi-host': 'moon-phase.p.rapidapi.com'
	}
};

async function fetchData() {

    try {
        const url = 'https://moon-phase.p.rapidapi.com/advanced';
        
        // Debug: Check if we can find the element
        const logoElement = document.querySelector('.myEl');
        console.log('Found element:', logoElement);  // This will help us see if the element exists
        
        if (!logoElement) {
            throw new Error('Could not find element with class "myEl"');
        }
        
        const response = await fetch(url, options);
        const result = await response.json();
        
        console.log('Raw API Response:', result);
        
        if (!result || !result.moon) {
            throw new Error('Invalid API response structure');
        }
        
        // Get current time
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

        // Convert API sunrise and sunset times to minutes
        const twilightBegin = result.sun.sunrise_timestamp.split(':');
        const twilightEnd = result.sun.sunset_timestamp.split(':');
        const twilightBeginMinutes = parseInt(twilightBegin[0]) * 60 + parseInt(twilightBegin[1]);
        const twilightEndMinutes = parseInt(twilightEnd[0]) * 60 + parseInt(twilightEnd[1]);

        // Check if current time is between twilight begin and end
        if (currentTime >= twilightBeginMinutes && currentTime <= twilightEndMinutes) {
            // It's daytime
            document.body.style.backgroundColor = 'white';
            logoElement.style.background = 'linear-gradient(#000000, #000000)';
            document.querySelector('.rMark').style.color = 'black';
        }
        
        const illuminationStr = result.moon.illumination;
        const illumination = parseInt(illuminationStr) / 100;
        
        if (isNaN(illumination)) {
            throw new Error('Invalid illumination value');
        }
        
        // Update logo opacity
        logoElement.style.color = `rgba(0, 0, 0, ${illumination})`;
        
        console.log('Moon Illumination:', illumination);
        console.log('Moon Phase Name:', result.moon.phase_name);
        console.log('Moon Emoji:', result.moon.emoji);
        
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
        const n6Slant = step * 1 *-1;  // 25% of the way
        const o7Slant = step * 2 *-1;  // 50% of the way
        const m8Slant = step * 3 *-1;  // 75% of the way
        const y9Slant = slantAngle *-1; // 100%
        
        // Negative progression for left side (a1 to r4)
        const a1Slant = slantAngle ;  // -100%
        const s2Slant = m8Slant *-1;  // -75%
        const t3Slant = o7Slant *-1;  // -50%
        const r4Slant =  n6Slant *-1;  // -25%
        
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
