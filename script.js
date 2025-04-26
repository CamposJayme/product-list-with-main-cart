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
    cardDecrementBtn.setAttribute('data-index', '0');
    cardDecrementBtn.classList.add('decrement-btn');

    const cardQuantity = document.createElement('span');
    cardQuantity.classList.add('quantity');
    cardQuantity.innerText = 1;

    const cardIncrementBtn = document.createElement('img');
    cardIncrementBtn.setAttribute('src', 'assets/images/icon-increment-quantity.svg');
    cardIncrementBtn.setAttribute('data-index', '0');
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
            // Execute the 'handleAddItemToCart' that validates the first click and change the elements
            handleItemsToCart(btn, index, addQuantityBtn, cardQuantity, cart, data);
        });
    });    
}

// This function basically the system's heart, from this function we can add, remove and control the cart:
function handleItemsToCart(btn, index, addQuantityBtn, cardQuantity, cart, data) {
    btn.style.display = 'none';
    addQuantityBtn[index].style.display = 'flex';

    cardQuantity[index].innerText = 1;
    const decrementBtn = document.querySelectorAll('.decrement-btn');
    const incrementBtn = document.querySelectorAll('.increment-btn');

    let quantity = 1;

    const cartTotalQuantity = cart.querySelector('h2 span');
    cartTotalQuantity.innerText++;

    if (cartTotalQuantity.innerText == 1) {
        document.querySelector('.aside-container img').style.display = 'none';
        document.querySelector('.aside-container p').style.display = 'none';        
        document.querySelector('.aside-total-order').style.display = 'flex';
        document.querySelector('.aside-total-order').style.justifyContent = 'space-between';
        document.querySelector('.cart-footer').style.display = 'flex';
        document.querySelector('.cart-footer').style.flexDirection = 'column';
    } 

    if (cardQuantity[index].innerText >= 1 || cartTotalQuantity.innerText >= 1) {
        addItemToCart(cart, index, cardQuantity, data, quantity);
        updateTotalPrice(data, cardQuantity, index, addQuantityBtn);
    } 
    
    // Here is where we can increment the item quantity by clicking the (+) button:
    incrementBtn.forEach((btn, i) => {
        btn.onclick = () => {
            if (parseInt(cardQuantity[i].innerText) === 0) {
                cardQuantity[i].innerText++;
                cartTotalQuantity.innerText++;
            } else {
                cardQuantity[i].innerText++;
                cartTotalQuantity.innerText++;
            }
    
            const cartItem = document.querySelector(`#cart-item-${i} span`);
            const cartItemTotalPrice = document.querySelector(`#cart-item-${i} span:last-child`);
            if (cartItem) {
                cartItem.innerHTML = `${cardQuantity[i].innerText}x`;
                cartItemTotalPrice.innerHTML = `${(data[i].price * cardQuantity[i].innerText).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`;
            }

            updateTotalPrice(data, cardQuantity, index, addQuantityBtn);
        };
    });
    
    // Here is where we can decrement the item quantity by clicking the (-) button:
    decrementBtn.forEach((btn, i) => {
        btn.onclick = () => {
            if (parseInt(cardQuantity[i].innerText) >= 1) {
                cardQuantity[i].innerText--;
                cartTotalQuantity.innerText--;
            }
    
            const cartItem = document.querySelector(`#cart-item-${i} span`);
            const cartItemTotalPrice = document.querySelector(`#cart-item-${i} span:last-child`);
            if (cartItem) {
                cartItem.innerHTML = `${cardQuantity[i].innerText}x`;
                cartItemTotalPrice.innerHTML = `${(data[i].price * cardQuantity[i].innerText).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`;
            }
    
            if (parseInt(cardQuantity[i].innerText) < 1) {
                addQuantityBtn[i].style.display = 'none';
                const mainBtn = document.querySelectorAll('.dessert-card-add-cart')[i];
                if (mainBtn) mainBtn.style.display = 'flex';
    
                const itemToRemove = cart.querySelector(`#cart-item-${i}`);
                if (itemToRemove) itemToRemove.remove();
            }

            if (parseInt(cartTotalQuantity.innerText) === 0) {
                document.querySelector('.aside-container').style.display = 'flex';
                document.querySelector('.aside-container').style.justifyContent = 'center';
                document.querySelector('.aside-container img').style.display = 'block';
                document.querySelector('.aside-container p').style.display = 'block';
                document.querySelector('.aside-total-order').style.display = 'none';
                document.querySelector('.cart-footer').style.display = 'none';
            }

            updateTotalPrice(data, cardQuantity, index, addQuantityBtn);

        };
    });
    
}

