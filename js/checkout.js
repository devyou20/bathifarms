// Checkout functionality for Bathi Farms
document.addEventListener('DOMContentLoaded', () => {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('bathiFarmsCart')) || [];
    const orderItems = document.querySelector('.order-items');
    const subtotalValue = document.querySelector('.subtotal-value');
    const shippingValue = document.querySelector('.shipping-value');
    const taxValue = document.querySelector('.tax-value');
    const totalValue = document.querySelector('.total-value');
    const checkoutForm = document.getElementById('checkout-form');
    const orderSuccess = document.getElementById('order-success');
    const orderNumber = document.getElementById('order-number');
    
    // Payment method toggles removed; Razorpay handles method selection
    
    // Currency formatter (INR)
    const formatINR = (value) => new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        maximumFractionDigits: 0 
    }).format(value);
    
    // Generate random order number
    const generateOrderNumber = () => {
        const prefix = 'BF-';
        const randomPart = Math.floor(10000 + Math.random() * 90000);
        return prefix + randomPart;
    };
    
    // Redirect to home if cart is empty
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    
    // Render order items
    function renderOrderItems() {
        orderItems.innerHTML = '';
        
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-details">
                    <div class="order-item-image" style="background-image: url('${item.image}')"></div>
                    <div class="order-item-info">
                        <h3>${item.name}</h3>
                        <p>${formatINR(item.price)} × ${item.quantity}</p>
                    </div>
                </div>
                <div class="order-item-total">${formatINR(item.price * item.quantity)}</div>
            `;
            orderItems.appendChild(orderItem);
        });
    }
    
    // Calculate order totals
    function calculateTotals() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = 100; // Fixed shipping cost (INR)
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + shipping + tax;
        subtotalValue.textContent = formatINR(subtotal);
        shippingValue.textContent = formatINR(shipping);
        taxValue.textContent = formatINR(tax);
        totalValue.textContent = formatINR(total);
        return { subtotal, shipping, tax, total };
    }
    
    // No payment method toggles; Razorpay widget will handle selection
    
    // Form submit handler
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = checkoutForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Compute totals and collect customer info
        const { total } = calculateTotals();
        const amountPaise = Math.max(1, Math.round(total * 100)); // Razorpay expects amount in paise
        const customer = {
            name: (checkoutForm.querySelector('#name')?.value || '').trim(),
            email: (checkoutForm.querySelector('#email')?.value || '').trim(),
            contact: (checkoutForm.querySelector('#phone')?.value || '').trim(),
            address: (checkoutForm.querySelector('#address')?.value || '').trim(),
            city: (checkoutForm.querySelector('#city')?.value || '').trim(),
            state: (checkoutForm.querySelector('#state')?.value || '').trim(),
            pincode: (checkoutForm.querySelector('#pincode')?.value || '').trim(),
            country: (checkoutForm.querySelector('#country')?.value || 'India').trim(),
        };

        if (!window.Razorpay) {
            alert('Payment gateway failed to load. Please check your internet connection and try again.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Configure Razorpay options
        const orderId = generateOrderNumber();
        const options = {
            key: 'rzp_test_1234567890abcdef', // TODO: replace with live key in production
            amount: amountPaise,
            currency: 'INR',
            name: 'Bathi Farms',
            description: 'Order ' + orderId,
            // order_id: '<create_on_server_and_pass_here>', // For production, create order via server
            prefill: {
                name: customer.name,
                email: customer.email,
                contact: customer.contact,
            },
            notes: {
                address: `${customer.address}, ${customer.city}, ${customer.state} ${customer.pincode}, ${customer.country}`,
                order_ref: orderId,
            },
            theme: { color: '#1a6f3c' },
            handler: function (response) {
                // Payment successful
                orderNumber.textContent = orderId;
                document.querySelector('.checkout-grid').classList.add('hidden');
                orderSuccess.classList.remove('hidden');
                localStorage.removeItem('bathiFarmsCart');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            },
            modal: {
                ondismiss: function () {
                    // User closed the payment modal
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    });
    
    // Initialize page
    renderOrderItems();
    calculateTotals();
});
