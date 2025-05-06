// Kenny Wells Ministry - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality - Updated version
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.main-header');
    
    if (menuToggle && navLinks && header) {
        // Menu toggle click handler
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling
            toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu when clicking on links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when window is resized
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        function toggleMenu() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('show');
            document.body.classList.toggle('menu-open');
        }

        function closeMenu() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('show');
            document.body.classList.remove('menu-open');
        }
    }

    // Mobile Navigation Toggle
    const oldMenuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const oldNavLinks = document.querySelectorAll('nav ul li a');

    if (oldMenuToggle) {
        oldMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link in mobile view
    oldNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && !nav.contains(event.target) && !oldMenuToggle.contains(event.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });

    // Hero Slider
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.opacity = 0;
            slide.style.zIndex = -1;
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide
        slides[index].style.opacity = 1;
        slides[index].style.zIndex = 1;
        
        // Add active class to current dot
        dots[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Initialize slider if slides exist
    if (slides.length > 0) {
        showSlide(0);
        startSlideshow();
        
        // Click events for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                stopSlideshow();
                showSlide(index);
                startSlideshow();
            });
        });
    }

    // Automated Testimonial Carousel
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    
    if (testimonialTrack && testimonialSlides.length > 0) {
        // Clone first and last slides
        const slides = [...testimonialSlides];
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        
        // Add clones to track
        testimonialTrack.appendChild(firstClone);
        testimonialTrack.insertBefore(lastClone, slides[0]);
        
        let currentIndex = 1;
        let isTransitioning = false;
        
        function updateSlidePosition() {
            testimonialTrack.style.transform = `translateX(-${currentIndex * (100/3)}%)`;
            
            // Update active state
            const allSlides = document.querySelectorAll('.testimonial-slide');
            allSlides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === currentIndex) {
                    slide.classList.add('active');
                }
            });
        }

        function moveToNextSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            
            testimonialTrack.style.transition = 'transform 0.5s ease-in-out';
            updateSlidePosition();
        }

        // Handle the infinite loop
        testimonialTrack.addEventListener('transitionend', () => {
            const allSlides = document.querySelectorAll('.testimonial-slide');
            
            if (currentIndex === allSlides.length - 1) {
                testimonialTrack.style.transition = 'none';
                currentIndex = 1;
                updateSlidePosition();
            }
            
            if (currentIndex === 0) {
                testimonialTrack.style.transition = 'none';
                currentIndex = allSlides.length - 2;
                updateSlidePosition();
            }
            
            isTransitioning = false;
        });

        // Initialize position
        updateSlidePosition();

        // Start automatic sliding
        const slideInterval = setInterval(moveToNextSlide, 5000);

        // Pause on hover
        testimonialTrack.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        // Resume on mouse leave
        testimonialTrack.addEventListener('mouseleave', () => {
            setInterval(moveToNextSlide, 5000);
        });
    }

    // Sermon Audio/Video Player
    const sermonPlayers = document.querySelectorAll('.sermon-player');
    
    sermonPlayers.forEach(player => {
        const audio = player.querySelector('audio') || player.querySelector('video');
        const playBtn = player.querySelector('.play-btn');
        const progress = player.querySelector('.progress');
        const progressFill = player.querySelector('.progress-fill');
        const currentTime = player.querySelector('.current-time');
        const duration = player.querySelector('.duration');
        
        if (audio && playBtn && progress && progressFill && currentTime && duration) {
            playBtn.addEventListener('click', function() {
                if (audio.paused) {
                    audio.play();
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    audio.pause();
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
            
            audio.addEventListener('timeupdate', function() {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = percent + '%';
                
                // Update current time
                const currentMinutes = Math.floor(audio.currentTime / 60);
                const currentSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
                currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
            });
            
            audio.addEventListener('loadedmetadata', function() {
                // Update duration
                const durationMinutes = Math.floor(audio.duration / 60);
                const durationSeconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
                duration.textContent = `${durationMinutes}:${durationSeconds}`;
            });
            
            progress.addEventListener('click', function(e) {
                const rect = progress.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                audio.currentTime = pos * audio.duration;
            });
            
            audio.addEventListener('ended', function() {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                progressFill.style.width = '0%';
                audio.currentTime = 0;
            });
        }
    });

    // Event Countdown Timer
    const countdownTimers = document.querySelectorAll('.countdown-timer');
    
    countdownTimers.forEach(timer => {
        const eventDateStr = timer.getAttribute('data-event-date');
        const eventDate = new Date(eventDateStr).getTime();
        
        // Update the countdown every 1 second
        const x = setInterval(function() {
            // Get today's date and time
            const now = new Date().getTime();
            
            // Find the distance between now and the event date
            const distance = eventDate - now;
            
            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Output the result
            timer.querySelector('.days').textContent = days.toString().padStart(2, '0');
            timer.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
            timer.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
            timer.querySelector('.seconds').textContent = seconds.toString().padStart(2, '0');
            
            // If the countdown is finished, display message
            if (distance < 0) {
                clearInterval(x);
                timer.innerHTML = '<span class="expired">This event has passed!</span>';
            }
        }, 1000);
    });

    // Donation Amount Selection
    const donationAmounts = document.querySelectorAll('.donation-amount');
    const customAmount = document.querySelector('.custom-amount');
    
    if (donationAmounts.length > 0) {
        donationAmounts.forEach(amount => {
            amount.addEventListener('click', function() {
                // Remove active class from all amounts
                donationAmounts.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked amount
                this.classList.add('active');
                
                // Update hidden input with selected amount
                const donationValue = this.getAttribute('data-amount');
                const donationInput = document.querySelector('#donation-value');
                if (donationInput) {
                    donationInput.value = donationValue;
                }
                
                // Clear custom amount input
                if (customAmount) {
                    customAmount.value = '';
                }
            });
        });
        
        // Custom amount input handler
        if (customAmount) {
            customAmount.addEventListener('input', function() {
                // Remove active class from all preset amounts
                donationAmounts.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Update hidden input with custom amount
                const donationInput = document.querySelector('#donation-value');
                if (donationInput) {
                    donationInput.value = this.value;
                }
            });
        }
    }

    // Form Validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Create error message if it doesn't exist
                    let errorMessage = field.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('span');
                        errorMessage.classList.add('error-message');
                        errorMessage.textContent = 'This field is required';
                        field.after(errorMessage);
                    }
                } else {
                    field.classList.remove('error');
                    
                    // Remove error message if it exists
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });
            
            if (!isValid) {
                event.preventDefault();
            }
        });
    });

    // Animation on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop <= window.innerHeight * 0.8) && (elementBottom >= 0);
            
            if (isVisible) {
                element.classList.add('animate');
            }
        });
    }
    
    // Run on page load
    checkIfInView();
    
    // Run on scroll
    window.addEventListener('scroll', checkIfInView);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Newsletter subscription validation
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const emailValue = emailInput.value.trim();
            
            if (!emailValue) {
                alert('Please enter your email address');
                return;
            }
            
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailValue)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // If validation passes, show success message
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.textContent = 'Thank you for subscribing to our newsletter!';
            
            newsletterForm.innerHTML = '';
            newsletterForm.appendChild(successMessage);
            
            // In a real application, you would also send the form data to a server
        });
    }

    // About section expand/collapse
    const expandBtn = document.getElementById('expand-btn');
    const expandableContent = document.getElementById('about-expandable');
    
    if (expandBtn && expandableContent) {
        expandBtn.addEventListener('click', function() {
            const isExpanded = this.classList.toggle('expanded');
            
            if (isExpanded) {
                expandableContent.style.height = expandableContent.scrollHeight + 'px';
                expandableContent.classList.add('expanded');
            } else {
                expandableContent.style.height = '0';
                expandableContent.classList.remove('expanded');
            }
        });
    }

    // WhatsApp Form Functionality
    function sendWhatsAppMessage(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        const whatsappMessage = 
            `*New Contact Form Message*%0a%0a` +
            `*Name:* ${name}%0a` +
            `*Email:* ${email}%0a` +
            `*Phone:* ${phone}%0a` +
            `*Subject:* ${subject}%0a%0a` +
            `*Message:*%0a${message}`;
        
        const whatsappLink = `https://wa.me/233261612674?text=${whatsappMessage}`;
        window.open(whatsappLink, '_blank');
    }
});
