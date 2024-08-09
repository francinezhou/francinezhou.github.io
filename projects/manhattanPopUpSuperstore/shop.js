function limitImageDimensions(img, maxWidth, maxHeight) {
    const aspectRatio = img.width / img.height;
    if (img.width > maxWidth || img.height > maxHeight) {
        if (aspectRatio > 1) {
            img.width = maxWidth;
            img.height = maxWidth / aspectRatio;
        } else {
            img.height = maxHeight;
            img.width = maxHeight * aspectRatio;
        }
    }
}


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
        let inputBox = document.querySelector('#inputBox');
        let buttonClose = document.querySelector('#buttonClose');
        const cartIcon = document.getElementById("cartIcon");
        const cartDrop = document.querySelector(".cartDrop");
        

        cartIcon.addEventListener("click", function () {
            if (cartDrop.style.display === 'none' || cartDrop.style.display === '') {
                cartDrop.style.display = 'block';
            } else {
                cartDrop.style.display = 'none';
            }
        });


    function drag_start(event, imgElement) {
        event.dataTransfer.setData("text/plain", imgElement.src);
    }
    
    document.addEventListener('dragover', function (event) {
        event.preventDefault();
        return false;
    });
    
    document.addEventListener('drop', function (event) {
        var imgSrc = event.dataTransfer.getData("text/plain");
    
 document.addEventListener('drop', function (event) {
            var imgSrc = event.dataTransfer.getData("text/plain");

            if (imgSrc) {
                const droppedImg = document.createElement('img');
                droppedImg.src = imgSrc;

                // Limit image dimensions to be under 200px x 200px
                limitImageDimensions(droppedImg, 200, 200);

                droppedImg.setAttribute('draggable', 'true');

                droppedImg.addEventListener('dragstart', function (event) {
                    drag_start(event, droppedImg);
                });

                const droppedImgContainer = document.getElementById('droppedImg-container');

                if (droppedImgContainer && event.target === droppedImgContainer) {
                    droppedImg.style.position = 'fixed';
                    
                    droppedImg.style.left = (event.clientX - droppedImg.width / 2) + 'px';
                    droppedImg.style.top = (event.clientY - droppedImg.height / 2) + 'px';

                    droppedImgContainer.appendChild(droppedImg);

                    droppedImg.onclick = function () {
                        if (droppedImg.parentNode) {
                            droppedImg.parentNode.removeChild(droppedImg);
                        }
                    };
                }
            }

            event.preventDefault();
            return false;
        });
    
        event.preventDefault();
        return false;
    });



        // Initialize a counter for product numbering
        let productCount = 0;

        // Loop through the data and add each item to the div
        data.forEach(item => {
             // Increment the product count
             productCount++;

            // Create the main cardOutline div
            const cardOutline = document.createElement('div');
            cardOutline.classList.add('cardOutline');

            // Create the mediadiv div
            const mediadiv = document.createElement('div');
            mediadiv.classList.add('mediadiv');

            // Create the image element
            const img = document.createElement('img');
            img.src = "img/png/" + item.imageLink;

            // Make each img element draggable
            img.setAttribute('draggable', 'true');

            // Add a dragstart event listener to each img element
            img.addEventListener('dragstart', function (event) {
                drag_start(event, img);
            });

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

            // Create the productNumber div
            const productNumber = document.createElement('div');
            productNumber.classList.add('productNumber');
            productNumber.textContent = `(${productCount})`; // Add the product number

            const addCart = document.createElement('div');
                addCart.classList.add('addCart');
                addCart.textContent = "add to cart";
                addCart.style.color = 'grey';
                addCart.style.cursor = 'pointer';
                // Add the addCart div to the textdiv
                cardOutline.appendChild(addCart);

            // Append the elements to their respective parents
            mediadiv.appendChild(img);
            textdiv.appendChild(productName);
            textdiv.appendChild(zeroDollar);
            cardOutline.appendChild(productNumber);
            cardOutline.appendChild(mediadiv);
            cardOutline.appendChild(textdiv);

            // Add the cardOutline to the list
            list.appendChild(cardOutline);
            
            // Function to add an item to the cart
    function addItemToCart(item) {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cartItem');

        // Create the cartThumbnail div with the product image
        const cartThumbnail = document.createElement('div');
        cartThumbnail.classList.add('cartThumbnail');
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = 'img/png/' + item.imageLink; // Update the path to your images
        limitImageDimensions(thumbnailImg, 100, 100); // Limit image dimensions
        cartThumbnail.appendChild(thumbnailImg);

        // Create the cartProductName div with the product name
        const cartProductName = document.createElement('div');
        cartProductName.classList.add('cartProductName');
        cartProductName.textContent = item.item;

        // Create the cartZeroDollar div with the price placeholder
        const cartZeroDollar = document.createElement('div');
        cartZeroDollar.classList.add('cartZeroDollar');
        cartZeroDollar.textContent = '$0'; // You can update this with the actual price

        // Append the thumbnail, product name, and price elements to cartItem
        cartItem.appendChild(cartThumbnail);
        cartItem.appendChild(cartZeroDollar);
        cartItem.appendChild(cartProductName);
        

        // Append cartItem to cartDrop
        cartDrop.appendChild(cartItem);
    }

const addCartButtons = document.querySelectorAll('.addCart');

// First, remove any existing event listeners
addCartButtons.forEach((button) => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
});

// Then, attach the event listeners
document.querySelectorAll('.addCart').forEach((button, index) => {
    button.addEventListener('click', function () {
        const selectedItem = data[index];
        addItemToCart(selectedItem);
    });

    // Ensure the button is visible
    button.style.display = 'block';
    button.style.color = 'grey';
    button.style.cursor = 'pointer';
});

    
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

            inputBox .addEventListener("click", function show () {
                document.querySelector(".button-group").style.display = "flex";
             })
           
            buttonClose .addEventListener("click", function show () {
                document.querySelector(".button-group").style.display = "none";
             })

            // Add a click event to the productName to display availableMarketTime
            productName.addEventListener('click', function () {
                const availableMarketTimeDivs = document.querySelectorAll('.availableMarketTime');

                availableMarketTimeDivs.forEach(div => {
                    // Construct the time string in the desired format
                    const timeString = `${item.time}`;
                    div.innerHTML = timeString; // Use innerHTML to interpret HTML tags
                    div.style.display = 'block';
                });
            });

            cardOutline.addEventListener('mouseover', function () {
                addCart.style.display = 'block';
            });
            
            // Handle the mouseout event to hide the addCart div
            cardOutline.addEventListener('mouseout', function () {
                addCart.style.display = 'none';
            });
            
            addCart.addEventListener('click', function () {
                document.querySelector(".cartDot").style.opacity = '1';
                
            });
            

        });
    })
    .catch(error => console.error(error));

    
