// Function responsible for creating the standard structure of the card with the dessert (photo, description, price...)
const createCardStructure = () => {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('desserts-cards-container');

    const cardBody = document.createElement('div')
    cardBody.classList.add('desserts-card-body');

    const cardPicture = document.createElement('picture');
    const cardTablet = document.createElement('source');
    cardTablet.classList.add('dessert-card-tablet')
    cardTablet.setAttribute('media', '(min-width: 1001px) and (max-width: 1320px)');

    const cardMobile = document.createElement('source');
    cardMobile.classList.add('dessert-card-mobile');
    cardMobile.setAttribute('media', '(min-width: 320px) and (max-width: 649px)');

    const cardImg = document.createElement('img');
    cardImg.classList.add('dessert-card-image');

    cardPicture.appendChild(cardTablet);
    cardPicture.appendChild(cardMobile);
    cardPicture.appendChild(cardImg);

    const cardCartBtn = document.createElement('button');
    cardCartBtn.classList.add('dessert-card-add-cart');

    const cardCartImg = document.createElement('img');
    cardCartImg.setAttribute('src', 'assets/images/icon-add-to-cart.svg');
    cardCartImg.classList.add('cart-icon');

    const cardCartAddContent = document.createElement('span');
    cardCartAddContent.textContent = 'Add to Cart';
    cardCartAddContent.classList.add('cart-content');

    cardCartBtn.appendChild(cardCartImg);
    cardCartBtn.appendChild(cardCartAddContent);

    const cardBtnCountItems = document.createElement('button');
    cardBtnCountItems.classList.add('cart-quantity-control');

    const cardDecrementBtn = document.createElement('img');
    cardDecrementBtn.setAttribute('src', 'assets/images/icon-decrement-quantity.svg');
    cardDecrementBtn.classList.add('decrement-btn');

    const cardQuantity = document.createElement('span');
    cardQuantity.classList.add('quantity');
    cardQuantity.innerText = 1;

    const cardIncrementBtn = document.createElement('img');
    cardIncrementBtn.setAttribute('src', 'assets/images/icon-increment-quantity.svg');
    cardIncrementBtn.classList.add('increment-btn');

    cardBtnCountItems.appendChild(cardDecrementBtn);
    cardBtnCountItems.appendChild(cardQuantity);
    cardBtnCountItems.appendChild(cardIncrementBtn);

    const cardFooter = document.createElement('footer');
    cardFooter.classList.add('dessert-card-footer');

    const cardCategory = document.createElement('span');
    cardCategory.classList.add('dessert-category');

    const cardProductName = document.createElement('p');
    cardProductName.classList.add('dessert-product');

    const cardPrice = document.createElement('span');
    cardPrice.classList.add('dessert-price');

    cardFooter.appendChild(cardCategory);
    cardFooter.appendChild(cardProductName);
    cardFooter.appendChild(cardPrice);

    cardBody.appendChild(cardPicture);
    cardBody.appendChild(cardCartBtn);
    cardBody.appendChild(cardBtnCountItems);

    cardContainer.appendChild(cardBody);
    cardContainer.appendChild(cardFooter);
    
    // The 'return' of the container happens because it is the parent element of the card, meaning all the information is stored inside it.
    return cardContainer; 

};

// This function store the HTML elements and datas from JSON (it will be called ahead to fill each dessert card)
const fillCardWithData = (card, data) => {
    // Card image:
    const cardImage = card.querySelector('.dessert-card-image');
    const cardTablet = card.querySelector('.dessert-card-tablet');
    const cardMobile = card.querySelector('.dessert-card-mobile');
    
    // Card footer:
    const cardCategory = card.querySelector('.dessert-category');
    const cardProductName = card.querySelector('.dessert-product');
    const cardPrice = card.querySelector('.dessert-price');

    cardImage.src = data.image.desktop;
    cardTablet.srcset = data.image.tablet;
    cardMobile.srcset = data.image.mobile;

    cardCategory.textContent = data.category;
    cardProductName.textContent = data.name;
    cardPrice.textContent = data.price.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
};
   
// This function is considered 'the main one', it is responsible for JSON data file comunication and executing other functions 
// (E.g.: createCardStructure) as we can see ahead
function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const cardSection = document.getElementById('desserts-cards-section');
            data.forEach((productData) => {
                const card = createCardStructure(); // Execute 'createCardStructure' function, which means the card created in HTML through JS;
                fillCardWithData(card, productData); // Execute 'fillCardWithData' function, each card is filled with datas like imgs, price, category...
                cardSection.appendChild(card);
            });
            setupCartFunctions(data);
        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
}

// Selects cartBtn and the elements that will be changed when the first click happens in each cartBtn
function setupCartFunctions(data) {
    // console.log(data);
    const addItemToCartBtn = document.querySelectorAll('.dessert-card-add-cart');
    const addQuantityBtn = document.querySelectorAll('.cart-quantity-control');
    const cardQuantity = document.querySelectorAll('.quantity');
    const cart = document.querySelector('.aside');

    addItemToCartBtn.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // execute the 'handleAddItemToCart' that validates the first click and change the elements
            handleItemsToCart(btn, index, addQuantityBtn, cardQuantity, cart);
        });
    });    
}

function handleItemsToCart(btn, index, addQuantityBtn, cardQuantity, cart) {
    // console.log(btn, index, addQuantityBtn, cardQuantity);
    btn.style.display = 'none';
    addQuantityBtn[index].style.display = 'flex';

    const decrementBtn = document.querySelectorAll('.decrement-btn');
    const incrementBtn = document.querySelectorAll('.increment-btn');

    // console.log(cart);
    const cartTotalQuantity = cart.querySelector('h2 span');
    cartTotalQuantity.innerText++;
    
    incrementBtn[index].onclick = () => {
        cardQuantity[index].innerText++;
        cartTotalQuantity.innerText++;
    }

    decrementBtn[index].onclick = () => {
        cardQuantity[index].innerText--;
        cartTotalQuantity.innerText--;
        if (cardQuantity[index].innerText < 1) {
            addQuantityBtn[index].style.display = 'none';
            btn.style.display = 'flex';
            cardQuantity[index].innerText = 1;
        }
    }
}

//Execute 'loadData' function:
window.addEventListener('load', loadData); 