
let b1 = document.querySelector('.b1');
let b2 = document.querySelector('.b2');
let c1 = document.querySelector('.c1');
let d1 = document.querySelector('.d1');


b2.addEventListener('mouseover', () => {
    b1.style.backgroundColor = '#C6C6C6';
    c1.style.color = 'white';
});

b2.addEventListener('mouseout', () => {
    b1.style.backgroundColor = '';
    c1.style.color = '';
});

d1.addEventListener('mouseover', () => {
    b1.style.backgroundColor = '#C6C6C6';
    b2.style.backgroundColor = '#C6C6C6';
    c1.style.background = 'linear-gradient(180deg, #C6C6C6 0%, #FFF 100%)';
    c1.style.color = 'white';
});

d1.addEventListener('mouseout', () => {
    b1.style.backgroundColor = '';
    b2.style.backgroundColor = '';
    c1.style.background = '';
    c1.style.color = '';
});


function updateTime() {
    const d2Element = document.getElementById('d2');
    const now = new Date();

    const dateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Use 24-hour format
    };

    const dateFormat = new Intl.DateTimeFormat('en-US', dateOptions);
    const timeFormat = new Intl.DateTimeFormat('en-US', timeOptions);

    const dateStr = dateFormat.format(now);
    let timeStr = timeFormat.format(now);

    // Convert 24:00 to 00:00
    if (timeStr.startsWith('24:')) {
        timeStr = '00' + timeStr.slice(2);
    }

    d2Element.querySelector('h4').innerHTML = `${dateStr}<br>${timeStr}`;
}

// Update the time initially
updateTime();

// Update the time every second (1000 milliseconds)
setInterval(updateTime, 1000);

function handleKeyPress(event) {
    if (event.key === "Enter") {
        const inputBox = document.getElementById('inputBox');
        const searchText = inputBox.value.trim(); // Get the text from the input box and remove leading/trailing spaces

        if (searchText) {
            // If the input is not empty, navigate to shop.html with the search text as a query parameter
            window.location.href = `shop.html?search=${encodeURIComponent(searchText)}`;
        } else {
            // If the input is empty, just navigate to shop.html
            window.location.href = 'shop.html';
        }
    }
}

