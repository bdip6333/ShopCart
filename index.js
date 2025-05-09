// Available colors and sizes for products
const availableColors = ["red", "blue", "green", "black", "white"];
const availableSizes = ["S", "M", "L", "XL"];

// Elements
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.querySelectorAll('.filter');
const colorFilters = document.querySelectorAll('input[name="color"]');
const sizeFilters = document.querySelectorAll('input[name="size"]');
const priceFilters = document.querySelectorAll('input[name="prange"]');
const ratingFilter = document.getElementById('ratingFilter');
const currentRating = document.getElementById('currentRating');
const cartModal = document.getElementById('cartModal');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartLink = document.getElementById('cartLink');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeModal = document.querySelector('.close');

// Global variables
let products = [];
let filteredProducts = [];
let currentCategory = 'all';
let cart = [];

// Initialize the application
function init() {
    loadProducts();
    setupEventListeners();
    setupUserInterface();
    loadCart();
}

// Set up user interface based on login status
function setupUserInterface() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const loginLink = document.getElementById("loginLink");
    const userMenu = document.getElementById("userMenu");
    const userName = document.getElementById("userName");
  
    if (currentUser) {
        // User is logged in
        if (loginLink) loginLink.style.display = "none";
        if (userMenu) {
            userMenu.style.display = "inline-block";
            if (userName) userName.textContent = `Welcome, ${currentUser.firstname}`;
        }
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = "inline-block";
        if (userMenu) userMenu.style.display = "none";
    }
  
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            cart = [];                           // <-- NEW LINE: Empty the cart array
            localStorage.removeItem('cart');     // <-- NEW LINE: Remove cart from localStorage
            updateCartCount();                   // <-- NEW LINE: Update the cart count to zero
            window.location.href = "index.html"; // redirect to home after logout
        });
    }
    // if (logoutLink) {
    //     logoutLink.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         localStorage.removeItem('userToken');
    //         localStorage.removeItem('userName');
    //         alert('You have been logged out');
    //         updateAuthUI();
    //     });
    // }
    // if (logoutBtn) {
    //     logoutBtn.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         // Clear authentication data
    //         localStorage.removeItem('userToken');
    //         localStorage.removeItem('userName');
            
    //         // Clear cart data when user logs out
    //         cart = [];                           // <-- NEW LINE: Empty the cart array
    //         localStorage.removeItem('cart');     // <-- NEW LINE: Remove cart from localStorage
    //         updateCartCount();                   // <-- NEW LINE: Update the cart count to zero
            
    //         alert('You have been logged out');
    //         updateAuthUI();
    //     });
    // }
}

// Load products from localStorage or API
async function loadProducts() {
    if (localStorage.getItem("products")) {
        products = JSON.parse(localStorage.getItem("products"));
        filteredProducts = [...products];
        displayProducts();
    } else {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            const data = await response.json();
            
            // Add random colors and sizes to each product
            products = data.map(item => {
                return {
                    ...item,
                    colors: generateRandomSubset(availableColors),
                    sizes: generateRandomSubset(availableSizes)
                };
            });
            
            localStorage.setItem("products", JSON.stringify(products));
            filteredProducts = [...products];
            displayProducts();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }
}

// Generate a random subset of an array
function generateRandomSubset(array) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    // Return 1 to array.length elements
    return shuffled.slice(0, Math.max(1, Math.floor(Math.random() * array.length)));
}

// Set up event listeners
function setupEventListeners() {
    // Category filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            currentCategory = filter.dataset.category;
            applyFilters();
        });
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        applyFilters();
    });

    // Color filters
    colorFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            applyFilters();
        });
    });

    // Size filters
    sizeFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            applyFilters();
        });
    });

    // Price range filters
    priceFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            applyFilters();
        });
    });

    // Rating filter
    ratingFilter.addEventListener('input', () => {
        currentRating.textContent = `${ratingFilter.value}+`;
        applyFilters();
    });

    // Cart modal
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Check if user is logged in before showing cart
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            redirectToLogin();
            return;
        }
        
        displayCart();
        cartModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            redirectToLogin();
            return;
        }
        
        if (cart.length > 0) {
            window.location.href = "./razorpay/index.html";
            cart = [];
            saveCart();
            displayCart();
            updateCartCount();
            cartModal.style.display = 'none';
        } else {
            alert('Your cart is empty.');
        }
    });
}

