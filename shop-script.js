// Kenny Wells Ministry - Shop JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize shopping cart
    let cart = JSON.parse(localStorage.getItem('kwm_cart')) || [];
    
    // Function to update cart count
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    // Function to render cart items
    function renderCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.total-amount');
        
        if (!cartItems || !cartTotal) return;
        
        // Clear cart items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        // Calculate total
        let total = 0;
        
        // Add items to cart
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                        <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-from-cart" data-index="${index}">×</button>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Update total
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons and remove buttons
        addCartEventListeners();
    }
    
    // Function to add event listeners to cart items
    function addCartEventListeners() {
        // Decrease quantity
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCart();
                }
            });
        });
        
        // Increase quantity
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                updateCart();
            });
        });
        
        // Input quantity change
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const quantity = parseInt(this.value);
                
                if (quantity > 0) {
                    cart[index].quantity = quantity;
                    updateCart();
                } else {
                    this.value = cart[index].quantity;
                }
            });
        });
        
        // Remove item
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
    
    // Function to update cart
    function updateCart() {
        localStorage.setItem('kwm_cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
    
    // Toggle cart visibility
    const cartIcon = document.querySelector('.cart-icon');
    const cartContainer = document.querySelector('.cart-container');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartIcon && cartContainer && cartOverlay && closeCart) {
        cartIcon.addEventListener('click', function() {
            cartContainer.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeCart.addEventListener('click', function() {
            cartContainer.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        cartOverlay.addEventListener('click', function() {
            cartContainer.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
            const productImage = productCard.querySelector('.product-image img').getAttribute('src');
            
            // Check if product already exists in cart
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            
            if (existingItemIndex !== -1) {
                // Increment quantity if product exists
                cart[existingItemIndex].quantity++;
            } else {
                // Add new item to cart
                cart.push({
                    id: productId,
                    title: productTitle,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Update cart
            updateCart();
            
            // Show cart
            if (cartContainer && cartOverlay) {
                cartContainer.classList.add('active');
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            // Add animation to button
            this.classList.add('added');
            setTimeout(() => {
                this.classList.remove('added');
            }, 1000);
        });
    });
    
    // Filter products by category
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Show all products if 'all' category is selected
                if (category === 'all') {
                    productCards.forEach(card => {
                        card.style.display = 'block';
                    });
                } else {
                    // Show only products from selected category
                    productCards.forEach(card => {
                        if (card.getAttribute('data-category') === category) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const description = card.querySelector('.product-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Sort products
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const productGrid = document.querySelector('.product-grid');
            
            if (!productGrid) return;
            
            // Convert NodeList to Array for sorting
            const productsArray = Array.from(productCards);
            
            switch (sortValue) {
                case 'price-low':
                    productsArray.sort((a, b) => {
                        const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                        const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                        return priceA - priceB;
                    });
                    break;
                    
                case 'price-high':
                    productsArray.sort((a, b) => {
                        const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                        const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                        return priceB - priceA;
                    });
                    break;
                    
                case 'name-asc':
                    productsArray.sort((a, b) => {
                        const nameA = a.querySelector('.product-title').textContent;
                        const nameB = b.querySelector('.product-title').textContent;
                        return nameA.localeCompare(nameB);
                    });
                    break;
                    
                case 'name-desc':
                    productsArray.sort((a, b) => {
                        const nameA = a.querySelector('.product-title').textContent;
                        const nameB = b.querySelector('.product-title').textContent;
                        return nameB.localeCompare(nameA);
                    });
                    break;
            }
            
            // Clear grid and append sorted products
            productGrid.innerHTML = '';
            productsArray.forEach(product => {
                productGrid.appendChild(product);
            });
        });
    }
    
    // Checkout process
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            
            // Redirect to checkout page
            // In a real application, you would redirect to a secure checkout page
            alert('Proceeding to checkout...');
            // window.location.href = 'checkout.html';
        });
    }
    
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link in mobile view
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && !nav.contains(event.target) && !menuToggle.contains(event.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
    
    // Initialize cart
    updateCartCount();
    renderCart();
});