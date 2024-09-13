const PRODUCTS = [
    {id: 1, name: "Laptop", price: 999.99, desc: 'High performance laptop', category: "Electronics"},
    {id: 2, name: "Smartphone", price: 699.99, desc: 'Latest model smartphone', category: "Electronics"},
    {id: 3, name: "Headphones", price: 99.99, desc: 'Wireless headphones', category: "Electronics"},
    {id: 4, name: "T-shirt", price: 19.99, desc: 'Comfortable cotton t-shirt', category: "Clothing"},
    {id: 5, name: "Jeans", price: 49.99, desc: 'Stylish denim jeans', category: "Clothing"},
    {id: 6, name: "Backpack", price: 79.99, desc: 'Durable backpack', category: "Accessories"},
    {id: 7, name: "Watch", price: 149.99, desc: 'Fashionable wristwatch', category: "Accessories"},
    {id: 8, name: "Desk Lamp", price: 29.99, desc: 'LED desk lamp', category: "Home & Office"},
    {id: 9, name: "Coffee Mug", price: 9.99, desc: 'Ceramic coffee mug', category: "Home & Office"},
    {id: 10, name: "Notebook", price: 4.99, desc: 'Spiral notebook', category: "Home & Office"}
];

let cart = [];

// Initialize category list and product display
window.onload = function() {
    displayCategories();
    displayProducts(PRODUCTS);

    document.getElementById('txtSearch').addEventListener('input', searchProducts);
};

// Display categories on the sidebar
function displayCategories() {
    const categories = [...new Set(PRODUCTS.map(product => product.category))];
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = `<li class="list-group-item" onclick="filterProducts('All')">All Data</li>`;
    categories.forEach(category => {
        categoryList.innerHTML += `<li class="list-group-item" onclick="filterProducts('${category}')">${category}</li>`;
    });
}

// Filter products based on category
function filterProducts(category) {
    const filteredProducts = category === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
    displayProducts(filteredProducts);
}

// Display product cards
function displayProducts(products) {
    const productContainer = document.getElementById('dvProducts');
    productContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.desc}</p>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button class="btn btn-outline-secondary" onclick="decrementQuantity(${product.id})">-</button>
                                <span id="quantity-${product.id}" class="px-2">1</span>
                                <button class="btn btn-outline-secondary" onclick="incrementQuantity(${product.id})">+</button>
                            </div>
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });
}

// Increment product quantity
function incrementQuantity(productId) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityElement.innerText);
    quantityElement.innerText = quantity + 1;
}

// Decrement product quantity
function decrementQuantity(productId) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityElement.innerText);
    if (quantity > 1) {
        quantityElement.innerText = quantity - 1;
    }
}

// Add product to cart
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).innerText);
    const existingProduct = cart.find(item => item.product.id === productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }

    updateCart();
}

// Update cart modal content
function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    let totalAmount = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = 'No items in cart';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    ${item.product.name} - $${item.product.price.toFixed(2)} x ${item.quantity}
                    <button class="btn btn-outline-secondary btn-sm ms-2" onclick="decrementCartQuantity(${item.product.id})">-</button>
                    <span class="px-2">${item.quantity}</span>
                    <button class="btn btn-outline-secondary btn-sm" onclick="incrementCartQuantity(${item.product.id})">+</button>
                </div>
            </div>
        `).join('');

        // Calculate the total amount
        totalAmount = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        cartItemsContainer.innerHTML += `
            <hr>
            <div class="d-flex justify-content-between">
                <strong>Total Amount:</strong>
                <strong>$${totalAmount.toFixed(2)}</strong>
            </div>
        `;
    }
}


// Increment quantity in cart
function incrementCartQuantity(productId) {
    const existingProduct = cart.find(item => item.product.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
        updateCart();
    }
}

// Decrement quantity in cart
function decrementCartQuantity(productId) {
    const existingProduct = cart.find(item => item.product.id === productId);
    if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
        updateCart();
    }
}

// Search products based on input
function searchProducts() {
    const searchTerm = document.getElementById('txtSearch').value.toLowerCase();
    const filteredProducts = PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.desc.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

// Show cart modal
document.getElementById('btnShowCart').addEventListener('click', () => {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
});


  