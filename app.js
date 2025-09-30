// Application State
let cart = [];
let currentUser = null;
let deals = [];

// Sample deals data
const sampleDeals = [
    {
        id: 1,
        title: "Laptop Gaming Pro",
        description: "Processeur i7, 16GB RAM, RTX 3070",
        price: 1299.99,
        oldPrice: 1799.99,
        discount: 28,
        category: "electronics",
        icon: "💻"
    },
    {
        id: 2,
        title: "iPhone 15 Pro",
        description: "128GB, Titanium, Dernière génération",
        price: 1199.99,
        oldPrice: 1399.99,
        discount: 14,
        category: "phones",
        icon: "📱"
    },
    {
        id: 3,
        title: "Console PS5",
        description: "PlayStation 5 + 2 jeux gratuits",
        price: 549.99,
        oldPrice: 699.99,
        discount: 21,
        category: "gaming",
        icon: "🎮"
    },
    {
        id: 4,
        title: "Smart TV 4K 65\"",
        description: "Samsung QLED, HDR, Smart Hub",
        price: 899.99,
        oldPrice: 1299.99,
        discount: 31,
        category: "electronics",
        icon: "📺"
    },
    {
        id: 5,
        title: "Casque Sans Fil",
        description: "Noise cancelling, Bluetooth 5.0",
        price: 199.99,
        oldPrice: 299.99,
        discount: 33,
        category: "electronics",
        icon: "🎧"
    },
    {
        id: 6,
        title: "Montre Connectée",
        description: "GPS, Santé, 7 jours d'autonomie",
        price: 249.99,
        oldPrice: 399.99,
        discount: 38,
        category: "electronics",
        icon: "⌚"
    },
    {
        id: 7,
        title: "Tablette Pro 12.9\"",
        description: "256GB, M2 Chip, Pencil inclus",
        price: 1099.99,
        oldPrice: 1399.99,
        discount: 21,
        category: "electronics",
        icon: "📱"
    },
    {
        id: 8,
        title: "Caméra Reflex",
        description: "24MP, 4K Video, Kit lentilles",
        price: 799.99,
        oldPrice: 1099.99,
        discount: 27,
        category: "electronics",
        icon: "📷"
    },
    {
        id: 9,
        title: "Robot Aspirateur",
        description: "Navigation laser, App control",
        price: 299.99,
        oldPrice: 499.99,
        discount: 40,
        category: "home",
        icon: "🤖"
    },
    {
        id: 10,
        title: "Chaussures Running",
        description: "Nike Air Max, Toutes tailles",
        price: 129.99,
        oldPrice: 189.99,
        discount: 32,
        category: "sport",
        icon: "👟"
    },
    {
        id: 11,
        title: "Sac à Dos Tech",
        description: "Anti-vol, Port USB, Waterproof",
        price: 59.99,
        oldPrice: 99.99,
        discount: 40,
        category: "fashion",
        icon: "🎒"
    },
    {
        id: 12,
        title: "Enceinte Bluetooth",
        description: "Portable, Waterproof, 20h autonomie",
        price: 79.99,
        oldPrice: 129.99,
        discount: 38,
        category: "electronics",
        icon: "🔊"
    }
];

// Initialize deals
deals = [...sampleDeals];

// DOM Elements
const dealsGrid = document.getElementById('deals-grid');
const cartModal = document.getElementById('cart-modal');
const authModal = document.getElementById('auth-modal');
const cartBtn = document.getElementById('cart-btn');
const authBtn = document.getElementById('auth-btn');
const closeCartBtn = document.getElementById('close-cart');
const closeAuthBtn = document.getElementById('close-auth');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const searchInput = document.getElementById('search-input');

// Auth elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTabs = document.querySelectorAll('.auth-tab');

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    renderDeals();
    setupEventListeners();
    loadCartFromStorage();
    checkAuthState();
});

// Render deals
function renderDeals(filteredDeals = deals) {
    dealsGrid.innerHTML = '';
    
    if (filteredDeals.length === 0) {
        dealsGrid.innerHTML = '<p class="empty-cart">Aucun deal trouvé</p>';
        return;
    }
    
    filteredDeals.forEach(deal => {
        const dealCard = createDealCard(deal);
        dealsGrid.appendChild(dealCard);
    });
}

// Create deal card
function createDealCard(deal) {
    const card = document.createElement('div');
    card.className = 'deal-card';
    
    card.innerHTML = `
        <div class="deal-image">${deal.icon}</div>
        <div class="deal-content">
            <h3 class="deal-title">${deal.title}</h3>
            <p class="deal-description">${deal.description}</p>
            <div class="deal-footer">
                <div>
                    <span class="deal-price">${deal.price.toFixed(2)}$</span>
                    <span class="deal-old-price">${deal.oldPrice.toFixed(2)}$</span>
                </div>
                <span class="deal-discount">-${deal.discount}%</span>
            </div>
            <button class="add-to-cart-btn" data-id="${deal.id}">
                <i class="fas fa-cart-plus"></i> Ajouter au panier
            </button>
        </div>
    `;
    
    const addBtn = card.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', () => addToCart(deal));
    
    return card;
}

