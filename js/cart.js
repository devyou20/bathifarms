// Cart functionality for Bathi Farms
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage or as empty array
    let cart = JSON.parse(localStorage.getItem('bathiFarmsCart')) || [];
    
    // DOM Elements
    const cartToggle = document.querySelector('.cart-toggle');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartClose = document.querySelector('.cart-close');
    const overlay = document.querySelector('.page-overlay');
    const cartItems = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total-value');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const clearCartBtn = document.querySelector('.clear-cart-btn'); // New clear cart button element
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    // Currency formatter (INR)
    const formatINR = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

    // Toast utility
    function showToast(message) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toast-out .25s ease forwards';
            setTimeout(() => toast.remove(), 250);
        }, 2000);
    }

    // Open/close drawer
    function openCart() {
        cartDrawer.classList.add('open');
        overlay?.classList.add('visible');
        overlay?.removeAttribute('hidden');
        document.body.style.overflow = 'hidden'; // Prevent body scroll when cart is open
        renderCart();
    }

    function closeCart() {
        cartDrawer.classList.remove('open');
        overlay?.classList.remove('visible');
        setTimeout(() => {
            if (!cartDrawer.classList.contains('open')) {
                overlay?.setAttribute('hidden', '');
                document.body.style.overflow = 'auto'; // Restore body scroll when cart is closed
            }
        }, 350); // Match transition time
    }

    function toggleCart() { (cartDrawer.classList.contains('open') ? closeCart : openCart)(); }
    
    // Add event listeners for cart toggle
    cartToggle.addEventListener('click', toggleCart);
    cartClose.addEventListener('click', closeCart);
    overlay?.addEventListener('click', closeCart);
    
    // Close cart when clicking outside
    // Close on Escape
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });
    
    // Initialize cart count on page load
    updateCartCount();
    updateCartTotal();
    
    // Listen for cart updates from carousel
    document.addEventListener('cartUpdate', (e) => {
      cart = e.detail || [];
      localStorage.setItem('bathiFarmsCart', JSON.stringify(cart));
      updateCartCount();
      updateCartTotal();
      renderCart();
    });
    
    // Add product to cart
    function addToCart(product) {
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingProductIndex > -1) {
            // Increment quantity if product already exists
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push(product);
        }
        
        // Update localStorage and UI
        updateCart();
        
        // Don't automatically open cart, just show toast notification
    }
    
    // Remove item from cart
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
    
    // Update item quantity
    function updateQuantity(id, change) {
        const index = cart.findIndex(item => item.id === id);
        
        if (index > -1) {
            cart[index].quantity += change;
            
            // Remove item if quantity reaches 0
            if (cart[index].quantity <= 0) {
                removeFromCart(id);
                return;
            }
            
            updateCart();
        }
    }
    
    // Update cart in localStorage and UI
    function updateCart() {
        localStorage.setItem('bathiFarmsCart', JSON.stringify(cart));
        updateCartCount();
        updateCartTotal();
        renderCart();
    }
    
    // Update cart count badge
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
        
        // Show/hide count badge
        if (count > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
    
    // Calculate and update cart total
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = formatINR(total);
    }
    
    // Render cart items
    function renderCart() {
        // Clear current items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            return;
        }
        
        emptyCartMessage.style.display = 'none';
        
        // Add each item to cart
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            
            cartItem.innerHTML = `
                <div class="cart-item-img" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-content">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatINR(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="cart-quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">×</button>
            `;
            
            cartItems.appendChild(cartItem);
            
            // Add event listeners for quantity buttons
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const removeBtn = cartItem.querySelector('.cart-item-remove');
            
            minusBtn.addEventListener('click', () => updateQuantity(item.id, -1));
            plusBtn.addEventListener('click', () => updateQuantity(item.id, 1));
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
        });
    }
    
    // Checkout functionality
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty');
            return;
        }
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
        closeCart();
    });
    
    // Clear cart functionality
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        localStorage.setItem('bathiFarmsCart', JSON.stringify(cart));
        updateCartCount();
        updateCartTotal();
        renderCart();
    });
    
    // Initialize the cart UI
    updateCartCount();
    updateCartTotal();
});
