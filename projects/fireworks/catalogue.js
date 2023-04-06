fetch('fireworks.json')
    .then(response => response.json())
    .then(data => {
        // Access the div element
        const list = document.getElementById('list');
        const buttonAll = document.getElementById('all');
        const buttonLitho = document.getElementById('buttonLitho');
        const buttonIllust = document.getElementById('buttonIllust');
        const buttonOil = document.getElementById('buttonOil');
        const buttonWood = document.getElementById('buttonWood');
        const buttonPhoto = document.getElementById('buttonPhoto');
        const buttonEtching = document.getElementById('buttonEtching');
        const buttonPastel = document.getElementById('buttonPastel');
        const buttonAcrylic = document.getElementById('buttonAcrylic');
        const buttonPhysical = document.getElementById('buttonPhysical');
        const buttonDigital = document.getElementById('buttonDigital');
                
        // Loop through the data and add each item to the div
        data.forEach(item => {
        const cardOutline = document.createElement('div');
        const mediadiv = document.createElement('div');
        const img = document.createElement('img');
        const textdiv = document.createElement('div');
		const h3 = document.createElement('h3');
        const p = document.createElement('p');
        const a =document.createElement('a');
        const iframe = document.createElement("iframe");
       
		// const vid = document.createElement('');


        iframe.src = item.videoId;
        iframe.frameborder = 0;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
       

        // Set the text content and href attributes for the link
        h3.textContent = item.title;
		p.textContent = item.artist + '. ' + item.date + '. ' + item.location;
        img.src = "img/" + item.imageLink;
        a.href = item.mediaHref;
	

        function processcolors( data ){
            data.forEach( function(item, index){
              cardOutline.style.borderColor = item.color
            //   container.appendChild(cardOutline);   
            });
            }
        /* 
         * Onclick function
         * whenever a image is clicked
         * associated audio will be played
         */
        img.onclick = function() {
        }

        // Button to control filtering
        buttonAll.addEventListener('click', function(){
            div.style.display = "block";
        });

        buttonLitho.addEventListener('click', function(){
            if(item.medium == "Lithograph") {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        });

        buttonIllust.addEventListener('click', function(){
            if(item.medium == "Illustration") {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        });

        buttonOil.addEventListener('click', function(){
            if(item.medium == "Oil Painting") {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        });

        buttonWood.addEventListener('click', function(){
            if(item.medium == "Woodblock Print") {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        });

        buttonPhoto.addEventListener('click', function(){
            if(item.medium == "Photograph") {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        });

        buttonEtching.addEventListener('click', function(){
            if(item.medium == "Etching") {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        });

        buttonPastel.addEventListener('click', function(){
            if(item.medium == "Pastel") {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        });

        buttonAcrylic.addEventListener('click', function(){
            if(item.medium == "Acrylic") {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        });

        buttonPhysical.addEventListener('click', function(){
            if(item.medium == "Physical") {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        });

        buttonDigital.addEventListener('click', function(){
            if(item.medium == "Digital") {
            div.style.display = "block";
            } else {
            div.style.display = "none";
            }
        });

        a.setAttribute("target", "_blank");

        // Add the HTML tags to webpage
        mediadiv.appendChild(a);
        mediadiv.appendChild(iframe);
        a.appendChild(img);
	    textdiv.appendChild(h3);
        textdiv.appendChild(p);
        cardOutline.appendChild(mediadiv);
        cardOutline.appendChild(textdiv);
        list.appendChild(cardOutline);
       
        if(item.imageLink == "") {
            iframe.style.display = "display";
            a.style.display = "none";
            } else {
            iframe.style.display = "none";
            }

        cardOutline.classList.add("cardOutline");
        textdiv.classList.add("textdiv");
        mediadiv.classList.add("mediadiv");


        
       
        });
    })
    .catch(error => console.error(error));



   