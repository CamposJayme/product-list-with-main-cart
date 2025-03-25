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

    cardContainer.appendChild(cardBody);
    cardContainer.appendChild(cardFooter);
    
    return cardContainer;

};

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
   
window.addEventListener('load', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const cardSection = document.getElementById('desserts-cards-section');
            data.forEach((productData, index) => {
                const card = createCardStructure();
                fillCardWithData(card, productData);
                cardSection.appendChild(card);
            });

            // Adicionar Item (+):
            const addItemToCartBtn = document.querySelectorAll('.dessert-card-add-cart');
            const cartIcon = document.querySelectorAll('.cart-icon');
            const cardPriceContent = document.querySelectorAll('.cart-content');
            let cartQuantities = new Array(data.length).fill(0);
            let clickQuantities = new Array(data.length).fill(0);

            addItemToCartBtn.forEach((btn, index) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (clickQuantities[index] == 0) {
                        addItemToCartBtn[index].style.backgroundColor = '#ae3131';
                        addItemToCartBtn[index].style.color = '#fff';
                        cartIcon[index].setAttribute('src', 'assets/images/icon-decrement-quantity.svg');

                        clickQuantities[index]++;
                        console.log('First click!');

                        const incrementItem = document.createElement('img');
                        incrementItem.classList.add('add-item');
                        incrementItem.setAttribute('src', 'assets/images/icon-increment-quantity.svg');

                        addItemToCartBtn[index].appendChild(incrementItem);
                        addItemToCartBtn[index].style.display = 'flex';    
                        addItemToCartBtn[index].style.justifyContent = 'space-between';    
                    }
                    cartQuantities[index]++;
                    cardPriceContent[index].textContent = cartQuantities[index];
                })
            })

        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
});   