// Apply all filters and display filtered products
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedColors = Array.from(colorFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);
    
    const selectedSizes = Array.from(sizeFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);
    
    const selectedPriceRanges = Array.from(priceFilters)
        .filter(filter => filter.checked)
        .map(filter => filter.value);
    
    const minRating = parseFloat(ratingFilter.value);

    filteredProducts = products.filter(product => {
        // Filter by category
        if (currentCategory !== 'all' && product.category !== currentCategory) {
            return false;
        }

        // Filter by search term
        if (searchTerm && !product.title.toLowerCase().includes(searchTerm) && 
            !product.description.toLowerCase().includes(searchTerm)) {
            return false;
        }

        // Filter by color
        if (selectedColors.length > 0 && 
            !product.colors.some(color => selectedColors.includes(color))) {
            return false;
        }

        // Filter by size
        if (selectedSizes.length > 0 && 
            !product.sizes.some(size => selectedSizes.includes(size))) {
            return false;
        }

        // Filter by price range
        if (selectedPriceRanges.length > 0) {
            const price = product.price;
            const inPriceRange = selectedPriceRanges.some(range => {
                if (range === '0-25') return price >= 0 && price <= 25;
                if (range === '25-50') return price > 25 && price <= 50;
                if (range === '50-100') return price > 50 && price <= 100;
                if (range === '100+') return price > 100;
                return false;
            });
            if (!inPriceRange) return false;
        }

        // Filter by rating
        if (product.rating.rate < minRating) {
            return false;
        }

        return true;
    });

    displayProducts();
}

// Display products in the container
function displayProducts() {
    productsContainer.innerHTML = '';

    // Group products by category
    const categories = ['men\'s clothing', 'women\'s clothing', 'jewelery', 'electronics'];
    
    categories.forEach(category => {
        const categoryProducts = filteredProducts.filter(product => product.category === category);
        
        if (categoryProducts.length > 0) {
            const section = document.createElement('section');
            
            const title = document.createElement('title');
            title.textContent = getCategoryDisplayName(category);
            section.appendChild(title);
            
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'items';
            
            categoryProducts.forEach(product => {
                const item = createProductCard(product);
                itemsContainer.appendChild(item);
            });
            
            section.appendChild(itemsContainer);
            productsContainer.appendChild(section);
        }
    });

    // If no products match filters, show message
    if (filteredProducts.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No products match your filters.';
        productsContainer.appendChild(noResults);
    }
}

// Create a product card
function createProductCard(product) {
    const item = document.createElement('div');
    item.className = 'item';
    
    // Create product image
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.title;
    item.appendChild(img);
    
    // Create product info
    const info = document.createElement('div');
    info.className = 'info';
    
    // Price and size row
    const priceRow = document.createElement('div');
    priceRow.className = 'row';
    
    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = `$${product.price.toFixed(2)}`;
    priceRow.appendChild(price);
    
    const sized = document.createElement('div');
    sized.className = 'sized';
    sized.textContent = product.sizes.join(',');
    priceRow.appendChild(sized);
    
    info.appendChild(priceRow);
    
    // Colors
    const colors = document.createElement('div');
    colors.className = 'colors';
    colors.textContent = 'Colors:';
    
    const colorRow = document.createElement('div');
    colorRow.className = 'row';
    
    product.colors.forEach(color => {
        const circle = document.createElement('div');
        circle.className = 'circle';
        circle.style.backgroundColor = color;
        colorRow.appendChild(circle);
    });
    
    colors.appendChild(colorRow);
    info.appendChild(colors);
    
    // Rating
    const ratingRow = document.createElement('div');
    ratingRow.className = 'row';
    ratingRow.textContent = `Rating: ${product.rating.rate} (${product.rating.count} reviews)`;
    info.appendChild(ratingRow);
    
    // Title (truncated)
    const titleElem = document.createElement('div');
    titleElem.className = 'product-title';
    titleElem.textContent = product.title.length > 50 ? 
        product.title.substring(0, 50) + '...' : product.title;
    info.appendChild(titleElem);
    
    item.appendChild(info);
    
    // Add to cart button
    const addBtn = document.createElement('button');
    addBtn.id = 'addBtn';
    addBtn.textContent = 'Add to Cart';
    
    // Check if user is logged in and style the button accordingly
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        addBtn.classList.add('login-required');
    }
    
    addBtn.addEventListener('click', () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            redirectToLogin();
            return;
        }
        addToCart(product);
    });
    
    item.appendChild(addBtn);
    
    return item;
}