// Add to cart
function addToCart(deal) {
    const existingItem = cart.find(item => item.id === deal.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...deal, quantity: 1 });
    }
    
    updateCart();
    saveCartToStorage();
    showNotification('Produit ajouté au panier!');
}

// Remove from cart
function removeFromCart(dealId) {
    cart = cart.filter(item => item.id !== dealId);
    updateCart();
    saveCartToStorage();
}

// Update quantity
function updateQuantity(dealId, change) {
    const item = cart.find(item => item.id === dealId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(dealId);
        } else {
            updateCart();
            saveCartToStorage();
        }
    }
}

// Update cart display
function updateCart() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Votre panier est vide</div>';
        cartTotal.textContent = '0.00$';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price.toFixed(2)}$</div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2) + '$';
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('misterdil_cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('misterdil_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Search functionality
function searchDeals(query) {
    const filtered = deals.filter(deal => 
        deal.title.toLowerCase().includes(query.toLowerCase()) ||
        deal.description.toLowerCase().includes(query.toLowerCase())
    );
    renderDeals(filtered);
}

// Setup event listeners
function setupEventListeners() {
    // Cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
    
    // Auth modal
    authBtn.addEventListener('click', () => {
        if (currentUser) {
            signOut();
        } else {
            authModal.classList.add('active');
        }
    });
    
    closeAuthBtn.addEventListener('click', () => {
        authModal.classList.remove('active');
    });
    
    // Close modals on outside click
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
        }
    });
    
    // Checkout
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Search
    searchInput.addEventListener('input', (e) => {
        searchDeals(e.target.value);
    });
    
    // Auth tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabName = tab.dataset.tab;
            if (tabName === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });
    
    // Auth form submissions
    document.getElementById('login-submit')?.addEventListener('click', handleLogin);
    document.getElementById('register-submit')?.addEventListener('click', handleRegister);
    
    // Category filters
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryName = card.querySelector('h3').textContent.toLowerCase();
            filterByCategory(categoryName);
        });
    });
}

// Filter by category
function filterByCategory(category) {
    const categoryMap = {
        'électronique': 'electronics',
        'téléphones': 'phones',
        'gaming': 'gaming',
        'maison': 'home',
        'mode': 'fashion',
        'sport': 'sport'
    };
    
    const mappedCategory = categoryMap[category];
    if (mappedCategory) {
        const filtered = deals.filter(deal => deal.category === mappedCategory);
        renderDeals(filtered);
    } else {
        renderDeals(deals);
    }
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide!', 'error');
        return;
    }
    
    if (!currentUser) {
        cartModal.classList.remove('active');
        authModal.classList.add('active');
        showNotification('Veuillez vous connecter pour continuer', 'error');
        return;
    }
    
    showNotification('Commande passée avec succès!', 'success');
    cart = [];
    updateCart();
    saveCartToStorage();
    cartModal.classList.remove('active');
}

// Firebase Authentication
function checkAuthState() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.log('Firebase not available - using demo mode');
        return;
    }
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            authBtn.textContent = 'Se déconnecter';
            showNotification(`Bienvenue ${user.email || user.displayName}!`, 'success');
        } else {
            currentUser = null;
            authBtn.textContent = 'Se connecter';
        }
    });
}

// Handle login
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (typeof firebase === 'undefined' || !firebase.auth) {
        // Demo mode
        currentUser = { email: email };
        authBtn.textContent = 'Se déconnecter';
        authModal.classList.remove('active');
        showNotification('Connexion réussie (mode démo)!', 'success');
        return;
    }
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            authModal.classList.remove('active');
            showNotification('Connexion réussie!', 'success');
        })
        .catch((error) => {
            showNotification('Erreur de connexion: ' + error.message, 'error');
        });
}

// Handle register
function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    if (!name || !email || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (typeof firebase === 'undefined' || !firebase.auth) {
        // Demo mode
        currentUser = { email: email, displayName: name };
        authBtn.textContent = 'Se déconnecter';
        authModal.classList.remove('active');
        showNotification('Inscription réussie (mode démo)!', 'success');
        return;
    }
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            return currentUser.updateProfile({ displayName: name });
        })
        .then(() => {
            authModal.classList.remove('active');
            showNotification('Inscription réussie!', 'success');
        })
        .catch((error) => {
            showNotification('Erreur d\'inscription: ' + error.message, 'error');
        });
}

// Sign out
function signOut() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(() => {
            currentUser = null;
            authBtn.textContent = 'Se connecter';
            showNotification('Déconnexion réussie', 'success');
        });
    } else {
        currentUser = null;
        authBtn.textContent = 'Se connecter';
        showNotification('Déconnexion réussie', 'success');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
