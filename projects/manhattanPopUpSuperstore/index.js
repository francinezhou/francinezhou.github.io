

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

