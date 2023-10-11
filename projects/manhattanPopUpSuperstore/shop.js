fetch('products.json')
    .then(response => response.json())
    .then(data => {
        // Access the div element
        const list = document.getElementById('list');
        const buttonAll = document.getElementById('all');
        const buttonFurniture = document.getElementById('buttonFurniture');
        const buttonKitchen = document.getElementById('buttonKitchen');
        const buttonAppliances = document.getElementById('buttonAppliances');
        const buttonStorage = document.getElementById('buttonStorage');
        const buttonBeds = document.getElementById('buttonBeds');
        const buttonTextiles = document.getElementById('buttonTextiles');
        const buttonCleaning = document.getElementById('buttonCleaning');
        const buttonHomeDecor = document.getElementById('buttonHomeDecor');
        const buttonOfficeSupplies = document.getElementById('buttonOfficeSupplies');
        const buttonRecreation = document.getElementById('buttonRecreation');
        const buttonOutdoorLiving = document.getElementById('buttonOutdoorLiving');
        const buttonTravel = document.getElementById('buttonTravel');
                
        // Loop through the data and add each item to the div
        // Loop through the data and add each item to the div
        data.forEach(item => {
            // Create the main cardOutline div
            const cardOutline = document.createElement('div');
            cardOutline.classList.add('cardOutline');

            // Create the mediadiv div
            const mediadiv = document.createElement('div');
            mediadiv.classList.add('mediadiv');

            // Create the image element
            const img = document.createElement('img');
            img.src = "img/png/" + item.imageLink;

            // Create the textdiv div
            const textdiv = document.createElement('div');
            textdiv.classList.add('textdiv');

            // Create the product name paragraph
            const productName = document.createElement('p');
            productName.classList.add('productName');
            productName.textContent = item.item;

            // Create the zeroDollar paragraph
            const zeroDollar = document.createElement('p');
            zeroDollar.classList.add('zeroDollar');
            zeroDollar.textContent = "$0";

            // Append the elements to their respective parents
            mediadiv.appendChild(img);
            textdiv.appendChild(productName);
            textdiv.appendChild(zeroDollar);
            cardOutline.appendChild(mediadiv);
            cardOutline.appendChild(textdiv);

            // Add the cardOutline to the list
            list.appendChild(cardOutline);

            
            /* 
             * Onclick function
             * whenever an image is clicked
             * associated audio will be played
             */
            img.onclick = function() {
            }

            // Button to control filtering
            buttonAll.addEventListener('click', function(){
                cardOutline.style.display = "block";
            });

            buttonFurniture.addEventListener('click', function(){
                if(item.category === "Furniture") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonKitchen.addEventListener('click', function(){
                if(item.category === "Kitchen") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonAppliances.addEventListener('click', function () {
                if (item.category === "Appliances") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonStorage.addEventListener('click', function () {
                if (item.category === "Storage & organization") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonBeds.addEventListener('click', function () {
                if (item.category === "Beds & mattresses") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonTextiles.addEventListener('click', function () {
                if (item.category === "Textiles") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonCleaning.addEventListener('click', function () {
                if (item.category === "Cleaning") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonHomeDecor.addEventListener('click', function () {
                if (item.category === "Home décor") { // Note the accent on 'e'
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonOfficeSupplies.addEventListener('click', function () {
                if (item.category === "Office supplies") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonRecreation.addEventListener('click', function () {
                if (item.category === "Recreation & sport") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonOutdoorLiving.addEventListener('click', function () {
                if (item.category === "Outdoor living & garden") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

            buttonTravel.addEventListener('click', function () {
                if (item.category === "Travel") {
                    cardOutline.style.display = "block";
                } else {
                    cardOutline.style.display = "none";
                }
            });

           

            
        });
    })
    .catch(error => console.error(error));