// This function will create the standard structure for each item inside the cart:
function addItemToCart(cart, index, cardQuantity, data, quantity) {
    const asideContainer = cart.querySelector('.aside-container');

    let existingItem = asideContainer.querySelector(`#cart-item-${index}`);
    if (!existingItem) {
        asideContainer.innerHTML += `<div id="cart-item-${index}" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 6px;">
                                        <div style="display: flex; align-items: center; justify-content: space-between;">
                                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                                <h4>${data[index].name}</h4>
                                                <p style="margin-top: 0px; display: flex; gap: 8px;">
                                                    <span>${quantity}x</span>
                                                    <span>@ ${data[index].price.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</span>
                                                    <span>${data[index].price.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</span>
                                                </p>
                                            </div>
                                            <span>
                                                <img class="remove-item" src="assets/images/icon-remove-item.svg" style="cursor: pointer; border: 1px solid #808080; border-radius: 50%; padding: 4px;"></img>
                                            </span>
                                        </div>
                                        <div style="background-color: gray; width: 100%; height: 1px;"></div>
                                     </div>`;
        asideContainer.style.display = 'block';
    } else {
        const spanQuantity = existingItem.querySelector('p span');
        spanQuantity.innerText = `${cardQuantity[index].innerText}x`;
    }
    
    if (parseInt(cardQuantity[index].innerText) < 1) {
        let itemToRemove = asideContainer.querySelector(`#cart-item-${index}`);
        if (itemToRemove) {
            itemToRemove.remove();
        }
    }
}

// Here is where the system update the total price and handles the quantity per item and total itens inside the cart:
function updateTotalPrice(data, cardQuantity, _index, addQuantityBtn) {
    let total = 0;    
    let totalItems = 0;
    const cartItems = document.querySelectorAll('[id^="cart-item-"]');
    const cartTotal = document.querySelector('.aside h2 span');
    
    cartItems.forEach(item => {
        const quantityText = item.querySelector('span').innerText;        
        const quantity = parseInt(quantityText);
        totalItems += quantity;
        const index = parseInt(item.id.replace('cart-item-', ''));
        const price = parseFloat(data[index].price);

        total += quantity * price;

        const removeItemBtn = item.querySelector('.remove-item');
        if (removeItemBtn) {
            removeItemBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const itemQuantity = parseInt(item.querySelector('span').innerText);
                totalItems -= itemQuantity;
                item.remove();
                cardQuantity[index].innerText = 0;
                if (parseInt(cardQuantity[index].innerText) < 1) {
                    addQuantityBtn[index].style.display = 'none';
                    const mainBtn = document.querySelectorAll('.dessert-card-add-cart')[index];
                    if (mainBtn) mainBtn.style.display = 'flex';
                }


                if (cartTotal) {
                    cartTotal.innerText = `${totalItems}`;
                }

                updateTotalPrice(data, cardQuantity, _index, addQuantityBtn);
            })
        }
    })

    const totalPriceElement = document.querySelector('.aside-total-order span');
    totalPriceElement.innerHTML = total.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const asideContainer = document.querySelector('.aside-container');
    const emptyCartImage = document.querySelector('.aside-container img');
    const emptyCartText = document.querySelector('.aside-container p');
    const totalOrderContainer = document.querySelector('.aside-total-order');
    const cartFooter = document.querySelector('.cart-footer');

    if (totalItems === 0) {
        asideContainer.style.display = 'flex';
        asideContainer.style.justifyContent = 'center';
        emptyCartImage.style.display = 'block';
        emptyCartText.style.display = 'block';
        totalOrderContainer.style.display = 'none';
        cartFooter.style.display = 'none';
    } else {
        emptyCartImage.style.display = 'none';
        emptyCartText.style.display = 'none';
        totalOrderContainer.style.display = 'flex';
        cartFooter.style.display = 'flex';
    }

}

document.getElementById('confirm-order-btn').addEventListener('click', (e, data) => {
    e.preventDefault();
    
    const modal = document.getElementById('modal-order-confirmed')
    modal.style.display = 'flex';    

    const modalContent = modal.querySelector('.modal');
    const oldOrderItems = modal.querySelectorAll('.order-item');
    oldOrderItems.forEach(item => item.remove());

    const cartItems = document.querySelectorAll('.aside-container [id^="cart-item-"]');
    const cartTotalPrice = document.querySelector('.aside .aside-total-order');

    cartItems.forEach(cartItem => {
        const itemName = cartItem.querySelector('h4').innerText;
        const quantityAndPriceSpans = cartItem.querySelectorAll('p span');
        const quantityText = quantityAndPriceSpans[0].innerText;
        const unitPriceText = quantityAndPriceSpans[1].innerText;
        const totalPriceText = quantityAndPriceSpans[2].innerText;
        
        const orderItemDiv = document.createElement('div');
        orderItemDiv.classList.add('order-item');
        orderItemDiv.innerHTML = `
            <img src="assets/images/image-tiramisu-thumbnail.jpg">
            <div>
                <span>${itemName}</span><br>
                ${quantityText} ${unitPriceText}
            </div>
            <div class="order-item-total">${totalPriceText}</div>
        `;

        modalContent.insertBefore(orderItemDiv, modalContent.querySelector('.button'));
        modalContent.insertBefore(cartTotalPrice, modalContent.querySelector('.button'));
    });
});

document.getElementById('modal-order-confirmed').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.modal-order-confirmed').style.display = 'none';
})

//Execute 'loadData' function:
window.addEventListener('load', loadData); 