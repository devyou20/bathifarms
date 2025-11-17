// Product Carousel with 3D positioning and Cart Integration
document.addEventListener('DOMContentLoaded', () => {
  const productStage = document.querySelector('.product-stage');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const indicators = document.querySelectorAll('.indicator');
  const productCards = document.querySelectorAll('.product-card');
  
  let currentIndex = 0;
  const totalProducts = productCards.length;
  
  // Product data with prices
  const products = [
    { id: 'sheep', name: 'Premium Sheep', price: 28999 },
    { id: 'chicken', name: 'Free-Range Chickens', price: 1999 },
    { id: 'eggs', name: 'Fresh Eggs', price: 650 },
    { id: 'milk', name: 'Fresh Milk', price: 420 }
  ];
  
  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem('bathiFarmsCart')) || [];
  
  // Update carousel position
  function updateCarousel() {
    productCards.forEach((card, index) => {
      card.classList.remove('left', 'center', 'right');
      
      const position = (index - currentIndex + totalProducts) % totalProducts;
      
      if (position === 0) {
        card.classList.add('center');
      } else if (position === totalProducts - 1) {
        card.classList.add('left');
      } else if (position === 1) {
        card.classList.add('right');
      }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }
  
  // Navigate to next product
  function nextProduct() {
    currentIndex = (currentIndex + 1) % totalProducts;
    updateCarousel();
  }
  
  // Navigate to previous product
  function prevProduct() {
    currentIndex = (currentIndex - 1 + totalProducts) % totalProducts;
    updateCarousel();
  }
  
  // Navigate to specific product
  function goToProduct(index) {
    currentIndex = index;
    updateCarousel();
  }
  
  // Event listeners for navigation
  nextBtn.addEventListener('click', nextProduct);
  prevBtn.addEventListener('click', prevProduct);
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToProduct(index));
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextProduct();
    if (e.key === 'ArrowLeft') prevProduct();
  });
  
  // Touch/Swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  productStage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  productStage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      nextProduct();
    } else if (touchEndX > touchStartX + 50) {
      prevProduct();
    }
  }
  
  // Quantity controls - setup for all cards
  function setupQuantityControls() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      // Remove existing listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      // Add new listener
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const input = newBtn.closest('.quantity-controls').querySelector('.quantity-input');
        let value = parseInt(input.value) || 1;
        
        if (newBtn.classList.contains('minus') && value > 1) {
          value--;
        } else if (newBtn.classList.contains('plus')) {
          value++;
        }
        
        input.value = value;
      });
    });
  }
  
  setupQuantityControls();
  
  // Add to cart functionality
  function addToCart() {
    const centerCard = document.querySelector('.product-card.center');
    if (!centerCard) return;
    
    const productId = centerCard.dataset.product;
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(centerCard.querySelector('.quantity-input').value) || 1;
    
    if (!product) return;
    
    // Refresh cart from localStorage to get latest data
    cart = JSON.parse(localStorage.getItem('bathiFarmsCart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: centerCard.querySelector('img').src
      });
    }
    
    // Save to localStorage
    localStorage.setItem('bathiFarmsCart', JSON.stringify(cart));
    
    // Dispatch custom event for cart updates
    const cartUpdateEvent = new CustomEvent('cartUpdate', { detail: cart });
    document.dispatchEvent(cartUpdateEvent);
    
    // Update cart count in header
    updateCartCount();
    
    // Show confirmation
    showCartConfirmation(product.name, quantity);
    
    // Reset quantity
    centerCard.querySelector('.quantity-input').value = 1;
  }
  
  // Update cart count in header
  function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
    }
  }
  
  // Show cart confirmation toast
  function showCartConfirmation(productName, quantity) {
    let container = document.querySelector('.cart-confirmation-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'cart-confirmation-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'cart-confirmation show';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${quantity}x ${productName} added to cart!</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
  
  // Get external add to cart button
  const externalAddToCartBtn = document.getElementById('carouselAddToCartBtn');
  
  // Attach click handler to external button
  if (externalAddToCartBtn) {
    externalAddToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart();
    });
  }
  
  // Initialize carousel
  updateCarousel();
  updateCartCount();
  
  // Wrap navigation functions to update quantity controls
  const wrappedNextProduct = () => {
    nextProduct();
    setupQuantityControls();
  };
  
  const wrappedPrevProduct = () => {
    prevProduct();
    setupQuantityControls();
  };
  
  const wrappedGoToProduct = (index) => {
    goToProduct(index);
    setupQuantityControls();
  };
  
  // Re-attach event listeners with wrapped functions
  nextBtn.removeEventListener('click', nextProduct);
  prevBtn.removeEventListener('click', prevProduct);
  
  nextBtn.addEventListener('click', wrappedNextProduct);
  prevBtn.addEventListener('click', wrappedPrevProduct);
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => wrappedGoToProduct(index));
  });
});
