fetch('fireworks.json')
    .then(response => response.json())
    .then(data => {
        // Access the div element
        const list = document.getElementById('list');
                
        // Loop through the data and add each item to the div
        data.forEach(item => {
        const div = document.createElement('div');
        const mediadiv = document.createElement('div');
        const img = document.createElement('img');
        const textdiv = document.createElement('div');
		const h3 = document.createElement('h3');
        const p = document.createElement('p');
        const a=document.createElement('a');
        
		// const vid = document.createElement('');

        // Set the text content and href attributes for the link
        h3.textContent = item.title;
		p.textContent = item.artist + '. ' + item.date + '. ' + item.location;
        img.src = "img/" + item.imageLink;
        a.href = item.mediaHref;
		// if imageLink 

        /* 
         * Onclick function
         * whenever a image is clicked
         * associated audio will be played
         */
        img.onclick = function() {
           
        }
        
        a.setAttribute("target", "_blank");

        // Add the HTML tags to webpage
        mediadiv.appendChild(a);
        a.appendChild(img);
	    textdiv.appendChild(h3);
        textdiv.appendChild(p);
        div.appendChild(mediadiv);
        div.appendChild(textdiv);
        list.appendChild(div);
       

        div.classList.add("cardOutline");
        textdiv.classList.add("textdiv");
        mediadiv.classList.add("mediadiv");
       
        });
    })
    .catch(error => console.error(error));



   