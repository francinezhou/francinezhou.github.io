fetch('fireworks.json')
    .then(response => response.json())
    .then(data => {
        // Access the div element
        const list = document.getElementById('list');
                
        // Loop through the data and add each item to the div
        data.forEach(item => {
        const div = document.createElement('div');
		const h3 = document.createElement('h3');
        const p = document.createElement('p');
        const img = document.createElement('img');

        // Set the text content and href attributes for the link
        h3.textContent = item.title;
		p.textContent = item.artist + ' ' + item.date + ' ' + item.location;
        img.src = item.imageLink;

        /* 
         * Onclick function
         * whenever a image is clicked
         * associated audio will be played
         */
        img.onclick = function() {
           
        }
        
        // Add the HTML tags to webpage
        div.appendChild(img);
		div.appendChild(h3);
        div.appendChild(p);
        list.appendChild(div);
        });
    })
    .catch(error => console.error(error));