// Redirect to login page
function redirectToLogin() {
    // Store the current URL to redirect back after login
    localStorage.setItem('redirectAfterLogin', window.location.href);
    window.location.href = './signup/login.html';
}

// Get display name for category
function getCategoryDisplayName(category) {
    switch(category) {
        case 'men\'s clothing':
            return 'Men\'s Clothing';
        case 'women\'s clothing':
            return 'Women\'s Clothing';
        case 'jewelery':
            return 'Jewellery';
        case 'electronics':
            return 'Electronics';
        default:
            return category;
    }
}

// Add product to cart
function addToCart(product) {
    // Double-check user is logged in (for security)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        redirectToLogin();
        return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Show confirmation
    alert(`${product.title} added to cart!`);
}

// Save cart to localStorage
function saveCart() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    // Store cart with user ID if logged in
    if (currentUser) {
        const userCart = {
            userId: currentUser.id || currentUser.email, // Use ID or email as identifier
            items: cart
        };
        localStorage.setItem('cart', JSON.stringify(userCart));
    } else {
        localStorage.setItem('cart', JSON.stringify({ items: cart }));
    }
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        
        // If it's a user-specific cart
        if (parsedCart.items) {
            cart = parsedCart.items;
        } else {
            // Legacy support for older cart format
            cart = parsedCart;
        }
        
        updateCartCount();
    }
}

// Update cart count in the navigation
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Display cart items in the modal
function displayCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = 'Total: $0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                <p>Color: ${item.colors.join(', ')}</p>
                <p>Size: ${item.sizes.join(', ')}</p>
            </div>
            <div class="cart-item-actions">
                <button class="decrease-qty" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-qty" data-id="${item.id}">+</button>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    
    // Add event listeners for cart item buttons
    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            const item = cart.find(item => item.id === id);
            item.quantity += 1;
            saveCart();
            displayCart();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            const item = cart.find(item => item.id === id);
            
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                const index = cart.findIndex(item => item.id === id);
                cart.splice(index, 1);
            }
            
            saveCart();
            displayCart();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            const index = cart.findIndex(item => item.id === id);
            cart.splice(index, 1);
            saveCart();
            displayCart();
            updateCartCount();
        });
    });
}

// Add modal styles to the existing stylesheet
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
        }
        
        .modal-content {
            background-color: white;
            margin: 15% auto;
            padding: 20px;
            width: 70%;
            max-width: 700px;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .close:hover {
            color: black;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            padding: 15px 0;
        }
        
        .cart-item-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .cart-item-actions button {
            padding: 5px 10px;
            cursor: pointer;
        }
        
        #cartTotal {
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
        }
        
        #checkoutBtn {
            padding: 10px 20px;
            background-color: black;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }
        
        .no-results {
            text-align: center;
            margin-top: 50px;
            font-size: 18px;
        }
        
        .product-title {
            margin-top: 10px;
            font-weight: bold;
        }
        
        .login-required {
            background-color: #888 !important; 
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
}

// Check login status after page loads
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    // If user logged in and there's a redirect URL stored, go there
    if (currentUser) {
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin');
            // Only redirect if we're on the login page
            if (window.location.href.includes('./signup/login.html')) {
                window.location.href = redirectUrl;
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addModalStyles();
    init();
    checkLoginStatus();
});